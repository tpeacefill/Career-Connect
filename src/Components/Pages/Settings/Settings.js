// Settings.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Config/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import the Firestore method to get document data
import "./Settings.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import ExtraSkillsBox from "../../App-Components/ExtraSkillsBox";
import ProfilePicture from "../../App-Components/profilePicture";
import { useUser } from "../../App-Components/UserContext"; // Make sure the path to useUser is correct

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, profileData } = useUser();
  const [userDetails, setUserDetails] = React.useState({
    fullName: "",
    email: "",
  });

  const [showExtraSkills, setShowExtraSkills] = useState(false);

  const handleEditClick = () => {
    setShowExtraSkills(true);
  };

  const handleCloseExtraSkills = () => {
    setShowExtraSkills(false);
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

  // Fetch user details once when the component mounts
  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        const userRef = doc(db, "User", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserDetails({
            fullName: userData.fullName,
            email: userData.email,
          });
        } else {
          console.log("No such document in 'User' collection!");
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  return (
    <div className="settings">
      <Sidepane auth={auth} handleLogout={logout} />
      <Menubar />
      <div className="page-content">
        <div className="dash-content">
          <div className="profileContent">
            <div className="profileCnt">
              <ProfilePicture
                className="settings-profile-picture"
                showDropdownMenu={false}
              />
              <div className="name-password">
                <h3 className="name-password-name">
                  {userDetails.fullName || profileData.fullName}
                </h3>{" "}
                {/* Display the full name */}
                <p className="name-password-email">
                  {userDetails.email || profileData.email}
                </p>{" "}
                {/* Display the email */}
              </div>
              <button className="edit-profile" onClick={handleEditClick}>
                Edit
              </button>
            </div>
            <div className="profilebio">
              <p>Add your bio in here.....</p>
            </div>
          </div>
          {showExtraSkills && (
            <div className="dialog-overlay">
              <ExtraSkillsBox onClose={handleCloseExtraSkills} />
            </div>
            
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
