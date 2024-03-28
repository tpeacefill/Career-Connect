import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const useFetchUserNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchNotifications = async () => {
      console.log("userId received:", userId);
      // Log to verify that we have a user ID
      console.log("Fetching notifications for user ID:", userId);

      if (!userId) {
        console.log("No user ID available, skipping fetch");
        return;
      }

      const notificationsRef = collection(db, "notifications");
      const q = query(notificationsRef, where("userId", "==", userId));

      try {   
        const querySnapshot = await getDocs(q);
        // Log to see the querySnapshot
        console.log("querySnapshot:", querySnapshot);

        const fetchedNotifications = querySnapshot.docs.map((doc) => {
          // Log each document to see the data
          console.log("Notification doc data:", doc.data());
          return {
            id: doc.id,
            message: doc.data().message,
            // Log to see the timestamp
            timestamp: new Date(doc.data().timestamp),
          };
        });

        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId, db]);

  return notifications;
};
export default useFetchUserNotifications;
