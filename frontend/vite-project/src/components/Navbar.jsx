import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">BlogApp</Link>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="lg:hidden text-white focus:outline-none"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path fillRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
            ) : (
              <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
            )}
          </svg>
        </button>
        <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:w-auto w-full`}>
          <div className="text-sm lg:flex-grow">
            {user ? (
              <>
                <Link to="/myfeed" className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4">
                  My Feed
                </Link>
                <Link to="/myblogs" className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4">
                  My Blogs
                </Link>
                <Link to="/create" className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4">
                  Create Post
                </Link>
                <button onClick={logout} className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4">
                  Login
                </Link>
                <Link to="/register" className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;