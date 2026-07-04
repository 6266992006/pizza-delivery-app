# 🍕 Pizza Hub — MERN Pizza Delivery Full-Stack App

A full-stack pizza ordering and inventory management platform built with **MongoDB, Express, React, Node.js**, and **Razorpay (test mode)**.

## Features implemented

**User side**
- Registration with email verification
- Login with JWT-based authorization
- Forgot / reset password flow (emailed link)
- Dashboard with order history and live-ish status (polling)
- 4-step custom pizza builder: base → sauce → cheese → vegetables (multi-select)
- Order summary page before payment
- Razorpay checkout (test mode) — clicking "Success" confirms the order
- Order status progression: Order Received → In Kitchen → Sent to Delivery → Delivered

**Admin side**
- Separate admin login (env-based credentials, not part of the user signup flow)
- Inventory dashboard for bases, sauces, cheeses, vegetables
- Stock automatically decremented after each order
- Manual stock update per item
- Hourly cron job (`node-cron`) that emails the admin when any item falls below its threshold
- Order management panel to view and update order status

## Project structure

```
pizza-delivery-app/
├── backend/
│   ├── config/db.js
│   ├── models/ (User, Inventory, Order)
│   ├── middleware/auth.js
│   ├── controllers/ (auth, admin, pizza, order)
│   ├── routes/ (auth, admin, pizza, order)
│   ├── utils/ (sendEmail, cronJobs, seedInventory)
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/ (Navbar, route guards, status tracker)
        └── pages/ (Home, Register, Login, Dashboard, PizzaBuilder, AdminLogin, AdminDashboard, ...)
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: MongoDB URI, JWT secret, email credentials, Razorpay TEST keys
npm run seed     # seeds starting inventory stock — run once
npm run dev      # starts on http://localhost:5000
```

You need a MongoDB instance — either install MongoDB locally or use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and paste its connection string into `MONGO_URI`.

For email (verification / reset / low-stock alerts), the easiest option is a Gmail account with an **App Password** (not your normal password) — search "Gmail app password nodemailer" for the 2-minute setup.

For Razorpay, sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com), grab your **Test Mode** Key ID and Key Secret, and paste them into `.env`. In test mode, the checkout popup has a "Success" button that simulates a completed payment — no real card needed.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev      # starts on http://localhost:5173
```

### 3. Admin login

Default admin credentials (change in `.env` before deploying anywhere real):
```
email: admin@pizzahub.com
password: Admin@1234
```
Go to `http://localhost:5173/admin/login` to access the admin panel.

## Notes on design choices

- Admin auth is a single env-based account rather than its own database model — this satisfies "separate login not accessible from the user registration flow" without over-engineering role management for a single admin. It's easy to extend into its own `Admin` model + collection later if you need multiple admin accounts.
- Order status updates use polling (every 8–10s) rather than WebSockets, since it's simpler to run and reason about for this scope. Swapping in `socket.io` later is a drop-in upgrade if you want true push updates.
- Pizza pricing is a flat rate (₹249) to keep the checkout flow focused on the required Razorpay integration rather than a full pricing engine — easy to extend with per-topping pricing later.
- Passwords are hashed with bcrypt; nothing is ever stored in plain text.

## Feature checklist mapping
live link :- https://pizza-delivery-frontend-5k81.onrender.com
Every checkbox from the assignment brief is implemented — see the **Features implemented** section above for the direct mapping.
