import jwt from "jsonwebtoken";
import Inventory from "../models/Inventory.js";
import Order from "../models/Order.js";

const signAdminToken = () =>
  jwt.sign({ role: "admin", email: process.env.ADMIN_EMAIL }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// POST /api/admin/login  — deliberately separate from the user login flow/route
export const adminLogin = (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = signAdminToken();
    return res.json({ token, admin: { email } });
  }
  return res.status(401).json({ message: "Invalid admin credentials" });
};

// GET /api/admin/inventory
export const getInventory = async (req, res) => {
  const inventory = await Inventory.findOne();
  if (!inventory) return res.status(404).json({ message: "Inventory not seeded yet. Run npm run seed." });
  res.json(inventory);
};

// PUT /api/admin/inventory  — manual stock update for a single item
export const updateInventoryItem = async (req, res) => {
  try {
    const { category, name, stock, threshold } = req.body;
    const validCategories = ["bases", "sauces", "cheeses", "vegetables"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const inventory = await Inventory.findOne();
    if (!inventory) return res.status(404).json({ message: "Inventory not found" });

    const item = inventory[category].find((i) => i.name === name);
    if (!item) return res.status(404).json({ message: "Item not found in category" });

    if (stock !== undefined) item.stock = stock;
    if (threshold !== undefined) item.threshold = threshold;

    await inventory.save();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: "Failed to update inventory", error: err.message });
  }
};

// GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
};

// PUT /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Order Received", "In Kitchen", "Sent to Delivery", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status", error: err.message });
  }
};
