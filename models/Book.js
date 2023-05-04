const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, },
    subCategory: { type: String, required: true, },
    title: { type: String, required: true, },
    publisher: { type: String, required: true, },
    desc: { type: String },
    cover: { type: String, required: true },
    rating: { type: String },
    tags: { type: Array },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true }
  }
  ,
  { timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);
