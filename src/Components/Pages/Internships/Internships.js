// Internships.js

import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../Config/firebase";
import { useNavigate } from "react-router-dom";
import "./Internships.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import JobsContent from "../../App-Components/JobsContent";
import CreateAlert from "../../Images/Create-alert.svg";

const Internships = () => {
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
    <div className="internships">
      <Sidepane handleLogout={logout} />
      <Menubar />
      <div className="page-content">
        <div className="Jobss-heading">
          <div className="Jobss-txt1">
            <h5>Find internships here!</h5>
            <p>You could be a favorite</p>
          </div>
          <div className="Jobss-txt2">
            <h5>Your Saved Jobs</h5>
            <p>Save jobs to apply later</p>
          </div>
        </div>
        <div className="Jobss-content">
          <div className="jobs-container">
            <div className="unavailable">
              <p>
                There are currently no internship opportunities available
                <br />
                Please check in later
              </p>
              <button className="create_alert">Create alert</button>
            </div>
          </div>
          <div className="savedjobs-container">
            <div className="saved-jobs">
              <div className="special-header">
                <p>Saved Internships</p>
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
                <img src={CreateAlert} alt="create alert" />
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

export default Internships;
