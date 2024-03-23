import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PostForm from "../PostForm/PostForm";
import "./PostList.css";

const PostList = ({ user, searchTerm }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setShowLoadingAnimation(true); // Show loading animation

      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setPosts(response.data);
        setFilteredPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
        toast.error("Failed to fetch posts");
      }

      setShowLoadingAnimation(false); // Hide loading animation
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  const handleCreatePost = async (newPost) => {
    setShowLoadingAnimation(true); // Show loading animation

    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        newPost
      );
      setPosts([...posts, response.data]);
      setFilteredPosts([...filteredPosts, response.data]);
      toast.success("Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }

    setShowLoadingAnimation(false); // Hide loading animation
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setShowLoadingAnimation(true); // Show loading animation

    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/posts/${selectedPost.id}`,
        {
          ...selectedPost,
          title: editTitle,
          body: editBody,
        }
      );
      const updatedPosts = posts.map((post) =>
        post.id === selectedPost.id ? response.data : post
      );
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      toast.success("Post updated successfully");
      closeEditPopup();
    } catch (error) {
      console.error("Error updating post:", error);
      closeEditPopup();
    }

    setShowLoadingAnimation(false); // Hide loading animation
  };

  const handleDeletePost = async (postId) => {
    setShowLoadingAnimation(true); // Show loading animation

    try {
      await axios.delete(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
      );
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }

    setShowLoadingAnimation(false); // Hide loading animation
  };

  const openEditPopup = (post) => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditBody(post.body);
    setIsEditing(true);
  };

  const closeEditPopup = () => {
    setIsEditing(false);
    setSelectedPost(null);
    setEditTitle("");
    setEditBody("");
  };

  return (
    <div className="post-list-container">
      <PostForm onCreatePost={handleCreatePost} user={user} />

      {isLoading || showLoadingAnimation ? (
        <div className="loading-container">
          <div className="loading"></div>
        </div>
      ) : (
        <ul className="post-list">
          {filteredPosts.map((post) => (
            <li key={post.id} className="post-item">
              <div className="post-details">
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </div>
              <div className="post-actions">
                <button onClick={() => openEditPopup(post)}>Edit</button>
                <button onClick={() => handleDeletePost(post.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {isEditing && (
        <div className="edit-popup">
          <div className="edit-popup-content">
            <h2>Edit Post</h2>
            <form onSubmit={handleUpdatePost}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Body:</label>
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="submit">Update</button>
                <button type="button" onClick={closeEditPopup}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
