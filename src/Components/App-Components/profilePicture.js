import React, { useState, useRef, useEffect } from "react";
import "./profilePicture.css";
import { Link } from "react-router-dom";
import { useUser } from "../App-Components/UserContext";

const ProfilePicture = ({
  className,
  imageUrl,
  onUpload,
  uploading,
  fullName,
  showDropdownMenu = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { profileData } = useUser(); // Use profileData as a fallback
  const containerRef = useRef(null);

  const toggleDropdown = () => {
    if (showDropdownMenu) {
      setShowDropdown(!showDropdown);
    }
  };

  console.log("ProfilePicture imageUrl:", imageUrl);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enhanced check for a valid image URL
  const hasValidImageUrl =
    imageUrl?.startsWith("http://") || imageUrl?.startsWith("https://");

  const displayName = fullName || profileData.fullName || "";
  const initials = displayName
    ? displayName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div
      className={`profile-container ${className || ""}`}
      ref={containerRef}
      onClick={toggleDropdown}
    >
      {hasValidImageUrl ? (
        <img src={imageUrl} alt="Profile" className="profile-image" />
      ) : (
        <div className="profile-initials">{initials}</div>
      )}
      {showDropdown && showDropdownMenu && (
        <div className="dropdown-content">
          <Link to="/settings" onClick={() => setShowDropdown(false)}>
            View Profile
          </Link>
          <Link to="/settings" onClick={() => setShowDropdown(false)}>
            Settings
          </Link>
          <Link to="/help" onClick={() => setShowDropdown(false)}>
            Help
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
