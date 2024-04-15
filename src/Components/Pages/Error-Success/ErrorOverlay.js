// ErrorOverlay.js

import React from "react";
import "./ErrorOverlay.css"; // Include styles for the error overlay

const ErrorOverlay = ({ message, onClose }) => {
  return (
    <div className="error-overlay">
      <div className="blur-background">
        {/* Your blurred background styling here */}
      </div>
      <div className="error-dialog">
        <div className="error-content">
          <p>{message}</p>
          <button className="error-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorOverlay;
