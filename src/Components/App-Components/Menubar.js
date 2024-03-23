import React, { useState, useEffect, useCallback } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./Menubar.css";
import { useUser } from "../App-Components/UserContext";
import Addpost from "../Images/Addpost.svg";
import Notifications from "../Images/Notifications.svg";
import ProfilePicture from "../App-Components/profilePicture";

const Menubar = () => {
  const { profileData } = useUser();
  const firstName = profileData.fullName?.split(" ")[0] || "User";
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown display

  const db = getFirestore();

  // Memoize performSearch function
  const performSearch = useCallback(() => {
    if (searchQuery.length > 0) {
      setShowDropdown(true); // Show the dropdown when search begins
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
      setShowDropdown(false); // Hide the dropdown when search is cleared
    }
  }, [db, searchQuery]);

  // useEffect hook to trigger performSearch on searchQuery changes
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleSelectUser = (user) => {
    // Implement the action when a user is selected
    console.log(user); // Placeholder action
    setShowDropdown(false); // Hide the dropdown
    setSearchQuery(""); // Optionally clear the search query
  };

  return (
    <div className="menubar">
      <div className="menubar-content">
        <div className="Welcome-div">
          <h4>Welcome, {firstName}</h4>
          <p>Let's get going today!</p>
        </div>
        <input
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
          <div className="search-dropdown">
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
            className="Notifications"
          />
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
