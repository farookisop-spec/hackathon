from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import jwt
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
from bson import ObjectId
import json
import requests

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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

# Pydantic Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "member"  # member, mentor, mentee, admin
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

class Post(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    author_id: str
    author_name: str
    author_role: str
    author_country: Optional[str] = None
    post_type: str = "General Feed"  # General Feed, Opportunity, Question, Announcement
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

class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    sender_id: str
    sender_name: str
    conversation_id: str
    message_type: str = "text"  # text, image, file
    file_url: Optional[str] = None
    reactions: Dict[str, List[str]] = {}  # emoji -> list of user_ids
    reply_to_message_id: Optional[str] = None
    is_deleted: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Conversation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    participants: List[str]  # user_ids
    conversation_type: str = "direct"  # direct, group
    group_name: Optional[str] = None
    group_description: Optional[str] = None
    group_admin_id: Optional[str] = None
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Announcement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    author_id: str
    author_name: str
    announcement_type: str = "General"  # General, Janazah, Charity, Event
    priority: str = "Normal"  # Low, Normal, High, Urgent
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None

class Business(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    category: str
    contact_info: Dict[str, str] = {}
    address: str
    is_halal_certified: bool = False
    is_verified: bool = False
    rating: float = 0.0
    reviews_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ForumTopic(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    creator_id: str
    creator_name: str
    posts_count: int = 0
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    is_pinned: bool = False
    is_locked: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChatMessage(BaseModel):
    message: str
    image_url: Optional[str] = None

class BotResponse(BaseModel):
    response: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    token_type: str

# Helper Functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# Authentication Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Create user
    user_dict = user_data.dict()
    del user_dict['password']
    user = User(**user_dict)
    
    # Store in database
    user_doc = user.dict()
    user_doc['password_hash'] = hashed_password
    await db.users.insert_one(user_doc)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/auth/login", response_model=Token)
async def login(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user['id']})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

# User Routes
@api_router.get("/users", response_model=List[User])
async def get_users(limit: int = 50, search: str = "", current_user: User = Depends(get_current_user)):
    query = {}
    if search:
        query = {
            "$or": [
                {"full_name": {"$regex": search, "$options": "i"}},
                {"bio": {"$regex": search, "$options": "i"}},
                {"skills": {"$regex": search, "$options": "i"}},
                {"interests": {"$regex": search, "$options": "i"}},
                {"country": {"$regex": search, "$options": "i"}}
            ]
        }
    
    users = await db.users.find(query).limit(limit).to_list(limit)
    return [User(**{k: v for k, v in user.items() if k != 'password_hash'}) for user in users]

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str, current_user: User = Depends(get_current_user)):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**{k: v for k, v in user.items() if k != 'password_hash'})

@api_router.put("/users/me", response_model=User)
async def update_profile(user_data: Dict[str, Any], current_user: User = Depends(get_current_user)):
    user_data['updated_at'] = datetime.utcnow()
    await db.users.update_one({"id": current_user.id}, {"$set": user_data})
    updated_user = await db.users.find_one({"id": current_user.id})
    return User(**{k: v for k, v in updated_user.items() if k != 'password_hash'})

# Posts Routes
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
    
    await db.posts.insert_one(post.dict())
    
    # Update user's post count
    await db.users.update_one({"id": current_user.id}, {"$inc": {"posts_count": 1}})
    
    return post

@api_router.get("/posts", response_model=List[Post])
async def get_posts(limit: int = 50, current_user: User = Depends(get_current_user)):
    posts = await db.posts.find({}).sort("created_at", -1).limit(limit).to_list(limit)
    return [Post(**post) for post in posts]

@api_router.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: str, current_user: User = Depends(get_current_user)):
    post = await db.posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return Post(**post)

# Comments Routes
@api_router.post("/posts/{post_id}/comments", response_model=Comment)
async def create_comment(post_id: str, comment_data: Dict[str, Any], current_user: User = Depends(get_current_user)):
    # Check if post exists
    post = await db.posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comment = Comment(
        content=comment_data['content'],
        post_id=post_id,
        author_id=current_user.id,
        author_name=current_user.full_name
    )
    
    await db.comments.insert_one(comment.dict())
    
    # Update post's comment count
    await db.posts.update_one({"id": post_id}, {"$inc": {"comments_count": 1}})
    
    return comment

@api_router.get("/posts/{post_id}/comments", response_model=List[Comment])
async def get_comments(post_id: str, current_user: User = Depends(get_current_user)):
    comments = await db.comments.find({"post_id": post_id}).sort("created_at", 1).to_list(1000)
    return [Comment(**comment) for comment in comments]

