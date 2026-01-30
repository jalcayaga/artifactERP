import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
    </div>
  );
};

export default StatsCard;
