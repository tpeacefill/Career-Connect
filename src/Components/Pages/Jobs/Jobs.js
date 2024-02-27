// Jobs.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../Config/firebase";
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
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="jobss">
      <Sidepane />
      <Menubar />
      <div className="page-content">
        <div className="Jobss-heading">
          <div className="Jobss-txt1">
            <h5>Find available jobs here!</h5>
            <p>You could be a favorite</p>
          </div>
          <div className="Jobss-txt2">
            <h5>Your Saved Jobs</h5>
            <p>Save jobs to apply later</p>
          </div>
        </div>
        <div className="Jobss-content">
          <div className="jobs-container">
            <div className="specific-job">
              <h5>UI/UX Design Jobs</h5>
              <p>Create alert</p>
            </div>
            <div className="thejobs">
              <JobsContent />
              <JobsContent />
              <JobsContent />
            </div>
            <div className="specific-job">
              <h5>UI/UX Design Jobs</h5>
              <p>Create alert</p>
            </div>
            <div className="thejobs">
              <JobsContent />
              <JobsContent />
              <JobsContent />
            </div>
            <button className="viewmore">View more jobs</button>
          </div>
          <div className="savedjobs-container">
            <div className="saved-jobs">
              <div className="special-header">
                <p>Saved Jobs</p>
              </div>
              <div className="display-msg-container">
                <p className="display-msg">
                  You do not have any
                  <br />
                  saved jobs yet
                </p>
              </div>
            </div>
            <div className="create-job-alert">
              <div className="special-header">
                <p>Saved Jobs</p>
              </div>
              <div className="alert-msg">
                <img src={CreateAlert} alt="create alert"/>
                <p>
                  Create job alerts to receive
                  <br />
                  job notications
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
