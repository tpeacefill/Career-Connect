// Sidepane.js

import React from "react";
import "./Menubar.css";
import Addpost from "../Images/Addpost.svg";
import Notifications from "../Images/Notifications.svg";
import Profile from "../Images/Profile.png";

const Menubar = () => {
  return (
    <div className="menubar">
      <div className="menubar-content">
        <div className="Welcome-div">
          <h4>Welcome, User</h4>
          <p>Let's get going today!</p>
        </div>
        <input
          className="search-bar"
          type="text"
          placeholder="Search"
        />
        <div className="Post-items">
          <img src={Addpost} alt="Addpost" className="Addpost" />
          <img
            src={Notifications}
            alt="Notifications"
            className="Notifications"
          />
          <img src={Profile} alt="Profile" className="Profile" />
        </div>
     </div>
    </div>
  );
};

export default Menubar;

{/*import React, { useEffect, useState } from "react";
import "./Menubar.css";
import Addpost from "../Images/Addpost.svg";
import Notifications from "../Images/Notifications.svg";
import Profile from "../Images/Profile.png";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Config/firebase"; // Make sure to import your Firestore configuration

const Menubar = () => {
  const location = useLocation();
  const { state } = location;
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (state && state.userId) {
        const userDocRef = doc(db, "users", state.userId);

        try {
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserName(userData.fullName);
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, [state]);

  // Splitting the full name into an array based on spaces
  const nameParts = userName ? userName.split(" ") : [];

  // Extracting the first part of the name
  const firstName = nameParts.length > 0 ? nameParts[0] : "User";

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
        />
        <div className="Post-items">
          <img src={Addpost} alt="Addpost" className="Addpost" />
          <img
            src={Notifications}
            alt="Notifications"
            className="Notifications"
          />
          <img src={Profile} alt="Profile" className="Profile" />
        </div>
     </div>
   </div>
  );
};

export default Menubar;*/}
