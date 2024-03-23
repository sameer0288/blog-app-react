// src/components/PostForm/PostForm.js
import React, { useState } from "react";
import "./PostForm.css";

const PostForm = ({ onCreatePost, onUpdatePost, post, user }) => {
  const [title, setTitle] = useState(post ? post.title : "");
  const [body, setBody] = useState(post ? post.body : "");
  const [isEditing, setIsEditing] = useState(!!post);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      userId: user.id,
      title,
      body,
    };

    if (isEditing) {
      newPost.id = post.id;
      onUpdatePost(newPost);
    } else {
      onCreatePost(newPost);
      setTitle("");
      setBody("");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="post-form-actions">
        <button type="submit">{isEditing ? "Update" : "Create"}</button>
        {isEditing && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PostForm;
