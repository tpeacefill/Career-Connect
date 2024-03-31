import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, getDoc, doc } from "firebase/firestore"; // Import doc here
import { auth, db } from "../../Config/firebase";
import { signOut } from "firebase/auth";
import "./Network.css";
import Sidepane from "../../App-Components/Sidepane";
import Menubar from "../../App-Components/Menubar";
import ProfilePicture from "../../App-Components/profilePicture";
import { useUser } from "../../App-Components/UserContext";
import MakePostBox from "../../App-Components/MakePost"; // Import MakePostBox component
import SocialMediaPost from "../../App-Components/SocialMediaPost";

const Network = () => {
  const navigate = useNavigate();
  const { currentUser, profileData } = useUser();
  const [showMakePostBox, setShowMakePostBox] = useState(false); // Step 1: State to manage modal visibility
  const [posts, setPosts] = useState([]); // State to hold posts

  const handleNavigateToProfile = (userId) => {
    if (userId === currentUser?.uid) {
      // Use optional chaining to safely access uid
      navigate(`/settings`); // Navigate to settings for the current user
    } else {
      navigate(`/userprofile/${userId}`); // Navigate to user profile for other users
    }
  };

  const handleSharePost = (postId) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard
      .writeText(postUrl)
      .then(() => alert("Post link copied to clipboard!"))
      .catch((err) => console.error("Could not copy post link: ", err));
  };

  useEffect(() => {
    const fetchPostsAndUserData = async () => {
      const postsCollectionRef = collection(db, "Posts");
      const querySnapshot = await getDocs(postsCollectionRef);
      let postsData = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          let postData = docSnapshot.data();
          // Include the document ID as part of the post object
          const postWithId = { id: docSnapshot.id, ...postData };

          // Fetch user info
          const userRef = doc(db, "User", postData.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            // Add user information to the post object
            postWithId.userName = userData.fullName;
            postWithId.userProfilePicture = userData.profilePicture;
          }

          // Fetch media info if mediaId exists
          if (postData.mediaId) {
            const mediaRef = doc(db, "Media", postData.mediaId);
            const mediaSnap = await getDoc(mediaRef);
            if (mediaSnap.exists()) {
              postWithId.mediaUrl = mediaSnap.data().url;
            }
          }

          return postWithId;
        })
      );

      // Sort the postsData array in descending order based on the createdAt timestamp
      postsData = postsData.sort((a, b) => {
        const aTime = a.createdAt?.toDate().getTime() || 0; // Convert Firestore Timestamp to JS Date, then to milliseconds
        const bTime = b.createdAt?.toDate().getTime() || 0; // Using 0 as fallback for missing createdAt field
        return bTime - aTime; // Descending order
      });

      setPosts(postsData);
    };

    fetchPostsAndUserData();
  }, []);

  function getPostDate(postTime) {
    // Handle Firestore Timestamp directly
    if (postTime && typeof postTime.toDate === "function") {
      return postTime.toDate();
    }

    // Handle a serialized Firestore Timestamp (object with seconds)
    if (postTime && typeof postTime === "object" && "seconds" in postTime) {
      return new Date(postTime.seconds * 1000);
    }

    // Handle a JavaScript Date object or a numeric timestamp directly
    if (postTime instanceof Date || typeof postTime === "number") {
      return new Date(postTime);
    }

    // Fallback if the time is unrecognized or missing
    console.warn("Unrecognized post time format:", postTime);
    return new Date(); // fallback to current time, adjust as needed
  }

  const timeAgo = (date) => {
    const formatter = new Intl.RelativeTimeFormat(undefined, {
      numeric: "auto",
    });

    const DIVISIONS = [
      { amount: 60, name: "seconds" },
      { amount: 60, name: "minutes" },
      { amount: 24, name: "hours" },
      { amount: 7, name: "days" },
      { amount: 4.34524, name: "weeks" },
      { amount: 12, name: "months" },
      { amount: Number.POSITIVE_INFINITY, name: "years" },
    ];

    let duration = (date - new Date()) / 1000;

    for (let i = 0; i < DIVISIONS.length; i++) {
      const division = DIVISIONS[i];
      if (Math.abs(duration) < division.amount) {
        return formatter.format(Math.round(duration), division.name);
      }
      duration /= division.amount;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User has been logged out");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handlePostInitiatorClick = () => {
    // Step 2: Event handler to open the modal
    setShowMakePostBox(true);
  };

  const handleCloseMakePostBox = () => {
    // Function to close the modal
    setShowMakePostBox(false);
  };

  return (
    <div className="network">
      <Sidepane auth={auth} handleLogout={logout} />
      <Menubar />
      <div className="page-content">
        <div className="post-section">
          <div className="make-post">
            {/* Step 3: Conditional rendering */}
            <div className="make-post-element">
              <ProfilePicture
                imageUrl={profileData.profilePicture}
                className="profile-image"
              />
              <button
                className="post-initiator"
                onClick={handlePostInitiatorClick}
              >
                Start a post
              </button>
            </div>
          </div>

          {showMakePostBox && (
            <>
              <div
                className="dialog-overlay"
                onClick={handleCloseMakePostBox}
              ></div>
              <MakePostBox
                onClose={handleCloseMakePostBox}
                className="make-post-box"
              />
            </>
          )}
          <div className="actual-posts">
            {posts.map((post) => {
              const postDate = getPostDate(post.createdAt.toDate());
              const readableTime = timeAgo(postDate);

              return (
                <SocialMediaPost
                  key={post.id}
                  user={{
                    name: post.userName,
                    profilePicture: post.userProfilePicture,
                    userId: post.userId, // Assuming post.userId is available and stores the ID of the user who created the post
                  }}
                  post={{
                    id: post.id,
                    time: readableTime,
                    message: post.content,
                    media: post.mediaUrl,
                    likeCount: post.likeCount,
                    userLikes: post.userLikes,
                  }}
                  onNavigateToProfile={() =>
                    handleNavigateToProfile(post.userId)
                  }
                  onShare={() => handleSharePost(post.id)} // This function is responsible for sharing logic
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;
