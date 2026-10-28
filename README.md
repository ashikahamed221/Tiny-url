# 🔗 Tiny URL — Full-Stack URL Shortener

A full-stack URL shortener application that converts long URLs into short, shareable links. It also provides click tracking, URL history, and statistics.


## 📸 About the Project

Tiny URL allows users to enter a long URL and generate a short link that redirects to the original destination. The application uses a React frontend, an Express.js backend, and MongoDB to store URL information.

## ✨ Features

- 🔗 Shorten long URLs into compact links
- ↗️ Redirect short links to their original destinations
- 📊 Track the number of clicks for each short URL
- 📋 View URL history and click statistics
- 🗑️ Delete shortened URLs
- 📱 Responsive user interface

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend UI |
| Tailwind CSS | Styling |
| Node.js | JavaScript runtime |
| Express.js | Backend API |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| Nanoid | Short ID generation |
| Axios | HTTP requests |
| Vercel | Deployment |

## ⚙️ How It Works

1. The user enters a long URL in the frontend.
2. The frontend sends a POST request to the backend using Axios.
3. The backend validates the URL and generates a short ID using Nanoid.
4. The original URL, short ID, and click count are stored in MongoDB.
5. When someone visits the short link, the backend finds the original URL, increments the click count, and redirects the user.

## 🏗️ Project Structure

```text
tiny-url/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── config.js
│   ├── package.json
│   └── vercel.json
│
└── server/
    ├── index.js
    ├── package.json
    └── vercel.json
```

*Adjust the folder structure above if your actual repository differs.*

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database
- Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd tiny-url
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

Add any other environment variables required by your backend.

Start the backend:

```bash
npm run dev
```

Use the appropriate start command if your `package.json` does not define `dev`.

### 3. Set up the frontend

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## 🔐 Environment Variables

Keep your database credentials and other secrets in environment variables. Never commit `.env` files containing real credentials to GitHub.

For production deployment, configure the required environment variables in your hosting provider's project settings.

## 🌐 Deployment

- **Frontend:** Vercel
- **Backend:** Vercel
- **Database:** MongoDB

## 📚 What I Learned

- Building REST APIs with Node.js and Express.js
- Connecting a React frontend to a backend API
- Performing database operations with MongoDB and Mongoose
- Generating short IDs with Nanoid
- Implementing URL redirection and click tracking
- Configuring CORS and deploying a full-stack application

## 👨‍💻 Author

**Ashik Ahamed**

- GitHub: [ashikahamed221](https://github.com/ashikahamed221)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/ashikahamed05/)

---

⭐ If you find this project interesting, consider giving the repository a star!
