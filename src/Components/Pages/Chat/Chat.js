// Chat.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../Config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import "./Chat.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import ChatListItem from "../../App-Components/ChatListItem";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Chats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { receiverId } = location.state || {};

  console.log("Location:", location);

  const [receiverDetails, setReceiverDetails] = useState({
    fullName: "",
    profilePicture: "",
  });

  const sendMessage = async (db, messageDetails) => {
    try {
      // Add a new document with a generated ID in the "Message" collection
      await addDoc(collection(db, "Message"), {
        content: messageDetails.content,
        createdAt: serverTimestamp(), // Use serverTimestamp for consistency
        receiverId: messageDetails.receiverId,
        senderId: messageDetails.senderId,
        status: "sent", // Example status, adjust as needed
        // messageId is generated automatically by Firestore
      });
      console.log("Document successfully written!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Example function to handle message send
  const handleSendMessage = () => {
    // Example message details
    const messageDetails = {
      content: "Hello, World!", // This would come from your message input field
      receiverId: "receiverUserId", // The receiver's userId
      senderId: "senderUserId", // The sender's userId, likely from auth/current user
    };

    // Call sendMessage with db (Firestore instance) and the message details
    sendMessage(db, messageDetails);
  };

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
          {receiverDetails.fullName && ( // Check if fullName exists to render the ChatListItem
            <ChatListItem
              key={receiverId} // Use receiverId as key for uniqueness
              fullName={receiverDetails.fullName}
              profilePicture={receiverDetails.profilePicture}
              onClick={() => navigate(`/chat/${receiverId}`)} // Navigate using receiverId
            />
          )}
        </div>

        <div className="main-chat">
          <div className="chatHeader"></div>
          <div className="chat-container"></div>
          <div className="chatInput">
            <div className=""></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
