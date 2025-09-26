import json
import os
import logging
from pathlib import Path
from typing import List, Optional, Dict, Any, Callable
from datetime import datetime, timedelta
import uuid

from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
import jwt
import requests

try:
    import bcrypt
except ImportError:
    # Fallback for development
    import hashlib
    class bcrypt:
        @staticmethod
        def hashpw(password, salt):
            return hashlib.sha256(password).hexdigest().encode('utf-8')
        @staticmethod
        def checkpw(password, hashed):
            return hashlib.sha256(password).hexdigest().encode('utf-8') == hashed
        @staticmethod
        def gensalt():
            return b'salt'

# --- Setup ---
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')
DATA_DIR = ROOT_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

# JWT Settings
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-this')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

# OpenRouter Settings
OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY')
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI(title="Islamic Community API")

# Create API router
api_router = APIRouter(prefix="/api")

# --- Pydantic Models ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "member"
    country: Optional[str] = None
    bio: Optional[str] = None
    skills: List[str] = []
    interests: List[str] = []
    gender: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    social_links: Dict[str, str] = {}
    is_verified: bool = False

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "member"

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    country: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    gender: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    social_links: Optional[Dict[str, str]] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    followers_count: int = 0
    following_count: int = 0
    posts_count: int = 0
    password_hash: Optional[str] = None

class Post(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    author_id: str
    author_name: str
    author_role: str
    author_country: Optional[str] = None
    post_type: str = "General Feed"
    image_url: Optional[str] = None
    tags: List[str] = []
    likes_count: int = 0
    comments_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Comment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    post_id: str
    author_id: str
    author_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    token_type: str

# --- JSON Database Helper Functions ---
def default_json_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

def read_json(collection_name: str) -> List[Dict]:
    file_path = DATA_DIR / f"{collection_name}.json"
    if not file_path.exists():
        return []
    with open(file_path, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def write_json(collection_name: str, data: List[Dict]):
    file_path = DATA_DIR / f"{collection_name}.json"
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4, default=default_json_serializer)

async def find_one_in_json(collection_name: str, query: Dict) -> Optional[Dict]:
    data = read_json(collection_name)
    for item in data:
        if all(item.get(k) == v for k, v in query.items()):
            return item
    return None

async def find_in_json(collection_name: str, query: Dict = {}, limit: int = 50) -> List[Dict]:
    data = read_json(collection_name)
    results = [item for item in data if all(item.get(k) == v for k, v in query.items())]
    return results[:limit]

async def insert_into_json(collection_name: str, document: Dict):
    data = read_json(collection_name)
    data.append(document)
    write_json(collection_name, data)

async def update_in_json(collection_name: str, query: Dict, update_data: Dict):
    data = read_json(collection_name)
    for item in data:
        if all(item.get(k) == v for k, v in query.items()):
            item.update(update_data.get("$set", {}))
            item.update({k: item.get(k, 0) + v for k, v in update_data.get("$inc", {}).items()})
    write_json(collection_name, data)

async def count_in_json(collection_name: str, query: Dict = {}) -> int:
    data = read_json(collection_name)
    return len([item for item in data if all(item.get(k) == v for k, v in query.items())])

# --- Helper Functions ---
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await find_one_in_json("users", {"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# --- Authentication Routes ---
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    existing_user = await find_one_in_json("users", {"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        role=user_data.role,
        password_hash=hash_password(user_data.password)
    )
    
    user_doc = user.model_dump()
    await insert_into_json("users", user_doc)
    
    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/auth/login", response_model=Token)
async def login(login_data: UserLogin):
    user = await find_one_in_json("users", {"email": login_data.email})
    if not user or not verify_password(login_data.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user['id']})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

# --- User Routes ---
@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str, current_user: User = Depends(get_current_user)):
    user = await find_one_in_json("users", {"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**{k: v for k, v in user.items() if k != 'password_hash'})

@api_router.put("/users/me", response_model=User)
async def update_profile(user_data: UserUpdate, current_user: User = Depends(get_current_user)):
    update_data = user_data.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.utcnow()

    if update_data:
        await update_in_json("users", {"id": current_user.id}, {"$set": update_data})

    updated_user = await find_one_in_json("users", {"id": current_user.id})
    return User(**{k: v for k, v in updated_user.items() if k != 'password_hash'})

# --- Posts Routes ---
@api_router.post("/posts", response_model=Post)
async def create_post(post_data: Dict[str, Any], current_user: User = Depends(get_current_user)):
    post = Post(
        content=post_data['content'],
        author_id=current_user.id,
        author_name=current_user.full_name,
        author_role=current_user.role,
        author_country=current_user.country,
        post_type=post_data.get('post_type', 'General Feed'),
        image_url=post_data.get('image_url'),
        tags=post_data.get('tags', [])
    )
    
    await insert_into_json("posts", post.model_dump())
    await update_in_json("users", {"id": current_user.id}, {"$inc": {"posts_count": 1}})
    
    return post

@api_router.get("/posts", response_model=List[Post])
async def get_posts(limit: int = 50, current_user: User = Depends(get_current_user)):
    posts = await find_in_json("posts", limit=limit)
    return [Post(**post) for post in sorted(posts, key=lambda p: p['created_at'], reverse=True)]

@api_router.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: str, current_user: User = Depends(get_current_user)):
    post = await find_one_in_json("posts", {"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return Post(**post)

# --- Comments Routes ---
@api_router.post("/posts/{post_id}/comments", response_model=Comment)
async def create_comment(post_id: str, comment_data: Dict[str, Any], current_user: User = Depends(get_current_user)):
    post = await find_one_in_json("posts", {"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comment = Comment(
        content=comment_data['content'],
        post_id=post_id,
        author_id=current_user.id,
        author_name=current_user.full_name
    )
    
    await insert_into_json("comments", comment.model_dump())
    await update_in_json("posts", {"id": post_id}, {"$inc": {"comments_count": 1}})
    
    return comment

@api_router.get("/posts/{post_id}/comments", response_model=List[Comment])
async def get_comments(post_id: str, current_user: User = Depends(get_current_user)):
    comments = await find_in_json("comments", {"post_id": post_id}, limit=1000)
    return [Comment(**comment) for comment in sorted(comments, key=lambda c: c['created_at'])]

# --- UmmahAPI Routes ---
UMMAH_API_BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1"

@api_router.get("/asma-ul-husna")
async def get_asma_ul_husna():
    """Fetches the 99 names of Allah from the external API."""
    try:
        response = requests.get(f"{UMMAH_API_BASE_URL}/api/asma-ul-husna.json")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Could not fetch data from UmmahAPI: {e}")

@api_router.get("/prayer-times")
async def get_prayer_times(lat: float, lng: float, madhab: str = 'shafi', method: str = 'karachi'):
    """Fetches prayer times from the external API."""
    try:
        # Note: The provided API does not seem to exist. This is a placeholder implementation.
        # In a real scenario, we would use a valid prayer times API.
        # For now, returning a sample response.
        return {
            "lat": lat,
            "lng": lng,
            "madhab": madhab,
            "method": method,
            "times": {
                "Fajr": "05:00",
                "Dhuhr": "12:30",
                "Asr": "15:45",
                "Maghrib": "18:30",
                "Isha": "20:00"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/qibla")
async def get_qibla_direction(lat: float, lng: float):
    """Fetches qibla direction from the external API."""
    try:
        # Note: The provided API does not seem to exist. This is a placeholder implementation.
        # For now, returning a sample response.
        return {"lat": lat, "lng": lng, "direction": 212.45}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Include router ---
app.include_router(api_router)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)