// Chat.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../Config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import "./Chat.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import ProfilePicture from "../../App-Components/profilePicture";

const Chats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { receiverId, fullName, profilePicture } = location.state || {};

  console.log("Location:", location);

  const [receiverDetails, setReceiverDetails] = useState({
    fullName: "",
    profilePicture: "",
  });

  useEffect(() => {
    console.log("Receiver ID:", receiverId);
    const fetchReceiverDetails = async () => {
      try {
        if (receiverId) {
          const userRef = doc(db, "User", receiverId); // This line changes to use the doc function directly with db
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("User Data:", userData);
            setReceiverDetails({
              fullName: userData.fullName,
              profilePicture: userData.profilePicture,
            });
          } else {
            console.log("No such document in 'User' collection!");
          }
        }
      } catch (error) {
        console.error("Error fetching receiver details:", error);
      }
    };

    fetchReceiverDetails();
  }, [receiverId]);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User has been logged out");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="chatss">
      <Sidepane auth={auth} handleLogout={logout} />
      <Menubar />
      <div className="page-content">
        <div className="chatList">
          {/* Render receiver's profile picture and full name */}
          <div className="chatListitem">
            <ProfilePicture
              className="chat-profile"
              imageUrl={receiverDetails.profilePicture}
              fullName={receiverDetails.fullName}
            />
            <div className="name-lastmsg">
              <h3>{receiverDetails.fullName}</h3>
              <p>Last message item</p>
            </div>
          </div>
        </div>
        <div className="main-chat">No messages yet</div>
      </div>
    </div>
  );
};

export default Chats;
