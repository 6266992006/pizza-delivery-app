import "dotenv/config";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const BASE_PRICE = 249; // flat price in test-mode paise-free rupees, kept simple for the assignment

// POST /api/orders/create-payment — Step before checkout: creates a Razorpay order in TEST mode
export const createPaymentOrder = async (req, res) => {
  try {
    const options = {
      amount: BASE_PRICE * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);
    res.json({ razorpayOrder, keyId: process.env.RAZORPAY_KEY_ID, amount: BASE_PRICE });
  } catch (err) {
    res.status(500).json({ message: "Failed to initiate payment", error: err.message });
  }
};

// POST /api/orders — called after the Razorpay checkout succeeds (test mode "Success" button)
export const createOrder = async (req, res) => {
  try {
    const { base, sauce, cheese, vegetables, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!base || !sauce || !cheese) {
      return res.status(400).json({ message: "Base, sauce, and cheese are all required" });
    }

    // Verify the Razorpay signature to confirm the payment was genuine
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const inventory = await Inventory.findOne();
    if (!inventory) return res.status(404).json({ message: "Inventory not found" });

    // Decrement stock for each selected ingredient
    const decrement = (category, name) => {
      const item = inventory[category].find((i) => i.name === name);
      if (item && item.stock > 0) item.stock -= 1;
    };
    decrement("bases", base);
    decrement("sauces", sauce);
    decrement("cheeses", cheese);
    (vegetables || []).forEach((v) => decrement("vegetables", v));
    await inventory.save();

    const order = await Order.create({
      user: req.user.id,
      base,
      sauce,
      cheese,
      vegetables: vegetables || [],
      price: BASE_PRICE,
      payment: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        status: "paid",
      },
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

// GET /api/orders/my-orders — polled by the dashboard for real-time-ish status updates
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
};