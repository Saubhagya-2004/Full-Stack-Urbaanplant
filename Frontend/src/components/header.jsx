import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';

const Header = () => {
  // Initialize user state from localStorage immediately
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // The useEffect can still be used for other side effects, but for initial load,
  // useState's functional update is more efficient.
  // This useEffect will now primarily re-evaluate if localStorage changes
  // outside of this component's direct control, or if user state is updated.
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user');
      setUser(userData ? JSON.parse(userData) : null);
    };

    // Listen for changes in localStorage from other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    // You might also want to re-check on mount for redundancy, though useState already does it
    // setUser(JSON.parse(localStorage.getItem('user') || 'null')); 

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, {
        withCredentials: true
      });
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear local storage even if API call fails
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-l from-green-300 via-blue-300 to-gray-600 shadow-lg sticky top-0 z-50 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white flex items-center">
              <span className="mr-2">🌱</span>
              Plant Paradise
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-white hover:text-green-200 transition duration-300 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/plants" 
              className="text-white hover:text-green-200 transition duration-300 font-medium"
            >
              Plants
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="text-white hover:text-green-200 transition duration-300 font-medium"
                >
                  Profile
                </Link>
                {user.Role === 'admin' && (
                  <Link 
                    to="/addplant" 
                    className="text-white hover:text-green-200 transition duration-300 font-medium"
                  >
                    Add Plant
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <div className="text-green-800 text-sm">
                    <span className="font-medium">Welcome, {user.Firstname}</span>
                    <span className="ml-2 bg-green-100 px-2 py-1 rounded-full text-xs">
                      {user.Role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-green-200 transition duration-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition duration-300 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-green-200 focus:outline-none focus:text-green-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-green-700 rounded-lg mb-4">
              <Link
                to="/"
                className="block px-3 py-2 text-white hover:text-green-200 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/plants"
                className="block px-3 py-2 text-white hover:text-green-200 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Plants
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-white hover:text-green-200 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {user.Role === 'admin' && (
                    <Link
                      to="/addplant"
                      className="block px-3 py-2 text-white hover:text-green-200 transition duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Add Plant
                    </Link>
                  )}
                  <div className="px-3 py-2 text-green-200 text-sm">
                    Welcome, {user.Firstname} ({user.Role})
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-white hover:text-red-200 transition duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-white hover:text-green-200 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-white hover:text-green-200 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
