import mongoose from "mongoose";

// Single-document collection tracking stock levels for every ingredient category
const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    threshold: { type: Number, required: true, default: 20 },
  },
  { _id: false }
);

const inventorySchema = new mongoose.Schema(
  {
    bases: [itemSchema],
    sauces: [itemSchema],
    cheeses: [itemSchema],
    vegetables: [itemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
