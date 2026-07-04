import express from "express";
import { protectUser } from "../middleware/auth.js";
import { createPaymentOrder, createOrder, getMyOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-payment", protectUser, createPaymentOrder);
router.post("/", protectUser, createOrder);
router.get("/my-orders", protectUser, getMyOrders);

export default router;
