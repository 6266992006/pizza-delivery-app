import cron from "node-cron";
import Inventory from "../models/Inventory.js";
import { sendEmail } from "./sendEmail.js";

// Runs every hour and emails the admin if any ingredient has fallen below its configured threshold
export const startLowStockCron = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("Running scheduled low-stock inventory check...");
    try {
      const inventory = await Inventory.findOne();
      if (!inventory) return;

      const categories = ["bases", "sauces", "cheeses", "vegetables"];
      const lowItems = [];

      categories.forEach((category) => {
        inventory[category].forEach((item) => {
          if (item.stock < item.threshold) {
            lowItems.push(`${item.name} (${category}) — ${item.stock} left, threshold ${item.threshold}`);
          }
        });
      });

      if (lowItems.length > 0) {
        const html = `
          <h2>Low Stock Alert</h2>
          <p>The following items have fallen below their configured threshold:</p>
          <ul>${lowItems.map((i) => `<li>${i}</li>`).join("")}</ul>
        `;
        await sendEmail({
          to: process.env.ADMIN_NOTIFY_EMAIL,
          subject: "⚠️ Pizza Hub: Low Stock Alert",
          html,
        });
      }
    } catch (err) {
      console.error("Low-stock cron job failed:", err.message);
    }
  });
};
