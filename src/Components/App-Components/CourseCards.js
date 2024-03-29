import React from "react";
import options from "../Images/options.svg";
import CourseImage from "../Images/courseimage.jpg";
import "./CourseCards.css";

const CourseCards = () => {
  return (
    <div className="course1">
      <div className="course-content">
        <div className="item1">
          <div className="item1-coursename">
            <p>Design</p>
          </div>
          <div className="item1-options">
            <img src={options} alt="options" />
          </div>
        </div>
        <h5>Auto Layout</h5>
        <img src={CourseImage} alt="Course" />

        <p className="description">
          Get the knowledge to make designs responsive{" "}
        </p>
        <div className="item3">
          <p className="percentage">50%</p>
          <div className="progresscontainer">
            <div className="progressbar"></div>
          </div>
          <p className="outof">5/10</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCards;
