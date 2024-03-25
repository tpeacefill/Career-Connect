import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Config/firebase";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import "./Settings.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import PersonalInformation from "../../App-Components/PersonalInformation";
import ResumeDownload from "../../App-Components/ResumeDownload";
import EditProfileDialog from "../../App-Components/EditProfileDialog";
import ProfilePicture from "../../App-Components/profilePicture";
import { useUser } from "../../App-Components/UserContext";

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    bio: "",
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (currentUser?.uid) {
      const userRef = doc(db, "User", currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUserDetails({
            fullName: userData.fullName,
            email: userData.email,
            bio: userData.bio || "",
          });
          setImageUrl(userData.profilePicture || ""); // Set the initial imageUrl
        } else {
          console.log("No such document in 'User' collection!");
        }
      });

      return unsubscribe; // Cleanup subscription on unmount
    }
  }, [currentUser]);

  const handleEditClick = () => {
    setShowEditProfile(true);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
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

  const updateBio = (newBio) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      bio: newBio,
    }));
  };

  return (
    <div className="settings">
      <Sidepane auth={auth} handleLogout={logout} />
      <Menubar />
      <div className="page-content">
        <div className="dash-content">
          <div className="profileContent">
            <div className="profileCnt">
              <ProfilePicture
                className="settings-profile-picture" // Use a different className here
                showDropdownMenu={false} // Set to false for Settings
                imageUrl={imageUrl}
              />
              <div className="name-passwordd">
                <h3 className="name-password-name">{userDetails.fullName}</h3>
                <p className="name-password-email">{userDetails.email}</p>
              </div>
              <button className="editt-profile" onClick={handleEditClick}>
                Edit
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="white"
                    d="M3.548 20.938h16.9a.5.5 0 0 0 0-1h-16.9a.5.5 0 0 0 0 1M9.71 17.18a2.587 2.587 0 0 0 1.12-.65l9.54-9.54a1.75 1.75 0 0 0 0-2.47l-.94-.93a1.788 1.788 0 0 0-2.47 0l-9.54 9.53a2.473 2.473 0 0 0-.64 1.12L6.04 17a.737.737 0 0 0 .19.72a.767.767 0 0 0 .53.22Zm.41-1.36a1.468 1.468 0 0 1-.67.39l-.97.26l-1-1l.26-.97a1.521 1.521 0 0 1 .39-.67l.38-.37l1.99 1.99Zm1.09-1.08l-1.99-1.99l6.73-6.73l1.99 1.99Zm8.45-8.45L18.65 7.3l-1.99-1.99l1.01-1.02a.748.748 0 0 1 1.06 0l.93.94a.754.754 0 0 1 0 1.06"
                  />
                </svg>
              </button>
            </div>
            <div className="profilebio">
              <p>{userDetails.bio || "Add your bio in here....."}</p>
            </div>
          </div>
          {showEditProfile && currentUser?.uid && (
            <div className="dialog-overlay">
              <EditProfileDialog
                onClose={handleCloseEditProfile}
                userId={currentUser?.uid}
                updateBio={updateBio}
              />
            </div>
          )}
        </div>
        <PersonalInformation />
        <ResumeDownload />
      </div>
    </div>
  );
};

export default Settings;
