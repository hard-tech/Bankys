// pages/Home.tsx
// import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome Home
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Featured Content</h2>
            <p className="text-gray-600">Main content goes here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;