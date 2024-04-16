// DialogBox.js
import React, { useState } from "react";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { auth } from "../Config/firebase";
import "./Dialog.css";
import closeBrown from "../Images/closebrown.svg";
import MyDatePicker from "../App-Components/DatePicker"; // Adjust the path accordingly

const DialogBox = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDescription, setActivityDescription] = useState("");

  const handleSave = async () => {
    const db = getFirestore();
    try {
      await addDoc(collection(db, "ActivityAlert"), {
        date: selectedDate.toISOString(),
        activityTitle,
        activityDescription,
        userId: auth.currentUser.uid,
      });
      onClose();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

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
            <MyDatePicker
              selectedDate={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
          <div className="activity-title">
            <p>Activity Title*</p>
            <input
              placeholder="Enter an activity title"
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
            />
          </div>
          <div className="activity-description">
            <p>Activity Description*</p>
            <input
              placeholder="Provide a description for the activity"
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
            />
          </div>
        </div>
        <button className="savebutton" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default DialogBox;
