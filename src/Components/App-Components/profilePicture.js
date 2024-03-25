import React, { useState, useRef, useEffect } from "react"; // Adjusted import
import { Link } from "react-router-dom";
import "./profilePicture.css";
import { useUser } from "../App-Components/UserContext";

const ProfilePicture = ({ className, imageUrl, onUpload, uploading, showDropdownMenu = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { profileData } = useUser();
  const containerRef = useRef(null);

  const toggleDropdown = () => {
    if (showDropdownMenu) {
      setShowDropdown(!showDropdown);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Here, ensure that imageUrl is treated strictly as a URL, not as any non-null value
  const hasValidImageUrl = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));

  // Correctly calculate initials only if fullName is available
  const initials = profileData.fullName
    ? profileData.fullName.split(' ').map(name => name[0]).join('').toUpperCase()
    : "";

  const containerClasses = `profile-container ${className || ''}`.trim();

  return (
    <div className={containerClasses} ref={containerRef} onClick={toggleDropdown}>
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
