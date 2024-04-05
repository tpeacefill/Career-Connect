import React, { useState } from "react"; // Import useState here
import "./ScheduleCounsel.css";
import closeBrown from "../Images/closebrown.svg";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useUser } from "./UserContext";

const ScheduleCounseling = ({ onClose }) => {
  const { profileData } = useUser();
  const [selectedDate, setSelectedDate] = useState(""); // Now useState is defined
  const [selectedCounselor, setSelectedCounselor] = useState(""); // Now useState is defined
  const [note, setNote] = useState(""); // Now useState is defined

  const handleSendEmail = async () => {
    const email =
      selectedCounselor === "C. Pokuaa"
        ? "peacefilltawiah123@gmail.com"
        : "pamenuveve@outlook.com";
    const subject = `Counseling Request from ${profileData.fullName}`;
    const content = `Date and Time: ${selectedDate.toString()}\nNote: ${note}`;

    // You need to define or import this function elsewhere in your project
    await sendEmail({ to: email, subject, body: content });

    onClose(); // Close the modal/dialog after sending the email
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
            <Datetime />
          </div>
          <div className="activity-title">
            <p>Select a counselor*</p>
            <select name="counselor" className="counselor-select">
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
