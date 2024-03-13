// Network.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Config/firebase";
import { signOut } from "firebase/auth";
import "./Network.css";
import Sidepane from '../../App-Components/Sidepane';
import Menubar from '../../App-Components/Menubar';



const Network = () => {
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
    <div className="network">
      <Sidepane auth={auth} handleLogout={logout} /> 
      <Menubar />
    </div>
  );
};

export default Network;
