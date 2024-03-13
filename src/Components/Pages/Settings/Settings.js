// Settings.js


import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Config/firebase";
import { signOut } from "firebase/auth";
import "./Settings.css";
import Sidepane from '../../App-Components/Sidepane';
import Menubar from '../../App-Components/Menubar';



const Settings = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('User has been logged out');
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="settings">
      <Sidepane auth={auth} handleLogout={logout} /> 
      <Menubar />
    </div>
  );
};

export default Settings;
