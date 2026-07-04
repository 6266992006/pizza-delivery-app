import { Link } from "react-router-dom";

const Home = () => (
  <div>
    <div className="dashboard-hero">
      <div className="container">
        <div className="eyebrow">Custom pizzas, made your way</div>
        <h1>Pizza Hub</h1>
        <p>Pick your base, sauce, cheese, and toppings — then track your order from the oven to your door.</p>
        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <Link to="/register" style={{ background: "#c1391f", color: "white", padding: "12px 22px", borderRadius: 999, fontWeight: 600 }}>Get started</Link>
          <Link to="/login" style={{ border: "1.5px solid #e8a93b", color: "#e8a93b", padding: "12px 22px", borderRadius: 999, fontWeight: 600 }}>Login</Link>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
