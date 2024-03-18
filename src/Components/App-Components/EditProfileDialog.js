import React, { useState, useRef } from "react";
import { storage, db } from "../Config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import "./EditProfileDialog.css";
import closeBrown from "../Images/closebrown.svg";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css"; // Ensure the CSS is correctly imported
import AddImage from "../Images/AddImage.svg";

const EditProfileDialog = ({ onClose, userId }) => {
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const cropperRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [isCropping, setIsCropping] = useState(false); // New state to control Cropper visibility

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    setCroppedImageUrl(cropper.getCroppedCanvas().toDataURL());
  };

  const handleBioChange = (e) => setBio(e.target.value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsCropping(true); // Show cropper when file is selected
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDoneCropping = () => {
    setIsCropping(false); // Hide cropper when done
    onCrop(); // Update cropped image URL
  };

  const uploadImage = async () => {
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
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateProfile(downloadURL);
          setUploading(false);
          setCroppedImageUrl(downloadURL); // Update cropped image URL after upload
        });
      }
    );
  };

  const updateProfile = async (profileUrl) => {
    const userRef = doc(db, "User", userId);
    await updateDoc(userRef, {
      bio,
      profilePicture: profileUrl,
    });
    onClose();
  };

  const handleSaveClick = async () => {
    await uploadImage();
  };

  return (
    <div className="dialog-box">
      <div className="dialog-container">
        <div className="dialog-headers">
          <p>Edit your user Profile</p>
          <img src={closeBrown} alt="close" onClick={onClose} />
        </div>
        <div className="dialog-content">
          <div className="dialog-content-profile">
            {isCropping ? (
              <div className="cropper-container" style={{ height: 300, width: "100%" }}>
                <Cropper
                  src={image}
                  style={{ height: 250, width: "100%"}}
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
