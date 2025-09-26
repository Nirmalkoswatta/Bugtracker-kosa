import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { useTheme } from "../contexts/ThemeContext";

export default function BugReports({ projectId, project }) {
  const [bugs, setBugs] = useState([]);
  const [reportType, setReportType] = useState('summary');
  const { colors } = useTheme();

  useEffect(() => {
    const bugsRef = ref(db, `projects/${projectId}/bugs`);
    const unsubscribe = onValue(bugsRef, (snapshot) => {
      const data = snapshot.val();
      const bugList = data ? Object.values(data) : [];
      setBugs(bugList);
    });
    return () => unsubscribe();
  }, [projectId]);

  const getStats = () => {
    const total = bugs.length;
    const open = bugs.filter(b => b.status === 'open').length;
    const inProgress = bugs.filter(b => b.status === 'in-progress').length;
    const closed = bugs.filter(b => b.status === 'closed').length;
    
    const severityStats = {
      high: bugs.filter(b => b.severity === 'high').length,
      medium: bugs.filter(b => b.severity === 'medium').length,
      low: bugs.filter(b => b.severity === 'low').length
    };

    const assigneeStats = {};
    bugs.forEach(bug => {
      const assignee = bug.assignee || 'Unassigned';
      assigneeStats[assignee] = (assigneeStats[assignee] || 0) + 1;
    });

    return {
      total,
      byStatus: { open, inProgress, closed },
      bySeverity: severityStats,
      byAssignee: assigneeStats,
      completionRate: total > 0 ? ((closed / total) * 100).toFixed(1) : 0
    };
  };

  const stats = getStats();

  const exportToCSV = () => {
    const headers = ['Title', 'Description', 'Severity', 'Status', 'Assignee', 'Created By', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...bugs.map(bug => [
        `"${bug.title.replace(/"/g, '""')}"`,
        `"${bug.description.replace(/"/g, '""')}"`,
        bug.severity,
        bug.status,
        bug.assignee || 'Unassigned',
        bug.createdBy,
        new Date(bug.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${project.name}-bug-report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className={`${colors.primary} p-4 md:p-6 rounded-lg`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className={`text-2xl font-bold ${colors.text}`}>Bug Reports</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setReportType('summary')}
            className={`px-4 py-2 rounded ${
              reportType === 'summary' ? 'bg-blue-600 text-white' : `${colors.accent} ${colors.textSecondary}`
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setReportType('detailed')}
            className={`px-4 py-2 rounded ${
              reportType === 'detailed' ? 'bg-blue-600 text-white' : `${colors.accent} ${colors.textSecondary}`
            }`}
          >
            Detailed
          </button>
          <button
            onClick={exportToCSV}
            className={`px-4 py-2 rounded ${colors.success} text-white hover:opacity-80`}
          >
            📊 Export CSV
          </button>
          <button
            onClick={printReport}
            className={`px-4 py-2 rounded ${colors.info} text-white hover:opacity-80`}
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {reportType === 'summary' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overall Stats */}
          <div className={`${colors.secondary} p-4 rounded-lg`}>
            <h3 className={`font-semibold mb-3 ${colors.text}`}>Overall Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={colors.textSecondary}>Total Bugs:</span>
                <span className={colors.text}>{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className={colors.textSecondary}>Completion Rate:</span>
                <span className={colors.text}>{stats.completionRate}%</span>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className={`${colors.secondary} p-4 rounded-lg`}>
            <h3 className={`font-semibold mb-3 ${colors.text}`}>Status Distribution</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-red-400">Open:</span>
                <span className={colors.text}>{stats.byStatus.open}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400">In Progress:</span>
                <span className={colors.text}>{stats.byStatus.inProgress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">Closed:</span>
                <span className={colors.text}>{stats.byStatus.closed}</span>
              </div>
            </div>
          </div>

          {/* Severity Distribution */}
          <div className={`${colors.secondary} p-4 rounded-lg`}>
            <h3 className={`font-semibold mb-3 ${colors.text}`}>Severity Distribution</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-red-400">High:</span>
                <span className={colors.text}>{stats.bySeverity.high}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400">Medium:</span>
                <span className={colors.text}>{stats.bySeverity.medium}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">Low:</span>
                <span className={colors.text}>{stats.bySeverity.low}</span>
              </div>
            </div>
          </div>

          {/* Assignee Distribution */}
          <div className={`${colors.secondary} p-4 rounded-lg md:col-span-2 lg:col-span-3`}>
            <h3 className={`font-semibold mb-3 ${colors.text}`}>Assignee Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {Object.entries(stats.byAssignee).map(([assignee, count]) => (
                <div key={assignee} className="flex justify-between">
                  <span className={colors.textSecondary}>{assignee.split('@')[0]}:</span>
                  <span className={colors.text}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={`${colors.secondary} rounded-lg overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${colors.accent}`}>
                <tr>
                  <th className={`px-4 py-3 text-left ${colors.text}`}>Title</th>
                  <th className={`px-4 py-3 text-left ${colors.text}`}>Severity</th>
                  <th className={`px-4 py-3 text-left ${colors.text}`}>Status</th>
                  <th className={`px-4 py-3 text-left ${colors.text}`}>Assignee</th>
                  <th className={`px-4 py-3 text-left ${colors.text}`}>Created</th>
                </tr>
              </thead>
              <tbody>
                {bugs.map((bug, index) => (
                  <tr key={bug.id} className={index % 2 === 0 ? colors.primary : colors.secondary}>
                    <td className={`px-4 py-3 ${colors.text}`}>{bug.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        bug.severity === 'high' ? 'bg-red-600' : 
                        bug.severity === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                      } text-white`}>
                        {bug.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        bug.status === 'open' ? 'bg-red-700' : 
                        bug.status === 'in-progress' ? 'bg-yellow-700' : 'bg-green-700'
                      } text-white`}>
                        {bug.status}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${colors.textSecondary}`}>
                      {bug.assignee ? bug.assignee.split('@')[0] : 'Unassigned'}
                    </td>
                    <td className={`px-4 py-3 ${colors.textSecondary}`}>
                      {new Date(bug.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}