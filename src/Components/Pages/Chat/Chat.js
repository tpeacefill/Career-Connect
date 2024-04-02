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
  const [selectedChat, setSelectedChat] = useState(null);

  const sendMessage = async (messageDetails) => {
    try {
      await addDoc(collection(db, "Message"), messageDetails);
      console.log("Message successfully sent!");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleChatSelect = (chat) => {
    console.log("Selected chat:", chat);
    setSelectedChat(chat);
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
      console.log("Fetching chats...");
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) return;

      const chatsRef = collection(db, "Message");
      const snapshot = await getDocs(chatsRef);
      const chatUserIds = new Set();

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.senderId === currentUserId ||
          data.receiverId === currentUserId
        ) {
          chatUserIds.add(data.senderId);
          chatUserIds.add(data.receiverId);
        }
      });

      chatUserIds.delete(currentUserId);

      const usersDetails = await Promise.all(
        Array.from(chatUserIds).map(async (userId) => {
          const userDoc = await getDoc(doc(db, "User", userId));
          return userDoc.exists() ? { userId, ...userDoc.data() } : null;
        })
      );

      const filteredUsersDetails = usersDetails.filter((user) => user !== null);

      setChats(filteredUsersDetails);
    };

    fetchChats();
  }, [auth.currentUser, location.state]);

  useEffect(() => {
    const emojiPicker = new EmojiButton();
    emojiPickerRef.current = emojiPicker;

    const triggerEl = triggerRef.current;
    if (triggerEl) {
      triggerEl.addEventListener("click", () =>
        emojiPicker.togglePicker(triggerEl)
      );

      emojiPicker.on("emoji", (emoji) => {
        setPostText((prev) => prev + emoji.emoji);
      });

      return () => {
        if (triggerEl) {
          triggerEl.removeEventListener("click", () =>
            emojiPicker.togglePicker(triggerEl)
          );
        }
      };
    }
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
              onClick={() => handleChatSelect(chat)} // This is where you pass the function
            />
          ))}
        </div>
        <div className="main-chat">
          {selectedChat ? (
            <>
              <div className="chatHeader">
                <div className="chatHeaderText">
                  <h3>{selectedChat.fullName}</h3>
                  <p>Last seen, 5 mins ago</p>
                </div>
              </div>
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
                      <g fill="none">
                        <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                        <path
                          fill="currentColor"
                          d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m2.8 9.857a1 1 0 1 1 1.4 1.428A5.984 5.984 0 0 1 12 17a5.984 5.984 0 0 1-4.2-1.715a1 1 0 0 1 1.4-1.428A3.984 3.984 0 0 0 12 15c1.09 0 2.077-.435 2.8-1.143M8.5 8a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m7 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"
                        />
                      </g>
                    </svg>
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
                        d="M2.01 21L23 12 2.01 3 2 10l15 2l-15 2l.01 7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="null-prompt">No conversations started yet...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
