import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';

const Plants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    categories: '',
    priceRange: '',
    availability: ''
  });
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Available categories for dropdown
  const plantCategories = [
    'Indoor', 'Outdoor', 'Flowering', 'Medicinal', 
    'Air Purifying', 'Decorative', 'Succulent', 
    'Herb', 'Culinary', 'Low Maintenance', 'Climbing'
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('user');
      }
    }
    fetchPlants();
  }, []);

  const fetchPlants = async (searchFilters = filters) => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      
      if (searchFilters.name && searchFilters.name.trim()) {
        params.append('name', searchFilters.name.trim());
      }
      if (searchFilters.categories && searchFilters.categories.trim()) {
        params.append('categories', searchFilters.categories.trim());
      }
      
      const queryString = params.toString();
      const url = queryString ? `${BASE_URL}/getplants?${queryString}` : `${BASE_URL}/getplants`;
      
      const response = await axios.get(url, {
        withCredentials: true,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const plantsData = response.data.data || response.data || [];
      setPlants(Array.isArray(plantsData) ? plantsData : []);
      
    } catch (err) {
      console.error('Fetch plants error:', err);
      
      let errorMessage = 'Failed to load plants';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - please check your connection';
      } else if (err.response) {
        const status = err.response.status;
        const serverMessage = err.response.data?.message;
        
        switch (status) {
          case 400:
            errorMessage = serverMessage || 'Bad request - please check your search parameters';
            break;
          default:
            errorMessage = serverMessage || `Server error (${status})`;
        }
      } else if (err.request) {
        errorMessage = 'Network error - please check your connection and try again';
      } else {
        errorMessage = err.message || 'An unexpected error occurred';
      }
      
      setError(errorMessage);
      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPlants(filters);
  };

  const handleDelete = async (plantId, plantName) => {
  if (!window.confirm(`Are you sure you want to delete "${plantName}"? This action cannot be undone.`)) {
    return;
  }

  // Enhanced debugging
  console.group('DELETE PLANT DEBUG INFO');
  console.log('Plant ID:', plantId);
  console.log('Plant Name:', plantName);
  console.log('Full URL:', `${BASE_URL}/deleteplant/${plantId}`);
  console.log('User Role:', user?.Role);
  console.log('User Data:', user);
  console.groupEnd();

  try {
    // First, let's test if the endpoint exists with a simple HEAD request
    console.log('Testing endpoint with HEAD request...');
    
    // Test if endpoint is reachable
    try {
      await axios.head(`${BASE_URL}/deleteplant/test`, {
        withCredentials: true,
        timeout: 3000
      });
    } catch (headErr) {
      console.log('HEAD request result:', headErr.response?.status || headErr.message);
    }

    // Now make the actual DELETE request
    console.log('Making DELETE request...');
    const response = await axios.delete(`${BASE_URL}/delete/plant/${plantId}`, {
      withCredentials: true,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add if using token auth
      }
    });
    
    console.log('Delete response:', response);
    
    if (response.status === 200 || response.status === 204) {
      setPlants(prevPlants => prevPlants.filter(plant => plant._id !== plantId));
      
      // Show success notification
      setError('');
      setSuccess(`"${plantName}" has been successfully deleted!`);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
    
  } catch (err) {
    console.group('DELETE ERROR DETAILS');
    console.error('Full error object:', err);
    console.log('Error code:', err.code);
    console.log('Error message:', err.message);
    console.log('Response status:', err.response?.status);
    console.log('Response data:', err.response?.data);
    console.log('Response headers:', err.response?.headers);
    console.groupEnd();
    
    let errorMessage = 'Failed to delete plant. ';
    
    if (err.code === 'ECONNABORTED') {
      errorMessage += 'Request timed out. The server might be unavailable.';
    } else if (err.response) {
      // Server responded with error status
      const status = err.response.status;
      
      switch (status) {
        case 400:
          errorMessage += 'Bad request. The plant ID might be invalid.';
          break;
        case 401:
          errorMessage += 'You need to log in again.';
          // Redirect to login if needed
          // navigate('/login');
          break;
        case 403:
          errorMessage += 'Access denied. Only administrators can delete plants.';
          break;
        case 404:
          errorMessage += 'Plant not found. It may have been already deleted.';
          break;
        case 405:
          errorMessage += 'Method not allowed. The DELETE method might not be enabled on this endpoint.';
          break;
        case 500:
          errorMessage += 'Server error. Please try again later.';
          break;
        default:
          errorMessage += `Server returned status: ${status}`;
      }
      
      // Add server message if available
      if (err.response.data?.message) {
        errorMessage += ` Server says: ${err.response.data.message}`;
      }
    } else if (err.request) {
      // Request was made but no response received
      errorMessage += 'No response from server. Check your connection and CORS settings.';
      console.log('No response received. This is likely a CORS or network issue.');
      
      // Test CORS with a simple OPTIONS request
      try {
        console.log('Testing CORS with OPTIONS request...');
        await axios.options(`${BASE_URL}/deleteplant/${plantId}`, {
          timeout: 5000
        });
        console.log('OPTIONS request succeeded - CORS is configured');
      } catch (optionsErr) {
        console.log('OPTIONS request failed - CORS might be misconfigured:', optionsErr.message);
        errorMessage += ' CORS might be misconfigured on the server.';
      }
    } else {
      // Something else happened
      errorMessage += `Unexpected error: ${err.message}`;
    }
    
    setError(errorMessage);
    
    // Show detailed error alert for debugging
    alert(`Delete Failed\n\n${errorMessage}\n\nCheck console for more details.`);
  }
};

  const clearFilters = () => {
    const emptyFilters = { name: '', categories: '', priceRange: '', availability: '' };
    setFilters(emptyFilters);
    fetchPlants(emptyFilters);
  };

  const retryFetch = () => {
    fetchPlants();
  };

  // Sort plants based on selected option
  const sortedPlants = [...plants].sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Filter plants based on selected filters
  const filteredPlants = sortedPlants.filter(plant => {
    // Name filter
    if (filters.name && !plant.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.categories && !plant.categories.includes(filters.categories)) {
      return false;
    }
    
    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max === 0) {
        if (plant.price < min) return false;
      } else {
        if (plant.price < min || plant.price > max) return false;
      }
    }
    
    // Availability filter
    if (filters.availability) {
      if (filters.availability === 'available' && !plant.available) return false;
      if (filters.availability === 'out-of-stock' && plant.available) return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Discovering beautiful plants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Plant Paradise
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {!error && filteredPlants.length > 0 
                  ? `Discover ${filteredPlants.length} plant${filteredPlants.length !== 1 ? 's' : ''} for your green space` 
                  : !error ? 'No plants available' : 'Unable to load plants'}
              </p>
            </div>
            
            {/* Add Plant Button - Only for Admin */}
            {user?.Role === 'admin' && (
              <Link
                to="/addplant"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <span className="text-xl">+</span>
                <span>Add New Plant</span>
              </Link>
            )}
          </div>
          
          {/* Search and Filter Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search by Name
                  </label>
                  <input
                    type="text"
                    placeholder="What plant are you looking for?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    value={filters.name}
                    onChange={(e) => setFilters({...filters, name: e.target.value})}
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Category
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    value={filters.categories}
                    onChange={(e) => setFilters({...filters, categories: e.target.value})}
                  >
                    <option value="">All Categories</option>
                    {plantCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    value={filters.priceRange}
                    onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  >
                    <option value="">Any Price</option>
                    <option value="0-100">Under ₹100</option>
                    <option value="100-200">₹100 - ₹200</option>
                    <option value="200-300">₹200 - ₹300</option>
                    <option value="300-0">₹300+</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    value={filters.availability}
                    onChange={(e) => setFilters({...filters, availability: e.target.value})}
                  >
                    <option value="">All Plants</option>
                    <option value="available">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center"
                >
                  <span className="mr-2">🔍</span> Search Plants
                </button>
                
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={loading}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                >
                  Clear All Filters
                </button>
              </div>
            </form>
            
            {/* View Controls */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Sort by:</span>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message with Retry */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl mr-3">⚠️</span>
                <div>
                  <p className="font-medium">Error Loading Plants</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={retryFetch}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow-md"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Plants Grid or Empty State */}
        {filteredPlants.length === 0 && !loading && !error ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-8xl mb-6">🌱</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No plants found</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {filters.name || filters.categories || filters.priceRange || filters.availability
                ? "Try adjusting your search filters to find what you're looking for." 
                : "No plants have been added yet. Check back soon!"}
            </p>
            {(filters.name || filters.categories || filters.priceRange || filters.availability) ? (
              <button
                onClick={clearFilters}
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
              >
                Clear Filters
              </button>
            ) : user?.Role === 'admin' && (
              <Link
                to="/addplant"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
              >
                <span className="text-xl mr-2">+</span>
                Add Your First Plant
              </Link>
            )}
          </div>
        ) : filteredPlants.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-6"
          }>
            {filteredPlants.map((plant) => (
              <div key={plant._id} className={
                viewMode === 'grid' 
                  ? "bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                  : "bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
              }>
                {/* Plant Image */}
                <div className={
                  viewMode === 'grid' 
                    ? "h-48 overflow-hidden"
                    : "md:w-1/4 h-48 md:h-auto overflow-hidden"
                }>
                  <img 
                    src={plant.profile} 
                    alt={plant.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop';
                    }}
                  />
                </div>
                
                {/* Plant Details */}
                <div className={
                  viewMode === 'grid' 
                    ? "p-5 flex-1 flex flex-col"
                    : "p-5 flex-1 flex flex-col"
                }>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {plant.name || 'Unnamed Plant'}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">
                        ₹{typeof plant.price === 'number' ? plant.price.toFixed(2) : parseFloat(plant.price || 0).toFixed(2)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        plant.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {plant.available ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm mb-1">
                        <span className="font-medium">Category:</span> {Array.isArray(plant.categories) ? plant.categories.join(', ') : plant.categories || 'Uncategorized'}
                      </p>
                    </div>
                    
                    {/* Category Tags */}
                    {Array.isArray(plant.categories) && plant.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {plant.categories.slice(0, 3).map((category, index) => (
                          <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                            {category}
                          </span>
                        ))}
                        {plant.categories.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            +{plant.categories.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-100">
                    {/* Admin Actions */}
                    {user?.Role === 'admin' ? (
                      <div className="flex space-x-3">
                        <Link
                          to={`/updateplant/${plant._id}`}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-3 rounded-lg transition duration-300 text-center flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(plant._id, plant.name)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-3 rounded-lg transition duration-300 flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    ) : (
                      /* Regular User Actions */
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                          </svg>
                          Add to Cart
                        </button>
                        <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded-lg transition duration-300 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Plants;