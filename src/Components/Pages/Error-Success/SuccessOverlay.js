// SuccessOverlay.js

import React from "react";
import "./SuccessOverlay.css"; // Include styles for the success overlay

const SuccessOverlay = ({ message, onClose }) => {
  return (
    <div className="success-overlay">
      <div className="blur-background">
        {/* Your blurred background styling here */}
      </div>
      <div className="success-dialog">
        <div className="success-content">
          <p>{message}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessOverlay;
