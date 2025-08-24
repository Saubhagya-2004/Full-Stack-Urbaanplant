import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(''); // New state for password update success
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/profile`, {
        withCredentials: true
      });
      setUser(response.data.data);
    } catch (err) {
      setError('Failed to load profile. Please log in again.');
      // Redirect to login after a short delay to show the error message
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, {
        withCredentials: true
      });
      localStorage.removeItem('user');
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if API logout fails, clear local storage and navigate
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    // Clear error messages when user starts typing
    if (error) setError('');
    if (passwordUpdateSuccess) setPasswordUpdateSuccess('');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordUpdateSuccess('');

    if (!passwordData.password || !passwordData.confirmPassword) {
      setError('Both password fields are required.');
      return;
    }
    if (passwordData.password !== passwordData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (passwordData.password.length < 6) { // Example: Minimum password length
        setError('Password must be at least 6 characters long.');
        return;
    }

    setUpdateLoading(true);

   
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) { // Show full error page if no user data and an error
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Profile</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <p className="text-gray-700 text-lg font-medium">No user data found. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">My Profile</h1>
            <p className="text-green-100 text-lg">Manage your account details and settings</p>
          </div>
          
          <div className="p-6 sm:p-8 md:p-10">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
              {/* User Profile Image */}
              <div className="md:col-span-1 flex justify-center">
                {user.profile ? (
                  <img 
                    src={user.profile} 
                    alt={`${user.Firstname}'s Profile`} 
                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full shadow-lg border-4 border-green-200" 
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/160x160/bbf7d0/16a34a?text=User"; }} // Fallback image
                  />
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center rounded-full bg-green-100 text-green-700 text-6xl font-bold shadow-lg border-4 border-green-200">
                    {user.Firstname ? user.Firstname[0].toUpperCase() : 'U'}
                  </div>
                )}
              </div>

              {/* User Information */}
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    {user.Firstname} {user.Lastname}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0018 4H2a2 2 0 00-.003 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                    <span className="font-medium">Email:</span> {user.email}
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
                    <span className="font-medium">Role:</span> <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{user.Role}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5L6 11H5a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1h3.134a1 1 0 00.866.5H14a1 1 0 001-1V8a1 1 0 00-1-1h-4z" clipRule="evenodd"/></svg>
                    <span className="font-medium">Age:</span> {user.age}
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/></svg>
                    <span className="font-medium">Gender:</span> {user.gender}
                  </div>
                </div>
              </div>
            </div>

            {/* Password Update Section */}
          

            {/* Action Buttons */}
            <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-center sm:justify-between gap-4">
              {user.Role === 'admin' && (
                <button
                  onClick={() => navigate('/addplant')}
                  className="w-full  cursor-pointer sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                >
                  Add New Plant
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full cursor-pointer sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
