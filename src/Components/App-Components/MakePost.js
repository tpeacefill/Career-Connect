import React from "react";
import "./MakePost.css";
import closeBrown from "../Images/closebrown.svg";
import { useUser } from "../App-Components/UserContext"; // Import the useUser hook
import ProfilePicture from "./profilePicture";

const MakePostBox = ({ onClose }) => {
  const { currentUser, profileData } = useUser(); // Use the hook to get current user data

  return (
    <div className="post-box">
      <div className="makepost">
        <div className="user-profile">
          <div className="userprofile1">
            <ProfilePicture
              imageUrl={profileData.profilePicture}
              className="profile-image"
            />

            <div className="person-details">
              <h3>{profileData.fullName}</h3> <p>{currentUser?.email}</p>
            </div>
          </div>
          <img
            src={closeBrown}
            alt="close button"
            className="close-button"
            onClick={onClose}
          />
        </div>
        <textarea
          class="post-input"
          placeholder="What do you want to talk about?"
        ></textarea>
        <div className="emoji-image">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="white"
              opacity={0.5}
              d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2M8.5 13.5l2.5 3.01L14.5 12l4.5 6H5z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="white"
              opacity={0.5}
              d="M12 1.998c5.524 0 10.002 4.478 10.002 10.002c0 5.523-4.478 10-10.002 10c-5.524.001-10.002-4.477-10.002-10C1.998 6.476 6.476 1.998 12 1.998m0 1.5a8.502 8.502 0 1 0 0 17.003a8.502 8.502 0 0 0 0-17.003M8.462 14.783A4.492 4.492 0 0 0 12 16.5a4.491 4.491 0 0 0 3.535-1.714a.75.75 0 1 1 1.177.93A5.99 5.99 0 0 1 12 18a5.991 5.991 0 0 1-4.717-2.29a.75.75 0 1 1 1.179-.928M9 8.75a1.25 1.25 0 1 1 0 2.499A1.25 1.25 0 0 1 9 8.75m6 0a1.25 1.25 0 1 1 0 2.499a1.25 1.25 0 0 1 0-2.499"
            />
          </svg>
        </div>
        <button className="post-button">Post</button>
      </div>
    </div>
  );
};

export default MakePostBox;
