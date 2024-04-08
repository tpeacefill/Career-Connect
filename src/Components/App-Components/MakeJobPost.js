import React, { useState } from "react";
import "./MakeJobPost.css";
import closeBrown from "../Images/closebrown.svg";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useUser } from "./UserContext";

const MakeJobPost = ({ onClose }) => {
  return (
    <div className="makejobpost-box">
      <div className="makeJob-header">
        <h3>Create a Job Post</h3>
        <img src={closeBrown} alt="close-button" />
      </div>
      <div className="makeJobContent">
        <div className="jobName-jobType">
          <select className="input-jobName">
            <option value="" disabled selected>
              Select a Job Name
            </option>
            <option value="Software Engineer/Developer">
              Software Engineer/Developer
            </option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="Data Scientist/Analyst">
              Data Scientist/Analyst
            </option>
            <option value="System Administrator">System Administrator</option>
            <option value="Cyber Security Analyst">
              Cyber Security Analyst
            </option>
          </select>
          <select id="job-type" className="jobType-selection">
            <option value="" disabled selected>
              Select a Job Type
            </option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div className="jobName-jobType">
          <input className="job-link" placeholder="Add a link to the job" type="link"/>
          <select id="job-type" className="jobType-selection">
            <option value="" disabled selected>
              Select Work Location
            </option>
            <option value="remote">Remote</option>
            <option value="in-person">In Person</option>
            <option value="both">Both</option>
          </select>
        </div>
        <textarea className="job-description"/>
      </div>
      <button className="post-job">Post Job</button>
    </div>
  );
};

export default MakeJobPost;
