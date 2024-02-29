import React, { useState } from "react";
import "./CreateAlertBox.css";
import closeBrown from "../Images/closebrown.svg";

const CreateAlertBox = ({ onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionSelect = (event) => {
    const selectedOption = event.target.value;
    if (!selectedOptions.includes(selectedOption)) {
      setSelectedOptions([...selectedOptions, selectedOption]);
    }
  };

  const handleRemoveOption = (optionToRemove) => {
    const updatedOptions = selectedOptions.filter(
      (option) => option !== optionToRemove
    );
    setSelectedOptions(updatedOptions);
  };

  return (
    <div className="dialog-box">
      <div className="dialog-container">
        <div className="dialog-header">
          <p>Create Job Alerts of your Preference</p>
          <img src={closeBrown} alt="close" onClick={onClose} />
        </div>
        <div className="dialog-content">
          <div className="activity-title">
            <p>Job Preferences</p>
            <select onChange={handleOptionSelect}>
              <option value="" disabled selected>
                Select a job preference to create alert
              </option>
              <option value="Software Engineer/Developer">
                Software Engineer/Developer
              </option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Data Scientist/Analyst">
                Data Scientist/Analyst
              </option>
              <option value="System Administrator">
                System Administrator
              </option>
              <option value="Cyber Security Analyst">
                Cyber Security Analyst
              </option>
            </select>
            <p>Select multiple preferences of your choice</p>
          </div>
          <div className="activity-description">
            <p>Selected Jobs</p>
            <div className="selected-jobs">
              {selectedOptions.map((option, index) => (
                <div key={index} className="selected-job">
                  <span>{option}</span>
                  <img
                    src={closeBrown}
                    alt="remove"
                    className="remove-icon"
                    onClick={() => handleRemoveOption(option)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="savebutton">Save</button>
      </div>
    </div>
  );
};

export default CreateAlertBox;
