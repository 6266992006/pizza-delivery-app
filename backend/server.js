import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./config/db.js";
import { startLowStockCron } from "./utils/cronJobs.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import pizzaRoutes from "./routes/pizzaRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";


console.log("KEY:", process.env.RAZORPAY_KEY_ID);
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pizza", pizzaRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => res.send("Pizza Delivery API is running"));

startLowStockCron();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));