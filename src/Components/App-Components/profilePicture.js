// ProfilePicture.js

import React from "react";
import { Link } from "react-router-dom";
import "./profilePicture.css"; // Make sure this path is correct
import { useUser } from "../App-Components/UserContext";

const ProfilePicture = ({ className, showDropdownMenu = true }) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const { profileData } = useUser(); // Get the user data from your context

  const toggleDropdown = () => {
    if (showDropdownMenu) {
      setShowDropdown(!showDropdown);
    }
  };

  const initials = profileData.fullName
    ? profileData.fullName.split(' ').map((name) => name[0]).join('').toUpperCase()
    : "U";

  const containerClasses = `profile-container ${className || ''}`.trim();

  return (
    <div className={containerClasses} onClick={toggleDropdown}>
      <div className="profile-initials">{initials}</div>
      {showDropdown && showDropdownMenu && (
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
