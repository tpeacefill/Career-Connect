import React from "react";
import './JobsContent.css';
import Jobspic from "../Images/jobspic.svg";
import SaveJobs from "../Images/savejobs.svg";

const JobsContent = () => {


    return (
        <div className="jobs-content">
        <div className="jobs-content1">
          <div className="jobs-content-text">
            <img src={Jobspic} alt="Jobs-image" className="Jobs-image"/>
            <div className="jobs-description">
            <h4>UI/UX Desiner</h4>
            <p>Job Description: We need a skilled UI/UX Designer with 3 years of experience</p>
            </div>
          </div>
          <div className="jobs-save">
            <img src={SaveJobs} alt="save jobs icon" />
            <p>Click to view job details</p>
          </div>
        </div>
        <div className="jobs-content2"></div>
      </div>
    );
};

export default JobsContent;