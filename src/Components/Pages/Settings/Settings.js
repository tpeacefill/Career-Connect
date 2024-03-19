import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Config/firebase";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import "./Settings.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
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

  // This function will be called to update the bio in the state
  const updateBio = (newBio) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      bio: newBio,
    }));
  };

  useEffect(() => {
    if (currentUser?.uid) {
      const userRef = doc(db, "User", currentUser.uid);

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUserDetails({
            fullName: userData.fullName,
            email: userData.email,
            bio: userData.bio || "",
          });
        } else {
          console.log("No such document in 'User' collection!");
        }
      });

      // Cleanup subscription on unmount
      return unsubscribe;
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
                <h3 className="name-password-name">{userDetails.fullName}</h3>
                <p className="name-password-email">{userDetails.email}</p>
              </div>
              <button className="edit-profile" onClick={handleEditClick}>
                Edit
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
                updateBio={updateBio} // Pass this function as a prop to the dialog
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
