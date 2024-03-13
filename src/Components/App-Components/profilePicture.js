// ProfilePicture.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./profilePicture.css"; // Make sure this path is correct
import { useUser } from "../App-Components/UserContext";

const ProfilePicture = ({ className }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { profileData } = useUser(); // Get the user data from your context

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Determine the initials for the user
  const initials = profileData.fullName
    ? profileData.fullName.split(' ').map(name => name[0]).join('').toUpperCase()
    : "U";

  // Add the passed className to the container class list
  const containerClasses = `profile-container ${className || ''}`.trim();

  return (
    <div className={containerClasses} onClick={toggleDropdown}>
      <div className="profile-initials">{initials}</div>
      {showDropdown && (
        <div className="dropdown-content">
          <Link to="/view-profile" onClick={() => setShowDropdown(false)}>View Profile</Link>
          <Link to="/settings" onClick={() => setShowDropdown(false)}>Settings</Link>
          <Link to="/help" onClick={() => setShowDropdown(false)}>Help</Link>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
