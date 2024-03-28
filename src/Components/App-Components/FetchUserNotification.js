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
      console.log("Fetching notifications for user ID:", userId);
      if (!userId) {
        console.log("No user ID provided");
        return;
      }

      const notificationsRef = collection(db, "notifications");
      const q = query(notificationsRef, where("userId", "==", userId));

      try {
        const querySnapshot = await getDocs(q);
        console.log("querySnapshot:", querySnapshot);

        const fetchedNotifications = querySnapshot.docs.map((doc) => {
          console.log("Notification doc data:", doc.data());

          // Convert Firestore timestamp to Date object safely
          const timestamp = doc.data().timestamp;
          const date = timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp.seconds * 1000);

          return {
            id: doc.id,
            message: doc.data().message,
            timestamp: date,
          };
        });

        // Sort notifications by timestamp in descending order
        const sortedNotifications = fetchedNotifications.sort(
          (a, b) => b.timestamp - a.timestamp
        );
        setNotifications(sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId, db]);

  return { notifications, setNotifications };
};
export default useFetchUserNotifications;
