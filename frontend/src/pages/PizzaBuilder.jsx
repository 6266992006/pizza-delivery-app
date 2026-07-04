import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const STEPS = ["Base", "Sauce", "Cheese", "Vegetables", "Summary"];
const PRICE = 249;

const PizzaBuilder = () => {
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState(null);
  const [selection, setSelection] = useState({ base: "", sauce: "", cheese: "", vegetables: [] });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/pizza/options");
        setOptions(data);
      } catch (err) {
        setError("Could not load pizza options. Please make sure the backend inventory has been seeded.");
      }
    };
    load();
  }, []);

  const toggleVeg = (name) => {
    setSelection((s) => ({
      ...s,
      vegetables: s.vegetables.includes(name)
        ? s.vegetables.filter((v) => v !== name)
        : [...s.vegetables, name],
    }));
  };

  const canProceed = () => {
    if (step === 0) return !!selection.base;
    if (step === 1) return !!selection.sauce;
    if (step === 2) return !!selection.cheese;
    return true;
  };

  const handleCheckout = async () => {
    setError("");
    setPlacing(true);
    try {
      const { data } = await api.post("/orders/create-payment");
      const { razorpayOrder, keyId, amount } = data;

      const rzp = new window.Razorpay({
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Pizza Hub",
        description: `Custom pizza — ₹${amount}`,
        order_id: razorpayOrder.id,
        // In TEST MODE, clicking "Success" in the Razorpay popup fires this handler
        handler: async (response) => {
          try {
            const order = await api.post("/orders", {
              ...selection,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            navigate("/dashboard");
          } catch (err) {
            setError(err.response?.data?.message || "Order could not be confirmed after payment.");
          }
        },
        theme: { color: "#c1391f" },
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Could not start checkout.");
    } finally {
      setPlacing(false);
    }
  };

  if (error && !options) {
    return <div className="section container"><div className="error-msg">{error}</div></div>;
  }
  if (!options) return <div className="section container">Loading pizza options...</div>;

  const renderOptionGrid = (category, selected, onSelect, multi = false) => (
    <div className="option-grid">
      {options[category].map((item) => {
        const isSelected = multi ? selected.includes(item.name) : selected === item.name;
        return (
          <div
            key={item.name}
            className={`option-card ${isSelected ? "selected" : ""} ${!item.inStock ? "out-of-stock" : ""}`}
            onClick={() => item.inStock && onSelect(item.name)}
          >
            {item.name}
            {!item.inStock && <div style={{ fontSize: "0.7rem", color: "#c1391f", marginTop: 4 }}>Out of stock</div>}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="section container">
      <h2>Build your pizza</h2>
      <div className="builder-steps">
        {STEPS.map((label, i) => (
          <div key={label} className={`builder-step ${i === step ? "active" : i < step ? "complete" : ""}`}>
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {error && <div className="error-msg">{error}</div>}

      {step === 0 && renderOptionGrid("bases", selection.base, (v) => setSelection({ ...selection, base: v }))}
      {step === 1 && renderOptionGrid("sauces", selection.sauce, (v) => setSelection({ ...selection, sauce: v }))}
      {step === 2 && renderOptionGrid("cheeses", selection.cheese, (v) => setSelection({ ...selection, cheese: v }))}
      {step === 3 && renderOptionGrid("vegetables", selection.vegetables, toggleVeg, true)}

      {step === 4 && (
        <div className="summary-card">
          <h3 style={{ marginBottom: 16 }}>Order summary</h3>
          <div className="summary-row"><span>Base</span><span>{selection.base}</span></div>
          <div className="summary-row"><span>Sauce</span><span>{selection.sauce}</span></div>
          <div className="summary-row"><span>Cheese</span><span>{selection.cheese}</span></div>
          <div className="summary-row"><span>Vegetables</span><span>{selection.vegetables.join(", ") || "None"}</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{PRICE}</span></div>
          <button className="btn-primary" style={{ marginTop: 20 }} onClick={handleCheckout} disabled={placing}>
            {placing ? "Starting checkout..." : "Pay & place order (Razorpay test mode)"}
          </button>
        </div>
      )}

      <div className="builder-nav">
        <button className="back-btn" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
        {step < 4 && (
          <button className="next-btn" disabled={!canProceed()} onClick={() => setStep(step + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default PizzaBuilder;
