import React, { useState, useRef, useEffect } from "react";
import "./MakePost.css";
import closeBrown from "../Images/closebrown.svg";
import { useUser } from "../App-Components/UserContext";
import ProfilePicture from "./profilePicture";
import { EmojiButton } from "@joeattardi/emoji-button";

const MakePostBox = ({ onClose }) => {
  const { currentUser, profileData } = useUser();
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null); // New state for the image
  const [imagePreview, setImagePreview] = useState(null); // State to hold the image preview URL
  const emojiPickerRef = useRef(null); // useRef to hold the emoji picker instance
  const triggerRef = useRef(null); // useRef for the SVG that triggers the picker

  // Function to handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the preview URL for display
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Create a new EmojiButton instance and assign to the ref
    // Inside your useEffect in MakePostBox.js
    emojiPickerRef.current = new EmojiButton({
      // Ensure this z-index is higher than that of the dialog overlay
      zIndex: 99999,
    });

    // Define what should happen when an emoji is selected
    emojiPickerRef.current.on("emoji", (selection) => {
      // When an emoji is selected, update the state
      setPostText((prevPostText) => prevPostText + selection.emoji);
    });

    // Attach the picker to the trigger element
    const triggerEl = triggerRef.current;
    triggerEl.addEventListener("click", () =>
      emojiPickerRef.current.togglePicker(triggerEl)
    );

    // Cleanup event listeners on unmount
    return () => {
      triggerEl.removeEventListener("click", () =>
        emojiPickerRef.current.togglePicker(triggerEl)
      );
    };
  }, []);

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
        <div className="post-content">
          <textarea
            className="post-input"
            placeholder="What do you want to talk about?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
          {/* Display image preview if available */}
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="eib">
          <div className="emoji-image">
            <div className="image-upload">
              <input
                type="file"
                id="imageInput"
                hidden={true}
                onChange={handleFileChange}
              />
              <svg
                onClick={() => document.getElementById("imageInput").click()}
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                style={{ cursor: "pointer" }}
              >
                <path
                  fill="white"
                  opacity={0.5}
                  d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-12.5-5.5l2.5 3.01L14.5 12l4.5 6H5z"
                />
              </svg>
            </div>
            {/* Emoji Icon SVG */}
            <svg
              ref={triggerRef} // Attach the ref to the SVG
              onClick={() =>
                emojiPickerRef.current.togglePicker(triggerRef.current)
              } // Use the ref to access the current instance of EmojiButton
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className="emoji-trigger"
            >
              {/* The path here represents your second SVG (emoji icon) */}
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
    </div>
  );
};

export default MakePostBox;
