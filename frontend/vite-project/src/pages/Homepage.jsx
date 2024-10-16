import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/api.js';

function Home() {
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
      <h1 className="text-4xl font-bold mb-8">Welcome to Our Blog Platform</h1>
      <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            {post.image_url && (
              <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                <Link to={`/post/${post.id}`} className="text-blue-600 hover:text-blue-800">{post.title}</Link>
              </h3>
              <p className="text-gray-600 mb-4">By: {post.author_email}</p>
              <p className="text-gray-700 line-clamp-3">{post.content.replace(/<[^>]*>?/gm, '')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;