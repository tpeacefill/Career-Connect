// Dashboard.js

import React, { useState } from "react";
import "./Dashboard.css";
import Sidepane from "../../App-Components/Sidepane";
import DialogBox from "../../App-Components/Dialog";
import CourseCards from "../../App-Components/CourseCards";
import JobsContent from "../../App-Components/JobsContent";
import Menubar from "../../App-Components/Menubar";
import JobAlert from "../../Images/Create-alert.svg";
import ExtraSkills from "../../Images/addskill.svg";
import ResumeLoad from "../../Images/ResumeLoad.svg";
import AddIcon from "../../Images/add_icon.svg";

const Dashboard = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };
  return (
    <div className="dashboard">
      <Sidepane />
      <Menubar />
      <div className="page-content">
        <div className="dash-content1">
          <div className="welcome-msg">
            <h3>What would you want to do today?</h3>
            <p>There’s a lot to achieve</p>
          </div>
          <div className="content-feature">
            <div className="content-imgs">
              <div className="content-img1">
                <img src={JobAlert} alt="Job Alert" />
                <p>Create a job alert</p>
              </div>
              <div className="content-img2">
                <img src={ExtraSkills} alt="Extra Skill Sets" />
                <p>Add extra skill sets</p>
              </div>
              <div className="content-img3">
                <img src={ResumeLoad} alt="Upload Resume" />
                <p>Upload your resume</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-content2">
          <div className="content2-txt1">
            <h5>Your registered Courses</h5>
            <p>Continue learning, you’ll get there</p>
          </div>
          <div className="content2-txt2">
            <h5>Your Personalized Calender</h5>
            <p>Keep track of your own activities</p>
          </div>
        </div>

        <div className="dash-content3">
          <div className="course-jobs">
            <div className="courses">
              <CourseCards />
              <CourseCards />
              <CourseCards />
              <CourseCards />
            </div>
            {/*Pay attention to jobs side*/}
            <div className="jobs">
              <div className="jobs-msg">
                <div className="jobs-msg1">
                  <h4>Today’s available job vacancies</h4>
                  <p>Keep applying, you might be the one they want</p>
                </div>
                <p className="text-msg1">View More</p>
              </div>
              <div className="jobs2">
                <JobsContent />
                <JobsContent />
              </div>
            </div>
          </div>
          {/*Remember to complete calendar*/}
          <div className="activity-event">
            <div className="created-activity"></div>
            <div className="divider1"></div>
            <div className="activity-alert">
              <p>Create an activity alert</p>
              {isDialogOpen && (
                <div className="dialog-overlay">
                  <DialogBox onClose={toggleDialog} />
                </div>
              )}
              <button className= "activity-alert-button" onClick={toggleDialog}>
                <img src={AddIcon} alt="add-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

{
  /*import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../Config/firebase";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Sidepane from '../../App-Components/Sidepane';
import Menubar from '../../App-Components/Menubar';



const Dashboard = () => {
  //const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }; 

  return (
    <div className="dashboard">
      <Sidepane /> 
      {/*<Menubar />
    </div>
  );
};

export default Dashboard;*/
}
