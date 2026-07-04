import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import {
  adminLogin,
  getInventory,
  updateInventoryItem,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/inventory", protectAdmin, getInventory);
router.put("/inventory", protectAdmin, updateInventoryItem);
router.get("/orders", protectAdmin, getAllOrders);
router.put("/orders/:id/status", protectAdmin, updateOrderStatus);

export default router;
