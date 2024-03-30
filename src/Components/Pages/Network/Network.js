import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Config/firebase";
import { signOut } from "firebase/auth";
import "./Network.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import ProfilePicture from "../../App-Components/profilePicture";
import { useUser } from "../../App-Components/UserContext";
import MakePostBox from "../../App-Components/MakePost"; // Import MakePostBox component
import SocialMediaPost from "../../App-Components/SocialMediaPost";

const Network = () => {
  const navigate = useNavigate();
  const { profileData } = useUser();
  const [showMakePostBox, setShowMakePostBox] = useState(false); // Step 1: State to manage modal visibility

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User has been logged out");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handlePostInitiatorClick = () => {
    // Step 2: Event handler to open the modal
    setShowMakePostBox(true);
  };

  const handleCloseMakePostBox = () => {
    // Function to close the modal
    setShowMakePostBox(false);
  };

  return (
    <div className="network">
      <Sidepane auth={auth} handleLogout={logout} />
      <Menubar />
      <div className="page-content">
        <div className="post-section">
          <div className="make-post">
            {/* Step 3: Conditional rendering */}
            <div className="make-post-element">
              <ProfilePicture
                imageUrl={profileData.profilePicture}
                className="profile-image"
              />
              <button
                className="post-initiator"
                onClick={handlePostInitiatorClick}
              >
                Start a post
              </button>
            </div>
          </div>
          {showMakePostBox && (
            <>
              <div
                className="dialog-overlay"
                onClick={handleCloseMakePostBox}
              ></div>
              <MakePostBox
                onClose={handleCloseMakePostBox}
                className="make-post-box"
              />
            </>
          )}
          <SocialMediaPost
            user={{
              name: "John Doe",
              profilePicture: "path/to/profile_picture.jpg",
            }}
            post={{
              time: "2 hours ago",
              message: "This is a sample post",
              media: "path/to/post_image.jpg",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Network;
