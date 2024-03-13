import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../Config/firebase'; // Adjust the import path as necessary
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../Config/firebase'; // Ensure you have a reference to your Firestore database

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in.
        const userRef = doc(db, "User", user.uid); // Adjust "users" to your users collection path
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setFullName(userSnap.data().fullName); // Assuming 'fullName' is the field name in your db
          setCurrentUser(user);
        } else {
          // User data not found in db, handle accordingly
          console.log("No such document!");
        }
      } else {
        // User is signed out.
        setCurrentUser(null);
        setFullName('');
      }
    });

    return () => unsubscribe(); // Clean up subscription
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, fullName }}>
      {children}
    </UserContext.Provider>
  );
};
