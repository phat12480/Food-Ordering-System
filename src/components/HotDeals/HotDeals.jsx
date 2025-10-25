// src/components/HotDeals/HotDeals.jsx
import React from "react";
import FoodCard from "../FoodCard/FoodCard";
import "./HotDeals.css";

const HotDeals = ({ deals, onAddToCart }) => {
  return (
    <section className="hot-deals-section">
      <div className="hot-deals-container">
        <div className="section-header">
          <div className="section-title-wrapper">
            <h2 className="section-title">🔥 Ưu đãi hôm nay</h2>
            <p className="section-subtitle">
              Món ngon - Giá tốt - Giảm sốc đến 50%
            </p>
          </div>
          <button className="view-all-button">
            Xem tất cả
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="deals-grid">
          {deals.map((deal) => (
            <FoodCard key={deal.id} item={deal} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotDeals;
