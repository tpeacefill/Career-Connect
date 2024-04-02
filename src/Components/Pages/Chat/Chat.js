import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../Config/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import "./Chat.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import ChatListItem from "../../App-Components/ChatListItem";
import { EmojiButton } from "@joeattardi/emoji-button";

const Chats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { receiverId } = location.state || {};
  const emojiPickerRef = useRef(null);
  const triggerRef = useRef(null);
  const [postText, setPostText] = useState("");
  const [chats, setChats] = useState([]);

  const sendMessage = async (messageDetails) => {
    try {
      await addDoc(collection(db, "Message"), messageDetails);
      console.log("Message successfully sent!");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleSendMessage = async () => {
    if (!auth.currentUser) {
      console.error("No user is signed in.");
      return;
    }
    if (postText.trim() === "") {
      console.log("No message to send.");
      return;
    }
    const messageDetails = {
      content: postText.trim(),
      receiverId: receiverId,
      senderId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      status: "sent",
    };
    await sendMessage(messageDetails);
    setPostText("");
  };

  useEffect(() => {
    const fetchChats = async () => {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) return;

      const chatsRef = collection(db, "Message");
      const snapshot = await getDocs(chatsRef);
      const chatUserIds = new Set();

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.senderId === currentUserId) chatUserIds.add(data.receiverId);
        else if (data.receiverId === currentUserId)
          chatUserIds.add(data.senderId);
      });

      const userPromises = Array.from(chatUserIds).map(async (userId) => {
        const userSnap = await getDoc(doc(db, "User", userId));
        return { userId, ...userSnap.data() };
      });

      const users = await Promise.all(userPromises);
      setChats(users);
    };

    fetchChats();
  }, [auth.currentUser]);

  useEffect(() => {
    const emojiPicker = new EmojiButton();
    emojiPickerRef.current = emojiPicker;

    const triggerEl = triggerRef.current;
    triggerEl.addEventListener("click", () =>
      emojiPicker.togglePicker(triggerEl)
    );

    emojiPicker.on("emoji", (emoji) => {
      setPostText((prev) => prev + emoji);
    });

    return () => {
      triggerEl.removeEventListener("click", () =>
        emojiPicker.togglePicker(triggerEl)
      );
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="chatss">
      <Sidepane auth={auth} handleLogout={logout} />
      <Menubar />
      <div className="page-content1">
        <div className="chatList">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.userId}
              fullName={chat.fullName || "Unnamed User"}
              profilePicture={chat.profilePicture || "/defaultProfilePic.jpg"}
              onClick={() =>
                navigate(`/chat/${chat.userId}`, {
                  state: { receiverId: chat.userId },
                })
              }
            />
          ))}
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
              {/* Send Icon SVG */}
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
                  d="M2.345 2.245a1 1 0 0 1 1.102-.14l18 9a1 1 0 0 1 0 1.79l-18 9a1 1 0 0 1-1.396-1.211L4.613 13H10a1 1 0 1 0 0-2H4.613L2.05 3.316a1 1 0 0 1 .294-1.071z"
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
