import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./profilePicture.css"; // Ensure your CSS styles are correctly applied
import { useUser } from "../App-Components/UserContext"; // Adjust this import path as necessary

const ProfilePicture = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { profileData } = useUser();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className="profile-container" onClick={toggleDropdown}>
      {profileData.profilePicture ? (
        <div className="profile-initials">{profileData.profilePicture}</div>
      ) : (
        <div className="profile-initials">{"U"}</div>
      )}
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
