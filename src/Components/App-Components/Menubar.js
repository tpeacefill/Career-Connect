import React, { useState, useEffect, useCallback } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
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

  const db = getFirestore();

  // useCallback hook to memoize performSearch function
  const performSearch = useCallback(() => {
    if (searchQuery.length > 0) {
      const searchLowerCase = searchQuery.toLowerCase();

      console.log(`Searching for: ${searchLowerCase}`); // Debugging

      const q = query(
        collection(db, "User"),
        where("fullNameLowerCase", ">=", searchLowerCase),
        where("fullNameLowerCase", "<=", searchLowerCase + '\uf8ff')
      );

      getDocs(q)
        .then((querySnapshot) => {
          console.log(`Found ${querySnapshot.docs.length} users`); // Debugging
          const users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log(users); // Debugging
          setSearchResults(users);
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
        });
    } else {
      setSearchResults([]);
    }
  }, [db, searchQuery]); // Dependencies for useCallback

  // useEffect hook to trigger performSearch on searchQuery changes
  useEffect(() => {
    performSearch();
  }, [performSearch]);

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
              performSearch(); // Call the search function when Enter is pressed
            }
          }}
        />
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((user) => (
              <div key={user.id}>
                <p>{user.fullName}</p>
              </div>
            ))}
          </div>
        )}
        <div className="Post-items">
          <img src={Addpost} alt="Addpost" className="Addpost" />
          <img src={Notifications} alt="Notifications" className="Notifications" />
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
