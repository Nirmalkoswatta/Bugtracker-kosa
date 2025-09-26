import React from "react";
import { useSelector } from "react-redux";
import StarfallBackground from "./StarfallBackground";

export default function DeveloperDashboard() {
  const user = useSelector(state => state.user.user);
  return (
    <div className="bugtracker-analytics-root" style={{position:'relative'}}>
      <StarfallBackground />
      <nav className="bugtracker-admin-navbar">
        <div className="bugtracker-admin-navbar-left">
          <span className="bugtracker-admin-navbar-logo">💻</span>
          <span className="bugtracker-admin-navbar-title">Developer Dashboard</span>
        </div>
        <div className="bugtracker-admin-navbar-user">
          <span className="bugtracker-admin-navbar-avatar" />
          <span className="bugtracker-admin-navbar-username">{user?.email || "Developer"}</span>
        </div>
      </nav>
      <section className="bugtracker-summary-panel">
        <div className="bugtracker-summary-title">Developer Panel</div>
        <div className="bugtracker-summary-desc">Assigned bugs, code reviews, and developer tasks will appear here.</div>
      </section>
    </div>
  );
}
