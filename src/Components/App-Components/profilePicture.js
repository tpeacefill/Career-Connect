import React, { useRef, useEffect } from "react"; // Step 1
import { Link } from "react-router-dom";
import "./profilePicture.css";
import { useUser } from "../App-Components/UserContext";

const ProfilePicture = ({ className, imageUrl, onUpload, uploading, showDropdownMenu = false }) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const { profileData } = useUser();
  const containerRef = useRef(null); // Step 2

  const toggleDropdown = () => {
    if (showDropdownMenu) { // Only show dropdown if enabled
      setShowDropdown(!showDropdown);
    }
  };

  useEffect(() => { // Step 3
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false); // Step 4
      }
    }

    // Add when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Return function to be called when it unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]); // Empty array ensures effect only runs on mount and unmount

  const initials = profileData.fullName
    ? profileData.fullName.split(' ').map((name) => name[0]).join('').toUpperCase()
    : "U";

  const containerClasses = `profile-container ${className || ''}`.trim();

  return (
    <div className={containerClasses} ref={containerRef} onClick={toggleDropdown}> {/* Attach the ref here */}
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
