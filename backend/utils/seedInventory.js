// One-time script to seed the inventory collection with starting stock.
// Run with: npm run seed
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Inventory from "../models/Inventory.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  const existing = await Inventory.findOne();
  if (existing) {
    console.log("Inventory already seeded. Delete the existing document first if you want to reseed.");
    process.exit(0);
  }

  await Inventory.create({
    bases: [
      { name: "Thin Crust", stock: 50, threshold: 20 },
      { name: "Thick Crust", stock: 50, threshold: 20 },
      { name: "Cheese Burst", stock: 50, threshold: 20 },
      { name: "Whole Wheat", stock: 50, threshold: 20 },
      { name: "Gluten Free", stock: 30, threshold: 15 },
    ],
    sauces: [
      { name: "Classic Tomato", stock: 50, threshold: 20 },
      { name: "Peri Peri", stock: 50, threshold: 20 },
      { name: "BBQ", stock: 50, threshold: 20 },
      { name: "Pesto", stock: 40, threshold: 15 },
      { name: "White Garlic", stock: 40, threshold: 15 },
    ],
    cheeses: [
      { name: "Mozzarella", stock: 60, threshold: 25 },
      { name: "Cheddar", stock: 50, threshold: 20 },
      { name: "Vegan Cheese", stock: 25, threshold: 10 },
    ],
    vegetables: [
      { name: "Onion", stock: 60, threshold: 20 },
      { name: "Capsicum", stock: 60, threshold: 20 },
      { name: "Mushroom", stock: 50, threshold: 20 },
      { name: "Sweet Corn", stock: 50, threshold: 20 },
      { name: "Olives", stock: 40, threshold: 15 },
      { name: "Jalapeno", stock: 40, threshold: 15 },
    ],
  });

  console.log("Inventory seeded successfully.");
  process.exit(0);
};

seed();
