import React from "react";
import "./ChatListItem.css";
import ProfilePicture from "./profilePicture";

const ChatListItem = ({ fullName, profilePicture, onClick }) => {
  return (
    <div className="chatListitem" onClick={onClick}>
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
