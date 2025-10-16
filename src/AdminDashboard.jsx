import React from "react";

function AdminDashboard({ adminUser, onNavigate, onLogout }) {
  return (
    <div className="dashboard-container">
      <h2>Welcome Admin</h2>
      <div className="btn-container">
        <button onClick={() => onNavigate("slots")}>Manage Slots</button>
        <button onClick={() => onNavigate("bookings")}>Manage Bookings</button>
        <button onClick={() => onNavigate("messages")}>Slot Messages</button>
        <button className="danger" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
