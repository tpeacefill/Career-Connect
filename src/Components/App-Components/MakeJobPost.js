import React, { useState } from "react";
import "./MakeJobPost.css";
import closeBrown from "../Images/closebrown.svg";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const MakeJobPost = ({ onClose }) => {
  const [jobName, setJobName] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Function to handle job post
  const postJob = async () => {
    if (jobName && jobType && jobLink && workLocation && jobDescription) {
      try {
        const db = getFirestore();
        await addDoc(collection(db, "JobListings"), {
          // No need to specify document ID, addDoc will generate it automatically
          jobName,
          jobType,
          link: jobLink,
          workLocation,
          description: jobDescription,
        });
        console.log("Job posted successfully!");
        onClose(); // Close the dialog
      } catch (error) {
        console.error("Error posting job: ", error);
      }
    }
  };

  // Function to check if all fields are filled
  const areAllFieldsFilled = () => {
    return jobName && jobType && jobLink && workLocation && jobDescription;
  };

  // Function to handle close button click
  const handleClick = () => {
    onClose();
  };

  return (
    <div className="makejobpost-box">
      <div className="makeJob-header">
        <h3>Create a Job Post</h3>
        <img src={closeBrown} alt="close-button" onClick={handleClick} />
      </div>
      <div className="makeJobContent">
        <div className="jobName-jobType">
          <select
            className="input-jobName"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
          >
            <option value="" disabled>
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
          <select
            id="job-type"
            className="jobType-selection"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="" disabled>
              Select a Job Type
            </option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div className="jobName-jobType">
          <input
            className="job-link"
            placeholder="Add a link to the job"
            type="link"
            value={jobLink}
            onChange={(e) => setJobLink(e.target.value)}
          />
          <select
            id="job-type"
            className="jobType-selection"
            value={workLocation}
            onChange={(e) => setWorkLocation(e.target.value)}
          >
            <option value="" disabled>
              Select Work Location
            </option>
            <option value="remote">Remote</option>
            <option value="in-person">In Person</option>
            <option value="both">Both</option>
          </select>
        </div>
        <textarea
          className="job-description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>
      <button
        className="post-job"
        disabled={!areAllFieldsFilled()}
        style={{
          backgroundColor: areAllFieldsFilled()
            ? "#ad8547"
            : "rgba(255, 255, 255, 0.5)",
        }}
        onClick={postJob}
      >
        Post Job
      </button>
    </div>
  );
};

export default MakeJobPost;
