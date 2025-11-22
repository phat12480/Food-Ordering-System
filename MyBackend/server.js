import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();

// ===== MIDDLEWARE CƠ BẢN =====
app.use(cors());
app.use(express.json());

// ===== KẾT NỐI MONGODB =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ===== MODEL: USER =====
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// ===== MODEL: PRODUCT (bạn đã có, giữ nguyên ý tưởng) =====
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: String,
    image: String,
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

// ===== MODEL: ORDER =====
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // lưu giá tại thời điểm đặt
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "DELIVERING", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    note: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

// ===== HELPER: TẠO JWT =====
function createToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// ===== MIDDLEWARE: AUTH =====
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, role }
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
}

// ===== ROUTE KIỂM TRA =====
app.get("/", (req, res) => {
  res.send("✅ Server is running and connected to MongoDB 🚀");
});

// ================== AUTH (REGISTER / LOGIN) ==================

// ĐĂNG KÝ
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu name / email / password" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email đã được sử dụng" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    const token = createToken(user);
    res.status(201).json({
      message: "Đăng ký thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi đăng ký" });
  }
});

// ĐĂNG NHẬP
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email / password" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    const token = createToken(user);
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi đăng nhập" });
  }
});

// ================== PRODUCT CRUD ==================

// Lấy danh sách sản phẩm
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm sản phẩm (tạm thời cho phép ai cũng thêm, sau này chỉ admin)
app.post("/api/products", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật sản phẩm
app.put("/api/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa sản phẩm
app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑️ Đã xóa sản phẩm" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== ORDER (ĐƠN HÀNG) ==================

// Tạo đơn hàng – yêu cầu đăng nhập
app.post("/api/orders", authMiddleware, async (req, res) => {
  try {
    const { items, note } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Đơn hàng phải có ít nhất 1 món" });
    }

    // items: [{ productId, quantity }]
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res
        .status(400)
        .json({ message: "Một số sản phẩm không tồn tại hoặc đã bị xóa" });
    }

    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      return {
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const totalPrice = orderItems.reduce(
      (sum, it) => sum + it.quantity * it.price,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalPrice,
      note,
    });

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      orderId: order._id,
      status: order.status,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi tạo đơn" });
  }
});

// Lấy danh sách đơn của user đang đăng nhập
app.get("/api/orders/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get my orders error:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy đơn hàng" });
  }
});

// (Tuỳ chọn) Admin xem tất cả đơn
app.get("/api/orders", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Chỉ admin mới được xem tất cả đơn" });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách đơn" });
  }
});

// ===== MIDDLEWARE LỖI CHUNG =====
app.use((err, req, res, next) => {
  console.error("❌ Lỗi server:", err);
  res.status(500).json({ message: "Lỗi máy chủ" });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
