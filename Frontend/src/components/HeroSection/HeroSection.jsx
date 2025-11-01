// src/components/HeroSection/HeroSection.jsx
import React from "react";
import "./HeroSection.css";

const HeroSection = ({ onCTAClick }) => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Đặt món ăn nhanh
            <span className="hero-highlight"> Giao tận nơi</span>
          </h1>
          <p className="hero-subtitle">
            Thưởng thức những món ăn ngon nhất trong thành phố. Giao hàng nhanh
            chóng chỉ trong vài phút!
          </p>
          <button className="hero-cta-button" onClick={onCTAClick}>
            Đặt món ngay
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

          <div className="hero-features">
            <div className="feature-item">
              <div className="feature-icon">🚀</div>
              <div className="feature-text">
                <strong>Giao nhanh 30'</strong>
                <span>Cam kết giao hàng</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⭐</div>
              <div className="feature-text">
                <strong>Chất lượng A+</strong>
                <span>Đảm bảo vệ sinh</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💝</div>
              <div className="feature-text">
                <strong>Ưu đãi hấp dẫn</strong>
                <span>Giảm đến 50%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-image-circle"></div>
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
            alt="Delicious Food"
            className="hero-food-image"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
