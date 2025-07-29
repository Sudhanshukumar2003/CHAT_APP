import { createContext, useEffect,useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { connect, io } from "socket.io-client";

// Get backend URL from environment variables with fallback
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
console.log('Backend URL:', backendUrl); // For debugging

// Configure axios defaults
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000; // 10 second timeout


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [token, setToken] = useState(localStorage.getItem('token') );
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    
    //Check if the user is authenticated and if so, 
    // set the user data and  connect the socket
    const checkAuth =async () => {
        try {
            const { data } = await axios.get('/api/auth/check');
            if (data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        }catch (error) {
            console.error('Auth check failed:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Authentication failed';
            toast.error(errorMessage);
        }
    }

    //Login function to authenticate the user and socket connection
    const login = async (state, ceredentials) =>{
        try{
            const {data}= await axios.post(`/api/auth/${state}`, ceredentials);
            if(data.success){
                setToken(data.token);
                localStorage.setItem('token', data.token);
                axios.defaults.headers.common['token'] = data.token;
                setAuthUser(data.userData);
                connectSocket(data.userData);
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        }catch (error) {
            console.error('Login failed:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            toast.error(errorMessage);
        }
    }

    //Logout function to clear the user data and disconnect the socket
    const logout = async () => {
        localStorage.removeItem('token');
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common['token'] = null;
        toast.success('Logged out successfully');
        if(socket) {
            socket.disconnect();
            setSocket(null);
        }
    }

    //Update user function to update the user data and emit the updated user data to the socket
    const updateProfile = async (body) => {
        try{
            const {data}=await axios.put('/api/auth/update-profile', body);
            if(data.success){
                setAuthUser(data.userData);
                toast.success("Profile updated successfully");
            }
        }catch (error) {
            console.error('Profile update failed:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
            toast.error(errorMessage);
        }
    }

    // Connect socket function to handle socket connection and online users updates
    const connectSocket =(userData)=>{
        if(!userData || socket?.connected) return;
        
        try {
            const newSocket= io(backendUrl, {
                query: {
                    userId: userData._id,
                },
                withCredentials: true,
                transports: ['websocket', 'polling'],
                timeout: 20000,
                forceNew: true,
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
            });
            
            newSocket.connect();
            setSocket(newSocket);
            
            newSocket.on('connect', () => {
                console.log('Socket connected successfully');
            });
            
            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                toast.error('Connection failed. Please check your internet connection.');
            });
            
            newSocket.on('getOnlineUsers', (usersIds) => {
                setOnlineUsers(usersIds);
            });
            
        } catch (error) {
            console.error('Socket connection failed:', error);
            toast.error('Failed to establish real-time connection');
        }
    }

    useEffect(() => {
        if(token){
            axios.defaults.headers.common['token'] = token;
        }
        checkAuth();
    }, []);
    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
