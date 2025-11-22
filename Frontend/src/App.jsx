// src/App.jsx
import { useEffect, useState } from "react";
import api from "./api/apiClient";
import ChatWidget from "./components/ChatWidget";

function App() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("phat@example.com");
  const [password, setPassword] = useState("123456");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [message, setMessage] = useState("");

  // 📦 Lấy danh sách sản phẩm từ backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setError("");
        const res = await api.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError("Không tải được danh sách món ăn");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔐 Đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      setToken(token);
      setUserInfo(user);

      // lưu vào localStorage để F5 không mất
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Đăng nhập thành công!");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Đăng nhập thất bại, kiểm tra lại email / mật khẩu"
      );
    }
  };

  // 🚪 Đăng xuất
  const handleLogout = () => {
    setToken("");
    setUserInfo(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMessage("Đã đăng xuất");
  };

  // 🛒 Đặt 1 món (tạo order với 1 product, quantity = 1)
  const handleOrderOne = async (productId) => {
    if (!token) {
      setError("Bạn cần đăng nhập trước khi đặt món");
      return;
    }

    try {
      setMessage("");
      setError("");

      const res = await api.post(
        "/api/orders",
        {
          items: [
            {
              productId,
              quantity: 1,
            },
          ],
          note: "Đặt từ React demo",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Tạo đơn thành công! ID: ${res.data.orderId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Lỗi khi tạo đơn");
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
        fontFamily: "system-ui",
      }}
    >
      <h1>🍱 Food Ordering Demo (React + Node + MongoDB)</h1>

      {/* Khu vực login */}
      <section
        style={{
          marginTop: 24,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h2>🔐 Đăng nhập</h2>
        {userInfo ? (
          <>
            <p>
              Xin chào, <b>{userInfo.name}</b> ({userInfo.email})
            </p>
            <button onClick={handleLogout}>Đăng xuất</button>
          </>
        ) : (
          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxWidth: 320,
            }}
          >
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
            <label>
              Mật khẩu:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
            <button type="submit">Đăng nhập</button>
          </form>
        )}
      </section>

      {/* Thông báo */}
      {message && <p style={{ marginTop: 16, color: "green" }}>✅ {message}</p>}
      {error && <p style={{ marginTop: 16, color: "red" }}>⚠ {error}</p>}

      {/* Danh sách món ăn */}
      <section
        style={{
          marginTop: 32,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h2>📋 Danh sách món ăn</h2>
        {loadingProducts ? (
          <p>Đang tải...</p>
        ) : products.length === 0 ? (
          <p>Chưa có món nào. Hãy thêm bằng Postman trước.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {products.map((p) => (
              <li
                key={p._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  padding: "8px 0",
                }}
              >
                <div>
                  <div>
                    <b>{p.name}</b>
                  </div>
                  <div>Giá: {p.price} đ</div>
                  {p.category && <div>Loại: {p.category}</div>}
                </div>
                <button onClick={() => handleOrderOne(p._id)}>
                  Đặt món này
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <ChatWidget />
    </div>
  );
}

export default App;
