import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  auth,
  googleProvider,
  db,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "../../Config/firebase";
import "./Login.css"; // Assuming this file contains your styling
import LoginImage from "../../Images/LoginImage.jpg"; // Update this path
import AppLogo from "../../Images/App_logo.png"; // Update this path
import GoogleLogo from "../../Images/GoogleLogo.png"; // Update this path
import ErrorOverlay from "../Error-Success/ErrorOverlay";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const closeErrorOverlay = () => {
    setError(null);
  };

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      const { displayName, email } = googleUser;

      await setDoc(doc(db, "User", googleUser.uid), {
        fullName: displayName,
        email: email,
      });

      console.log("Google User:", googleUser);
      navigate("/dashboard", { state: { userName: displayName.split(' ')[0] } });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = result.user;

      const userRef = doc(db, "User", loggedInUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const fullName = userSnap.data().fullName;
        navigate("/dashboard", { state: { userName: fullName.split(' ')[0] } });
      } else {
        console.log("User document does not exist.");
        setError("An error occurred. Please try again.");
      }
    } catch (err) {
      console.log("Error during login:", err);
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-section">
        <div className="login-content">
          <div className="login-details">
            <div className="login-details-intro">
              <img src={AppLogo} alt="AppLogo" />
              <h3>Welcome to Career Connect!</h3>
              <h5>Your Career, Streamlined</h5>
              <h6>
                Let’s help you get started on your journey to <br />
                achieving greatness efficiently
              </h6>
            </div>

            <div className="login-details-section2">
              <button className="login-options" onClick={handleLoginWithGoogle}>
                <img src={GoogleLogo} alt="GoogleLogo" />
                <h5>Log In with Google</h5>
              </button>
              {error && <ErrorOverlay message={error} onClose={closeErrorOverlay} />}
              <div className="OR">
                <div></div> {/* removed alt attribute as it is not valid for div elements */}
                <h5>OR</h5>
                <div></div> {/* removed alt attribute as it is not valid for div elements */}
              </div>
            </div>

            <div className="login-details-section3">
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

            <div className="login-details-section4">
              <p className="Forgot-Password">Forgot Password?</p>
              <button onClick={handleLogin}>Log In</button>
              <div className="section4-paragraphs">
                <p className="section4-p1">Don't have an account?</p>
                <Link to="/signup" className="section4-p2">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          <div className="login-image">
            <img src={LoginImage} alt="LoginImage" className="LoginImage" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;