// src/page/GuestHomePage/GuestHomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GuestHomePage.css";

const GuestHomePage = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  // Mock data món ăn
  const deals = [
    {
      id: 1,
      name: "Combo Burger Phô Mai",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
      originalPrice: 89000,
      salePrice: 69000,
      discount: 22,
    },
    {
      id: 2,
      name: "Pizza Hải Sản",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
      originalPrice: 199000,
      salePrice: 149000,
      discount: 25,
    },
    {
      id: 3,
      name: "Gà Rán Giòn Tan",
      image:
        "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500",
      originalPrice: 129000,
      salePrice: 99000,
      discount: 23,
    },
    {
      id: 4,
      name: "Mì Ý Bò Bằm",
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500",
      originalPrice: 75000,
      salePrice: 59000,
      discount: 21,
    },
    {
      id: 5,
      name: "Phở Bò Đặc Biệt",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500",
      originalPrice: 65000,
      salePrice: 49000,
      discount: 25,
    },
    {
      id: 6,
      name: "Trà Sữa Trân Châu",
      image:
        "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=500",
      originalPrice: 45000,
      salePrice: 35000,
      discount: 22,
    },
  ];

  const handleAddToCart = (item) => {
    const savedCart = localStorage.getItem("cart");
    let cart = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cart.find((c) => c.id === item.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // ← FIX: Tính tổng quantity thay vì chỉ đếm số món
    const totalQuantity = cart.reduce(
      (total, item) => total + (item.quantity || 1),
      0
    );
    setCartCount(totalQuantity);

    alert(`Đã thêm "${item.name}" vào giỏ hàng!`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const scrollToDeals = () => {
    document.getElementById("hot-deals").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="guest-homepage">
      {/* HEADER */}
      <header className="header">
        <div className="header-container">
          <div className="logo" onClick={() => navigate("/")}>
            <div className="logo-icon">🍔</div>
            <span className="logo-text">FastFood</span>
            <nav className="nav">
              <a href="/" className="nav-link active">
                Trang chủ
              </a>
              <a href="/menu" className="nav-link">
                Đặt món
              </a>
              <a href="/orders" className="nav-link">
                Theo dõi đơn
              </a>
              <a href="/promotions" className="nav-link">
                Khuyến mãi
              </a>
            </nav>
          </div>

          <div className="header-actions">
            <button className="cart-btn" onClick={() => navigate("/cart")}>
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* LUÔN HIỂN THỊ AUTH BUTTONS */}
            <div className="auth-btns">
              <button className="btn-login" onClick={() => navigate("/login")}>
                Đăng nhập
              </button>
              <button
                className="btn-signup"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Đặt món ăn nhanh
              <br />
              <span className="highlight">Giao tận nơi trong vài phút</span>
            </h1>
            <p className="hero-subtitle">
              Thưởng thức những món ăn ngon nhất trong thành phố. Giao hàng
              nhanh chóng!
            </p>
            <button className="btn-cta" onClick={scrollToDeals}>
              Đặt món ngay →
            </button>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
              alt="Food"
            />
          </div>
        </section>

        {/* HOT DEALS */}
        <section className="hot-deals" id="hot-deals">
          <div className="container">
            <h2 className="section-title">🔥 Ưu đãi hôm nay</h2>
            <p className="section-subtitle">
              Món ngon - Giá tốt - Giảm sốc đến 50%
            </p>

            <div className="deals-grid">
              {deals.map((deal) => (
                <div key={deal.id} className="deal-card">
                  <div className="card-image">
                    <img src={deal.image} alt={deal.name} />
                    <span className="badge">-{deal.discount}%</span>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{deal.name}</h3>
                    <div className="card-price">
                      <span className="price-old">
                        {formatPrice(deal.originalPrice)}
                      </span>
                      <span className="price-new">
                        {formatPrice(deal.salePrice)}
                      </span>
                    </div>
                    <button
                      className="btn-add"
                      onClick={() => handleAddToCart(deal)}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <div>
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-col">
              <div className="footer-logo">
                <div className="logo-icon">🍔</div>
                <span>FastFood</span>
              </div>
              <p>
                Dịch vụ đặt đồ ăn nhanh, giao hàng tận nơi. Chất lượng - Nhanh
                chóng - Uy tín.
              </p>
            </div>

            <div className="footer-col">
              <h4>Liên kết nhanh</h4>
              <ul>
                <li>
                  <a href="/">Về chúng tôi</a>
                </li>
                <li>
                  <a href="/">Đặt món</a>
                </li>
                <li>
                  <a href="/">Theo dõi đơn hàng</a>
                </li>
                <li>
                  <a href="/">Khuyến mãi</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Hỗ trợ</h4>
              <ul>
                <li>
                  <a href="/">Trung tâm trợ giúp</a>
                </li>
                <li>
                  <a href="/">Chính sách giao hàng</a>
                </li>
                <li>
                  <a href="/">Chính sách đổi trả</a>
                </li>
                <li>
                  <a href="/">Điều khoản dịch vụ</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Liên hệ</h4>
              <ul>
                <li>📍 123 Nguyễn Huệ, Q.1, TP.HCM</li>
                <li>📞 1900-xxxx</li>
                <li>✉️ support@fastfood.vn</li>
                <li>🕐 8:00 - 22:00 hàng ngày</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 FastFood Online. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GuestHomePage;
