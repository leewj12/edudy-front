import React from 'react';

export default function StatCard({ label, value, highlight = false, color = 'bg-white', valueColor = 'text-black' }) {
  return (
    <div className={`rounded shadow-sm ${color} p-5`}>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className={`text-lg font-semibold ${highlight ? 'text-pink-600' : valueColor}`}>
        {value}
      </div>
    </div>
  );
}
