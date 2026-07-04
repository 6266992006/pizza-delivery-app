import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in every field before submitting.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      setSuccess(data.message);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Create your account</h2>
        <p className="sub">Register to start building your own pizza.</p>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Jordan Lee" />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password (min 8 characters, 1 number)</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          <button className="btn-primary" disabled={loading}>{loading ? "Creating account..." : "Register"}</button>
        </form>
        <div className="auth-links">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
