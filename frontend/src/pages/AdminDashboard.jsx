import { useEffect, useState } from "react";
import api from "../api/axios.js";

const STATUSES = ["Order Received", "In Kitchen", "Sent to Delivery", "Delivered"];

const AdminDashboard = () => {
  const [tab, setTab] = useState("inventory");
  const [inventory, setInventory] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const fetchInventory = async () => {
    try {
      const { data } = await api.get("/admin/inventory");
      setInventory(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load inventory");
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/admin/orders");
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchOrders();
    const interval = setInterval(() => {
      fetchInventory();
      fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStock = async (category, name, stock) => {
    try {
      const { data } = await api.put("/admin/inventory", { category, name, stock: Number(stock) });
      setInventory(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update stock");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await api.put(`/admin/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    }
  };

  return (
    <div className="section container">
      <h2>Admin control panel</h2>
      {error && <div className="error-msg">{error}</div>}

      <div className="admin-nav">
        <button className={tab === "inventory" ? "active" : ""} onClick={() => setTab("inventory")}>Inventory</button>
        <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Orders</button>
      </div>

      {tab === "inventory" && (
        <>
          {!inventory ? (
            <p>Loading inventory...</p>
          ) : (
            ["bases", "sauces", "cheeses", "vegetables"].map((category) => (
              <div key={category} style={{ marginBottom: 28 }}>
                <h3 style={{ textTransform: "capitalize", marginBottom: 10, fontSize: "1.1rem" }}>{category}</h3>
                <table className="admin-table">
                  <thead>
                    <tr><th>Item</th><th>Stock</th><th>Threshold</th><th>Update</th></tr>
                  </thead>
                  <tbody>
                    {inventory[category].map((item) => (
                      <StockRow key={item.name} item={item} category={category} onUpdate={updateStock} />
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </>
      )}

      {tab === "orders" && (
        <table className="admin-table">
          <thead>
            <tr><th>Customer</th><th>Pizza</th><th>Price</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.user?.name || "Unknown"}<br /><span style={{ fontSize: "0.8rem", color: "#7a6a5c" }}>{order.user?.email}</span></td>
                <td>{order.base}, {order.sauce}, {order.cheese}{order.vegetables?.length ? `, ${order.vegetables.join(", ")}` : ""}</td>
                <td>₹{order.price}</td>
                <td>
                  <select className="status-select" value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const StockRow = ({ item, category, onUpdate }) => {
  const [value, setValue] = useState(item.stock);
  const isLow = item.stock < item.threshold;

  return (
    <tr>
      <td>{item.name}</td>
      <td className={isLow ? "low-stock" : ""}>{item.stock}{isLow && " ⚠"}</td>
      <td>{item.threshold}</td>
      <td>
        <input className="stock-input" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        <button style={{ marginLeft: 8, padding: "6px 12px", borderRadius: 8, background: "#4c7a52", color: "white" }} onClick={() => onUpdate(category, item.name, value)}>
          Save
        </button>
      </td>
    </tr>
  );
};

export default AdminDashboard;
