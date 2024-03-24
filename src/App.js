// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from './Components/App-Components/UserContext.js';
import SplashScreen from "./Components/Pages/SplashScreen/SplashScreen.js";
import Login from "./Components/Pages/Login-Signup/Login.js";
import Signup from "./Components/Pages/Login-Signup/Signup.js";
import Dashboard from "./Components/Pages/Dashboard/Dashboard.js";
import Jobs from "./Components/Pages/Jobs/Jobs.js";
import Internships from "./Components/Pages/Internships/Internships.js";
import Courses from "./Components/Pages/Courses/Courses.js";
import Resumes from "./Components/Pages/Resumes/Resumes.js";
import Interviews from "./Components/Pages/Interviews/Interviews.js";
import Help from "./Components/Pages/Help/Help.js";
import Network from "./Components/Pages/Network/Network.js";
import Settings from "./Components/Pages/Settings/Settings.js";
import UserProfile from "./Components/App-Components/UserProfile.js";
import Tryout from "./Components/Pages/Tryout.js";



function App() {
  return (
    <div className="App">
      <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/help" element={<Help />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/network" element={< Network />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/try" element={<Tryout />} />
          <Route path="/userprofile" element={<UserProfile />} />
        </Routes>
      </Router>
      </UserProvider>
    </div>
  );
}

export default App;




