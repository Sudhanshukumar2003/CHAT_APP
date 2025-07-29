import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

//create express app and HTTP server
const app = express();
const server = http.createServer(app);

// Configure CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, /\.vercel\.app$/] 
    : ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
};

// Socket.IO Setup with proper CORS configuration
export const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

//Store online users
export const userSocketMap = {}; //{userId: socketId}

//Socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:",userId);
    
    if(userId) {
        userSocketMap[userId] = socket.id; // Store the user's socket ID
    }

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected:", userId);
        delete userSocketMap[userId]; // Remove the user's socket ID
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit updated online users
    });
})

//Middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cors(corsOptions));

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

//routes setup
app.use("/api/status", (req,res)=> res.json({status: "Server is live", timestamp: new Date().toISOString()}));
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);

//connect to the database
await connectDB();

//start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log("Server is running on PORT: "+ PORT));

//Export the server for Vercel or other platforms
export default server;
