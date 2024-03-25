import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Config/firebase";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import "./UserProfile.css";
import Sidepane from "../App-Components/Sidepane";
import Menubar from "../App-Components/Menubar";
import PersonalInformation from "../App-Components/PersonalInformation";
import ResumeDownload from "../App-Components/ResumeDownload";
import ProfilePicture from "../App-Components/profilePicture";
import { useUser } from "../App-Components/UserContext";

const UserProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    bio: "",
  });
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


  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User has been logged out");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleMessageClick = () => {
    
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
              <button className="send-message" onClick={handleMessageClick}>
                Message
              </button>
            </div>
            <div className="profilebio">
              <p>{userDetails.bio || "Add your bio in here....."}</p>
            </div>
          </div>
        </div>
        <PersonalInformation editable={false} />

        <ResumeDownload editable={false} />
      </div>
    </div>
  );
};

export default UserProfile;
