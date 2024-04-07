import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Config/firebase";
import { signOut } from "firebase/auth";
import "./Resumes.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import DownloadResume from "../../Images/DownloadResume.svg";
import UploadResume from "../../Images/ResumeLoad.svg";
import ResumeTemplate1 from "../Resumes/ResumeTemplate1.pdf";
import ResumeTemplate2 from "../Resumes/ResumeTemplate2.pdf";
import ResumeTemplate3 from "../Resumes/ResumeTemplate3.pdf";

const Resumes = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User has been logged out");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch(
        "https://api.mindee.net/v1/products/mindee/resume/v1/predict_async",
        {
          method: "POST",
          headers: {
            Authorization: "aa0aac51a7ff5c776093c4037b118900",
          },
          body: formData,
        }
      );

      if (response.ok) {
        // Handle successful response
        console.log("Document uploaded successfully!");
      } else {
        // Handle error response
        console.error("Failed to upload document:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFileUpload({ target: { files: [file] } });
  };

  const openFileExplorer = () => {
    fileInputRef.current.click();
  };

  const openPreview = (documentUrl) => {
    try {
      // Open the document URL directly in a new tab
      window.open(documentUrl, "_blank");
    } catch (error) {
      console.error("Error opening preview:", error);
    }
  };

  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value);
  };

  return (
    <div className="resumes">
      <Sidepane auth={auth} handleLogout={logout} />
      <Menubar />
      <div className="page-content">
        <div className="Jobss-heading">
          <div className="Jobss-txt1">
            <h5>Let’s help tailor your resume</h5>
            <p>Your resume should be stunning </p>
          </div>
          <div className="Jobss-txt2">
            <h5>Choose a Resume template</h5>
            <p>Select from the templates below</p>
          </div>
        </div>

        <div className="Jobss-content">
          <div className="jobs-container">
            <div className="upload-resume">
              <div
                className="upload-container"
                onClick={openFileExplorer}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="upload-item">
                  <img src={UploadResume} alt="upload-resume" />
                  <h5>Upload your resume here</h5>
                  <p>Our AI tool would do justice to its layout and content</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </div>
              <button>Submit</button>
            </div>
            <div className="download-resume">
              <div className="dowload-resume-text">
                <h5>Your Document is ready</h5>
                <p>Download to view your updated resume</p>
              </div>
              <div className="download-container">
                <div className="download-item">
                  <img src={DownloadResume} alt="download-resume" />
                  <p>Resume is ready for download</p>
                </div>
              </div>
              <button>Download</button>
            </div>
          </div>
          <div className="savedjobs-container">
            {/* Display buttons to preview documents */}
            <select
              onChange={handleTemplateChange}
              className="Preview-templates"
            >
              <option value="">Select a template</option>
              <option value={ResumeTemplate1}>Template 1</option>
              <option value={ResumeTemplate2}>Template 2</option>
              <option value={ResumeTemplate3}>Template 3</option>
            </select>
            {selectedTemplate && (
              <div>
                <button
                  onClick={() => openPreview(selectedTemplate)}
                  className="preview-button"
                >
                  Preview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resumes;
