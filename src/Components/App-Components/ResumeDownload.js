import React, { useEffect, useState } from "react";
import "./ResumeDownload.css";
import PersonalInformationDialog from "./PersonalInformationDialog"; // Assuming the correct file name is 'PersonalInformationDialog'
import { db } from "../Config/firebase"; // Import auth from Firebase
import { useUser } from "../App-Components/UserContext";
import { doc, onSnapshot } from "firebase/firestore";

const ResumeDownload = () => {
  
  return (
    <div className="personal-information">
       
    </div>
  );
};

export default ResumeDownload;
