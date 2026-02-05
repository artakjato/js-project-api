Happy Thoughts API 💬❤️

This is a RESTful API built with Node.js, Express, and MongoDB for a “Happy Thoughts” application.
Users can sign up, log in, post happy thoughts, like them, and manage their own posts.

The API is deployed on Render and connected to MongoDB Atlas.

🚀 Features

  User authentication (signup & login)
  Secure password hashing
  Create, read, update, and delete thoughts
  Like thoughts
  Ownership protection (users can only edit/delete their own posts)
  API documentation endpoint
  Deployed online

🛠️ Tech Stack
  Node.js
  Express.js
  MongoDB + Mongoose
  bcryptjs (password hashing)
  dotenv (environment variables)
  express-list-endpoints

CORS

🧠 Data Models
User Model

  email (unique)
  password (hashed)
  accessToken

HappyThought Model

  message (5–140 chars)
  hearts (number)
  createdAt
  userId (reference to User)

🔒 Security

  Passwords are hashed using bcrypt
  Access tokens are stored securely
  Protected routes require authentication
  Users can only edit/delete their own posts

❗ Error Handling

  The API returns meaningful status codes:
  400 Bad Request
  401 Unauthorized
  403 Forbidden
  404 Not Found
  500 Server Error

This project was built to practice:

REST APIs
Authentication
MongoDB
Full-stack integration
Deployment

