'use client';

import React from 'react';
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { ProductItem } from '../../lib/types';

interface ProductsTableProps {
  products: ProductItem[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  
  // Helper to color-code the status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'baked':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'available':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'out_of_stock':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Added By</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100">
            {products.length > 0 ? (
              products.map((product) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-gray-50/80 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 block">{product.name}</span>
                    <span className="text-xs text-gray-400">ID: #{product.id}</span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)} capitalize`}>
                      {product.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-700">{product.quantity}</span>
                      <span className="text-xs text-gray-400">{product.unit}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                        {product.addedBy.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-600 capitalize">{product.addedBy}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <MoreHorizontal size={32} className="opacity-20" />
                    <p>No products found matching your search.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Optional: Simple Pagination Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
        <span>Showing {products.length} results</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}