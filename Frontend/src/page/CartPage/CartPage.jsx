// src/page/CartPage/CartPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const shippingFee = 15000;
  const taxRate = 0.1; // 10%

  useEffect(() => {
    // Check login
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Vui lòng đăng nhập để xem giỏ hàng!");
      navigate("/login");
      return;
    }
    const userData = JSON.parse(user);
    setUserName(userData.name || "User");

    // Load cart
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const updateQuantity = (id, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + (item.salePrice || item.price) * (item.quantity || 1),
      0
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * taxRate;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + shippingFee + calculateTax();
  };

  const handleCheckout = () => {
    if (!address || !phone) {
      alert("Vui lòng điền đầy đủ địa chỉ và số điện thoại!");
      return;
    }

    const order = {
      items: cartItems,
      address,
      phone,
      note,
      paymentMethod,
      subtotal: calculateSubtotal(),
      shippingFee,
      tax: calculateTax(),
      total: calculateTotal(),
      createdAt: new Date().toISOString(),
    };

    // Clear cart
    localStorage.removeItem("cart");

    // Navigate to success page with order data
    navigate("/order-success", { state: { order } });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="cart-page">
      {/* HEADER */}
      <header className="cart-header">
        <div className="cart-header-container">
          <div className="logo" onClick={() => navigate("/home")}>
            <div className="logo-icon">🍔</div>
            <span className="logo-text">FastFood</span>
          </div>

          <div className="user-dropdown">
            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{userName}</span>
            <div className="dropdown-menu">
              <a href="/profile">👤 Trang cá nhân</a>
              <a href="/orders">📦 Đơn hàng của tôi</a>
              <hr />
              <a href="#logout" onClick={handleLogout}>
                🚪 Đăng xuất
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="cart-main">
        <div className="cart-container">
          <h1 className="page-title">🛒 Giỏ hàng của bạn</h1>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Giỏ hàng trống!</p>
              <button className="btn-back" onClick={() => navigate("/home")}>
                Quay lại menu
              </button>
            </div>
          ) : (
            <div className="cart-layout">
              {/* LEFT: Cart Items */}
              <div className="cart-items-section">
                <h2 className="section-title">
                  Danh sách món ({cartItems.length})
                </h2>
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-info">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-price">
                        {formatPrice(item.salePrice)}
                      </p>
                    </div>
                    <div className="item-quantity">
                      <button onClick={() => updateQuantity(item.id, -1)}>
                        −
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      {formatPrice(item.salePrice * (item.quantity || 1))}
                    </div>
                    <button
                      className="btn-remove"
                      onClick={() => removeItem(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {/* RIGHT: Delivery Info + Summary */}
              <div className="cart-summary-section">
                {/* Delivery Info */}
                <div className="delivery-card">
                  <h2 className="section-title">📍 Thông tin giao hàng</h2>
                  <div className="form-group">
                    <label>Địa chỉ giao hàng *</label>
                    <input
                      type="text"
                      placeholder="123 Nguyễn Huệ, Q.1, TP.HCM"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input
                      type="tel"
                      placeholder="0901234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Ghi chú</label>
                    <textarea
                      placeholder="Ví dụ: Giao trước cổng chính..."
                      rows="3"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="summary-card">
                  <h2 className="section-title">💰 Tóm tắt đơn hàng</h2>
                  <div className="summary-row">
                    <span>Tổng giá món:</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="summary-row">
                    <span>Phí giao hàng:</span>
                    <span>{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Thuế (10%):</span>
                    <span>{formatPrice(calculateTax())}</span>
                  </div>
                  <hr />
                  <div className="summary-row total">
                    <span>Tổng thanh toán:</span>
                    <span className="total-price">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>

                  {/* Payment Method */}
                  <div className="payment-method">
                    <h3>Phương thức thanh toán:</h3>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>💵 Thanh toán khi nhận hàng (COD)</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="payment"
                        value="Online"
                        checked={paymentMethod === "Online"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>💳 Thanh toán trực tuyến</span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    <button
                      className="btn-back-menu"
                      onClick={() => navigate("/home")}
                    >
                      ← Quay lại menu
                    </button>
                    <button className="btn-checkout" onClick={handleCheckout}>
                      Xác nhận & Thanh toán
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
