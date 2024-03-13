import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../Config/firebase'; // Adjust the import path as necessary
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../Config/firebase'; // Ensure you have a reference to your Firestore database

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

// UserProvider component
export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [profileData, setProfileData] = useState({ fullName: '', profilePicture: '' });
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userRef = doc(db, "User", user.uid);
          const userSnap = await getDoc(userRef);
  
          if (userSnap.exists()) {
            setProfileData({
              fullName: userSnap.data().fullName,
              profilePicture: userSnap.data().profilePicture,
            });
            setCurrentUser(user);
          } else {
            console.log("No such document!");
          }
        } else {
          setCurrentUser(null);
          setProfileData({ fullName: '', profilePicture: '' });
        }
      });
  
      return unsubscribe;
    }, []);
  
    return (
      <UserContext.Provider value={{ currentUser, profileData }}>
        {children}
      </UserContext.Provider>
    );
  };
  
