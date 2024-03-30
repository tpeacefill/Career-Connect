// UserContext.js

import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../Config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";


const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: "",
    profilePicture: "",
    id: "", // Add id field to store the userId
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "User", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfileData({
            fullName: userSnap.data().fullName,
            profilePicture: userSnap.data().profilePicture,
            id: user.uid, // Set the id field with the userId
          });
          setCurrentUser(user);
        } else {
          console.log("No such document!");
        }
      } else {
        setCurrentUser(null);
        setProfileData({ fullName: "", profilePicture: "", id: "" }); // Reset profileData
      }
    });

    return unsubscribe;
  }, []);

  const updateProfilePicture = async (newImageUrl) => {
    try {
      if (currentUser) {
        const userRef = doc(db, "User", currentUser.uid);
        await updateDoc(userRef, { profilePicture: newImageUrl });
        setProfileData((prevProfileData) => ({
          ...prevProfileData,
          profilePicture: newImageUrl,
        }));
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{ currentUser, profileData, updateProfilePicture }}
    >
      {children}
    </UserContext.Provider>
  );
};
