import React from "react";
import { useSelector } from "react-redux";
// StarfallBackground from App.jsx
function StarfallBackground() {
  return (
    <div className="starfall-bg">
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          style={{
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

// No demo bug data. Use real data or leave empty.
const bugColumns = [];

export default function Dashboard() {
  // Demo summary data
  const summary = {
    total: 9,
    new: 2,
    inProgress: 5,
    fixed: 2,
  };
  // Get logout handler from props or window (App passes it via window for now)
  const handleLogout = window.handleLogout || (() => {});
  // Get user from Redux
  const user = useSelector(state => state.user.user);
  return (
    <div className="bugtracker-analytics-root" style={{position:'relative'}}>
      <StarfallBackground />
      {/* Top Navbar */}
      <nav className="bugtracker-admin-navbar">
        <div className="bugtracker-admin-navbar-left">
          <span className="bugtracker-admin-navbar-logo">🐞</span>
          <span className="bugtracker-admin-navbar-title">Bug Tracker Dashboard ADMIN</span>
        </div>
        <ul className="bugtracker-admin-navbar-links">
          <li>Dashboard</li>
          <li>Issues</li>
          <li>Projects</li>
        </ul>
        <div className="bugtracker-admin-navbar-user">
          <span className="bugtracker-admin-navbar-avatar" />
          <span className="bugtracker-admin-navbar-username">{user?.email || "Admin"}</span>
          <button className="btn btn-secondary" style={{marginLeft:12}} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Summary Panel */}
      <section className="bugtracker-summary-panel">
        <div className="bugtracker-summary-title">BUGS SUMMARY</div>
        <div className="bugtracker-summary-desc">Overview Of Identified Bugs.</div>
        <div className="bugtracker-summary-table">
          <div className="bugtracker-summary-row bugtracker-summary-header">
            <div className="bugtracker-summary-cell">Name</div>
            <div className="bugtracker-summary-cell">Total Bugs</div>
            <div className="bugtracker-summary-cell">New Bugs</div>
            <div className="bugtracker-summary-cell">In Progress Bugs</div>
            <div className="bugtracker-summary-cell">Fixed Bugs</div>
          </div>
          <div className="bugtracker-summary-row">
            <div className="bugtracker-summary-cell">Analytics</div>
            <div className="bugtracker-summary-cell">{summary.total}</div>
            <div className="bugtracker-summary-cell">
              22.2% <span className="bugtracker-summary-bar"><span style={{width:'22.2%',background:'#2563eb'}} /></span>
            </div>
            <div className="bugtracker-summary-cell">
              55.6% <span className="bugtracker-summary-bar"><span style={{width:'55.6%',background:'#f59e42'}} /></span>
            </div>
            <div className="bugtracker-summary-cell">
              22.2% <span className="bugtracker-summary-bar"><span style={{width:'22.2%',background:'#22c55e'}} /></span>
            </div>
          </div>
        </div>
      </section>
      {/* Bugs Lifecycle */}
      <section className="bugtracker-lifecycle-panel">
        <div className="bugtracker-summary-title">BUGS LIFECYCLE</div>
        <div className="bugtracker-summary-desc">Bug Progression Stages.</div>
        <div className="bugtracker-lifecycle-columns">
          {bugColumns.map(col => (
            <div className="bugtracker-lifecycle-col" key={col.status}>
              <div className="bugtracker-lifecycle-col-header" style={{color:col.color}}>
                <span className="bugtracker-lifecycle-col-dot" style={{background:col.color}} />
                {col.status} <span className="bugtracker-lifecycle-col-count">{col.count}</span>
              </div>
              <div className="bugtracker-lifecycle-cards">
                {col.bugs.map(bug => (
                  <div className="bugtracker-lifecycle-card" key={bug.title}>
                    <div className="bugtracker-lifecycle-card-title">🐞 {bug.title}</div>
                    <div className="bugtracker-lifecycle-card-desc">{bug.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
