import React, { useState } from "react";
import "./JobsContent.css";
import Jobspic from "../Images/App_logo.png";
import SaveJobs from "../Images/savejobs.svg";
import DialogBox from "./Dialog"; // Import DialogBox component

const JobsContent = ({ job }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  // Add a condition to render a message or a spinner while the job data is loading
  if (!job) {
    return <div>Loading job...</div>;
  }

  return (
    <div className="jobs-content">
      <div className="jobs-content1">
        <div className="jobs-content-text">
          <img src={Jobspic} alt="Jobs" className="Jobs-image" />
          <div className="jobs-description">
            <h4>{job?.jobName}</h4>
            <p>Job Description: {job?.description}</p>
          </div>
        </div>
        <div className="jobs-save" onClick={toggleDialog}>
          {" "}
          {/* Add onClick event */}
          <img src={SaveJobs} alt="save jobs icon" />
          <p>Click to view job details</p>
        </div>
      </div>
      {isDialogOpen && (
        <div className="dialog-overlay">
          <DialogBox onClose={toggleDialog} />
        </div>
      )}

      {/* Render DialogBox conditionally */}
    </div>
  );
};

export default JobsContent;
