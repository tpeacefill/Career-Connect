import React, { useState, useRef, useEffect } from "react";
import "./MakePost.css";
import closeBrown from "../Images/closebrown.svg";
import { useUser } from "../App-Components/UserContext";
import ProfilePicture from "./profilePicture";
import { EmojiButton } from "@joeattardi/emoji-button";
import { db } from "../Config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const MakePostBox = ({ onClose }) => {
  const { currentUser, profileData } = useUser();
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const emojiPickerRef = useRef(null);
  const triggerRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadMedia = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `media/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    const mediaRef = collection(db, "Media");
    const mediaDoc = await addDoc(mediaRef, {
      createdAt: serverTimestamp(),
      type: file.type,
      url: url,
      userId: currentUser.uid,
    });
    return mediaDoc.id;
  };

  // Check if postText is empty to determine if the button should be disabled
  const isPostTextEmpty = postText.trim().length === 0;

  const handlePost = async () => {
    let mediaId = null;

    if (image) {
      mediaId = await uploadMedia(image);
    }

    const postRef = collection(db, "Posts");
    await addDoc(postRef, {
      userId: currentUser.uid,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      content: postText,
      mediaId: mediaId,
      likeCount: 0,
      userLikes: [],
    });

    // Reset state and close the modal after posting
    setImage(null);
    setImagePreview(null);
    setPostText("");
    onClose(); // Assuming this function closes the modal
  };

  useEffect(() => {
    const emojiPicker = new EmojiButton({ zIndex: 99999 });
    emojiPickerRef.current = emojiPicker;

    const triggerEl = triggerRef.current;
    if (triggerEl) {
      triggerEl.addEventListener("click", () =>
        emojiPicker.togglePicker(triggerEl)
      );
    }

    emojiPicker.on("emoji", (selection) => {
      setPostText((prev) => prev + selection.emoji);
    });

    return () => {
      if (triggerEl) {
        triggerEl.removeEventListener("click", () =>
          emojiPicker.togglePicker(triggerEl)
        );
      }
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
          <button
            className="post-button"
            onClick={handlePost}
            disabled={isPostTextEmpty} // Disable the button if postText is empty
            style={{
              background: isPostTextEmpty
                ? "rgba(255, 255, 255, 0.5)"
                : "#ad8547",
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakePostBox;
