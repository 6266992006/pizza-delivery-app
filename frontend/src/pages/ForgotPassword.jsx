import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Reset your password</h2>
        <p className="sub">We'll email you a link to reset it.</p>
        {message && <div className="success-msg">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <button className="btn-primary" disabled={loading}>{loading ? "Sending..." : "Send reset link"}</button>
        </form>
        <div className="auth-links"><Link to="/login">Back to login</Link></div>
      </div>
    </div>
  );
};

export default ForgotPassword;
