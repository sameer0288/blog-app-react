import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import PostList from "./components/PostList/PostList";
import "./App.css";

const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    try {
      // Here, you should validate the email and password with stored user data
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (
        storedUser.email === userData.email &&
        storedUser.password === userData.password
      ) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      console.error("Error setting authentication data:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Error removing user data:", error);
    }
  };

  return { isAuthenticated, user, handleLogin, handleLogout };
};

const App = () => {
  const { isAuthenticated, user, handleLogin, handleLogout } =
    useAuthentication();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  return (
    <Router>
      <div className="app">
        <Header
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onSearch={handleSearch}
        />
        <div className="content">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/posts" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/posts" />
                ) : (
                  <Register onRegister={handleLogin} />
                )
              }
            />
            <Route
              path="/posts"
              element={
                isAuthenticated ? (
                  <PostList user={user} searchTerm={searchTerm} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/" element={<Navigate to="/register" />} />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;
