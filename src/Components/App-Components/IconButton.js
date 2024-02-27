// IconButton.js

import './IconButton.css';
import React from "react";

const IconButton = ({ svg, label, handleClick }) => {


  return (
    <div className="button-container">
      <button className="side-pane-button" onClick={handleClick}>
        <div className="button-content">
          <span>{svg}</span>
          <span className='label'>{label}</span>
        </div>
      </button>
    </div>
  );
};

export default IconButton;
