import React, { useState, useEffect } from "react";

function ManageSlots({ onBack }) {
  const [slots, setSlots] = useState([]);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [totalSlots, setTotalSlots] = useState(0);
  const [inputSlots, setInputSlots] = useState("");

  useEffect(() => {
    fetchSlotConfig();
    fetchReservedSlots();
  }, []);

  const fetchSlotConfig = async () => {
    try {
      const res = await fetch("https://optiparx-backend.onrender.com/api/slots/total-slots");
      const data = await res.json();
      setTotalSlots(data.totalSlots || 0);
      setInputSlots(data.totalSlots?.toString() || "");
      const generatedSlots = Array.from({ length: data.totalSlots }, (_, i) => `Slot ${i + 1}`);
      setSlots(generatedSlots);
    } catch (err) {
      console.error("Error fetching slot config:", err);
    }
  };

  const fetchReservedSlots = async () => {
    try {
      const res = await fetch("https://optiparx-backend.onrender.com/api/slots/reserved-slots");
      const data = await res.json();
      setReservedSlots(data.reservedSlots || []);
    } catch (err) {
      console.error("Error fetching reserved slots:", err);
    }
  };

  const handleSlotsChange = (e) => {
    const val = e.target.value;
    // Allow only numbers, max 100 slots for sanity
    if (/^\d*$/.test(val) && (val === "" || (parseInt(val) > 0 && parseInt(val) <= 100))) {
      setInputSlots(val);
    }
  };

  const updateTotalSlots = async () => {
    const slotsNum = parseInt(inputSlots);
    if (!slotsNum || slotsNum <= 0) {
      alert("Please enter a valid number of slots (1-100).");
      return;
    }
    try {
      const res = await fetch("https://optiparx-backend.onrender.com/api/slots/set-total-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalSlots: slotsNum }),
      });
      if (!res.ok) throw new Error("Failed to update slots");
      setTotalSlots(slotsNum);
      const generatedSlots = Array.from({ length: slotsNum }, (_, i) => `Slot ${i + 1}`);
      setSlots(generatedSlots);
      alert("Total slots updated successfully!");
    } catch (err) {
      alert("Error updating slots: " + err.message);
    }
  };

  return (
    <div className="container">
      <button onClick={onBack} style={{ margin: "10px 0" }}>
        ← Back to Admin Dashboard
      </button>
      <h2>Reserved Slots Overview</h2>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="totalSlotsInput" style={{ marginRight: "10px" }}>
          Total Parking Slots:
        </label>
        <input
          id="totalSlotsInput"
          type="text"
          value={inputSlots}
          onChange={handleSlotsChange}
          style={{ width: "50px", marginRight: "10px" }}
          placeholder="e.g. 20"
        />
        <button onClick={updateTotalSlots}>Update Slots</button>
      </div>

      <p>Configured Slots: {totalSlots}</p>

      <div className="slot-grid" style={{ display: "flex", flexWrap: "wrap" }}>
        {slots.length === 0 ? (
          <p>No slots configured</p>
        ) : (
          slots.map((slot, idx) => {
            const isReserved = reservedSlots.includes(slot);
            return (
              <div
                key={idx}
                className={`admin-slot ${isReserved ? "occupied" : "free"}`}
                style={{
                  backgroundColor: isReserved ? "#e57373" : "#aed581",
                  color: "#000",
                  padding: "10px",
                  margin: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  minWidth: "80px",
                }}
              >
                {slot}
                <div style={{ fontSize: "0.8em" }}>
                  Status: {isReserved ? "Occupied" : "Available"}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ManageSlots;
