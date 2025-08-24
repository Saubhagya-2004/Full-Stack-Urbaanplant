import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';

const UpdatePlant = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categories: '',
    available: true,
    profile: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // Available categories for suggestions
  const categorySuggestions = [
    'Indoor', 'Outdoor', 'Flowering', 'Medicinal', 'Air Purifying',
    'Decorative', 'Succulent', 'Herb', 'Culinary', 'Low Maintenance', 'Climbing'
  ];

  // Function to fetch the plant data by ID
  const fetchPlantData = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get(`${BASE_URL}/plant/${id}`, {
        withCredentials: true
      });
      const plantData = response.data.data;
      
      // Update form data and image preview
      setFormData({
        name: plantData.name,
        price: plantData.price,
        categories: plantData.categories.join(', '), // Convert array to comma-separated string
        available: plantData.available,
        profile: plantData.profile || ''
      });
      setImagePreview(plantData.profile || '');
    } catch (err) {
      console.error('Failed to fetch plant data:', err);
      setFetchError(err.response?.data?.message || 'Failed to load plant data. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.Role !== 'admin') {
      navigate('/plants');
      return;
    }

    // Fetch plant data
    fetchPlantData();
  }, [navigate, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      [name]: fieldValue
    });

    if (error) setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      setFormData({
        ...formData,
        profile: previewUrl
      });
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Plant name is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price greater than 0');
      return false;
    }
    if (!formData.categories.trim()) {
      setError('At least one category is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price),
        categories: formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat)
      };

      console.log('Updating plant with data:', submissionData);

      const response = await axios.patch(`${BASE_URL}/update/plant/${id}`, submissionData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.message === "Plant updated successfully" || response.data.message === "Plant updated sucessfully") {
        setSuccess('Plant updated successfully!');

        setTimeout(() => {
          navigate('/plants');
        }, 1500);
      }
    } catch (err) {
      console.error('Update error:', err);
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map(error => error.msg).join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'Failed to update plant. Please check all fields and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addCategorySuggestion = (suggestion) => {
    const currentCategories = formData.categories ? formData.categories.split(',').map(cat => cat.trim()) : [];

    if (!currentCategories.includes(suggestion)) {
      const updatedCategories = [...currentCategories, suggestion].join(', ');
      setFormData({
        ...formData,
        categories: updatedCategories
      });
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading plant data...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 text-center">
              <div className="text-5xl mb-2">⚠️</div>
              <h1 className="text-2xl font-bold">Error Loading Plant</h1>
            </div>
            <div className="p-6 text-center">
              <p className="text-red-600 mb-6">{fetchError}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={fetchPlantData}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition duration-300"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/plants')}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition duration-300"
                >
                  Back to Plants
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 text-center">
            <div className="text-5xl mb-2">🌿</div>
            <h1 className="text-3xl font-bold">Update Plant</h1>
            <p className="text-green-100 mt-2">Modify the plant details below</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Plant Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plant Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter plant name (e.g., Snake Plant)"
                maxLength="100"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500 text-lg">₹</span>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0.01"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories *
              </label>
              <input
                type="text"
                name="categories"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                value={formData.categories}
                onChange={handleChange}
                placeholder="e.g., Indoor, Flowering, Air Purifying"
                maxLength="100"
              />
              <p className="text-xs text-gray-500 mt-2">
                Separate multiple categories with commas
              </p>
              
              {/* Category Suggestions */}
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Quick select:</p>
                <div className="flex flex-wrap gap-2">
                  {categorySuggestions.map((category, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addCategorySuggestion(category)}
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full hover:bg-emerald-200 transition duration-200"
                    >
                      + {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plant Image
              </label>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  {imagePreview ? (
                    <img 
                      className="h-20 w-20 object-cover rounded-lg border border-gray-300" 
                      src={imagePreview} 
                      alt="Plant preview" 
                    />
                  ) : (
                    <div className="h-20 w-20 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
              </div>
                <label className="block">
                  <span className="sr-only">Choose plant photo</span>
                  <input 
                    type="file" 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Availability Checkbox */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                name="available"
                id="available"
                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                checked={formData.available}
                onChange={handleChange}
              />
              <label htmlFor="available" className="text-sm font-medium text-gray-900">
                Available for purchase
              </label>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Plant...
                  </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Update Plant
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/plants')}
                className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl transition duration-300"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 space-y-2">
              <p className="font-medium">📝 Form Tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Make sure categories are separated by commas</li>
                <li>Use descriptive names that customers will recognize</li>
                <li>High-quality images help plants sell better</li>
                <li>Update availability status based on current stock</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePlant;