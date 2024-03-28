import { useState, useCallback } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const useDeleteUserNotifications = (userId) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const db = getFirestore();

  const deleteNotifications = useCallback(async () => {
    console.log("Attempting to delete notifications for userId:", userId); // Debugging: Log the userId being used for deletion

    setIsDeleting(true);
    setError(null);

    const notificationsRef = collection(db, "notifications");
    const q = query(notificationsRef, where("userId", "==", userId));

    try {
      const querySnapshot = await getDocs(q);
      console.log(
        `Found ${querySnapshot.docs.length} notifications to delete for userId: ${userId}`
      ); // Debugging: Log the number of notifications found for deletion

      const deletePromises = querySnapshot.docs.map((docSnapshot) => {
        return deleteDoc(doc(db, "notifications", docSnapshot.id));
      });

      // Wait for all delete operations to complete
      await Promise.all(deletePromises);
      console.log(`All notifications deleted for userId: ${userId}`); // Debugging: Confirm deletion completion
      setIsDeleting(false);
    } catch (e) {
      console.error("Error deleting notifications:", e);
      setError(e);
      setIsDeleting(false);
    }
  }, [userId, db]);

  return { deleteNotifications, isDeleting, error };
};

export default useDeleteUserNotifications;
