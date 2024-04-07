// Jobs.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Config/firebase";
import { signOut } from "firebase/auth";
import "./Jobs.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import JobsContent from "../../App-Components/JobsContent";
import CreateAlert from "../../Images/Create-alert.svg";

const Jobs = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User has been logged out");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="jobss">
      <Sidepane auth={auth} handleLogout={logout} />
      <Menubar />
      <div className="page-content">
        <div className="JobsButton-Heading">
          <div className="title-button">
            <div className="jobtitle-headings">
              <h3>Open Job Listing</h3>
              <p>View Job listing of your interest here</p>
            </div>
            <button className="Makepost">Make a Post</button>
          </div>
          <div className="filter-section">
            <selection className="fulltime-parttime-contract">
              <label htmlFor="job-type" className="label1">
                Job Type:
              </label>
              <select id="job-type" className="select-options">
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
            </selection>
            <selection className="remote-Inperson">
              <label htmlFor="work-location" className="label1">
                Work Location:
              </label>
              <select id="work-location" className="select-options2">
                <option value="remote">Remote</option>
                <option value="in-person">In Person</option>
                <option value="both">Both</option>
              </select>
            </selection>
            <button className="Search-button">Search</button>
          </div>
        </div>
        <div className="jobs-space">
          <JobsContent />
        </div>
      </div>
    </div>
  );
};

export default Jobs;