# Islamic Bot Routes
@api_router.post("/bot/chat", response_model=BotResponse)
async def chat_with_bot(chat_data: ChatMessage, current_user: User = Depends(get_current_user)):
    if not OPENROUTER_API_KEY:
        # Fallback response when API key is not available
        fallback_responses = [
            "As-salamu alaikum! I am here to help with Islamic knowledge. However, the AI service is currently being configured. Please check back soon, in sha Allah.",
            "May Allah bless you! The AI assistant is temporarily unavailable. In the meantime, you can explore our Quran, Hadith, and Duas sections for Islamic guidance.",
            "Barakallahu feeki/feek for reaching out! Our AI Islamic scholar is being set up. Please visit our learning section for authentic Islamic content."
        ]
        
        import random
        response_text = random.choice(fallback_responses)
        
        return BotResponse(response=response_text)
    
    try:
        # Prepare Islamic context for the AI
        islamic_context = """
        You are an Islamic AI assistant helping Muslims with authentic Islamic knowledge. 
        Provide guidance based on Quran and authentic Hadith. Always be respectful and accurate.
        If unsure about something, recommend consulting local Islamic scholars.
        Start responses with Islamic greetings when appropriate.
        """
        
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # Use a free model from OpenRouter
        data = {
            "model": "microsoft/phi-3-mini-128k-instruct:free",  # Free model
            "messages": [
                {"role": "system", "content": islamic_context},
                {"role": "user", "content": chat_data.message}
            ],
            "max_tokens": 500,
            "temperature": 0.7
        }
        
        response = requests.post(OPENROUTER_API_URL, headers=headers, json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            bot_response = result['choices'][0]['message']['content']
        else:
            bot_response = "I apologize, but I'm having trouble connecting to the knowledge base right now. Please try again later, or consult with your local Islamic scholar for guidance."
        
        # Store conversation in database
        conversation_data = {
            "id": str(uuid.uuid4()),
            "user_id": current_user.id,
            "user_message": chat_data.message,
            "bot_response": bot_response,
            "created_at": datetime.utcnow()
        }
        await db.bot_conversations.insert_one(conversation_data)
        
        return BotResponse(response=bot_response)
        
    except Exception as e:
        logging.error(f"Bot chat error: {str(e)}")
        return BotResponse(response="I apologize for the technical difficulty. Please try again later or consult with Islamic scholars for authentic guidance.")

# Announcements Routes
@api_router.get("/announcements", response_model=List[Announcement])
async def get_announcements(limit: int = 50, current_user: User = Depends(get_current_user)):
    announcements = await db.announcements.find({"is_active": True}).sort("created_at", -1).limit(limit).to_list(limit)
    return [Announcement(**announcement) for announcement in announcements]

@api_router.post("/announcements", response_model=Announcement)
async def create_announcement(announcement_data: Dict[str, Any], current_user: User = Depends(get_current_user)):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can create announcements")
    
    announcement = Announcement(
        title=announcement_data['title'],
        content=announcement_data['content'],
        author_id=current_user.id,
        author_name=current_user.full_name,
        announcement_type=announcement_data.get('announcement_type', 'General'),
        priority=announcement_data.get('priority', 'Normal'),
        expires_at=announcement_data.get('expires_at')
    )
    
    await db.announcements.insert_one(announcement.dict())
    return announcement

# Business Directory Routes
@api_router.get("/businesses", response_model=List[Business])
async def get_businesses(limit: int = 50, category: str = "", search: str = "", current_user: User = Depends(get_current_user)):
    query = {}
    if category:
        query['category'] = category
    if search:
        query['$or'] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    businesses = await db.businesses.find(query).limit(limit).to_list(limit)
    return [Business(**business) for business in businesses]

@api_router.post("/businesses", response_model=Business)
async def create_business(business_data: Dict[str, Any], current_user: User = Depends(get_current_user)):
    business = Business(**business_data)
    await db.businesses.insert_one(business.dict())
    return business

# Forum Routes
@api_router.get("/forum/topics", response_model=List[ForumTopic])
async def get_forum_topics(limit: int = 50, category: str = "", current_user: User = Depends(get_current_user)):
    query = {}
    if category:
        query['category'] = category
        
    topics = await db.forum_topics.find(query).sort("last_activity", -1).limit(limit).to_list(limit)
    return [ForumTopic(**topic) for topic in topics]

@api_router.post("/forum/topics", response_model=ForumTopic)
async def create_forum_topic(topic_data: Dict[str, Any], current_user: User = Depends(get_current_user)):
    topic = ForumTopic(
        title=topic_data['title'],
        description=topic_data['description'],
        category=topic_data.get('category', 'General'),
        creator_id=current_user.id,
        creator_name=current_user.full_name
    )
    
    await db.forum_topics.insert_one(topic.dict())
    return topic

# Dashboard Stats
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    total_members = await db.users.count_documents({})
    mentors_count = await db.users.count_documents({"role": "mentor"})
    mentees_count = await db.users.count_documents({"role": "mentee"})
    total_posts = await db.posts.count_documents({})
    
    return {
        "total_members": total_members,
        "mentors": mentors_count,
        "mentees": mentees_count,
        "total_posts": total_posts
    }

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()