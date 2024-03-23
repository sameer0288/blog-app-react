import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search as SearchIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import "./Header.css";

const Header = ({ isAuthenticated, onLogout, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    onLogout();
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="header-root">
      <nav>
        <div className="logo">
          <Link to="/posts" className="logo-link">
            Post App
          </Link>
        </div>
        {isAuthenticated && (
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <SearchIcon className="search-icon" />
          </div>
        )}

        <div className="nav-links">
          {isAuthenticated ? (
            <Button
              className="logout-btn"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              {/* <LogoutIcon /> */}
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
