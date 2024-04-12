import React from "react";
import "./JobsContent.css";
import Jobspic from "../Images/App_logo.png";
import SaveJobs from "../Images/savejobs.svg";

const JobsContent = ({ job }) => {
  return (
    <div className="jobs-content">
      <div className="jobs-content1">
        <div className="jobs-content-text">
          <img src={Jobspic} alt="Jobs" className="Jobs-image" />
          <div className="jobs-description">
            <h4>{job.jobName}</h4>
            <p>Job Description: {job.description}</p>
          </div>
        </div>
        <div className="jobs-save">
          <img src={SaveJobs} alt="save jobs icon" />
          <p>Click to view job details</p>
        </div>
      </div>
    </div>
  );
};

export default JobsContent;
