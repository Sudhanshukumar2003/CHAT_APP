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

app.use(cors({
  origin: 'https://chat-app-ashen-xi-75.vercel.app',
  credentials: true,
}));

app.use(express.json({ limit: '4mb' }));

// Socket.IO Setup
export const io = new Server(server, {
  cors: {
    origin: 'https://chat-app-ashen-xi-75.vercel.app',
    methods: ["GET", "POST", "PUT"],
    credentials: true
  }
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


//routes setup
app.use("/api/status", (req,res)=> res.send("Server is live"));
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);

//connect to the database
await connectDB();

//start server
if(process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, ()=> console.log("Server is running on PORT: ", PORT));

}

//Export the server for Vercel or other platforms
export default server;
