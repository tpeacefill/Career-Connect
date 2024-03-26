import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./Menubar.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../App-Components/UserContext";
import Addpost from "../Images/Addpost.svg";
import Notifications from "../Images/Notifications.svg";
import ProfilePicture from "../App-Components/profilePicture";

const Menubar = () => {
  const { profileData } = useUser();
  const firstName = profileData.fullName?.split(" ")[0] || "User";
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const navigate = useNavigate(); // Use the useNavigate hook
  const db = getFirestore();
  const searchBarRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Toggle notification dropdown
  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  const handleSelectUser = (user) => {
    navigate(`/userprofile/${user.id}`);
  };

  const performSearch = useCallback(() => {
    if (searchQuery.length > 0) {
      setShowDropdown(true);
      const searchLowerCase = searchQuery.toLowerCase();

      const q = query(
        collection(db, "User"),
        where("fullNameLowerCase", ">=", searchLowerCase),
        where("fullNameLowerCase", "<=", searchLowerCase + "\uf8ff")
      );

      getDocs(q)
        .then((querySnapshot) => {
          const users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSearchResults(users);
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
        });
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [db, searchQuery]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Handle click outside for search dropdown and notification dropdown
  const handleClickOutside = useCallback((event) => {
    // If the click is outside the search bar and search dropdown, close the search dropdown.
    if (
      searchBarRef.current && !searchBarRef.current.contains(event.target) &&
      dropdownRef.current && !dropdownRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
    }
  
    // If the click is outside the notification icon and its dropdown, close the notification dropdown.
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotificationDropdown(false);
    }
  }, []);
  

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="menubar">
      <div className="menubar-content">
        <div className="Welcome-div">
          <h4>Welcome, {firstName}</h4>
          <p>Let's get going today!</p>
        </div>
        <input
          ref={searchBarRef}
          className="search-bar"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              performSearch();
            }
          }}
        />
        {showDropdown && searchResults.length > 0 && (
          <div ref={dropdownRef} className="search-dropdown">
            {searchResults.map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className="dropdown-item"
              >
                {user.fullName}
              </div>
            ))}
          </div>
        )}
        <div className="Post-items">
          <img src={Addpost} alt="Addpost" className="Addpost" />
          <img
            src={Notifications}
            alt="Notifications"
            ref={notificationRef}
            className="Notifications"
            onClick={toggleNotificationDropdown}
          />
          {showNotificationDropdown && (
            <div className="notification-dropdown" ref={notificationRef}>
              <div className="notification-item">
                You have new notifications!
              </div>
            </div>
          )}
          <ProfilePicture
            className="menubar-profile-picture"
            showDropdownMenu={true}
            imageUrl={profileData.profilePicture}
          />
        </div>
      </div>
    </div>
  );
};

export default Menubar;
