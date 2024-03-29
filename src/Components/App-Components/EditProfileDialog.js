import React, { useState, useRef } from "react";
import { storage, db } from "../Config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  doc,
  updateDoc,
  collection, // Import the collection function
  addDoc, // Import the addDoc function
} from "firebase/firestore";
import "./EditProfileDialog.css";
import closeBrown from "../Images/closebrown.svg";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import AddImage from "../Images/AddImage.svg";
import ErrorOverlay from "../Pages/Error-Success/ErrorOverlay";
import SuccessOverlay from "../Pages/Error-Success/SuccessOverlay";

const EditProfileDialog = ({ onClose, userId, updateBio }) => {
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const cropperRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    setCroppedImageUrl(cropper.getCroppedCanvas().toDataURL());
  };

  // Function to create a notification
  const createNotification = async () => {
    const notificationsRef = collection(db, "notifications");
    try {
      await addDoc(notificationsRef, {
        userId: userId, // This should be the ID of the current user
        message: "Your profile picture and bio were updated successfully!",
        timestamp: Date.now(),
      });
      console.log("Notification created for user ID:", userId);
    } catch (error) {
      console.error("Error creating notification for user ID:", userId, error);
    }
  };


  const handleBioChange = (e) => setBio(e.target.value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsCropping(true);
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDoneCropping = () => {
    setIsCropping(false);
    onCrop();
  };

  const uploadImage = async (updateBioCallback) => {
    if (!croppedImageUrl) return;

    setUploading(true);
    const blob = await fetch(croppedImageUrl).then((r) => r.blob());
    const fileRef = ref(
      storage,
      `profilePictures/${userId}/profilePicture.jpg`
    );
    const uploadTask = uploadBytesResumable(fileRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("Upload failed:", error);
        setError("Failed to upload image. Please try again.");
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateProfile(downloadURL, bio, updateBioCallback);
          setUploading(false);
          setCroppedImageUrl(downloadURL);
          setSuccess(true);
        });
      }
    );
  };

  const updateProfile = async (profileUrl, bio, updateBioCallback) => {
    try {
      const userRef = doc(db, "User", userId);
      await updateDoc(userRef, {
        bio,
        profilePicture: profileUrl,
      });
      updateBioCallback(bio); // Update bio on settings page
      setSuccess(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleSaveClick = async () => {
    await uploadImage(updateBio); // Pass updateBio as the callback function
    createNotification(); // Create a notification after the bio is updated
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
    onClose(); // Navigate to settings page here
  };

  return (
    <div className="dialog-box">
      <div className="dialog-container">
        {error && <ErrorOverlay message={error} onClose={handleCloseError} />}
        {success && (
          <SuccessOverlay
            message="Profile updated successfully"
            onClose={handleCloseSuccess}
          />
        )}
        <div className="dialog-headers">
          <p>Edit your user Profile</p>
          <img src={closeBrown} alt="close" onClick={onClose} />
        </div>
        <div className="dialog-content">
          <div className="dialog-content-profile">
            {isCropping ? (
              <div
                className="cropper-container"
                style={{ height: 300, width: "100%" }}
              >
                <Cropper
                  src={image}
                  style={{ height: 250, width: "100%" }}
                  initialAspectRatio={1}
                  aspectRatio={1}
                  preview=".img-preview"
                  ref={cropperRef}
                  viewMode={1}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false}
                />
                <button
                  className="done-cropping-button"
                  onClick={handleDoneCropping}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div
                  className="upload-icon"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  {croppedImageUrl ? (
                    <img
                      src={croppedImageUrl}
                      alt="Profile"
                      style={{
                        height: "90px",
                        width: "90px",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <img src={AddImage} alt="Add-Profile" />
                  )}
                </div>
                <p>Change profile from here</p>
              </>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="dialog-bio">
            <p>Bio</p>
            <input
              className="dialog-bio-input"
              placeholder="Add a bio to your profile..."
              value={bio}
              onChange={handleBioChange}
            />
          </div>
        </div>
        <button
          className="savebutton"
          onClick={handleSaveClick}
          disabled={uploading || isCropping}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProfileDialog;
