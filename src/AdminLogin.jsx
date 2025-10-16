import React, { useState } from "react";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    try {
      const res = await fetch("https://optiparx-backend.onrender.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", res.status);

      const data = await res.json();

      console.log("Response data:", data);

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Login successful, now call onLogin
      onLogin({ username }); // you can pass more info if needed

    } catch (err) {
      console.error("Login error:", err);
      alert("Login error: " + err.message);
    }
  };

  return (
    <div className="login-box">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="btn-container">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;
