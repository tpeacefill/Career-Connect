import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../Config/firebase";
import { useNavigate } from "react-router-dom";
import "./Help.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";

const Help = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    // Logic to search for the question and display the response
    const question = searchInput.toLowerCase().trim();
    const faqs = [
      {
        question: "What is Career Connect?",
        answer:
          "Career Connect is a comprehensive career service platform designed to assist users in various aspects of their career development journey.",
      },
      {
        question: "How can I access Career Connect?",
        answer:
          "You can access Career Connect by visiting our website and signing up for an account.",
      },
      {
        question: "What features does Career Connect offer?",
        answer:
          "Career Connect offers a range of features including job alerts, skill management, course registration, personalized calendar, job postings, resume uploading and optimization, interview practice, networking capabilities, and more.",
      },
      {
        question: "How do I create a job alert on Career Connect?",
        answer:
          "To create a job alert, simply navigate to the dashboard and select the option to create a job alert. You can then specify your preferences such as job title, location, and industry, and Career Connect will notify you when relevant jobs are posted.",
      },
      {
        question: "Can I add skills to my profile on Career Connect?",
        answer:
          "Yes, you can add skills to your profile on Career Connect to showcase your expertise to potential employers.",
      },
      {
        question: "How do I access my registered courses on Career Connect?",
        answer:
          "You can access your registered courses by navigating to the courses section on the dashboard.",
      },
      {
        question:
          "What is the personalized calendar feature in Career Connect?",
        answer:
          "The personalized calendar feature allows users to keep track of important dates such as interviews, networking events, and deadlines.",
      },
      {
        question: "How do I add jobs on Career Connect?",
        answer:
          "You can add jobs on Career Connect by navigating to the jobs page and selecting the option to add a new job.",
      },
      {
        question: "Can I view job details on Career Connect?",
        answer:
          "Yes, you can view detailed information about job postings on Career Connect including job descriptions, requirements, and application instructions.",
      },
      {
        question: "Does Career Connect offer internship opportunities?",
        answer:
          "Yes, Career Connect provides access to internship opportunities in addition to full-time job postings.",
      },
    ];

    for (let i = 0; i < faqs.length; i++) {
      if (faqs[i].question.toLowerCase() === question) {
        setResponse(faqs[i].answer);
        return;
      }
    }
    setResponse(
      "Results not found, reach out to support at peacefilltawiah123@gmail.com"
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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

  return (
    <div className="coursess">
      <Sidepane auth={auth} handleLogout={logout} />
      <Menubar />
      <div className="page-content">
        <div className="FAQS">
          <h3 className="FAQS-Heading">Do you have any concerns?</h3>
          <p className="FAQS-text">
            Ask any questions and our FAQS bot will answer you
          </p>
          <div className="FAQS-search">
            <input
              className="FAQSsearchInput"
              placeholder="Enter your question here......"
              value={searchInput}
              onChange={handleSearchInput}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="response-box">
            <h3 className="FAQS-Heading">Response:</h3>
            <div className="actual-response">{response}</div>
          </div>
        </div>
        <div className=""></div>
      </div>
    </div>
  );
};

export default Help;
