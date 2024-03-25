import React, { useEffect, useState } from "react";
import "./ResumeDownload.css";
import { db } from "../Config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "../App-Components/UserContext";

const ResumeDownload = ({ userId }) => {
  const { currentUser } = useUser();
  const [resumeFileName, setResumeFileName] = useState("");


    // Determine the effective userId to use: prop or current user's ID
    const effectiveUserId = userId || currentUser?.uid;
  
    useEffect(() => {
      const fetchUserDetails = async () => {
        if (effectiveUserId) {
          const userRef = doc(db, "User", effectiveUserId);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const { fullName } = docSnap.data();
            // Format fullName: replace spaces with underscores and append "_Resume.pdf"
            const formattedName = `${fullName.replace(/\s+/g, "_")}_Resume.pdf`;
            setResumeFileName(formattedName);
          } else {
            console.log("No such document in 'User' collection!");
          }
        }
      };
  
      fetchUserDetails();
    }, [effectiveUserId]);

  return (
    <div className="resumeDownload">
      <div className="resumeContent">
        <h3>Resume</h3>
        <div className="resumePlace">
          <div className="resumeCnt">
            <div className="Rsm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.75em"
                height="1em"
                viewBox="0 0 24 32"
                opacity="0.5"
              >
                <g fill="white">
                  <path d="M1.5 32h21c.827 0 1.5-.673 1.5-1.5v-21c0-.017-.008-.031-.009-.047c-.002-.023-.008-.043-.013-.065a.488.488 0 0 0-.09-.191c-.007-.009-.006-.02-.013-.029l-8-9c-.003-.003-.007-.003-.01-.006a.494.494 0 0 0-.223-.134c-.019-.006-.036-.008-.056-.011C15.557.012 15.53 0 15.5 0h-14C.673 0 0 .673 0 1.5v29c0 .827.673 1.5 1.5 1.5M16 1.815L22.387 9H16.5c-.22 0-.5-.42-.5-.75zM1 1.5a.5.5 0 0 1 .5-.5H15v7.25c0 .809.655 1.75 1.5 1.75H23v20.5a.5.5 0 0 1-.5.5h-21c-.28 0-.5-.22-.5-.5z" />
                  <path d="M5.5 14h13a.5.5 0 0 0 0-1h-13a.5.5 0 0 0 0 1m0 4h13a.5.5 0 0 0 0-1h-13a.5.5 0 0 0 0 1m0-8h6a.5.5 0 0 0 0-1h-6a.5.5 0 0 0 0 1m0 12h13a.5.5 0 0 0 0-1h-13a.5.5 0 0 0 0 1m0 4h13a.5.5 0 0 0 0-1h-13a.5.5 0 0 0 0 1" />
                </g>
              </svg>
            </div>
            <p>{resumeFileName}</p>
          </div>
          <button className="rsmDownload">
            Download
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="m12 15.577l-3.538-3.539l.707-.719L11.5 13.65V5h1v8.65l2.33-2.33l.708.718zM6.615 19q-.69 0-1.152-.462Q5 18.075 5 17.385v-2.423h1v2.423q0 .23.192.423q.193.192.423.192h10.77q.23 0 .423-.192q.192-.193.192-.423v-2.423h1v2.423q0 .69-.462 1.152q-.463.463-1.153.463z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeDownload;
