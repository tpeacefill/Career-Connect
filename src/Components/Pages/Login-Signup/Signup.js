import React, { useState, useEffect } from "react";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../../Config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import "./Signup.css";
import SignupImage from "../../Images/SignupImage.png"; // Update this path
import AppLogo from "../../Images/App_logo.png"; // Update this path
import GoogleLogo from "../../Images/GoogleLogo.png"; // Update this path
import ErrorOverlay from "../Error-Success/ErrorOverlay";
import SuccessOverlay from "../Error-Success/SuccessOverlay";


const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null);
  const [success, setShowSuccess] = useState(false); // State to manage success message

  // Function to update lastActive when the user is active
  const updateLastActive = async (userId) => {
    const userRef = doc(db, "User", userId);
    const timestamp = Timestamp.now(); // Get the current timestamp
    await setDoc(userRef, { lastActive: timestamp }, { merge: true });
  };

  // Helper function to get initials
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const signup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const initials = getInitials(fullName);
      const timestamp = Timestamp.now(); // Get the current timestamp
      const fullNameLowerCase = fullName.toLowerCase(); // Convert full name to lowercase

      await setDoc(doc(db, "User", user.uid), {
        fullName,
        fullNameLowerCase, // Store the lowercase full name
        email,
        dateJoined: timestamp,
        lastActive: timestamp,
        profilePicture: initials,
      });

      setShowSuccess(true);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await updateLastActive(user.uid);
        navigate("/dashboard", {
          state: { userName: user.displayName || fullName },
        });
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [navigate, fullName]);

  const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const timestamp = Timestamp.now(); // Get the current timestamp
      const initials = getInitials(user.displayName || "");
      const fullNameLowerCase = (user.displayName || "").toLowerCase(); // Convert full name to lowercase

      await setDoc(doc(db, "User", user.uid), {
        fullName: user.displayName,
        fullNameLowerCase, // Store the lowercase full name
        email: user.email,
        dateJoined: timestamp,
        lastActive: timestamp,
        profilePicture: initials,
      });

      setShowSuccess(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const closeErrorOverlay = () => {
    setError(null);
  };

  const closeSuccessOverlay = () => {
    setShowSuccess(false);
    navigate("/dashboard", { state: { userName: fullName } });
  };

  return (
    <div className="signup-page">
      <div className="signup-section">
        <div className="signup-content">
          <div className="signup-details">
            <div className="signup-details-intro">
              <img src={AppLogo} alt="AppLogo" />
              <h3>Welcome to Career Connect!</h3>
              <h5>Your Career, Streamlined</h5>
              <h6>
                Let’s help you get started on your journey to <br />
                achieving greatness efficiently
              </h6>
            </div>

            <div className="signup-details-section2">
              <button className="signup-options" onClick={signUpWithGoogle}>
                <img src={GoogleLogo} alt="GoogleLogo" />
                <h5>Sign Up with Google</h5>
              </button>
              {error && (
                <ErrorOverlay message={error} onClose={closeErrorOverlay} />
              )}
              <div className="OR">
                <div alt="line-division"></div>
                <h5>OR</h5>
                <div alt="line-division"></div>
              </div>
            </div>

            <div className="signup-details-section3">
              <div className="Fullname">
                <label htmlFor="fullname" className="label-styles">
                  Full Name*
                </label>
                <div className="input-container">
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    placeholder="First and Last names"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-styles"
                  />
                </div>
              </div>

              <div className="Email">
                <label htmlFor="email" className="label-styles">
                  Email*
                </label>
                <div className="input-container">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-styles"
                  />
                </div>
              </div>

              <div className="Password">
                <label htmlFor="password" className="label-styles">
                  Password*
                </label>
                <div className="input-container">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter a password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-styles"
                  />
                </div>
              </div>
            </div>

            <div className="signup-details-section4">
              <button onClick={signup}>Sign Up</button>
              {error && (
                <ErrorOverlay message={error} onClose={closeErrorOverlay} />
              )}
              {success && (
                <SuccessOverlay
                  message="Account created successfully."
                  onClose={closeSuccessOverlay}
                  userName={fullName} // Pass the userName to the SuccessOverlay
                />
              )}
              <div className="section4-paragraphs">
                <p className="section4-p1">Already have an account?</p>
                <Link to="/login" className="section4-p2">
                  Log in
                </Link>
              </div>
            </div>
          </div>

          <div className="signup-image">
            <img src={SignupImage} alt="SignupImage" className="SignupImage" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
