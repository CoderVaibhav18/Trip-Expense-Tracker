// components/BalanceVisualization.js
import React from 'react';
import { FiUser } from 'react-icons/fi';
import { formatCurrency } from '../utils/formatUtils';

const BalanceVisualization = ({ balances, className = '' }) => {
  if (!balances || balances.length === 0) return null;

  // Find max absolute value for scaling
  const maxBalance = Math.max(
    ...balances.map(b => Math.abs(b.balance)),
    1 // Ensure we don't divide by zero
  );

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 shadow border border-blue-100 ${className}`}>
      <h3 className="text-lg font-bold text-blue-700 mb-4">Balance Overview</h3>
      <div className="space-y-4">
        {balances.map((b) => (
          <div key={b.user_id} className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div className="bg-blue-100 border-2 border-blue-200 rounded-xl w-8 h-8 flex items-center justify-center shadow-sm mr-3">
                  <FiUser className="text-blue-500" size={16} />
                </div>
                <span className="font-medium text-gray-800">{b.name}</span>
              </div>
              <span className={`font-medium ${
                b.balance > 0 
                  ? 'text-green-600' 
                  : b.balance < 0 
                    ? 'text-red-600' 
                    : 'text-gray-500'
              }`}>
                {b.balance > 0 
                  ? `+${formatCurrency(b.balance)}` 
                  : formatCurrency(b.balance)}
              </span>
            </div>
            
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              {b.balance !== 0 && (
                <div 
                  className={`h-full ${
                    b.balance > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.abs(b.balance) / maxBalance * 100}%`,
                    marginLeft: b.balance > 0 ? '0' : 'auto'
                  }}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BalanceVisualization;