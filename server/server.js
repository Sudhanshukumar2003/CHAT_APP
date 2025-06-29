import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

// Create app + server
const app = express();
const server = http.createServer(app);

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://chat-p86je9gvf-sudhanshukumar2003s-projects.vercel.app'
];

// Express CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Express middlewares
app.use(express.json({ limit: '4mb' }));

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Socket.IO setup
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// User socket map
export const userSocketMap = {};

// Socket.IO connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Connect DB + start server
try {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log("Server is running on PORT:", PORT));
} catch (err) {
  console.error("DB connection failed:", err);
  process.exit(1);
}

// Export server for Vercel
export default server;
