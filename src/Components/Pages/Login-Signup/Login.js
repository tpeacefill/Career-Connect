import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import { doc, setDoc } from "firebase/firestore";
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
  const [user, setUser] = useState(null); // Add this line

  const closeErrorOverlay = () => {
    setError(null);
  };

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // Access the user's profile information
      const { displayName, email } = googleUser;

      // Save user's name and email to Firestore
      await setDoc(doc(db, "users", googleUser.uid), {
        fullName: displayName,
        email: email,
      });

      // Displaying user information in the console
      console.log("Google User:", googleUser);

      // Add further logic using 'googleUser' if needed

      // Inside handleLoginWithGoogle function, after setting the Firestore doc
      navigate("/dashboard", { state: { userName: displayName } });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = result.user;

      // If needed, use 'loggedInUser' here for any specific operations
      console.log("Logged in User:", loggedInUser);

      // If login is successful, navigate to the dashboard
      // Use loggedInUser.displayName to get the name
      navigate("/dashboard", { state: { userName: loggedInUser.displayName } });
    } catch (err) {
      let errorMessage = "An error occurred. Please try again.";

      // Check the error code for specific error types
      if (err.code === "auth/network-request-failed") {
        console.log("Network Error", "Please check your internet connection.");
      } else if (err.code === "auth/invalid-credential") {
        console.log("Wrong Email or Password");
        errorMessage = "Wrong Email or Password";
      } else if (email === "") {
        console.log("Wrong Email or Password");
        errorMessage = "fill in";
      } else {
        console.log("Error", err.message);
      }

      setError(errorMessage);
      setUser(null); // Reset user state when an error occurs
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

              <div className="OR">
                <div alt="line-division"></div>
                <h5>OR</h5>
                <div alt="line-division"></div>
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
                    className="input-styles"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="Password">
                <label htmlFor="Password" className="label-styles">
                  Password*
                </label>
                <div className="input-container">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    placeholder="Enter a password"
                    className="input-styles"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="login-details-section4">
              <p className="Forgot-Password">Forgot Password?</p>
              <button onClick={handleLogin}>Log In</button>
              {error && (
                <ErrorOverlay
                  message={error}
                  onClose={closeErrorOverlay}
                  userName={user.displayName} // Pass the userName to the ErrorOverlay
                />
              )}
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
