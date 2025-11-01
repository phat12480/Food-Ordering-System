// src/page/AllFoodsPage/AllFoodsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AllFoodsPage.css";

const AllFoodsPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  // Mock data - Toàn bộ món ăn
  const allFoods = [
    {
      id: 1,
      name: "Combo Burger Phô Mai",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
      price: 69000,
      originalPrice: 89000,
      rating: 4.5,
      category: "burger",
      popular: true,
    },
    {
      id: 2,
      name: "Pizza Hải Sản",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
      price: 149000,
      originalPrice: 199000,
      rating: 4.8,
      category: "pizza",
      popular: true,
    },
    {
      id: 3,
      name: "Gà Rán Giòn Tan",
      image:
        "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500",
      price: 99000,
      originalPrice: 129000,
      rating: 4.6,
      category: "chicken",
      popular: true,
    },
    {
      id: 4,
      name: "Mì Ý Bò Bằm",
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500",
      price: 59000,
      originalPrice: 75000,
      rating: 4.3,
      category: "pasta",
      popular: false,
    },
    {
      id: 5,
      name: "Phở Bò Đặc Biệt",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500",
      price: 49000,
      originalPrice: 65000,
      rating: 4.7,
      category: "asian",
      popular: true,
    },
    {
      id: 6,
      name: "Trà Sữa Trân Châu",
      image:
        "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=500",
      price: 35000,
      originalPrice: 45000,
      rating: 4.4,
      category: "drink",
      popular: false,
    },
    {
      id: 7,
      name: "Burger Gà Teriyaki",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500",
      price: 65000,
      originalPrice: 85000,
      rating: 4.5,
      category: "burger",
      popular: false,
    },
    {
      id: 8,
      name: "Pizza Margherita",
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
      price: 129000,
      originalPrice: 169000,
      rating: 4.6,
      category: "pizza",
      popular: true,
    },
    {
      id: 9,
      name: "Gà Sốt BBQ",
      image:
        "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500",
      price: 109000,
      originalPrice: 139000,
      rating: 4.7,
      category: "chicken",
      popular: true,
    },
    {
      id: 10,
      name: "Cơm Gà Xối Mỡ",
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500",
      price: 45000,
      originalPrice: 55000,
      rating: 4.4,
      category: "asian",
      popular: false,
    },
    {
      id: 11,
      name: "Sinh Tố Dâu",
      image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500",
      price: 30000,
      originalPrice: 40000,
      rating: 4.2,
      category: "drink",
      popular: false,
    },
    {
      id: 12,
      name: "Bánh Mì Xíu Mại",
      image:
        "https://imgs.search.brave.com/b9c6N-r5pKepiQpD8FQ_90wFO0UikCyYcPOpaK6Dejc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3cy4xMjNyZi5j/b20vaW1hZ2VzL3Bh/dWxicmlnaHRvbi9w/YXVsYnJpZ2h0b24x/NTEyL3BhdWxicmln/aHRvbjE1MTIwMTQy/OC80OTM1NTk3NC1i/YW5oLW1pLXhpdS1t/YWktdmlldG5hbWVz/ZS1zYW5kd2ljaC13/aXRoLW1lYXRiYWxs/cy1pbi10b21hdG8t/c2F1Y2UtZG8tY2h1/YS1yYWRpc2gtYW5k/LWNhcnJvdC5qcGc",
      price: 25000,
      originalPrice: 30000,
      rating: 4.5,
      category: "asian",
      popular: true,
    },
  ];

  const categories = [
    { id: "all", name: "Tất cả", icon: "🍽️" },
    { id: "burger", name: "Burger", icon: "🍔" },
    { id: "pizza", name: "Pizza", icon: "🍕" },
    { id: "chicken", name: "Gà rán", icon: "🍗" },
    { id: "pasta", name: "Mì Ý", icon: "🍝" },
    { id: "asian", name: "Món Á", icon: "🍜" },
    { id: "drink", name: "Đồ uống", icon: "🥤" },
  ];

  const [filteredFoods, setFilteredFoods] = useState(allFoods);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name || "User");
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const totalQuantity = cart.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );
      setCartCount(totalQuantity);
    }
  }, []);

  useEffect(() => {
    let result = allFoods;

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((food) => food.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter((food) =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "popular":
        result = result.sort(
          (a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
        );
        break;
      case "price-asc":
        result = result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredFoods([...result]);
  }, [selectedCategory, searchTerm, sortBy]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = (item) => {
    const savedCart = localStorage.getItem("cart");
    let cart = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cart.find((c) => c.id === item.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      // ← FIX: Đổi "price" thành "salePrice" để match với CartPage
      cart.push({
        ...item,
        salePrice: item.price, // ← THÊM dòng này
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    const totalQuantity = cart.reduce(
      (total, item) => total + (item.quantity || 1),
      0
    );
    setCartCount(totalQuantity);

    showToast(`Đã thêm "${item.name}" vào giỏ hàng!`);
  };

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("popular");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="all-foods-page">
      {/* HEADER */}
      <header className="header">
        <div className="header-container">
          <div className="logo" onClick={() => navigate("/")}>
            <div className="logo-icon">🍔</div>
            <span className="logo-text">FastFood</span>
          </div>

          <nav className="nav">
            <a href="/" className="nav-link">
              Trang chủ
            </a>
            <a href="/menu" className="nav-link active">
              Đặt món
            </a>
            <a href="/orders" className="nav-link">
              Theo dõi đơn
            </a>
            <a href="/cart" className="nav-link">
              Giỏ hàng
            </a>
          </nav>

          <div className="header-actions">
            <button className="cart-btn" onClick={() => navigate("/cart")}>
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {userName ? (
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
            ) : (
              <div className="auth-btns">
                <button
                  className="btn-login"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="foods-main">
        <div className="foods-container">
          <h1 className="page-title">🍽️ Tất cả món ăn</h1>

          {/* Categories */}
          <div className="categories-bar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${
                  selectedCategory === cat.id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-left">
              <span className="result-count">
                Tìm thấy <strong>{filteredFoods.length}</strong> món
              </span>
            </div>
            <div className="filter-right">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Phổ biến nhất</option>
                <option value="rating">Đánh giá cao</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
              <button className="btn-reset" onClick={handleResetFilters}>
                🔄 Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Foods Grid */}
          <div className="foods-grid">
            {filteredFoods.map((food) => (
              <div key={food.id} className="food-card">
                <div className="food-image-wrapper">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="food-image"
                  />
                  {food.popular && (
                    <span className="popular-badge">🔥 HOT</span>
                  )}
                </div>
                <div className="food-content">
                  <h3 className="food-name">{food.name}</h3>
                  <div className="food-rating">
                    <span className="stars">⭐ {food.rating}</span>
                  </div>
                  <div className="food-price">
                    {food.originalPrice && (
                      <span className="price-original">
                        {formatPrice(food.originalPrice)}
                      </span>
                    )}
                    <span className="price-current">
                      {formatPrice(food.price)}
                    </span>
                  </div>
                  <button
                    className="btn-add-to-cart"
                    onClick={() => handleAddToCart(food)}
                  >
                    🛒 Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFoods.length === 0 && (
            <div className="empty-result">
              <p>😔 Không tìm thấy món ăn phù hợp</p>
              <button className="btn-reset" onClick={handleResetFilters}>
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllFoodsPage;
