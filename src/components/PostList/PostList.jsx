import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPosts,
  createNewPost,
  updateExistingPost,
  deleteExistingPost,
  setSelectedPost,
  closeEditPopup,
  setEditTitle,
  setFilteredPosts,
  setEditBody,
} from "../../slices/postSlice";
// import { toast } from "react-toastify";
import PostForm from "../PostForm/PostForm";
import "./PostList.css";

const PostList = ({ user, searchTerm }) => {
  const dispatch = useDispatch();

  const {
    items: posts,
    filteredItems,
    isLoading,
    isEditing,
    selectedPost,
    editTitle,
    editBody,
    showLoadingAnimation,
  } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setFilteredPosts(searchTerm));
  }, [searchTerm, dispatch]);

  const handleCreatePost = async (newPost) => {
    dispatch(createNewPost(newPost));
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    const updatedPost = {
      ...selectedPost,
      title: editTitle,
      body: editBody,
    };
    dispatch(updateExistingPost(updatedPost));
  };

  const handleDeletePost = async (postId) => {
    dispatch(deleteExistingPost(postId));
  };

  const openEditPopup = (post) => {
    dispatch(setSelectedPost(post));
  };

  const closeEditPopupLocal = () => {
    dispatch(closeEditPopup());
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
          {filteredItems.map((post) => (
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
                  onChange={(e) => dispatch(setEditTitle(e.target.value))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Body:</label>
                <textarea
                  value={editBody}
                  onChange={(e) => dispatch(setEditBody(e.target.value))}
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="submit">Update</button>
                <button type="button" onClick={closeEditPopupLocal}>
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
