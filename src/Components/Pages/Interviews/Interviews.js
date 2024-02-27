// Interviews.js

import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../Config/firebase";
import { useNavigate } from "react-router-dom";
import "./Interviews.css";
import Sidepane from '../../App-Components/Sidepane';
import Menubar from '../../App-Components/Menubar';



const Interviews = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="interviews">
      <Sidepane handleLogout={logout} />
      <Menubar />
    </div>
  );
};

export default Interviews;
