import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Config/firebase";
import ProfilePicture from "./profilePicture"; // Adjust the import path as necessary
import "./SocialMediaPost.css";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState({
    name: "Unknown User",
    profilePicture: "defaultImagePath",
  });

  useEffect(() => {
    const fetchPostAndUserData = async () => {
      try {
        // Fetch the post
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();

          // Fetch the user details
          const userRef = doc(db, "User", postData.userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser({
              name: userData.fullName,
              profilePicture: userData.profilePicture,
            });
          }

          // If there's a mediaId, fetch the media URL
          if (postData.mediaId) {
            const mediaRef = doc(db, "Media", postData.mediaId);
            const mediaSnap = await getDoc(mediaRef);
            if (mediaSnap.exists()) {
              postData.mediaUrl = mediaSnap.data().url;
            }
          }

          setPost(postData);
        } else {
          console.log("No such post!");
        }
      } catch (error) {
        console.error("Error fetching post or related data:", error);
      }
    };

    fetchPostAndUserData();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="PostDetail">
      <div className="social-media-posts">
        <div className="post-header">
          <ProfilePicture
            imageUrl={user.profilePicture}
            className="profile-image"
          />
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            {/* Optionally display post time here */}
          </div>
        </div>
        <div className="post-content">
          <div className="post-message">{post.content}</div>
          {post.mediaUrl && (
            <img src={post.mediaUrl} alt="Post media" className="post-media" />
          )}
        </div>
        {/* Post actions (Like, Comment, Share) could go here */}
      </div>
    </div>
  );
};

export default PostDetailPage;
