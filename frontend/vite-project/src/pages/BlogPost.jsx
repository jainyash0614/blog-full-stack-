import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost, deletePost, likePost, unlikePost, addComment, getComments, getAudio } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

function BlogPost() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const audioRef = React.useRef(null);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await getPost(id);
      setPost(response.data);
      setLiked(response.data.user_liked);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikePost(id);
      } else {
        await likePost(id);
      }
      setLiked(!liked);
      fetchPost();
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        navigate('/myblogs');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await addComment(id, newComment);
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAudioToggle = async () => {
    if (!audioUrl) {
      try {
        const response = await getAudio(id);
        setAudioUrl(response.data.audioUrl);
        setIsPlaying(true);
        audioRef.current.play();
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    } else {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!post) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-4">By: {post.author_email}</p>
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="w-full max-h-96 object-cover mb-4 rounded-lg" />
      )}
      <div className="flex items-center mb-4">
        <button
          onClick={handleAudioToggle}
          className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center mr-4"
        >
          {isPlaying ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              Pause Audio
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play Audio
            </>
          )}
        </button>
        {audioUrl && (
          <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
        )}
        <button onClick={handleLike} className={`px-4 py-2 rounded ${liked ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          {liked ? 'Unlike' : 'Like'} ({post.likes_count})
        </button>
      </div>
      <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: post.content }}></div>
      {user && user.id === post.author_id && (
        <div className="flex space-x-4 mb-8">
          <Link to={`/edit/${post.id}`} className="text-blue-500 hover:underline">Edit</Link>
          <button onClick={handleDelete} className="text-red-500 hover:underline">Delete</button>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="font-semibold">{comment.user_email}</p>
            <p>{comment.content}</p>
          </div>
        ))}
        {user && (
          <form onSubmit={handleAddComment} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Add a comment..."
              rows="3"
            ></textarea>
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Add Comment
            </button>
          </form>
        )}
      </div>
      <Link to="/myblogs" className="mt-8 inline-block text-blue-500 hover:underline">Back to My Blogs</Link>
    </div>
  );
}

export default BlogPost;