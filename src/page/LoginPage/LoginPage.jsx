import React, { useState } from "react";
import "./LoginPage.css";
import { authAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(email, password);

      // Lưu token và user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      console.log("Login success:", response.data);

      // Redirect theo role
      const role = response.data.user.role;
      switch (role) {
        case "customer":
          navigate("/home"); // Thay /home → /dashboard
          break;
        case "owner":
          navigate("/dashboard");
          break;
        case "staff":
          navigate("/dashboard"); // Thay /staff-panel → /dashboard
          break;
        case "shipper":
          navigate("/dashboard"); // Thay /shipper-app → /dashboard
          break;
        default:
          navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const response = await authAPI.googleLogin();
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/home");
    } catch (error) {
      console.error("Google login failed:", error);
      setError("Đăng nhập Google thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Decoration */}
      <div className="bg-decoration bg-decoration-1"></div>
      <div className="bg-decoration bg-decoration-2"></div>

      {/* Login Card */}
      <div className="login-card">
        {/* Logo & Brand */}
        <div className="brand-container">
          <div className="logo-box">
            <svg
              className="logo-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 3L18 8.5V15.5L11 21L4 15.5V8.5L11 3Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 21V12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 12L18 8.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 12L4 8.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="brand-name">FastFood</h1>
          <p className="brand-tagline">Đặt món ngon - Giao nhanh chóng</p>
        </div>

        {/* Welcome Text */}
        <div className="welcome-text">
          <h2 className="welcome-title">Chào mừng trở lại!</h2>
          <p className="welcome-subtitle">Đăng nhập để tiếp tục đặt món</p>
        </div>
        {/* Error Message */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M3 7L12 13L21 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <input
                type="email"
                className="form-input"
                placeholder="example@email.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Mật khẩu
            </label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M12 17V17.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input password-input"
                placeholder="••••••••"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePassword}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="1"
                      y1="1"
                      x2="23"
                      y2="23"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="forgot-link">
            <a href="#forgot">Quên mật khẩu?</a>
          </div>

          {/* Login Button */}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">hoặc</span>
          <div className="divider-line"></div>
        </div>

        {/* Google Login */}
        <button className="btn-google" onClick={handleGoogleLogin}>
          <svg className="google-icon" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Đăng nhập bằng Google
        </button>

        {/* Sign Up Link */}
        <div className="signup-link">
          Chưa có tài khoản? <a href="#register">Đăng ký ngay</a>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">© 2025 FastFood System. All rights reserved.</div>
    </div>
  );
};

export default LoginPage;
