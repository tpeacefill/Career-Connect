import React, { useState, useRef } from "react";
import { storage, db } from "../Config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import "./PersonalInformationDialog.css";
import closeBrown from "../Images/closebrown.svg";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css"; // Ensure the CSS is correctly imported
import AddImage from "../Images/AddImage.svg";
import ErrorOverlay from "../Pages/Error-Success/ErrorOverlay";
import SuccessOverlay from "../Pages/Error-Success/SuccessOverlay";
import { useUser } from "../App-Components/UserContext";

const PersonalInformationDialog = ({ onClose }) => {
  // Define state and functions here

  const handleSaveClick = () => {
    // Logic for saving the profile information
  };

  return (
    <div className="overlay">
      <div className="dialog-box1">
        <div className="dialog-container1">
          <div className="dialog-headers1">
            <p>Edit Personal Information</p>
            <img src={closeBrown} alt="close" onClick={onClose} />
          </div>
          <div className="dialog-content1">
            <div className="email-phone1">
              <div className="email1">
                <p>Email</p>
                <input className="email01"></input>
              </div>
              <div className="phone1">
                <p>Phone Number</p>
                <input className="phone01"></input>
              </div>
            </div>
            <div className="birthdate-salary1">
              <div className="birthdate1">
                <p>Birth Date</p>
                <input className="birthdate01"></input>
              </div>
              <div className="salary1">
                <p>Salary Expectation</p>
                <input className="salary01"></input>
              </div>
            </div>
            <div className="location1">
              <p>Location</p>
              <input className="location01"></input>
            </div>
            <div className="worktype1">
              <p>Work Type</p>
              <input className="worktype01"></input>
            </div>
          </div>
          {/* Additional content and form elements */}
          <button className="savebutton1" onClick={handleSaveClick}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationDialog;
