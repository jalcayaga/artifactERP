import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description }) => {
  return (
    <div className="card-premium p-6">
      <h3 className="text-sm font-medium text-[rgb(var(--text-secondary))]uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-bold text-[rgb(var(--brand-color))] mt-2">{value}</p>
      {description && <p className="text-sm text-[rgb(var(--text-secondary))] mt-2 opacity-80">{description}</p>}
    </div>
  );
};

export default StatsCard;
