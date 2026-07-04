import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed.");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Set a new password</h2>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>New password (min 8 characters, 1 number)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn-primary">Reset password</button>
        </form>
        <div className="auth-links"><Link to="/login">Back to login</Link></div>
      </div>
    </div>
  );
};

export default ResetPassword;
