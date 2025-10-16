import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import ManageSlots from "./ManageSlots";
import ManageBookings from "./ManageBookings";
import SlotMessages from "./SlotMessages";

function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [page, setPage] = useState("login"); // "login", "dashboard", "slots", "bookings", "messages"

  // Example: on login, set adminUser and navigate
  const handleLogin = (admin) => {
    setAdminUser(admin);
    setPage("dashboard");
  };

  const requireAuth = () => {
    if (!adminUser) {
      setPage("login");
      return false;
    }
    return true;
  };

  const renderPage = () => {
    if (page === "login") {
      return <AdminLogin onLogin={handleLogin} />;
    }
    if (!requireAuth()) return null;

    if (page === "dashboard") {
      return (
        <AdminDashboard
          adminUser={adminUser}
          onNavigate={(p) => setPage(p)}
          onLogout={() => {
            setAdminUser(null);
            setPage("login");
          }}
        />
      );
    }
    if (page === "slots") {
      return <ManageSlots onBack={() => setPage("dashboard")} />;
    }
    if (page === "bookings") {
      return <ManageBookings onBack={() => setPage("dashboard")} />;
    }
    if (page === "messages") {
      return <SlotMessages onBack={() => setPage("dashboard")} />;
    }

    return <div>Unknown admin page</div>;
  };
  return <div>{renderPage()}</div>;
}

export default App;

