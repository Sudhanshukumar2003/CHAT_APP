import mongoose from "mongoose";

//Function to connect to the MongoDB database
export const connectDB = async () => {
  try {
    // Connect to the MongoDB database using the connection string from environment variables
    mongoose.connection.on('connected', () => console.log('MongoDB connected successfully'));
    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    
  } catch (error) {
    console.log(error);
  }
}