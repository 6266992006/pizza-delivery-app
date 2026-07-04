import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import OrderStatusTracker from "../components/OrderStatusTracker.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my-orders");
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll every 8 seconds so status changes made by admin reflect near-real-time
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="dashboard-hero">
        <div className="container">
          <div className="eyebrow">Welcome back</div>
          <h1>{user?.name || "Pizza lover"}</h1>
          <p>Craft a custom pie exactly how you like it, or check the status of what's already in the oven.</p>
        </div>
      </div>

      <div className="section container">
        <div className="cta-tile">
          <div>
            <h2 style={{ color: "white" }}>Ready for a fresh pizza?</h2>
            <p style={{ margin: "6px 0 0", color: "#fce7df" }}>Pick your base, sauce, cheese, and toppings in four quick steps.</p>
          </div>
          <Link to="/build">Start building →</Link>
        </div>
      </div>

      <div className="section container">
        <h2>Your orders</h2>
        {loading ? (
          <p>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders yet. Your first pizza is one click away.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div>
                  <strong>{order.base}</strong> · {order.sauce} · {order.cheese}
                  <div className="meta">
                    {order.vegetables?.length ? order.vegetables.join(", ") : "No extra veggies"} · ₹{order.price}
                  </div>
                </div>
                <OrderStatusTracker status={order.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
