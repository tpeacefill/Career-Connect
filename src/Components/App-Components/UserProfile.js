import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../Config/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./UserProfile.css";
import Sidepane from "../App-Components/Sidepane";
import Menubar from "../App-Components/Menubar";
import PersonalInformation from "../App-Components/PersonalInformation";
import ResumeDownload from "../App-Components/ResumeDownload";
import ProfilePicture from "./profilePicture";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    bio: "",
  });
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const userRef = doc(db, "User", userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserDetails({
            fullName: userData.fullName,
            email: userData.email,
            bio: userData.bio || "",
          });
          setImageUrl(userData.profilePicture || "");
        } else {
          console.log("No such document in 'User' collection!");
        }
      }
    };

    fetchUserData();
  }, [userId]);

  

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
    navigate(`/chats/${userId}`, {
      state: {
        receiverId: userId,
        fullName: userDetails.fullName,
        profilePicture: imageUrl, // Assuming imageUrl holds the profile picture URL
      },
    });
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
                className="settings-profile-picture"
                showDropdownMenu={false}
                imageUrl={imageUrl}
                fullName={userDetails.fullName}
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
              <p>{userDetails.bio || "Add your bio here..."}</p>
            </div>
          </div>
        </div>
        <PersonalInformation editable={false} userId={userId} />
        <ResumeDownload editable={false} userId={userId} />
      </div>
    </div>
  );
};

export default UserProfile;
