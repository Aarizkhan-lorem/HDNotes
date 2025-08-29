# Notes App - MERN Stack with JWT Authentication

A full-stack note-taking application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user authentication, secure JWT tokens, and a clean dashboard interface for managing personal notes.

## 🚀 Features

- **User Authentication**
  - User registration and login
  - Secure JWT token-based authentication
  - Password encryption with bcrypt
  - Protected routes and middleware

- **Note Management**
  - Create, read, update, and delete notes
  - User-specific notes (users can only access their own notes)
  - Rich text note content support
  - Timestamps for note creation and updates

- **Dashboard Interface**
  - Clean, responsive UI
  - Real-time note updates
  - Intuitive note management
  - User-friendly forms and interactions

- **Security Features**
  - JWT token validation
  - Protected API endpoints
  - Input validation and sanitization
  - Secure password handling

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS3/Bootstrap/Tailwind** - Styling (specify your choice)
- **Context API/Redux** - State management (specify your choice)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14.0.0 or later)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/notes-app-mern.git
cd notes-app-mern
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

### 3. Environment Variables
Create a `.env` file in the backend directory and add:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notesapp
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notesapp

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Frontend Setup
```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env file for frontend
touch .env
```

Add to frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Database Setup
- **Local MongoDB**: Make sure MongoDB is running locally
- **MongoDB Atlas**: Replace the connection string in your `.env` file

### Screenshots of the App
![App Screenshot](/frontend/1.png)

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**
```bash
# From backend directory
npm run dev
# or
npm start
```

2. **Start the Frontend Development Server**
```bash
# From frontend directory (new terminal)
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Serve the application (configure your backend to serve static files)
```

## 📁 Project Structure

```
notes-app-mern/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── noteController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── notes.js
│   ├── config/
│   │   └── db.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Signup.js
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── NoteCard.js
│   │   │   │   └── NoteForm.js
│   │   │   ├── Layout/
│   │   │   │   ├── Header.js
│   │   │   │   └── Footer.js
│   │   │   └── Common/
│   │   │       └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🔐 API Endpoints

### Authentication Routes
```
POST /api/auth/register - User registration
POST /api/auth/login    - User login
GET  /api/auth/me       - Get current user profile
```

### Notes Routes (Protected)
```
GET    /api/notes       - Get all user notes
POST   /api/notes       - Create a new note
GET    /api/notes/:id   - Get specific note
PUT    /api/notes/:id   - Update note
DELETE /api/notes/:id   - Delete note
```

## 💾 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Note Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  user: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- **Password Hashing**: Uses bcryptjs for secure password storage
- **JWT Authentication**: Stateless authentication with JSON Web Tokens
- **Protected Routes**: Middleware to verify user authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Sensitive data stored securely

## 📱 Usage

1. **Registration**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials to receive a JWT token
3. **Dashboard**: Access your personal dashboard to manage notes
4. **Add Notes**: Create new notes with title and content
5. **Edit Notes**: Update existing notes inline or in a modal
6. **Delete Notes**: Remove notes with confirmation
7. **Logout**: Clear authentication and redirect to login

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🌐 Deployment

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI and login
heroku create your-notes-app-backend
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)
```bash
# Build the project
npm run build

# Deploy the build folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Environment Setup Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB running (local or Atlas)
- [ ] Environment variables configured
- [ ] Dependencies installed for both frontend and backend
- [ ] Database connection established
- [ ] JWT secret key set

## 🐛 Troubleshooting

### Common Issues

1. **Connection Issues**
   - Check MongoDB connection string
   - Verify database is running
   - Check network connectivity

2. **Authentication Problems**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify middleware implementation

3. **CORS Errors**
   - Configure CORS in Express
   - Check frontend API URL
   - Verify port configurations

### Debug Mode
```bash
# Backend with debug logging
DEBUG=app:* npm start

# Frontend with detailed errors
REACT_APP_DEBUG=true npm start
```

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check existing documentation
- Review the troubleshooting section

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- MongoDB for the database solution
- Express.js for the backend framework
- React.js for the frontend library
- JWT for authentication standard
- All contributors and the open-source community

---

**Happy Note Taking! 📝**
