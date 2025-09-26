import React from "react";
import { useSelector } from "react-redux";
import StarfallBackground from "./StarfallBackground";

export default function ProjectManagerDashboard() {
  const user = useSelector(state => state.user.user);
  return (
    <div className="bugtracker-analytics-root" style={{position:'relative'}}>
      <StarfallBackground />
      <nav className="bugtracker-admin-navbar">
        <div className="bugtracker-admin-navbar-left">
          <span className="bugtracker-admin-navbar-logo">📊</span>
          <span className="bugtracker-admin-navbar-title">Project Manager Dashboard</span>
        </div>
        <div className="bugtracker-admin-navbar-user">
          <span className="bugtracker-admin-navbar-avatar" />
          <span className="bugtracker-admin-navbar-username">{user?.email || "Project Manager"}</span>
        </div>
      </nav>
      <section className="bugtracker-summary-panel">
        <div className="bugtracker-summary-title">Project Manager Panel</div>
        <div className="bugtracker-summary-desc">Project status, team assignments, and management tools will appear here.</div>
      </section>
    </div>
  );
}
