import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to Plant Paradise
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover and manage your favorite plants with ease
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/plants"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Browse Plants
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-green-600 text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold mb-2">Extensive Collection</h3>
            <p className="text-gray-600">Browse through our vast collection of plants from different categories.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-green-600 text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Easy Management</h3>
            <p className="text-gray-600">Manage your plant inventory with our intuitive admin interface.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-green-600 text-4xl mb-4">💚</div>
            <h3 className="text-xl font-semibold mb-2">Plant Care</h3>
            <p className="text-gray-600">Get expert advice and tips for taking care of your plants.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;