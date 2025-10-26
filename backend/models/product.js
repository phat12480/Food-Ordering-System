import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
  category: String,
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
