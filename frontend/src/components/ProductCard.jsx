// File: frontend/src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, ragReason }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={product.image_url || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{product.type}</p>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {product.effects.map(effect => (
              <span 
                key={effect} 
                className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded"
              >
                {effect}
              </span>
            ))}
          </div>
        </div>
        
        {ragReason && (
          <div className="bg-amber-50 p-2 rounded-md mb-4 text-xs text-amber-800">
            <p>{ragReason}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">${product.price}</span>
          <Link 
            to={`/product/${product.id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
