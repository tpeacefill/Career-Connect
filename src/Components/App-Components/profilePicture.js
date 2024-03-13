import React, { useState } from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import "./profilePicture.css"; // Your CSS file for styling the profile picture component
import Profile from '../Images/Profile.png';


const ProfilePicture = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <div className="profile-picture">
      <img
        src={Profile} // Assuming you have imported the profile picture image
        alt="Profile"
        className="profile-image"
        onClick={toggleDropdown}
      />
      {showDropdown && (
        <div className="dropdown-content">
          <Link to="/view-profile" className="dropdown-link" onClick={closeDropdown}>
            View Profile
          </Link>
          <Link to="/settings" className="dropdown-link" onClick={closeDropdown}>
            Settings
          </Link>
          <Link to="/help" className="dropdown-link" onClick={closeDropdown}>
            Help
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
