import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/api.js';

function MyFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Feed</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">
              <Link to={`/post/${post.id}`} className="text-blue-600 hover:text-blue-800">{post.title}</Link>
            </h2>
            <p className="text-gray-600 mb-4">By: {post.author_email}</p>
            <p className="text-gray-700">{post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyFeed;