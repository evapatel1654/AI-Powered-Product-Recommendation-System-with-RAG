// File: frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import { getRecommendations } from '../services/api';

const HomePage = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        const products = await getRecommendations(8);
        setPopularProducts(products);
      } catch (err) {
        console.error('Error fetching popular products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <div>
      <section className="mb-10">
        <div className="bg-indigo-700 text-white rounded-xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">Discover Products Tailored to You</h1>
          <p className="text-xl mb-6">
            Our AI-powered recommendation system finds the perfect products to match your needs and preferences.
          </p>
          <a 
            href="/recommendations" 
            className="inline-block bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium"
          >
            Get Personalized Recommendations
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Popular Products</h2>
        
        {loading ? (
          <p className="text-center py-10">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-10">{error}</p>
        ) : (
          <ProductGrid products={popularProducts} />
        )}
      </section>
    </div>
  );
};

export default HomePage;
