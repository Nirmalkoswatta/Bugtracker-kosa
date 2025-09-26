import React from "react";

// Demo bug data for columns
const bugColumns = [
  { status: "Open", color: "#888", count: 2, bugs: [
    { title: "Login Button Not Working", desc: "The login button on the homepage does not respond." },
    { title: "UI glitch on dashboard", desc: "Sidebar overlaps content on mobile." },
  ]},
  { status: "Can't Reproduce", color: "#b3b3c6", count: 1, bugs: [
    { title: "Incorrect Total Price in Shopping Cart", desc: "Total price sometimes shows as 0." },
  ]},
  { status: "In Progress", color: "#2563eb", count: 2, bugs: [
    { title: "Incorrect Total Price in Shopping Cart", desc: "Total price sometimes shows as 0." },
    { title: "Profile image upload fails", desc: "Error 500 when uploading large images." },
  ]},
  { status: "Rejected", color: "#ef4444", count: 2, bugs: [
    { title: "Broken Links on Footer", desc: "Several links in the footer of the website are broken." },
    { title: "Typo in About Page", desc: "Misspelled word in About page." },
  ]},
  { status: "Closed", color: "#22c55e", count: 1, bugs: [
    { title: "Slow Page Load Times on Mobile", desc: "Page loads slowly on mobile devices." },
  ]},
];

export default function Dashboard() {
  // Demo summary data
  const summary = {
    total: 9,
    new: 2,
    inProgress: 5,
    fixed: 2,
  };
  return (
    <div className="bugtracker-analytics-root">
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
          <span className="bugtracker-admin-navbar-username">Admin</span>
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
