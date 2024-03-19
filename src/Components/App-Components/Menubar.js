// Menubar component
import React from "react";
import "./Menubar.css";
import { useUser } from "../App-Components/UserContext"; // Update path as needed
import Addpost from "../Images/Addpost.svg";
import Notifications from "../Images/Notifications.svg";
import ProfilePicture from "../App-Components/profilePicture";

const Menubar = () => {
  const { profileData } = useUser(); // Destructure profileData from context
  const firstName = profileData.fullName?.split(" ")[0] || "User"; // Access fullName from profileData

  return (
    <div className="menubar">
      <div className="menubar-content">
        <div className="Welcome-div">
          <h4>Welcome, {firstName}</h4> {/* Display the firstName */}
          <p>Let's get going today!</p>
        </div>
        <input className="search-bar" type="text" placeholder="Search" />
        <div className="Post-items">
          <img src={Addpost} alt="Addpost" className="Addpost" />
          <img
            src={Notifications}
            alt="Notifications"
            className="Notifications"
          />
          <ProfilePicture
            className="menubar-profile-picture" // Use a different className here
            showDropdownMenu={true} // Set to true for Menubar
            imageUrl={profileData.profilePicture}
          />
        </div>
      </div>
    </div>
  );
};

export default Menubar;
