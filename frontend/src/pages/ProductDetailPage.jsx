// File: frontend/src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/api';
import ProductGrid from '../components/ProductGrid';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(parseInt(id));
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-10">Product not found</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={product.image_url || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-500 mb-4">Category: {product.type}</p>
              </div>
              <div className="text-2xl font-bold">${product.price}</div>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {product.effects.map(effect => (
                  <span
                    key={effect}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                  >
                    {effect}
                  </span>
                ))}
              </div>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* RAG-enhanced insights */}
            {product.insightsFromRAG && product.insightsFromRAG.length > 0 && (
              <div className="bg-amber-50 p-4 rounded-md mb-6">
                <h3 className="font-semibold text-amber-800 mb-2">AI-Enhanced Insights</h3>
                <ul className="list-disc pl-5 text-amber-800">
                  {product.insightsFromRAG.map((insight, index) => (
                    <li key={index} className="mb-1">{insight}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'details'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'ingredients'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('ingredients')}
                >
                  Ingredients
                </button>
              </div>

              {activeTab === 'details' ? (
                <div>
                  <p className="mb-4">
                    <span className="font-semibold">Units Sold:</span> {product.sales_data.units_sold}
                  </p>
                  <p className="mb-4">
                    <span className="font-semibold">Last Month Revenue:</span> ${product.sales_data.last_month_revenue.toFixed(2)}
                  </p>
                </div>
              ) : (
                <div>
                  {product.ingredientDetails && product.ingredientDetails.length > 0 ? (
                    <div className="space-y-4">
                      {product.ingredientDetails.map(ingredient => (
                        <div key={ingredient.name} className="bg-gray-50 p-4 rounded">
                          <h4 className="font-semibold mb-2">{ingredient.name}</h4>
                          <p className="text-sm mb-2">{ingredient.properties}</p>
                          <div className="mb-2">
                            <span className="text-sm font-medium">Effects: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {ingredient.common_effects.map(effect => (
                                <span
                                  key={effect}
                                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                                >
                                  {effect}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm">{ingredient.benefits}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No detailed ingredient information available.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      {product.similarProducts && product.similarProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Products You Might Like</h2>
          <ProductGrid products={product.similarProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
