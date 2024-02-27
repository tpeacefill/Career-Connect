{/*import { signOut } from "firebase/auth";
import React, { useState } from 'react';
import { auth } from "../../Config/firebase";
import { useNavigate } from "react-router-dom";
import "./Help.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import { ChatGPTAPI } from 'chatgpt-api';

const Help = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  {const chatGPT = new ChatGPTAPI({
    apiKey: 'YOUR_API_KEY_HERE', // Replace with your actual API key
  });

  const handleMessageSend = async () => {
    if (!inputText.trim()) return;

    const newMessages = [...messages, { text: inputText, sender: 'user' }];
    setMessages(newMessages);
    setInputText('');

    try {
      const response = await chatGPT.sendMessage(inputText);
      const botMessage = { text: response, sender: 'bot' };
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message to ChatGPT API:', error);
    }
  };

  // Define FAQs and responses
  const faqs = [
    { question: "What is Career Connect?", answer: "Career Connect is a comprehensive career service platform designed to assist users in various aspects of their career development journey." },
    { question: "How can I access Career Connect?", answer: "You can access Career Connect by visiting our website and signing up for an account." },
    // Add other FAQs and responses here
  ];

  const handleFAQ = async (question) => {
    const faq = faqs.find(faq => faq.question.toLowerCase() === question.toLowerCase());
    if (faq) {
      const newMessages = [...messages, { text: faq.question, sender: 'user' }, { text: faq.answer, sender: 'bot' }];
      setMessages(newMessages);
    } else {
      // If the question is not found in FAQs, send it to ChatGPT for a response
      handleMessageSend();
    }
  };

  return (
    <div className="help">
      <Sidepane handleLogout={logout} />
      <Menubar />
      <div className="page-content">
        <div
          style={{
            height: "300px",
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          {messages.map((message, index) => (
            <div key={index} style={{ marginBottom: "5px" }}>
              <span
                style={{
                  fontWeight: "bold",
                  color: message.sender === "user" ? "blue" : "green",
                }}
              >
                {message.sender === "user" ? "You: " : "ChatGPT: "}
              </span>
              {message.text}
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFAQ(inputText);
              }
            }}
            placeholder="Type your message..."
            style={{ width: "80%", marginTop: "10px" }}
          />
          <button onClick={handleMessageSend} style={{ marginLeft: "10px" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Help;
*/}