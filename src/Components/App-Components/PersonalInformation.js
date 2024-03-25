import React, { useEffect, useState } from "react";
import "./PersonalInformation.css";
import PersonalInformationDialog from "./PersonalInformationDialog"; // Assuming the correct file name is 'PersonalInformationDialog'
import { db } from "../Config/firebase"; // Import auth from Firebase
import { useUser } from "../App-Components/UserContext";
import { doc, onSnapshot } from "firebase/firestore";

const PersonalInformation = ({ editable = true, userId }) => {
  const { currentUser } = useUser();
  const effectiveUserId = userId || currentUser?.uid;
  const [userDetails, setUserDetails] = useState({
    email: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  useEffect(() => {
    if (effectiveUserId) {
      const userRef = doc(db, "User", effectiveUserId);
      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUserDetails({
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            dob: userData.dob,
            address: userData.address,
            salaryExpected: userData.salaryExpected,
            workType: userData.workType,
          });
        } else {
          console.log("No such document in 'User' collection!");
        }
      });

      return unsubscribe; // Cleanup subscription on unmount
    }
  }, [effectiveUserId]);
  return (
    <div className="personal-information">
      {isEditDialogOpen && (
        <PersonalInformationDialog onClose={() => setIsEditDialogOpen(false)} />
      )}
      <div className="personal-container">
        <div className="personal-infoHeading">
          <h3>All Personal Information</h3>
          {/* Conditionally render the Edit label based on `editable` */}
          {editable && <label onClick={handleEditClick}>Edit</label>}
        </div>
        <div className="personal-contacts">
          <div className="personal1">
            <div className="personal-cnt1">
              <div className="email">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="white"
                    opacity={0.5}
                    d="M12 21q-1.863 0-3.507-.708q-1.643-.709-2.859-1.924q-1.216-1.214-1.925-2.856Q3 13.87 3 12.003q0-1.866.708-3.51q.709-1.643 1.924-2.859q1.214-1.216 2.856-1.925Q10.13 3 11.997 3q1.866 0 3.51.709t2.859 1.924q1.216 1.215 1.925 2.857Q21 10.133 21 12v.988q0 1.264-.868 2.138Q19.264 16 18 16q-.894 0-1.63-.49q-.737-.49-1.09-1.306q-.57.821-1.425 1.309Q13 16 12 16q-1.671 0-2.836-1.164T8 12q0-1.671 1.164-2.836T12 8q1.671 0 2.836 1.164T16 12v.988q0 .824.588 1.418Q17.177 15 18 15t1.412-.594q.588-.594.588-1.418V12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20h5v1zm0-6q1.25 0 2.125-.875T15 12q0-1.25-.875-2.125T12 9q-1.25 0-2.125.875T9 12q0 1.25.875 2.125T12 15"
                  />
                </svg>
              </div>
              <div className="email-details">
                <h3>{userDetails.email}</h3>
                <p>Email Address</p>
              </div>
            </div>
            <div className="personal-cnt2">
              <div className="phone">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="white"
                    opacity={0.5}
                    d="M220.78 162.13L173.56 141a12 12 0 0 0-11.38 1a3.37 3.37 0 0 0-.38.28L137 163.42a3.9 3.9 0 0 1-3.7.21c-16.24-7.84-33.05-24.52-40.89-40.57a3.9 3.9 0 0 1 .18-3.69l21.2-25.21c.1-.12.19-.25.28-.38a12 12 0 0 0 1-11.36L93.9 35.28a12 12 0 0 0-12.48-7.19A52.25 52.25 0 0 0 36 80c0 77.2 62.8 140 140 140a52.25 52.25 0 0 0 51.91-45.42a12 12 0 0 0-7.13-12.45m-.78 11.44A44.23 44.23 0 0 1 176 212c-72.78 0-132-59.22-132-132a44.23 44.23 0 0 1 38.42-44a3.87 3.87 0 0 1 .48 0a4 4 0 0 1 3.67 2.49l21.11 47.14a4 4 0 0 1-.23 3.6l-21.19 25.2c-.1.13-.2.25-.29.39a12 12 0 0 0-.78 11.75c8.69 17.79 26.61 35.58 44.6 44.27a12 12 0 0 0 11.79-.87l.37-.28l24.83-21.12a3.93 3.93 0 0 1 3.57-.27l47.21 21.16a4 4 0 0 1 2.44 4.11M148 72a4 4 0 0 1 4-4h28V40a4 4 0 0 1 8 0v28h28a4 4 0 0 1 0 8h-28v28a4 4 0 0 1-8 0V76h-28a4 4 0 0 1-4-4"
                  />
                </svg>
              </div>
              <div className="phone-details">
                <h3>
                  {userDetails.phoneNumber
                    ? userDetails.phoneNumber
                    : "+233 -- --- ----"}
                </h3>
                <p>Phone Number</p>
              </div>
            </div>
          </div>
          <div className="personal2">
            <div className="personal-cnt01">
              <div className="birthday">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="none"
                    stroke="white"
                    opacity={0.5}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20.33 15.16c-7.33.75-12.78 3.67-12.78 7.17c0 4.06 7.37 7.35 16.45 7.35s16.45-3.29 16.45-7.35c0-3.5-5.46-6.42-12.78-7.17"
                  />
                  <path
                    fill="none"
                    stroke="white"
                    opacity={0.5}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7.55 26.41c0 1.44.38 3.55 2 4.69c1.14.81 3.46-.17 5.2.38c1.42.46 2.59 2.66 4.3 2.9c1.53.21 3.29-1.57 5-1.57s3.43 1.78 5 1.57c1.71-.24 2.89-2.44 4.31-2.89c1.74-.56 4.06.42 5.2-.39c1.6-1.14 2-3.25 2-4.69"
                  />
                  <path
                    fill="none"
                    stroke="white"
                    opacity={0.5}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7.55 22.33v13.44c0 4.06 7.37 7.35 16.45 7.35s16.45-3.29 16.45-7.35V22.33"
                  />
                  <path
                    fill="none"
                    stroke="white"
                    opacity={0.5}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20.33 14.15v8.18C20.33 23.23 22 24 24 24s3.67-.74 3.67-1.64v-8.21"
                  />
                  <ellipse
                    cx="24"
                    cy="14.15"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    rx="3.67"
                    ry="1.64"
                  />
                  <path
                    fill="none"
                    stroke="white"
                    opacity={0.5}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M24 14.15c0-.9-1.05-2.1-1.05-2.86m.05 0c-.26-.77-1.75-.7-1.75-2.77s1.41-2.7 1.41-4.4a4 4 0 0 1 2.18 3.7A3.9 3.9 0 0 1 23 11.29"
                  />
                </svg>
              </div>
              <div className="birthday-details">
                <h3>{userDetails.dob ? userDetails.dob : "Day Month Year"}</h3>
                <p>Birth Date</p>
              </div>
            </div>
            <div className="personal-cnt02">
              <div className="salary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="white"
                    opacity={0.5}
                    d="M128 164a36 36 0 1 0-36-36a36 36 0 0 0 36 36m0-64a28 28 0 1 1-28 28a28 28 0 0 1 28-28m112-40H16a4 4 0 0 0-4 4v128a4 4 0 0 0 4 4h224a4 4 0 0 0 4-4V64a4 4 0 0 0-4-4M20 107.26A52.75 52.75 0 0 0 59.26 68h137.48A52.75 52.75 0 0 0 236 107.26v41.48A52.75 52.75 0 0 0 196.74 188H59.26A52.75 52.75 0 0 0 20 148.74ZM236 99a44.8 44.8 0 0 1-31-31h31ZM51 68a44.8 44.8 0 0 1-31 31V68Zm-31 89a44.8 44.8 0 0 1 31 31H20Zm185 31a44.8 44.8 0 0 1 31-31v31Z"
                  />
                </svg>
              </div>
              <div className="salary-details">
                <h3>
                  {userDetails.salaryExpected
                    ? userDetails.salaryExpected
                    : "GHS --- ---"}
                </h3>
                <p>Salary Expectation</p>
              </div>
            </div>
          </div>
        </div>
        <div className="location-worktype">
          <div className="location">
            <div className="location-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 21 21"
              >
                <g
                  fill="none"
                  fill-rule="evenodd"
                  stroke="white"
                  opacity={0.5}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  transform="translate(4 2)"
                >
                  <path d="m6.5 16.54l.631-.711c.716-.82 1.36-1.598 1.933-2.338l.473-.624c1.975-2.661 2.963-4.773 2.963-6.334C12.5 3.201 9.814.5 6.5.5s-6 2.701-6 6.033c0 1.561.988 3.673 2.963 6.334l.473.624a54.84 54.84 0 0 0 2.564 3.05" />
                  <circle cx="6.5" cy="6.5" r="2.5" />
                </g>
              </svg>
            </div>
            <div className="location-details">
              <h3>
                {userDetails.address
                  ? userDetails.address
                  : "City/Province, Country"}
              </h3>
              <p>Location</p>
            </div>
          </div>
          <div className="worktype">
            <div className="worktype-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  opacity={0.5}
                  d="M4.615 20q-.69 0-1.152-.462Q3 19.075 3 18.385v-9.77q0-.69.463-1.152Q3.925 7 4.615 7H9V5.615q0-.69.463-1.152Q9.925 4 10.615 4h2.77q.69 0 1.153.463q.462.462.462 1.152V7h4.385q.69 0 1.152.463q.463.462.463 1.152v9.77q0 .69-.462 1.152q-.463.463-1.153.463zm0-1h14.77q.23 0 .423-.192q.192-.193.192-.423v-9.77q0-.23-.192-.423Q19.615 8 19.385 8H4.615q-.23 0-.423.192Q4 8.385 4 8.615v9.77q0 .23.192.423q.193.192.423.192M10 7h4V5.615q0-.23-.192-.423Q13.615 5 13.385 5h-2.77q-.23 0-.423.192q-.192.193-.192.423zM4 19V8z"
                />
              </svg>
            </div>
            <div className="worktype-details">
              <h3>
                {userDetails.workType
                  ? userDetails.workType
                  : "Remote, Fulltime, Part-Time, Internship etc."}
              </h3>
              <p>Work Type</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
