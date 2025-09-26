import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os
from datetime import datetime
import json
import requests

# Add parent directory to path to import the server app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.server import app, User, Post, Comment

# In-memory "filesystem" for testing
json_storage = {}

def mock_read_json(collection_name: str):
    """Mocked version of read_json that uses an in-memory dictionary."""
    return json_storage.get(collection_name, [])

def mock_write_json(collection_name: str, data: list):
    """Mocked version of write_json that uses an in-memory dictionary."""
    # The real writer uses a custom serializer, so we'll simulate that
    # by converting datetime objects to strings.
    def serialize_datetimes(obj):
        if isinstance(obj, list):
            return [serialize_datetimes(i) for i in obj]
        if isinstance(obj, dict):
            return {k: serialize_datetimes(v) for k, v in obj.items()}
        if isinstance(obj, datetime):
            return obj.isoformat()
        return obj

    json_storage[collection_name] = serialize_datetimes(data)

@pytest.fixture(autouse=True)
def setup_teardown():
    """Clear the in-memory filesystem before each test."""
    global json_storage
    json_storage = {
        "users": [],
        "posts": [],
        "comments": [],
    }
    yield

@pytest.fixture
def client():
    """Pytest fixture to create a test client with mocked JSON I/O."""
    with patch('backend.server.read_json', side_effect=mock_read_json), \
         patch('backend.server.write_json', side_effect=mock_write_json):
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

def test_get_prayer_times_placeholder(client: TestClient):
    """Verify the placeholder prayer times endpoint works."""
    response = client.get("/api/prayer-times?lat=34.05&lng=-118.25")
    assert response.status_code == 200
    data = response.json()
    assert data["lat"] == 34.05
    assert data["lng"] == -118.25
    assert "times" in data

def test_get_qibla_direction_placeholder(client: TestClient):
    """Verify the placeholder qibla direction endpoint works."""
    response = client.get("/api/qibla?lat=34.05&lng=-118.25")
    assert response.status_code == 200
    data = response.json()
    assert data["lat"] == 34.05
    assert "direction" in data

@patch('requests.get')
def test_get_asma_ul_husna_success(mock_get, client: TestClient):
    """Verify the Asma ul Husna endpoint works on success."""
    # Mock a successful response from the external API
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = [{"name": "Ar-Rahman", "transliteration": "The Beneficent"}]
    mock_get.return_value = mock_response

    response = client.get("/api/asma-ul-husna")
    assert response.status_code == 200
    assert response.json()[0]["name"] == "Ar-Rahman"

@patch('requests.get')
def test_get_asma_ul_husna_failure(mock_get, client: TestClient):
    """Verify the Asma ul Husna endpoint handles external API failure."""
    # Mock a failed response from the external API
    mock_get.side_effect = requests.exceptions.RequestException("API is down")

    response = client.get("/api/asma-ul-husna")
    assert response.status_code == 503
    assert "Could not fetch data from UmmahAPI" in response.json()["detail"]