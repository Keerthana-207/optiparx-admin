import React, { useState, useEffect } from "react";

function ManageBookings({ onBack }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/slots/all-bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Error fetching all bookings:", err);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!bookingId) return alert("Invalid booking ID");
    if (!window.confirm("Cancel this booking?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/slots/cancel-booking/${bookingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel");
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      alert("Booking cancelled");
    } catch (err) {
      alert("Error cancelling booking: " + err.message);
    }
  };

  // Map duration strings to minutes for expiration check
  const durationToMinutes = (duration) => {
    if (!duration) return 0;
    const map = {
      "30 min": 30,
      "1 hr": 60,
      "2 hrs": 120,
      "3 hrs": 180,
      "4 hrs": 240,
      "Full Day": 1440,
    };
    return map[duration] || parseInt(duration) || 0;
  };

  const isBookingExpired = (bookedAt, duration) => {
    const now = new Date();
    const endTime = new Date(bookedAt);
    endTime.setMinutes(endTime.getMinutes() + durationToMinutes(duration));
    return now > endTime;
  };

  return (
    <div className="container">
      <button onClick={onBack} style={{ margin: "10px 0" }}>
        ← Back to Admin Dashboard
      </button>
      <h2>All Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>User</th>
              <th>Slot</th>
              <th>Duration</th>
              <th>Booked At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const expired = isBookingExpired(b.bookedAt, b.duration);
              return (
                <tr key={b._id} style={{ backgroundColor: expired ? "#f8d7da" : "transparent" }}>
                  <td>{b.username}</td>
                  <td>{b.slot}</td>
                  <td>{b.duration}</td>
                  <td>{new Date(b.bookedAt).toLocaleString()}</td>
                  <td>
                    <span
                      className={expired ? "expired" : "active"}
                      style={{ color: expired ? "#a94442" : "#3c763d", fontWeight: "bold" }}
                    >
                      {expired ? "Expired" : "Active"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="danger"
                      onClick={() => handleCancel(b._id)}
                      disabled={expired}
                      title={expired ? "Cannot cancel expired booking" : "Cancel booking"}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageBookings;

