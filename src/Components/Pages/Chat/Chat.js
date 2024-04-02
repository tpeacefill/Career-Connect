// Chat.js
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../Config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import "./Chat.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import ChatListItem from "../../App-Components/ChatListItem";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { EmojiButton } from "@joeattardi/emoji-button";

const Chats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { receiverId } = location.state || {};
  const emojiPickerRef = useRef(null);
  const triggerRef = useRef(null);
  const [postText, setPostText] = useState("");

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

  useEffect(() => {
    const emojiPicker = new EmojiButton({ zIndex: 99999 });
    emojiPickerRef.current = emojiPicker;

    const triggerEl = triggerRef.current;
    if (triggerEl) {
      triggerEl.addEventListener("click", () =>
        emojiPicker.togglePicker(triggerEl)
      );
    }

    emojiPicker.on("emoji", (selection) => {
      setPostText((prev) => prev + selection.emoji);
    });

    return () => {
      if (triggerEl) {
        triggerEl.removeEventListener("click", () =>
          emojiPicker.togglePicker(triggerEl)
        );
      }
    };
  }, []);

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
            <div className="input-wrapper">
              <input
                className="chatInputcnt"
                placeholder="Type a message..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              />
              <div className="input-actions">
                {/* Emoji Icon SVG */}
                <svg
                  ref={triggerRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    emojiPickerRef.current.togglePicker(triggerRef.current);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  className="emoji-trigger"
                >
                  {/* SVG path for emoji icon */}
                  <path
                    fill="white"
                    opacity={0.5}
                    d="M12 1.998c5.524 0 10.002 4.478 10.002 10.002c0 5.523-4.478 10-10.002 10c-5.524.001-10.002-4.477-10.002-10C1.998 6.476 6.476 1.998 12 1.998m0 1.5a8.502 8.502 0 1 0 0 17.003a8.502 8.502 0 0 0 0-17.003M8.462 14.783A4.492 4.492 0 0 0 12 16.5a4.491 4.491 0 0 0 3.535-1.714a.75.75 0 1 1 1.177.93A5.99 5.99 0 0 1 12 18a5.991 5.991 0 0 1-4.717-2.29a.75.75 0 1 1 1.179-.928M9 8.75a1.25 1.25 0 1 1 0 2.499A1.25 1.25 0 0 1 9 8.75m6 0a1.25 1.25 0 1 1 0 2.499a1.25 1.25 0 0 1 0-2.499"
                  />
                </svg>
              </div>
              <svg
                className="send-button"
                onClick={handleSendMessage}
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#ad8547"
                  fill-rule="evenodd"
                  d="M2.345 2.245a1 1 0 0 1 1.102-.14l18 9a1 1 0 0 1 0 1.79l-18 9a1 1 0 0 1-1.396-1.211L4.613 13H10a1 1 0 1 0 0-2H4.613L2.05 3.316a1 1 0 0 1 .294-1.071z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
