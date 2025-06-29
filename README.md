# ⚡ Full Stack Real-Time Chat App (MERN + Socket.IO)

A real-time chat application built using **MongoDB, Express.js, React.js, Node.js** (MERN Stack) and **Socket.IO**.  
This app allows users to send and receive messages instantly, track online users, and chat securely — all without refreshing the page!

---

## 🚀 Features
✅ User authentication (Sign up / Login)  
✅ Real-time messaging with Socket.IO  
✅ Online users tracking  
✅ RESTful APIs for user & message management  
✅ Responsive frontend built with React.js  
✅ MongoDB for database storage  
✅ Deployment-ready (Vercel)

---

## 📌 Tech Stack

| **Frontend** | React.js, Axios, Socket.IO Client |
| **Backend** | Express.js, Node.js, Socket.IO |
| **Database** | MongoDB Atlas |
| **Deployment** | Vercel (frontend + backend serverless) |

---

## 🌐 Live Demo
👉 [View Live App]([https://quickchat.greatstack.in](https://chat-app-git-main-sudhanshukumar2003s-projects.vercel.app/login))

---

/client --> React frontend
/server --> Express + Socket.IO backend
/routes --> API routes
/models --> Mongoose models
/lib --> DB connection utils

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Sudhanshukumar2003/CHAT_APP-repo.git
cd CHAT_APP-repo
2️⃣ Install dependencies
bash
Copy
Edit
# Backend
npm install

# Frontend
cd client
npm install
3️⃣ Set up environment variables
Create a .env file in your root:

ini
Copy
Edit
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
4️⃣ Run locally
bash
Copy
Edit
# In root directory (server)
npm run dev

# In client directory
npm start
🚀 Deployment
Deployed using Vercel:

Frontend → React build on Vercel

Backend → Express server as Vercel serverless functions

🤝 Credits
This project was inspired by GreatStack.
I’ve customized and extended it with additional features.

📄 License
This project is licensed for educational and personal use.
Feel free to fork, modify, and share!

