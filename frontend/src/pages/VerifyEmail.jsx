import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);
        setMessage(data.message);
        setOk(true);
      } catch (err) {
        setMessage(err.response?.data?.message || "Verification failed.");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Email verification</h2>
        <p className={ok ? "success-msg" : "error-msg"}>{message}</p>
        {ok && <Link className="btn-secondary" to="/login" style={{ display: "block", textAlign: "center" }}>Go to login</Link>}
      </div>
    </div>
  );
};

export default VerifyEmail;
