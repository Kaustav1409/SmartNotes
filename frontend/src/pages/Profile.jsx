import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../App.css";

function Profile() {
  const navigate = useNavigate();

  // Load user from localStorage (set at login)
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ─── Change Password State ──────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    // Validate
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPwError("New password must be different from current password.");
      return;
    }

    setPwLoading(true);

    try {
      await axiosInstance.post("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setPwSuccess("✅ Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(
        err.response?.data?.message || "Failed to update password. Please try again."
      );
    } finally {
      setPwLoading(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="hero">
        <h1>👤 My Profile</h1>
        <p>Manage your SmartNotes account</p>
      </div>

      {/* ── User Info Card ───────────────────────────────── */}
      <div className="profile-card">
        <div className="profile-avatar">
          {getInitials(user?.name)}
        </div>

        <div className="profile-info-row">
          <label>Full Name</label>
          <span>{user?.name || "Not Available"}</span>
        </div>

        <div className="profile-info-row">
          <label>Email Address</label>
          <span>{user?.email || "Not Available"}</span>
        </div>

        <div className="profile-info-row">
          <label>User ID</label>
          <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            {user?.id || "Not Available"}
          </span>
        </div>
      </div>

      {/* ── Change Password Card ─────────────────────────── */}
      <div className="profile-card">
        <h3 style={{ margin: "0 0 20px 0", color: "#1e293b" }}>
          🔒 Change Password
        </h3>

        {pwError && (
          <div className="alert alert-error">
            ⚠️ {pwError}
          </div>
        )}

        {pwSuccess && (
          <div className="alert alert-success">
            {pwSuccess}
          </div>
        )}

        <form className="auth-form" onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="current-password">Current Password</label>
            <input
              id="current-password"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              disabled={pwLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              disabled={pwLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={pwLoading}
            />
          </div>

          <button
            type="submit"
            className="btn-success btn-full"
            disabled={pwLoading}
          >
            {pwLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* ── Action Buttons ───────────────────────────────── */}
      <div className="profile-actions">
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-secondary"
        >
          ← Back to Dashboard
        </button>

        <button
          onClick={logout}
          className="btn-danger"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;