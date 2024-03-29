import React from "react";
import "./CreateAlertBox.css";
import closeBrown from "../Images/closebrown.svg";

const MakePostBox = ({ onClose }) => {
 

  return (
    <div className="dialog-box">
      <div className="dialog-container">
        <div className="dialog-header">
          <p>Create Job Alerts of your Preference</p>
          <img src={closeBrown} alt="close" onClick={onClose} />
        </div>
        <div className="dialog-content">
          
        </div>
        <button className="savebutton">Save</button>
      </div>
    </div>
  );
};

export default MakePostBox;
