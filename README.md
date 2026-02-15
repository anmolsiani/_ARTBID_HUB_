# ArtBid Hub 🎨

A modern, full-stack social art platform where artists share work, connect with others, generate AI art, and trade artwork through auctions.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Installation](#-installation)
4. [Environment Variables](#-environment-variables)
5. [Running the Application](#-running-the-application)
6. [API Endpoints](#-api-endpoints)
7. [Socket.IO Events](#-socketio-events)
8. [Project Structure](#-project-structure)
9. [Deployment](#-deployment)

---

## ✨ Features

- 🎨 **Art Galleries**: Upload and browse human-made and AI-generated art
- 📱 **Reels Feed**: TikTok-style vertical scrolling feed for art discovery
- 💬 **Real-time Messaging**: Direct messaging with Socket.IO
- 🔐 **Authentication**: Email/password + Google OAuth via NextAuth.js
- 👥 **Social Features**: Follow/unfollow, like, comment, save artworks
- 💰 **Marketplace & Auctions**: Buy/sell art with live bidding system
- 🤖 **AI Art Generator**: Create AI art using DALL-E 3
- 📝 **Developer Blog**: Share technical insights (admin-approved)
- 🔔 **Real-time Notifications**: Get notified for all activities
- 💳 **Stripe Payments**: Secure checkout for art purchases
- 🛡️ **Admin Dashboard**: Content moderation and user management

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Authentication**: NextAuth.js (Google OAuth)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js + TypeScript
- **Database**: MongoDB + Mongoose ODM
- **Real-time**: Socket.IO
- **Authentication**: JWT + bcrypt
- **Validation**: Zod schemas
- **File Upload**: Multer + Cloudinary
- **Payments**: Stripe API
- **AI Integration**: OpenAI API (DALL-E 3)

### DevOps & Services
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render / Railway
- **Database**: MongoDB Atlas
- **CDN**: Cloudinary
- **Containerization**: Docker + Docker Compose

---

## 📦 Installation

### Prerequisites

Ensure you have the following:

- **Node.js** 18+ and npm
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary** account ([sign up](https://cloudinary.com/))
- **Stripe** account ([sign up](https://stripe.com/))
- **Google Cloud Console** OAuth credentials
- **OpenAI** API key ([OpenAI platform](https://platform.openai.com/))

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/artbid-hub.git
cd artbid-hub
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/artbid-hub

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI Configuration
OPENAI_API_KEY=sk-...

# Email Configuration (Optional)
EMAIL_FROM=noreply@artbidhub.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Step 3: Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local` file:

```env
# API URLs
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-generate-random-string

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Step 4: Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud database
# Update MONGODB_URI in backend/.env with your Atlas connection string
```

---

## � Environment Variables

### Backend Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Server port (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for JWT tokens |
| `JWT_EXPIRES_IN` | Yes | JWT expiration time (e.g., "7d") |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `OPENAI_API_KEY` | Yes | OpenAI API key for DALL-E |
| `FRONTEND_URL` | Yes | Frontend URL for CORS |
| `EMAIL_*` | No | Email service configuration |

### Frontend Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_SOCKET_URL` | Yes | Socket.IO server URL |
| `NEXTAUTH_URL` | Yes | NextAuth callback URL |
| `NEXTAUTH_SECRET` | Yes | NextAuth encryption secret |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth Client Secret |

---

## 🚀 Running the Application

### Option 1: Manual Start (Development)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
App runs on: `http://localhost:3000`

### Option 2: Docker Compose

```bash
# From project root directory
docker-compose up -d
```

Services available at:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **MongoDB**: `localhost:27017`

Stop services:
```bash
docker-compose down
```

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/login` | Login | No |
| GET | `/auth/me` | Get current user | Yes |
| GET | `/auth/check-username/:username` | Check username availability | No |
| GET | `/auth/generate-username` | Generate unique username | No |

**POST /auth/signup**
```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "username": "artlover",
  "displayName": "Art Lover"
}

// Response
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "_id": "64a1b2c3...",
    "email": "user@example.com",
    "username": "artlover",
    "displayName": "Art Lover",
    "role": "user"
  }
}
```

**POST /auth/login**
```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

// Response
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1...",
  "user": { /* user object */ }
}
```

---

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/:username` | Get user profile | No |
| PUT | `/users/profile` | Update profile | Yes |
| POST | `/users/:userId/follow` | Follow/unfollow user | Yes |
| GET | `/users/:userId/followers` | Get followers | No |
| GET | `/users/:userId/following` | Get following | No |

**GET /users/:username**
```json
{
  "user": {
    "_id": "64a1b2c3...",
    "username": "artlover",
    "displayName": "Art Lover",
    "avatar": "https://...",
    "bio": "Digital artist from NYC",
    "followers": ["64a1...", "64a2..."],
    "following": ["64a3...", "64a4..."]
  }
}
```

---

### Artworks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/artworks` | Create artwork | Yes |
| GET | `/artworks` | Get artworks (with filters) | No |
| GET | `/artworks/:id` | Get artwork by ID | No |
| PUT | `/artworks/:id` | Update artwork | Yes |
| DELETE | `/artworks/:id` | Delete artwork | Yes |
| POST | `/artworks/:id/like` | Like/unlike artwork | Yes |
| POST | `/artworks/:id/save` | Save/unsave artwork | Yes |
| GET | `/artworks/saved` | Get saved artworks | Yes |
| GET | `/artworks/reels/feed` | Get reels feed | No |

**POST /artworks** (multipart/form-data)
```json
// Form fields
{
  "title": "Sunset Dreams",
  "description": "A beautiful digital painting",
  "type": "human", // or "ai"
  "category": ["Digital", "Landscape"],
  "price": 150,
  "forSale": true,
  "images": [File, File] // Max 10 images
}

// Response
{
  "message": "Artwork created",
  "artwork": {
    "_id": "64a1...",
    "title": "Sunset Dreams",
    "images": [
      { "url": "https://...", "publicId": "..." }
    ],
    "likes": [],
    "views": 0
  }
}
```

**GET /artworks**
```
Query Parameters:
- type: "human" | "ai"
- category: "Digital" | "Portrait" | "Landscape" | etc.
- userId: Filter by user ID
- page: Page number (default: 1)
- limit: Items per page (default: 20)
- sort: "-createdAt" | "-likes" | "-views"
```

**POST /artworks/:id/like**
```json
{
  "message": "Liked",
  "liked": true,
  "likesCount": 42
}
```

---

### Comments (To be implemented)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/comments` | Create comment | Yes |
| GET | `/comments/:artworkId` | Get comments | No |
| DELETE | `/comments/:id` | Delete comment | Yes |
| POST | `/comments/:id/like` | Like comment | Yes |

---

### Messaging (To be implemented)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/conversations` | Get conversations | Yes |
| POST | `/conversations` | Create conversation | Yes |
| GET | `/messages/:conversationId` | Get messages | Yes |
| POST | `/messages` | Send message | Yes |

---

### Auctions (To be implemented)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auctions` | Create auction | Yes |
| GET | `/auctions` | Get auctions | No |
| GET | `/auctions/:id` | Get auction details | No |
| POST | `/auctions/:id/bid` | Place bid | Yes |

---

### Blogs (To be implemented)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/blogs` | Create blog post | Yes |
| GET | `/blogs` | Get published blogs | No |
| GET | `/blogs/:slug` | Get blog by slug | No |
| PUT | `/blogs/:id` | Update blog | Yes |
| POST | `/blogs/:id/like` | Like blog | Yes |

---

## 🔌 Socket.IO Events

Connect to: `ws://localhost:5000`

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `authenticate` | `userId: string` | Join user's room |
| `send_message` | `{ recipientId, conversationId, text }` | Send message |
| `typing` | `{ conversationId, userId, isTyping }` | Typing indicator |
| `join_auction` | `auctionId: string` | Join auction room |
| `place_bid` | `{ auctionId, amount }` | Place bid |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `new_message` | `{ message object }` | New chat message |
| `user_typing` | `{ userId, isTyping }` | Typing status |
| `new_notification` | `{ notification }` | New notification |
| `user_online` | `{ userId, status }` | User status |
| `new_bid` | `{ auctionId, bid }` | New auction bid |

---

## 📁 Project Structure

```
artbid-hub/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Cloudinary, Stripe
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, validation, upload
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript types
│   │   ├── app.ts           # Express app
│   │   └── server.ts        # Entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components  
│   │   ├── lib/             # API, Socket.IO, utils
│   │   ├── hooks/           # Custom hooks
│   │   └── types/           # TypeScript types
│   ├── .env.local.example
│   ├── package.json
│   ├── next.config.mjs
│   └── tailwind.config.ts
├── docker-compose.yml
├── CONTRIBUTING.md
├── .gitignore
└── README.md
```

---

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set root directory: `frontend`
4. Add environment variables from `.env.local.example`
5. Deploy

### Backend (Render)

1. Create Web Service on [Render](https://render.com)
2. Connect GitHub repository
3. Root directory: `backend`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add environment variables from `.env.example`
7. Deploy

See [DEPLOYMENT.md](/.gemini/antigravity/brain/DEPLOYMENT.md) for detailed deployment guide.

---

## 📚 Additional Documentation

- **[API Documentation](/.gemini/antigravity/brain/API.md)** - Complete API reference
- **[Database Schema](/.gemini/antigravity/brain/DATABASE.md)** - MongoDB schema details
- **[Deployment Guide](/.gemini/antigravity/brain/DEPLOYMENT.md)** - Production deployment
- **[Contributing](./CONTRIBUTING.md)** - Contribution guidelines

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - Free to use for learning or commercial purposes.

---

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/artbid-hub/issues)
- **Email**: support@artbidhub.com

---

**Built with ❤️ by the ArtBid Hub Team**
