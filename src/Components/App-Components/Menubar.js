import React from "react";
import "./Menubar.css";
import { useUser } from "../App-Components/UserContext"; // Assuming this is the correct path
import Addpost from "../Images/Addpost.svg";
import Notifications from "../Images/Notifications.svg";
import ProfilePicture from "../App-Components/profilePicture";

const Menubar = () => {
  const { fullName } = useUser();
  const firstName = fullName?.split(" ")[0] || "User";

  return (
    <div className="menubar">
      <div className="menubar-content">
        <div className="Welcome-div">
          <h4>Welcome, {firstName}</h4>
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
          <ProfilePicture />
        </div>
      </div>
    </div>
  );
};

export default Menubar;
