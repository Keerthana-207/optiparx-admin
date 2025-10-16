import React, { useState, useEffect } from "react";

function SlotMessages({ onBack }) {
  const [slot, setSlot] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/slots/latest-message");
      const data = await res.json();
      setHistory([data]);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSend = async () => {
    if (!slot || !message) {
      alert("Please enter both slot and message");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/slots/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      alert("Message sent!");
      fetchHistory();
    } catch (err) {
      alert("Error sending message: " + err.message);
    }
  };

  return (
    <div className="container">
      <button onClick={onBack} style={{margin: '10px 0'}}>← Back to Admin Dashboard</button>
      <h2>Slot Messages</h2>

      <div className="message-box">
        <label>Slot</label>
        <input value={slot} onChange={(e) => setSlot(e.target.value)} />

        <label>Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />

        <button onClick={handleSend}>Send Message</button>
      </div>

      <h3 style={{margin: '10px 0'}}>Recent Message</h3>
      {history.length === 0 ? (
        <p>No messages</p>
      ) : (
        history.map((h, idx) => (
          <div key={idx} className="message-box">
            <p>
              <strong>Slot:</strong> {h.slot} — {h.message}
            </p>
            <p>
              <em>At: {new Date(h.time).toLocaleString()}</em>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default SlotMessages;
