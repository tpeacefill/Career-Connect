import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../Config/firebase";
import "./PersonalInformationDialog.css";
import closeBrown from "../Images/closebrown.svg";
import BirthdateInput from "../App-Components/DatePicker";
import { useUser } from "./UserContext";

const PersonalInformationDialog = ({ onClose }) => {
  const { currentUser } = useUser();
  const [userInput, setUserInput] = useState("");
  const [salary, setSalary] = useState("GHS ");
  const [birthdate, setBirthdate] = useState(null);
  const [location, setLocation] = useState("");
  const [workTypeSelections, setWorkTypeSelections] = useState({
    Remote: false,
    Fulltime: false,
    "Part-Time": false,
    Internship: false,
    Freelance: false,
    Contracts: false,
  });

 // Define userDetails state and its setter
 const [userDetails, setUserDetails] = useState({ email: "" });

  useEffect(() => {
    if (currentUser?.uid) {
      const userRef = doc(db, "User", currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setUserDetails(docSnapshot.data());
        } else {
          console.log("No such document in 'User' collection!");
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handlePhoneInputChange = (e) => {
    const enteredValue = e.target.value;
    if (/^\+233\d{0,9}$/.test(enteredValue)) {
      setUserInput(enteredValue.substring(4));
    }
  };

  const handleSalaryBlur = (e) => {
    const value = e.target.value;
    if (!value.includes('.')) {
      setSalary(value + '.00');
    }
  };
  

  const handleSalaryChange = (e) => {
    setSalary(e.target.value);
  };

  const handleWorkTypeChange = (e) => {
    const { name, checked } = e.target;
    setWorkTypeSelections(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveClick = async () => {
    if (!currentUser?.uid) {
      console.error("No user logged in");
      return;
    }

    const selectedWorkTypes = Object.entries(workTypeSelections)
      .filter(([_, checked]) => checked)
      .map(([key]) => key)
      .join(", ");

    const userData = {
      phoneNumber: "+233" + userInput,
      dob: birthdate ? birthdate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) : "",
      salaryExpected: salary,
      address: location,
      workType: selectedWorkTypes,
    };

    try {
      await updateDoc(doc(db, "User", currentUser.uid), userData);
      console.log("Profile information saved successfully");
      onClose(); // Close the dialog
    } catch (error) {
      console.error("Error saving profile information:", error);
    }
  };

  return (
    <div className="overlay">
      <div className="dialog-box1">
        <div className="dialog-container1">
          <div className="dialog-headers1">
            <p>Edit Personal Information</p>
            <img src={closeBrown} alt="close" onClick={onClose} />
          </div>
          <div className="dialog-content1">
            <div className="email-phone1">
              <div className="email1">
                <p>Email</p>
                <input className="email01" value={userDetails.email} readOnly />
              </div>
              <div className="phone1">
                <p>Phone Number</p>
                <input
                  className="phone01"
                  value={"+233" + userInput}
                  onChange={handlePhoneInputChange}
                />
              </div>
            </div>
            <div className="birthdate-salary1">
              <div className="birthdate1">
                <p>Birth Date</p>
                <BirthdateInput
                  selectedDate={birthdate}
                  setSelectedDate={setBirthdate}
                />
              </div>
              <div className="salary1">
                <p>Salary Expectation</p>
                <input
                  className="salary01"
                  value={salary}
                  onChange={handleSalaryChange}
                  onBlur={handleSalaryBlur}
                />
              </div>
            </div>
            <div className="location1">
              <p>Location</p>
              <input
  className="location01"
  placeholder="Province/City, Country"
  value={location} // Control the input with the location state
  onChange={(e) => setLocation(e.target.value)} // Update the state on change
/>

            </div>
            <div className="worktype1">
              <p>Work Type</p>
              <div className="worktype-row">
                <div className="worktype01-types">
                  <input
                    type="checkbox"
                    id="Remote"
                    name="Remote"
                    checked={workTypeSelections["Remote"]}
                    onChange={handleWorkTypeChange}
                  />
                  <label htmlFor="Remote">Remote</label>
                </div>
                <div className="worktype01-types">
                  <input
                    type="checkbox"
                    id="Fulltime"
                    name="Fulltime"
                    checked={workTypeSelections["Fulltime"]}
                    onChange={handleWorkTypeChange}
                  />
                  <label htmlFor="Fulltime">Fulltime</label>
                </div>
                <div className="worktype01-types">
                  <input
                    type="checkbox"
                    id="Part-Time"
                    name="Part-Time"
                    checked={workTypeSelections["Part-Time"]}
                    onChange={handleWorkTypeChange}
                  />
                  <label htmlFor="Part-Time">Part-Time</label>
                </div>
              </div>
              <div className="worktype-row">
                <div className="worktype01-types">
                  <input
                    type="checkbox"
                    id="Internship"
                    name="Internship"
                    checked={workTypeSelections["Internship"]}
                    onChange={handleWorkTypeChange}
                  />
                  <label htmlFor="Internship">Internship</label>
                </div>
                <div className="worktype01-types">
                  <input
                    type="checkbox"
                    id="Freelance"
                    name="Freelance"
                    checked={workTypeSelections["Freelance"]}
                    onChange={handleWorkTypeChange}
                  />
                  <label htmlFor="Freelance">Freelance</label>
                </div>
                <div className="worktype01-types">
                  <input
                    type="checkbox"
                    id="Contracts"
                    name="Contracts"
                    checked={workTypeSelections["Contracts"]}
                    onChange={handleWorkTypeChange}
                  />
                  <label htmlFor="Contracts">Contracts</label>
                </div>
              </div>
            </div>
          </div>
          <button className="savebutton1" onClick={handleSaveClick}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationDialog;
