import React, { useState, useEffect, useCallback, useRef } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
} from "firebase/firestore";
import "./Menubar.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../App-Components/UserContext";
import ReactDOM from "react-dom";
import Addpost from "../Images/Addpost.svg";
import Notifications from "../Images/Notifications.svg";
import ProfilePicture from "../App-Components/profilePicture";
import useFetchUserNotifications from "./FetchUserNotification";
import MakePostBox from "../App-Components/MakePost";

const Menubar = () => {
  const { profileData } = useUser();
  const { notifications, setNotifications } = useFetchUserNotifications(
    profileData.id
  );

  // Step 1: Define state for dialog visibility
  const [isMakePostBoxVisible, setMakePostBoxVisible] = useState(false);

  // Step 2: Toggle function for dialog visibility
  const toggleMakePostBox = () => {
    setMakePostBoxVisible(!isMakePostBoxVisible); 
  };

  const firstName = profileData.fullName?.split(" ")[0] || "User";
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const navigate = useNavigate();
  const db = getFirestore();
  const searchBarRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const clearUserNotifications = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const userUid = currentUser.uid;
    const notificationsRef = collection(db, "notifications");
    const q = query(notificationsRef, where("userId", "==", userUid));

    try {
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db); // Correct use of writeBatch

      querySnapshot.docs.forEach((docSnapshot) => {
        batch.delete(doc(db, "notifications", docSnapshot.id));
      });

      await batch.commit();
      setNotifications([]);
      console.log("Notifications cleared.");
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!profileData.id) return;
    const notificationsRef = collection(db, "notifications");
    const q = query(notificationsRef, where("userId", "==", profileData.id));
    try {
      const querySnapshot = await getDocs(q);
      const notificationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [profileData.id, db, setNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [profileData.id, db, fetchNotifications]);

  const timeAgo = (date) => {
    const formatter = new Intl.RelativeTimeFormat(undefined, {
      numeric: "auto",
    });

    const DIVISIONS = [
      { amount: 60, name: "seconds" },
      { amount: 60, name: "minutes" },
      { amount: 24, name: "hours" },
      { amount: 7, name: "days" },
      { amount: 4.34524, name: "weeks" },
      { amount: 12, name: "months" },
      { amount: Number.POSITIVE_INFINITY, name: "years" },
    ];

    let duration = (date - new Date()) / 1000;

    for (let i = 0; i < DIVISIONS.length; i++) {
      const division = DIVISIONS[i];
      if (Math.abs(duration) < division.amount) {
        return formatter.format(Math.round(duration), division.name);
      }
      duration /= division.amount;
    }
  };

  // Toggle notification dropdown
  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  const handleSelectUser = (user) => {
    navigate(`/userprofile/${user.id}`);
  };

  const performSearch = useCallback(() => {
    console.log("Search Query:", searchQuery); // Log the current search query

    if (searchQuery.length > 0) {
      setShowDropdown(true);
      // Convert the search query to lowercase and trim it
      const searchLowerCase = searchQuery.toLowerCase();
      console.log("Search Query Lowercase:", searchLowerCase); // Log the lowercase version of the search query

      // Perform the query in the "User" collection
      const usersRef = collection(db, "User");
      const q = query(
        usersRef,
        where("fullNameLowerCase", ">=", searchLowerCase),
        where("fullNameLowerCase", "<=", searchLowerCase + "\uf8ff")
      );

      console.log("Executing Firestore query..."); // Indicate that the Firestore query is about to be executed

      // Fetch the matching documents
      getDocs(q)
        .then((querySnapshot) => {
          console.log(`Found ${querySnapshot.docs.length} users`); // Log the number of users found
          const users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Search Results:", users); // Log the search results
          setSearchResults(users); // Update the state with the search results
        })
        .catch((error) => {
          console.error("Error getting documents: ", error); // Log any errors encountered during the query
        });
    } else {
      console.log("Clearing search results."); // Log that search results are being cleared
      setSearchResults([]); // Clear the search results if the query is empty
      setShowDropdown(false);
    }
  }, [db, searchQuery]);

  // Handle click outside for search dropdown and notification dropdown
  const handleClickOutside = useCallback((event) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
    }

    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
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
          <img
            src={Addpost}
            alt="Addpost"
            className="Addpost"
            onClick={toggleMakePostBox} // Ensure this handler is properly set
          />
          {isMakePostBoxVisible &&
            ReactDOM.createPortal(
              <div className="dialog-overlay">
                <MakePostBox
                  onClose={() => setMakePostBoxVisible(false)}
                />
              </div>,
              document.body
            )}

          <img
            src={Notifications}
            alt="Notifications"
            ref={notificationRef}
            className="Notifications"
            onClick={toggleNotificationDropdown}
          />
          {showNotificationDropdown && (
            <div className="notification-dropdown">
              <label
                onMouseDown={clearUserNotifications}
                className="clear-notification "
              >
                Clear All Notifications
              </label>

              {notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <p>{notification.message}</p>
                  <p>{timeAgo(notification.timestamp)}</p>
                </div>
              ))}
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
