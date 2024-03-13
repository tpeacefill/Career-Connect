import { addDoc, collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db, auth } from "../Config/firebase";

export default function Tryout() {
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);

    // Function to fetch posts from Firestore
    const fetchPosts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'Post'));
            const postData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postData);
        } catch (err) {
            console.error('Error fetching posts: ', err);
        }
    };

    useEffect(() => {
        fetchPosts(); // Fetch posts when the component mounts
    }, []); // Empty dependency array to execute only once

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        const userId = auth?.currentUser?.uid;
        console.log('User ID:', userId); // Log the user ID to see if it's defined
    
        if (!userId) {
            console.error('No user ID found. User might not be logged in.');
            return;
        }
    
        try {
            const docRef = await addDoc(collection(db, 'Post'), {
                content: content,
                userId: userId,
                updatedAt: new Date(), // Add an updatedAt field with the current date
            });
            console.log('Document written with ID: ', docRef.id);
            fetchPosts(); // After adding a new post, fetch posts again to update the list
        } catch (err) {
            console.error('Error adding document: ', err);
        }
    };
    
    return (
        <div className="Main-Post" style={{ width: '50%', height: '50%', justifyContent: 'center', alignContent: 'center', margin: '100px' }}>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="Content"
                    rows='10'
                    value={content} // Bind textarea value to state
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <button type="submit">Add</button>
            </form>

            {/* Display posts */}
            <div>
                <h2>Posts</h2>
               <div>
               <ul>
                    {posts.map(post => (
                       <div className="" style={{background:"gray " }}> <li key={post.id}>
                       <div>{post.content}</div>
                       <div>{post.userId}</div>
                       <div>{post.updatedAt && post.updatedAt.toDate().toLocaleString()}</div>

                       <input placeholder="comment"></input>
                   </li>
</div>                    ))}
                </ul>
               </div>
            </div>
        </div>
    );
}
