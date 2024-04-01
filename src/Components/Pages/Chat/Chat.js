import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Config/firebase";
import { signOut } from "firebase/auth";
import "./Chat.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import ProfilePicture from "../../App-Components/profilePicture"; // Make sure this is a URL or adjust accordingly
import { useUser } from "../../App-Components/UserContext";
import {
  Chat,
  Channel,
  ChannelList,
  ChannelHeader,
  Window,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import "@stream-io/stream-chat-css/dist/css/index.css";

const Chats = () => {
  const navigate = useNavigate();
  const { profileData } = useUser();
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    const initializeChatClient = async () => {
      try {
        const { StreamChat } = await import("stream-chat");
        const client = StreamChat.getInstance("r9kzsb2wmexs");

        await client.connectUser(
          {
            id: profileData.id,
            name: profileData.fullName,
            image: ProfilePicture,
          },
          client.devToken(profileData.id)
        );

        setChatClient(client);

        const channel = client.channel("messaging", "channel-id", {
          members: [profileData.id], // Ensure the user is a member of the channel
        });
        await channel.watch();

        await channel.watch();
        // Previously there was an erroneous call to `setClient(chatClient)` here, which is not needed.

        // Assuming channel creation is not needed here since `channel.watch()` is already invoked
        // If channel creation is necessary (e.g., for first-time setup), it should be managed differently.
      } catch (error) {
        console.error("Error initializing chat client:", error);
      }
    };

    if (profileData.id) {
      initializeChatClient();
    }
  }, [profileData.id]); // Assuming profileData.id is stable and correctly triggers the effect when needed

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Example filters and sort options
  const filters = { type: "messaging", members: { $in: [profileData.id] } };
  const sort = { last_message_at: -1 };

  return (
    <div className="chatss">
      <Sidepane auth={auth} handleLogout={logout} />
      <Menubar />
      <div className="page-content">
        {chatClient && (
          <Chat client={chatClient} theme="messaging light">
            <ChannelList filters={filters} sort={sort} />
            <Channel>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        )}
      </div>
    </div>
  );
};

export default Chats;
