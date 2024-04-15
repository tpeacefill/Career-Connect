import React, { useState, useEffect } from "react";
import "./ViewJobDetails.css";
import closeBrown from "../Images/closebrown.svg";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firebase Firestore

const ViewJobDetails = ({ onClose, jobId }) => {
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const db = getFirestore();
        const jobDocRef = doc(db, "JobListings", jobId);
        const jobSnapshot = await getDoc(jobDocRef);
        if (jobSnapshot.exists()) {
          setJobDetails(jobSnapshot.data());
        } else {
          console.log("No such job document!");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Conditional rendering to check if jobDetails is not null
  if (!jobDetails) {
    return <p>Loading job details...</p>; // Show loading state or error message
  }

  return (
    <div className="dialog-box">
      <div className="dialog-container">
        <div className="dialog-headerforjob">
          <p>View Job's Details</p>
          <img src={closeBrown} alt="close" onClick={onClose} />
        </div>
        <div className="dialog-content">
          <h3>Job Name: {jobDetails.jobName}</h3>
          <h3>Job Type: {jobDetails.jobType}</h3>
          <h3>Work Location: {jobDetails.workLocation}</h3>
          <h3>Description: {jobDetails.description}</h3>
          <h3>
            Job Link:{" "}
            <a
              href={jobDetails.link}
              target="_blank"
              rel="noopener noreferrer"
              className="jobslink"
            >
              Click Here
            </a>
          </h3>
        </div>
        <button className="savebutton">
          <a
            href={jobDetails.link}
            target="_blank"
            rel="noopener noreferrer"
            className="jobslinkss"
          >
            Apply
          </a>
        </button>
      </div>
    </div>
  );
};

export default ViewJobDetails;
