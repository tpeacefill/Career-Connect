import React from "react";
import "./Dialog.css";
import closeBrown from "../Images/closebrown.svg";
import MyDatePicker from "../Pages/Dashboard/Datepicker";

const DialogBox = ({ onClose }) => {
  return (
    <div className="dialog-box">
      <div className="dialog-container">
        <div className="dialog-header">
          <p>Add an activity to your list for Reminders</p>
          <img src={closeBrown} alt="close" onClick={onClose} />
        </div>
        <div className="dialog-content">
          <div className="activity-title">
            <p>Pick a date*</p>
            <MyDatePicker />
          </div>
          <div className="activity-title">
            <p>Activity Title*</p>
            <input placeholder="Enter an activity title" />
          </div>
          <div className="activity-description">
            <p>Activity Description*</p>
            <input placeholder="Provide a description for the activity" />
          </div>
        </div>
        <button className="savebutton">Save</button>
      </div>
    </div>
  );
};

export default DialogBox;
