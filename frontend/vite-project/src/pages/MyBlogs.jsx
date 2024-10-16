import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, deletePost } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

function MyBlogs() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data.filter(post => post.author_id === user.id));
    } catch (error) {
      console.error('Error fetching my posts:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        fetchMyPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Blogs</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">
              <Link to={`/post/${post.id}`} className="text-blue-600 hover:text-blue-800">{post.title}</Link>
            </h2>
            <p className="text-gray-700 mb-4">{post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...</p>
            <div className="flex space-x-4">
              <Link to={`/edit/${post.id}`} className="text-blue-600 hover:text-blue-800">Edit</Link>
              <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-800">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBlogs;