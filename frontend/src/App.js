import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

// Import pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Quran from "./pages/Quran";
import Hadith from "./pages/Hadith";
import Duas from "./pages/Duas";
import Learning from "./pages/Learning";
import ToolHub from "./pages/ToolHub";
import Search from "./pages/Search";
import Announcements from "./pages/Announcements";
import Directory from "./pages/Directory";
import Forum from "./pages/Forum";
import IslamicBot from "./pages/IslamicBot";
import AdminPanel from "./pages/AdminPanel";

// Import components
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/toaster";

// API Configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Set up axios defaults
axios.defaults.baseURL = API;

// Auth Context
export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
        <BrowserRouter>
          {user && <Navbar />}
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register /> : <Navigate to="/dashboard" />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/feed" 
              element={user ? <Feed /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile/:userId?" 
              element={user ? <Profile /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/messages" 
              element={user ? <Messages /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/quran" 
              element={user ? <Quran /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/hadith" 
              element={user ? <Hadith /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/duas" 
              element={user ? <Duas /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/learning" 
              element={user ? <Learning /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/tools" 
              element={user ? <ToolHub /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/search" 
              element={user ? <Search /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/announcements" 
              element={user ? <Announcements /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/directory" 
              element={user ? <Directory /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/forum" 
              element={user ? <Forum /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/bot" 
              element={user ? <IslamicBot /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} 
            />
            
            {/* Default redirect */}
            <Route 
              path="/" 
              element={<Navigate to={user ? "/dashboard" : "/login"} />} 
            />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;