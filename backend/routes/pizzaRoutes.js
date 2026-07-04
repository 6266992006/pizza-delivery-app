import express from "express";
import { getPizzaOptions } from "../controllers/pizzaController.js";

const router = express.Router();

router.get("/options", getPizzaOptions);

export default router;
