import React from "react";
import { useSelector } from "react-redux";
import StarfallBackground from "./StarfallBackground";

export default function QADashboard() {
  const user = useSelector(state => state.user.user);
  if (!user) {
    return (
      <div className="bugtracker-analytics-root" style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh'}}>
        <div style={{color:'#fff', fontSize:'1.2rem'}}>Loading QA Dashboard...</div>
      </div>
    );
  }
  // Example QA dashboard data
  const sampleBugs = [
    { id: 1, title: "Login page error", status: "Open", assignedTo: "dev1@example.com" },
    { id: 2, title: "Attachment upload fails", status: "In Progress", assignedTo: "dev2@example.com" },
    { id: 3, title: "UI glitch on dashboard", status: "Resolved", assignedTo: "dev3@example.com" },
  ];
  return (
    <div className="bugtracker-analytics-root" style={{position:'relative'}}>
      <StarfallBackground />
      <nav className="bugtracker-admin-navbar">
        <div className="bugtracker-admin-navbar-left">
          <span className="bugtracker-admin-navbar-logo">🧪</span>
          <span className="bugtracker-admin-navbar-title">QA Dashboard</span>
        </div>
        <div className="bugtracker-admin-navbar-user">
          <span className="bugtracker-admin-navbar-avatar" />
          <span className="bugtracker-admin-navbar-username">{user.email || "QA"}</span>
        </div>
      </nav>
      <section className="bugtracker-summary-panel">
        <div className="bugtracker-summary-title">QA Panel</div>
        <div className="bugtracker-summary-desc">Test cases, bug verification, and QA tasks will appear here.</div>
        <div className="qa-dashboard-bugs-list" style={{marginTop:'2rem'}}>
          <h3 style={{color:'#fff',marginBottom:'1rem'}}>Assigned Bugs</h3>
          <table style={{width:'100%',background:'rgba(0,0,0,0.3)',borderRadius:'1rem',color:'#fff'}}>
            <thead>
              <tr style={{background:'rgba(24,52,58,0.5)'}}>
                <th style={{padding:'0.5rem 1rem'}}>Title</th>
                <th style={{padding:'0.5rem 1rem'}}>Status</th>
                <th style={{padding:'0.5rem 1rem'}}>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {sampleBugs.map(bug => (
                <tr key={bug.id}>
                  <td style={{padding:'0.5rem 1rem'}}>{bug.title}</td>
                  <td style={{padding:'0.5rem 1rem'}}>{bug.status}</td>
                  <td style={{padding:'0.5rem 1rem'}}>{bug.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
