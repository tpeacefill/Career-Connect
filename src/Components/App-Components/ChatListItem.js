// ChatListItem.js
import React from "react";
import "./ChatListItem.css";
import ProfilePicture from "./profilePicture";

const ChatListItem = ({ fullName, profilePicture, userId }) => {
  // You can add click handlers or other logic here, e.g., navigating to a chat with this user
  return (
    <div className="chatListitem">
      <ProfilePicture
        className="profile-image"
        imageUrl={profilePicture}
        fullName={fullName}
      />
      <div className="name-lastmsg">
        <h3>{fullName}</h3>
        <p>Last message here</p>{" "}
        {/* You might want to pass this as a prop if it changes */}
      </div>
    </div>
  );
};

export default ChatListItem;
