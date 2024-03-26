import React, { useState, useRef, useEffect } from "react";
import "./profilePicture.css";
import { Link } from "react-router-dom";
import { useUser } from "../App-Components/UserContext";

const ProfilePicture = ({ className, imageUrl, onUpload, uploading, fullName, showDropdownMenu = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { profileData } = useUser(); // Use profileData as a fallback
  const containerRef = useRef(null);

  const toggleDropdown = () => {
    if (showDropdownMenu) {
      setShowDropdown(!showDropdown);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check if a valid image URL is provided
  const hasValidImageUrl = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));

  // Use fullName prop if available; otherwise, fall back to the current user's name
  const displayName = fullName || profileData.fullName || "";
  const initials = displayName
    ? displayName.split(' ').map(name => name[0]).join('').toUpperCase()
    : "U"; // Fallback to "U" if no name is available

  return (
    <div className={`profile-container ${className || ''}`} ref={containerRef} onClick={toggleDropdown}>
      {hasValidImageUrl ? (
        <img src={imageUrl} alt="Profile" className="profile-image" />
      ) : (
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
