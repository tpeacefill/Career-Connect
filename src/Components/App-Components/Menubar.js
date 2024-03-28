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
import Addpost from "../Images/Addpost.svg";
import Notifications from "../Images/Notifications.svg";
import ProfilePicture from "../App-Components/profilePicture";
import useFetchUserNotifications from "./FetchUserNotification";

const Menubar = () => {
  const { profileData } = useUser();
  const { notifications, setNotifications } = useFetchUserNotifications(
    profileData.id
  );

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
          <img src={Addpost} alt="Addpost" className="Addpost" />
          <img
            src={Notifications}
            alt="Notifications"
            ref={notificationRef}
            className="Notifications"
            onClick={toggleNotificationDropdown}
          />
          {showNotificationDropdown && (
            <div className="notification-dropdown">
              <button onMouseDown={clearUserNotifications}>
                Clear All Notifications
              </button>

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
