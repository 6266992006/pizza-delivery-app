import Inventory from "../models/Inventory.js";

// GET /api/pizza/options — feeds the 4-step custom pizza builder on the frontend
export const getPizzaOptions = async (req, res) => {
  const inventory = await Inventory.findOne();
  if (!inventory) return res.status(404).json({ message: "Inventory not seeded yet. Run npm run seed." });

  const mapNames = (arr) => arr.map((i) => ({ name: i.name, inStock: i.stock > 0 }));

  res.json({
    bases: mapNames(inventory.bases),
    sauces: mapNames(inventory.sauces),
    cheeses: mapNames(inventory.cheeses),
    vegetables: mapNames(inventory.vegetables),
  });
};
