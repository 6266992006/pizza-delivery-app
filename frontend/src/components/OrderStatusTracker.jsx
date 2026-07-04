const STAGES = ["Order Received", "In Kitchen", "Sent to Delivery", "Delivered"];

// Signature UI element: a dotted progress line that fills in as the order advances
const OrderStatusTracker = ({ status }) => {
  const currentIndex = STAGES.indexOf(status);

  return (
    <div>
      <div className="status-tracker">
        {STAGES.map((stage, i) => (
          <div key={stage} style={{ display: "flex", alignItems: "center", flex: i < STAGES.length - 1 ? 1 : "initial" }}>
            <div className={`status-dot ${i < currentIndex ? "done" : i === currentIndex ? "active" : ""}`} title={stage} />
            {i < STAGES.length - 1 && <div className={`status-line ${i < currentIndex ? "done" : ""}`} />}
          </div>
        ))}
      </div>
      <span className="status-label">{status}</span>
    </div>
  );
};

export default OrderStatusTracker;
