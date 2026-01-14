# 📚 BookWorm - Personalized Reading Tracker

**BookWorm** is a full-stack web application designed to help book lovers discover new books, track their reading progress, and set annual reading challenges. It features a robust recommendation system and a comprehensive admin panel for content management.

![Project Preview](https://i.postimg.cc/DzSz9JW1/Screenshot-1.png)

## 🚀 Live Demo
> **[https://book-worm-gyfc.vercel.app/login]**

---

## ✨ Features

### 👤 User Features
- **Authentication:** Secure Login & Registration with Email/Password and Google (Glassmorphism UI).
- **Personalized Dashboard:**
  - Dynamic Reading Stats & Annual Goal Progress.
  - "Recommended For You" section based on reading history.
  - Interactive Charts (Pie & Bar charts) using Recharts.
- **My Library Management:**
  - Three distinct shelves: **Want to Read**, **Currently Reading**, **Read**.
  - Update reading progress (percentage).
- **Book Discovery:**
  - Advanced Search & Filtering (by Genre, Rating).
  - Detailed Book View with Reviews.
- **Community:** Write reviews and rate books.
- **Tutorials:** Access curated video content related to books.

### 🛡️ Admin Features
- **Role-Based Access Control:** Secure Admin Dashboard protected by middleware logic.
- **Dashboard Overview:** Real-time statistics of users, books, and reviews.
- **Content Management:**
  - **Manage Books:** Add, Edit, Delete books with cover images.
  - **Manage Genres:** Create and manage book categories.
  - **Manage Tutorials:** Embed YouTube videos.
- **User Management:** Promote/Demote users (Admin/User roles).
- **Review Moderation:** Monitor user-submitted reviews.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15+ (App Router), React, Tailwind CSS, Framer Motion.
- **Backend:** Next.js API Routes (Serverless).
- **Database:** MongoDB Atlas (Mongoose ODM).
- **Authentication:** Firebase Auth (Client) & Custom Session Logic.
- **UI Components:** React Hot Toast, SweetAlert2, Recharts, React Icons.
- **Utilities:** Next Top Loader, Date-fns.

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/bookworm.git
cd bookworm

```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
#### Create a .env.local file in the root directory and add the following keys:

```bash
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Firebase Configuration (Get these from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server
```bash
npm run dev
```

### 🔑 How to Create the First Admin
#### By default, every new signup is a "User". To access the Admin Panel:
#### Sign up a new user via the Register page.
#### Go to your MongoDB Atlas Database.
#### Open the users collection.
#### Find your user document and manually update the field:

```bash
"role": "admin"
```
#### Log out and Log in again. You will be redirected to the Admin Dashboard.

### 📂 Project Structure
```bash
src/
├── app/                # Next.js App Router Pages & API
│   ├── admin/          # Admin Dashboard Pages
│   ├── api/            # Backend API Routes
│   ├── books/          # Book Browsing Pages
│   ├── dashboard/      # User Dashboard
│   ├── login/          # Auth Pages
│   └── my-library/     # User Library Page
├── components/         # Reusable UI Components
│   ├── home/           # Homepage Sections
│   └── ...
├── context/            # Authentication Context
├── lib/                # Database & Firebase Config
└── models/             # Mongoose Schemas (User, Book, Genre, Review)
```

### 🤝 Contributing
#### Contributions are welcome! Please fork the repository and create a pull request.
Made with ❤️ by [Shariful Islam]



