import axios from "axios";
/*Customer: customer@test.com / 123456
Owner: owner@test.com / 123456
Staff: staff@test.com / 123456
Shipper: shipper@test.com / 123456
*/
// Config axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api", // URL backend tương lai
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock data - giả lập database
const mockUsers = [
  {
    email: "customer@test.com",
    password: "123456",
    role: "customer",
    name: "Nguyễn Văn A",
  },
  {
    email: "owner@test.com",
    password: "123456",
    role: "owner",
    name: "Trần Thị B",
  },
  {
    email: "staff@test.com",
    password: "123456",
    role: "staff",
    name: "Lê Văn C",
  },
  {
    email: "shipper@test.com",
    password: "123456",
    role: "shipper",
    name: "Phạm Văn D",
  },
];

// Mock API functions - Giả lập các API call
export const authAPI = {
  // Login (giả lập)
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          resolve({
            data: {
              success: true,
              token: "mock-jwt-token-" + Date.now(),
              user: {
                email: user.email,
                name: user.name,
                role: user.role,
              },
            },
          });
        } else {
          reject({
            response: {
              data: {
                success: false,
                message: "Email hoặc mật khẩu không đúng!",
              },
            },
          });
        }
      }, 1000); // Giả lập delay network
    });
  },

  // Google login (giả lập)
  googleLogin: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            token: "mock-google-token-" + Date.now(),
            user: {
              email: "google@test.com",
              name: "Google User",
              role: "customer",
            },
          },
        });
      }, 1000);
    });
  },
};

// Khi có backend thật, chỉ cần uncomment và xóa mock functions
/*
export const authAPI = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  googleLogin: (token) => {
    return api.post('/auth/google', { token });
  }
};
*/

export default api;
