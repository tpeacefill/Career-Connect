// Courses.js

import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../Config/firebase";
import { useNavigate } from "react-router-dom";
import "./Courses.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import ExtraSkills from "../../Images/addskill.svg";
import CourseCards from "../../App-Components/CourseCards";
import CourseImage from "../../Images/courseImage.png";

const Courses = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('User has been logged out');
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="coursess">
       <Sidepane auth={auth} handleLogout={logout} /> 
      <Menubar />
      <div className="page-content">
        <div className="Jobss-heading">
          <div className="Jobss-txt1">
            <h5>Your registered Courses</h5>
            <p>Keep learning always</p>
          </div>
          <div className="Jobss-txt2">
            <h5>Your Saved Courses</h5>
            <p>Keep track of your activities</p>
          </div>
        </div>
        <div className="Jobss-content">
          <div className="jobs-container">
            <div className="registered-courses">
              <div className="registered-courses0">
                <CourseCards />
                <CourseCards />
                <CourseCards />
                <CourseCards />
              </div>
              <div className="registered-courses1">
                <CourseCards />
                <CourseCards />
                <CourseCards />
                <CourseCards />
              </div>
            </div>

            <div className="new-courses">
              <div className="new-courses-text">
                <div className="text1">
                  <h5>Other available Courses</h5>
                  <p>You might be interested in these courses as well</p>
                </div>
                <p className="new-text">See more</p>
              </div>
              <div className="available-courses">
                <div className="avalable-course1">
                  <div className="course-container">
                    <div className="course1-text">
                      <div className="course-type">
                        <p>Sales</p>
                      </div>
                      <div className="course-txt">
                        <h4>Profit & Losses</h4>
                        <p>
                          Get deep knowledge in business
                          <br />
                          calculate complex profit & losses
                          <br />
                          for rganizations
                        </p>
                      </div>
                      <div className="course-txt2">
                        <div className="course-txt2-1">
                          <h5>24K+</h5>
                          <p>Enrolled</p>
                        </div>
                        <div className="course-txt2-2">
                          <h5>18K+</h5>
                          <p>Completed</p>
                        </div>
                      </div>
                    </div>
                    <img
                      src={CourseImage}
                      className="course-image"
                      alt="course-item"
                    />
                  </div>
                </div>
                <div className="avalable-course2">
                <div className="course-container">
                    <div className="course1-text">
                      <div className="course-type">
                        <p>Sales</p>
                      </div>
                      <div className="course-txt">
                        <h4>Profit & Losses</h4>
                        <p>
                          Get deep knowledge in business
                          <br />
                          calculate complex profit & losses
                          <br />
                          for rganizations
                        </p>
                      </div>
                      <div className="course-txt2">
                        <div className="course-txt2-1">
                          <h5>24K+</h5>
                          <p>Enrolled</p>
                        </div>
                        <div className="course-txt2-2">
                          <h5>18K+</h5>
                          <p>Completed</p>
                        </div>
                      </div>
                    </div>
                    <img
                      src={CourseImage}
                      className="course-image"
                      alt="course-item"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="savedjobs-container">
            <div className="saved-jobs">
              <div className="special-header">
                <p>Saved Courses</p>
              </div>
              <div className="display-msg-container">
                <p className="display-msg">
                  You do not have any
                  <br />
                  saved courses yet
                </p>
              </div>
            </div>
            <div className="create-job-alert">
              <div className="special-header">
                <p>Add extra skills</p>
              </div>
              <div className="alert-msg">
                <img src={ExtraSkills} alt="Add extra skills" />
                <p>
                  Add extra skills to your
                  <br />
                  already existing skill set by
                  <br />
                  taking extra courses
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
