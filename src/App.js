import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "./store/store";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import PostList from "./components/PostList/PostList";
import { loginUser, logoutUser } from "../src/slices/userSlice"; // <-- Importing loginUser and logoutUser
import "./App.css";

const useAuthentication = () => {
  const dispatch = useDispatch(); // <-- Defining dispatch here
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const handleLogin = (userData) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (
        storedUser.email === userData.email &&
        storedUser.password === userData.password
      ) {
        dispatch(loginUser(userData)); // <-- Dispatching loginUser
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      console.error("Error setting authentication data:", error);
      dispatch(logoutUser()); // <-- Dispatching logoutUser
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
      dispatch(logoutUser()); // <-- Dispatching logoutUser
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
    <Provider store={store}>
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
    </Provider>
  );
};

export default App;
