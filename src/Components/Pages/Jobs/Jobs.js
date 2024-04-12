// Jobs.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../../Config/firebase";
import "./Jobs.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import JobsContent from "../../App-Components/JobsContent";
import MakeJobPost from "../../App-Components/MakeJobPost";

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [workLocationFilter, setWorkLocationFilter] = useState("");
  const [isAlertBoxVisible, setIsAlertBoxVisible] = useState(false);

  useEffect(() => {
    const db = getFirestore();
    const jobsCollection = collection(db, "JobListings");
    let filteredQuery = jobsCollection;

    if (jobTypeFilter) {
      filteredQuery = query(
        jobsCollection,
        where("jobType", "==", jobTypeFilter)
      );
    }

    if (workLocationFilter) {
      filteredQuery = query(
        filteredQuery,
        where("workLocation", "==", workLocationFilter)
      );
    }

    const unsubscribe = onSnapshot(
      filteredQuery,
      (snapshot) => {
        const jobList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobList);
      },
      (error) => {
        console.error("Error fetching jobs:", error);
      }
    );

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [jobTypeFilter, workLocationFilter]);

  const toggleAlertBox = () => {
    setIsAlertBoxVisible(!isAlertBoxVisible);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User has been logged out");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleJobTypeChange = (e) => {
    setJobTypeFilter(e.target.value);
  };

  const handleWorkLocationChange = (e) => {
    setWorkLocationFilter(e.target.value);
  };

  const handleSearch = () => {
    // This function could be expanded further if needed
    // For now, the filtering is automatically applied via useEffect
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
            <button className="Makepost" onClick={toggleAlertBox}>
              Make a Post
            </button>
            {isAlertBoxVisible && (
              <div className="overlay">
                <MakeJobPost onClose={toggleAlertBox} />
              </div>
            )}
          </div>
          <div className="filter-section">
            <selection className="fulltime-parttime-contract">
              <label htmlFor="job-type" className="label1">
                Job Type:
              </label>
              <select
                id="job-type"
                className="select-options"
                onChange={handleJobTypeChange}
                value={jobTypeFilter}
              >
                <option value="">All</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
            </selection>
            <selection className="remote-Inperson">
              <label htmlFor="work-location" className="label1">
                Work Location:
              </label>
              <select
                id="work-location"
                className="select-options2"
                onChange={handleWorkLocationChange}
                value={workLocationFilter}
              >
                <option value="">All</option>
                <option value="remote">Remote</option>
                <option value="in-person">In Person</option>
                <option value="both">Both</option>
              </select>
            </selection>
            <button className="Search-button" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
        <div className="jobs-space">
          <h3>Available Jobs</h3>
          <p className="jobsp">All jobs are tailored to your preference</p>
          <div className="actual-joblistings">
            {jobs.map((job) => (
              <JobsContent key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
