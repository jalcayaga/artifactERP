import React from "react";

interface PriceProps {
  amount: number;
  currencyCode: string;
}

const Price: React.FC<PriceProps> = ({ amount, currencyCode }) => {
  const formattedPrice = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);

  return <p className="text-xl font-bold text-brand">{formattedPrice}</p>;
};

export default Price;
