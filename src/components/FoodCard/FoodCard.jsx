// src/components/FoodCard/FoodCard.jsx
import React from "react";
import "./FoodCard.css";

const FoodCard = ({ item, onAddToCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="food-card">
      <div className="food-card-image-wrapper">
        <img src={item.image} alt={item.name} className="food-card-image" />
        <div className="food-card-badge">-{item.discount}%</div>
      </div>

      <div className="food-card-content">
        <h3 className="food-card-title">{item.name}</h3>
        <p className="food-card-description">{item.description}</p>

        <div className="food-card-price">
          <span className="price-original">
            {formatPrice(item.originalPrice)}
          </span>
          <span className="price-sale">{formatPrice(item.salePrice)}</span>
        </div>

        <button className="food-card-button" onClick={() => onAddToCart(item)}>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
