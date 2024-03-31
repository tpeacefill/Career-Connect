import React, { useState, useEffect } from "react";
import { useUser } from "../App-Components/UserContext";
import { db } from "../Config/firebase";
import {
  doc,
  writeBatch,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import closeBrown from "../Images/closebrown.svg";
import "./SocialMediaPost.css"; // Import CSS file for styling
import ProfilePicture from "./profilePicture"; // Adjust path as needed

const SocialMediaPost = ({ user, post, onNavigateToProfile, onShare }) => {
  const { currentUser } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Check if the current user has liked the post
    setIsLiked(post.userLikes?.includes(currentUser.uid));
  }, [post, currentUser.uid]);

  // Toggle display of comments section
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // Post a comment
  const postComment = async () => {
    if (newComment.trim() === "") return; // Prevent posting empty comments

    const commentRef = collection(db, "Comment");
    await addDoc(commentRef, {
      content: newComment,
      postId: post.id,
      userId: currentUser.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    setNewComment(""); // Clear input field after posting
  };

  useEffect(() => {
    const fetchComments = async () => {
      if (!post.id || !showComments) return;

      // Query comments for the current post
      const q = query(
        collection(db, "Comment"),
        where("postId", "==", post.id),
        orderBy("createdAt", "desc")
      );

      try {
        const querySnapshot = await getDocs(q);
        const fetchedComments = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const commentData = docSnapshot.data();
            const userSnap = await getDoc(doc(db, "User", commentData.userId));

            // Add comments with user data or handle if user data does not exist
            if (userSnap.exists()) {
              return {
                ...commentData,
                fullName: userSnap.data().fullName,
                profilePicture: userSnap.data().profilePicture,
              };
            } else {
              return {
                ...commentData,
                fullName: "Unknown User",
                profilePicture: "default-profile-pic-url",
              };
            }
          })
        );

        // Set comments to state
        setComments(fetchedComments.filter((comment) => comment !== undefined));
      } catch (error) {
        console.error("Error fetching comments: ", error);
      }
    };

    // Fetch comments when showComments or post.id changes
    fetchComments();
  }, [post.id, showComments]);

  // Handle like action
  const handleLike = async () => {
    if (!post.id) {
      console.error("Post ID is undefined, cannot process like.");
      return;
    }

    const postRef = doc(db, "Posts", post.id);
    const batch = writeBatch(db);

    try {
      const postSnapshot = await getDoc(postRef);
      if (postSnapshot.exists()) {
        let { likeCount, userLikes } = postSnapshot.data();
        likeCount = likeCount || 0;
        userLikes = userLikes || [];

        const userIndex = userLikes.indexOf(currentUser.uid);

        if (userIndex === -1) {
          userLikes.push(currentUser.uid);
          likeCount += 1;
        } else {
          userLikes.splice(userIndex, 1);
          likeCount = Math.max(0, likeCount - 1);
        }

        batch.update(postRef, { likeCount, userLikes });
        await batch.commit();
        setIsLiked(userIndex === -1);
        setLikeCount(likeCount);
      } else {
        console.error("Post does not exist.");
      }
    } catch (error) {
      console.error("Error processing like:", error);
    }
  };

  // SVG fill color based on like status
  const likeButtonFill = isLiked ? "#ad8547" : "rgba(255, 255, 255, 0.5)";

  // Handle share action
  const handleShareClick = () => {
    onShare(); // Call handleSharePost(post.id) from parent component
  };

  return (
    <div className="social-media-post">
      {/* Post header */}
      <div className="post-header">
        <ProfilePicture
          imageUrl={user.profilePicture}
          className="profile-image"
          onClick={onNavigateToProfile}
        />
        <div className="user-info">
          <div className="user-name" onClick={onNavigateToProfile}>
            {user.name}
          </div>
          <div className="post-time">{post.time}</div>
        </div>
      </div>

      {/* Post content */}
      <div className="post-content">
        <div className="post-message">{post.message}</div>
        {post.media && (
          <img src={post.media} alt="Post media" className="post-media" />
        )}
      </div>
      <div className="post-actions">
        <button className="like-button" onClick={handleLike}>
          Like {likeCount}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 48 48"
          >
            <path
              fill={likeButtonFill}
              d="M34 9c-4.2 0-7.9 2.1-10 5.4C21.9 11.1 18.2 9 14 9C7.4 9 2 14.4 2 21c0 11.9 22 24 22 24s22-12 22-24c0-6.6-5.4-12-12-12"
            />
          </svg>
        </button>
        <button className="comment-button" onClick={toggleComments}>
          Comment{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 1024 1024"
          >
            <path
              fill="currentColor"
              d="M573 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40m-280 0c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40"
            />
            <path
              fill="currentColor"
              d="M894 345c-48.1-66-115.3-110.1-189-130v.1c-17.1-19-36.4-36.5-58-52.1c-163.7-119-393.5-82.7-513 81c-96.3 133-92.2 311.9 6 439l.8 132.6c0 3.2.5 6.4 1.5 9.4c5.3 16.9 23.3 26.2 40.1 20.9L309 806c33.5 11.9 68.1 18.7 102.5 20.6l-.5.4c89.1 64.9 205.9 84.4 313 49l127.1 41.4c3.2 1 6.5 1.6 9.9 1.6c17.7 0 32-14.3 32-32V753c88.1-119.6 90.4-284.9 1-408M323 735l-12-5l-99 31l-1-104l-8-9c-84.6-103.2-90.2-251.9-11-361c96.4-132.2 281.2-161.4 413-66c132.2 96.1 161.5 280.6 66 412c-80.1 109.9-223.5 150.5-348 102m505-17l-8 10l1 104l-98-33l-12 5c-56 20.8-115.7 22.5-171 7l-.2-.1C613.7 788.2 680.7 742.2 729 676c76.4-105.3 88.8-237.6 44.4-350.4l.6.4c23 16.5 44.1 37.1 62 62c72.6 99.6 68.5 235.2-8 330"
            />
            <path
              fill="currentColor"
              d="M433 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40"
            />
          </svg>
        </button>
        <button className="share-button" onClick={handleShareClick}>
          Share{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m20 12l-6.4-7v3.5C10.4 8.5 4 10.6 4 19c0-1.167 1.92-3.5 9.6-3.5V19z"
            />
          </svg>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="comment-section">
          <img
            src={closeBrown}
            alt="close button"
            onClick={toggleComments}
            className="close-comment-section"
          />
          <div className="comment-post">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <button onClick={postComment}>Post</button>
          </div>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <div className="comments-list">
              {comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div className="User-comment-profile">
                    <div className="only-comment-profile">
                      <img
                        src={comment.profilePicture}
                        alt={comment.fullName}
                        className="User-comment-profile-image"
                      />
                      <p>{comment.fullName}</p>
                    </div>
                    <div className="comment-content">
                      <p>{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialMediaPost;
