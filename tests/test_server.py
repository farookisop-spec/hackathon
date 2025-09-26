import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
import sys
import os
from datetime import datetime

# Add parent directory to path to import the server app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.server import app

# In-memory "database" for testing
db_storage = {}

@pytest.fixture(autouse=True)
def setup_teardown():
    """Clear the in-memory database before each test."""
    global db_storage
    db_storage = {
        "users": {},
        "posts": {},
        "comments": {},
        "bot_conversations": {},
        "announcements": {},
        "businesses": {},
        "forum_topics": {},
    }
    yield

# Mock Motor client and collections
class AsyncMockCollection:
    """A mock of the Motor collection that uses an in-memory dictionary."""
    def __init__(self, collection_name):
        self.name = collection_name
        self._collection = db_storage.setdefault(collection_name, {})

    async def find_one(self, query):
        for doc_id, doc in self._collection.items():
            match = True
            for key, value in query.items():
                if doc.get(key) != value:
                    match = False
                    break
            if match:
                return doc
        return None

    async def insert_one(self, document):
        # Documents are Pydantic model dicts, which should have an 'id'
        doc_id = document["id"]
        self._collection[doc_id] = document
        return True

    async def update_one(self, query, update):
        doc = await self.find_one(query)
        if doc:
            update_data = update.get("$set", {})
            doc.update(update_data)
        return True

class AsyncMockDb:
    """A mock of the database client that returns mock collections."""
    def __getitem__(self, key):
        return AsyncMockCollection(key)

    def __getattr__(self, name):
        """Allow attribute access to collections (e.g., db.users)."""
        return self[name]

@pytest.fixture
def client():
    """Pytest fixture to create a test client with a mocked database."""
    with patch('backend.server.db', new=AsyncMockDb()):
        yield TestClient(app)

def test_update_profile_prevents_role_escalation(client: TestClient):
    """
    Verify that a user cannot change their own role via the /api/users/me endpoint.
    This test ensures the fix for the privilege escalation vulnerability is effective.
    """
    # 1. Register a new user. The default role should be "member".
    register_response = client.post(
        "/api/auth/register",
        json={"email": "testuser@example.com", "password": "password123", "full_name": "Test User"},
    )
    assert register_response.status_code == 200, "User registration failed."
    token = register_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Fetch the user's profile to confirm their initial role is "member".
    me_response_before = client.get("/api/auth/me", headers=headers)
    assert me_response_before.status_code == 200, "Failed to fetch user profile."
    assert me_response_before.json()["role"] == "member", "Initial user role should be 'member'."

    # 3. Attempt to update the user's profile with a malicious payload to change the role to "admin".
    # The UserUpdate model should ignore the 'role' field, preventing the change.
    update_payload = {"full_name": "Updated Name", "role": "admin"}
    update_response = client.put("/api/users/me", headers=headers, json=update_payload)

    # The request should be successful because updating 'full_name' is allowed.
    assert update_response.status_code == 200, "Profile update request failed."

    # 4. Fetch the user's profile again to verify that the role was NOT changed.
    me_response_after = client.get("/api/auth/me", headers=headers)
    assert me_response_after.status_code == 200, "Failed to fetch user profile after update."
    user_data = me_response_after.json()

    # 5. Assert that the allowed field was updated but the sensitive field was not.
    assert user_data["full_name"] == "Updated Name", "The 'full_name' field was not updated as expected."
    assert user_data["role"] == "member", "User role was changed, indicating a security vulnerability."
    assert user_data["role"] != "admin", "User role was successfully escalated to 'admin', which is a critical bug."