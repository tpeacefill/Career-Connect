import React from "react";
import { Link } from "react-router-dom";
import "./profilePicture.css";
import { useUser } from "../App-Components/UserContext";

const ProfilePicture = ({ className, imageUrl, onUpload, uploading, showDropdownMenu = false }) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const { profileData } = useUser();

  const toggleDropdown = () => {
    if (showDropdownMenu) { // Only show dropdown if enabled
      setShowDropdown(!showDropdown);
    }
  };

  const initials = profileData.fullName
    ? profileData.fullName.split(' ').map((name) => name[0]).join('').toUpperCase()
    : "U";

  const containerClasses = `profile-container ${className || ''}`.trim();

  return (
    <div className={containerClasses} onClick={toggleDropdown}>
      {imageUrl ? ( // If imageUrl exists, display the image
        <img src={imageUrl} alt="Profile" className="profile-image" />
      ) : ( // Otherwise, display initials
        <div className="profile-initials">{initials}</div>
      )}
      {showDropdown && showDropdownMenu && (
        <div className="dropdown-content">
          <Link to="/settings" onClick={() => setShowDropdown(false)}>View Profile</Link>
          <Link to="/settings" onClick={() => setShowDropdown(false)}>Settings</Link>
          <Link to="/help" onClick={() => setShowDropdown(false)}>Help</Link>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
