// Dashboard.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../../Config/firebase";
import "./Dashboard.css";
import Sidepane from "../../App-Components/Sidepane";
import DialogBox from "../../App-Components/Dialog";
import ExtraSkillsBox from "../../App-Components/ExtraSkillsBox";
import CreateAlertBox from "../../App-Components/CreateAlertBox";
import CourseCards from "../../App-Components/CourseCards";
import JobsContent from "../../App-Components/JobsContent";
import Menubar from "../../App-Components/Menubar";
import JobAlert from "../../Images/Create-alert.svg";
import ExtraSkillss from "../../Images/addskill.svg";
import ResumeLoad from "../../Images/ResumeLoad.svg";
import AddIcon from "../../Images/add_icon.svg";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Dashboard = () => {
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

  const [jobs, setJobs] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const db = getFirestore();
      const jobsCollection = collection(db, "JobListings");

      // Subscribe to changes in the jobs collection
      const unsubscribe = onSnapshot(jobsCollection, (snapshot) => {
        const jobList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobList);
      });

      return unsubscribe; // Cleanup subscription on component unmount
    };

    fetchJobs();
  }, []);

  const toggleDialog = (type) => {
    setDialogType(type);
    setDialogOpen(!isDialogOpen);
  };

  // Function to render the appropriate dialog component based on dialogType
  const renderDialogComponent = () => {
    switch (dialogType) {
      case "extraSkills":
        return <ExtraSkillsBox onClose={toggleDialog} />;
      case "createAlert":
        return <CreateAlertBox onClose={toggleDialog} />;
      default:
        return <DialogBox onClose={toggleDialog} type={dialogType} />;
    }
  };

  return (
    <div className="dashboard">
      <Sidepane auth={auth} handleLogout={logout} />
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
                <div
                  className="content-img1-inner"
                  onClick={() => toggleDialog("createAlert")}
                >
                  <img src={JobAlert} alt="Job Alert" />
                  <p className="conttext">Create a job alert</p>
                </div>
              </div>
              <div className="content-img2">
                <div
                  className="content-img2-inner"
                  onClick={() => toggleDialog("extraSkills")}
                >
                  <img src={ExtraSkillss} alt="Extra Skill Sets" />
                  <p className="conttext">Add extra skill sets</p>
                </div>
              </div>
              <div className="content-img3">
                <Link to="/resumes" className="content-img3-1">
                  <img src={ResumeLoad} alt="Upload Resume" />
                  <p className="conttext">Upload your resume</p>
                </Link>
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
            <h5>Your Personalized Calendar</h5>
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
            <div className="jobs">
              <div className="jobs-msg">
                <div className="jobs-msg1">
                  <h4>Today’s available job vacancies</h4>
                  <p>Keep applying, you might be the one they want</p>
                </div>
                <p className="text-msg1">
                  <Link to="/jobs" className="text-msg1">
                    View More
                  </Link>
                </p>
              </div>
              <div className="jobs2">
                {jobs.slice(0, 2).map((job) => (
                  <JobsContent key={job.id} job={job} />
                ))}
              </div>
            </div>
          </div>
          <div className="activity-event">
            <div className="created-activity">
              <Calendar onChange={onChange} value={date} className= "calendar"/>
            </div>
            <div className="divider1"></div>
            <div className="activity-alert">
              <p>Create an activity alert</p>
              {isDialogOpen && (
                <div className="dialog-overlay">{renderDialogComponent()}</div>
              )}
              <button
                className="activity-alert-button"
                onClick={() => toggleDialog("activityAlert")}
              >
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
