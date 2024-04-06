import React, { useState } from "react";
import "./ScheduleCounsel.css";
import closeBrown from "../Images/closebrown.svg";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useUser } from "./UserContext";
import { getFunctions, httpsCallable } from "firebase/functions";

const ScheduleCounseling = ({ onClose }) => {
  const { profileData } = useUser();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [note, setNote] = useState("");
  const functions = getFunctions();
  const sendCounselingEmail = httpsCallable(functions, "sendCounselingEmail");

  const handleSendEmail = async () => {
    const email =
      selectedCounselor === "C. Pokuaa"
        ? "peacefilltawiah123@outlook.com"
        : "pamenuveve@outlook.com";
    const subject = `Counseling Request from ${profileData.fullName}`;
    const content = `Date and Time: ${selectedDate.toString()}\nNote: ${note}`;

    // Using sendCounselingEmail within an async function
    try {
      await sendCounselingEmail({ to: email, subject, body: content });
      onClose(); // Close the modal/dialog after sending the email
    } catch (error) {
      console.error("Error sending email:", error);
      // Handle error (show message to user, etc.)
    }
  };

  return (
    <div className="dialog-box">
      <div className="dialog-container">
        <div className="dialog-header">
          <p>Schedule a Counseling Session</p>
          <img src={closeBrown} alt="close" onClick={onClose} />
        </div>
        <div className="dialog-content">
          <div className="activity-title">
            <p>Pick a date*</p>
            <Datetime onChange={(date) => setSelectedDate(date)} />
          </div>
          <div className="activity-title">
            <p>Select a counselor*</p>
            <select
              name="counselor"
              className="counselor-select"
              onChange={(e) => setSelectedCounselor(e.target.value)}
            >
              <option value="">--Please choose a counselor--</option>
              <option value="Martha Duah">Martha Duah</option>
              <option value="C. Pokuaa">C. Pokuaa</option>
            </select>
          </div>
          <div className="activity-description">
            <p>Attach a Note*</p>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Provide a description for the activity"
            />
          </div>
        </div>
        <button className="savebutton" onClick={handleSendEmail}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ScheduleCounseling;
