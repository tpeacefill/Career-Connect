import React, { useState } from "react";
import "./ExtraSkillsBox.css";
import closeBrown from "../Images/closebrown.svg";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useUser } from "./UserContext";

const ExtraSkillsBox = ({ onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { profileData } = useUser();
  const userId = profileData.id;

  const handleOptionSelect = (event) => {
    const selectedOption = event.target.value;
    if (!selectedOptions.includes(selectedOption)) {
      setSelectedOptions([...selectedOptions, selectedOption]);
    }
  };

  const handleRemoveOption = (optionToRemove) => {
    const updatedOptions = selectedOptions.filter(
      (option) => option !== optionToRemove
    );
    setSelectedOptions(updatedOptions);
  };

  const saveToFirestore = async () => {
    try {
      const db = getFirestore();
      await setDoc(doc(db, "JobSkills", userId), {
        userId: userId,
        skills: selectedOptions,
      });
      console.log("Skills saved successfully!");
      onClose(); // Close the dialog
    } catch (error) {
      console.error("Error saving skills: ", error);
    }
  };

  console.log("Selected skills:", selectedOptions);

  return (
    <div className="dialog-box">
      <div className="dialog-container">
        <div className="dialog-header">
          <p>Add Extra Skills to your Portfolio</p>
          <img src={closeBrown} alt="close" onClick={onClose} />
        </div>
        <div className="dialog-content">
          <div className="activity-title">
            <p>Skills are essential for job matching</p>
            <select onChange={handleOptionSelect}>
              <option value="" disabled selected>
                Select a skillset you are proficient in
              </option>
              <option value="Adobe XD">Adobe XD</option>
              <option value="Figma">Figma</option>
              <option value="User-centered design ">
                User-centered design
              </option>
              <option value="Wireframing, mockups, and prototyping">
                Wireframing, mockups, and prototyping.
              </option>
              <option value="Collaboration and communication">
                Collaboration and communication
              </option>
              <option value="User research and feedback gathering">
                User research and feedback gathering
              </option>
              <option value="HTML, CSS, JavaScript">
                HTML, CSS, JavaScript
              </option>
              <option value="Threat intelligence gathering">
                Threat intelligence gathering.
              </option>
              <option value="GDPR, HIPAA, NIST">GDPR, HIPAA, NIST</option>
              <option value="Incident response and management">
                Incident response and management
              </option>
              <option value="Vulnerability assessment and penetration testing">
                Vulnerability assessment and penetration testing
              </option>
              <option value="IDS, firewalls, antivirus">
                IDS, firewalls, antivirus
              </option>
              <option value="Network and system security technologies">
                Network and system security technologies
              </option>
              <option value="Python, R">Python, R</option>
              <option value="Statistics and probability">
                Statistics and probability
              </option>
              <option value="Data manipulation and analysis">
                Data manipulation and analysis
              </option>
              <option value="Machine learning techniques and algorithms">
                Machine learning techniques and algorithms
              </option>
              <option value="Data visualization (e.g., Matplotlib, Tableau)">
                Data visualization (e.g., Matplotlib, Tableau)
              </option>
              <option value="Databases and querying languages (e.g., SQL)">
                Databases and querying languages (e.g., SQL)
              </option>
              <option value="Critical thinking and problem-solving">
                Critical thinking and problem-solving
              </option>
              <option value="Effective communication and storytelling">
                Effective communication and storytelling
              </option>
              <option value="Linux, Windows, Unix">Linux, Windows, Unix</option>
              <option value="Networking knowledge (e.g., TCP/IP, DNS, DHCP)">
                Networking knowledge (e.g., TCP/IP, DNS, DHCP)
              </option>
              <option value="VMware, Hyper-V">VMware, Hyper-V</option>
              <option value="Python, Java, C++, JavaScript">
                Python, Java, C++, JavaScript
              </option>
              <option value="Agile, Scrum">Agile, Scrum</option>
              <option value="Version control systems (e.g., Git)">
                Version control systems (e.g., Git)
              </option>
              <option value="Algorithms and data structures">
                Algorithms and data structures
              </option>
              <option value="Database management (e.g., SQL)">
                Database management (e.g., SQL)
              </option>
              <option value="Software testing and debugging techniques">
                Software testing and debugging techniques
              </option>
            </select>
            <p>Select multiple preferences of your choice</p>
          </div>
          <div className="activity-description">
            <p>Selected Jobs</p>
            <div className="selected-jobs">
              {selectedOptions.map((option, index) => (
                <div key={index} className="selected-job">
                  <span>{option}</span>
                  <img
                    src={closeBrown}
                    alt="remove"
                    className="remove-icon"
                    onClick={() => handleRemoveOption(option)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="savebutton" onClick={saveToFirestore}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ExtraSkillsBox;
