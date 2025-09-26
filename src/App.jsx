

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import Dashboard from "./components/Dashboard";
import Notification from "./components/Notification";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import GoogleLoginButton from "./components/GoogleLoginButton";
import { ThemeToggle, useTheme } from "./contexts/ThemeContext";

function StarfallBackground() {
  // 30 animated stars with random positions and delays
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

function AuthForm({ type, onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "", confirm: "", role: "User" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignUp = type === "signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        if (form.password !== form.confirm) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        // Save role to Firestore users collection
        try {
          const { getFirestore, doc, setDoc } = await import("firebase/firestore");
          const db = getFirestore();
          await setDoc(doc(db, "users", cred.user.uid), {
            email: form.email,
            role: form.role
          }, { merge: true });
        } catch (e) { /* ignore */ }
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-bg login-black-bg">
      <div className="login-form-card">
        <h2 className="login-title">{isSignUp ? "Create Account" : "User Login"}</h2>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="login-input-row modern-input-row">
            <input
              type="email"
              className="login-input"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
            <span className="login-input-icon">
              <svg width="24" height="24" fill="none" stroke="#18343a" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4.5"/><path d="M20 20c0-4-3.6-7-8-7s-8 3-8 7"/></svg>
            </span>
          </div>
          {/* Password */}
          <div className="login-input-row modern-input-row">
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
            <span className="login-input-icon">
              <svg width="24" height="24" fill="none" stroke="#18343a" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="11" width="12" height="7" rx="3.5"/><path d="M12 15v-2.5"/><circle cx="12" cy="8" r="2"/></svg>
            </span>
          </div>
          {/* Confirm Password (Sign Up only) */}
          {isSignUp && (
            <div className="login-input-row modern-input-row">
              <input
                type="password"
                className="login-input"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required
                autoComplete="new-password"
              />
              <span className="login-input-icon">
                <svg width="24" height="24" fill="none" stroke="#18343a" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="11" width="12" height="7" rx="3.5"/><path d="M12 15v-2.5"/><circle cx="12" cy="8" r="2"/></svg>
              </span>
            </div>
          )}
          {/* Role (Sign Up and Login) */}
          <div className="login-input-row modern-input-row">
            <select
              className="login-input"
              style={{ color: '#111' }}
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              required
            >
              <option value="QA">QA</option>
              <option value="Developer">Developer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="User">User</option>
            </select>
            <span className="login-input-icon">
              <svg width="24" height="24" fill="none" stroke="#18343a" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4.5"/><path d="M20 20c0-4-3.6-7-8-7s-8 3-8 7"/></svg>
            </span>
          </div>
          {error && (
            <div className="badge" style={{ background: '#ffe5e5', color: '#b91c1c', marginBottom: 16 }}>{error}</div>
          )}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (isSignUp ? "Creating Account..." : "Login...") : (isSignUp ? "Create Account" : "Login")}
          </button>
          <div className="divider mb-lg text-center" style={{ color: '#888' }}>or</div>
          <div className="google-btn-row">
            <GoogleLoginButton />
          </div>
        </form>
        <div className="mt-lg text-center">
          <button className="login-switch-btn" onClick={onSwitch} type="button">
            {isSignUp ? (
              <>Already have an account? <span className="login-switch-link">Sign In</span></>
            ) : (
              <>Don't have an account? <span className="login-switch-link">Sign Up</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState("signin");
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const { isDarkMode, colors } = useTheme();
  // Redirect to dashboard based on role after login
  useEffect(() => {
    if (user && user.role && typeof user.role === 'string') {
      const role = user.role.toLowerCase();
      if (role === 'qa') {
        setPage('qa-dashboard');
      } else if (role === 'developer') {
        setPage('developer-dashboard');
      } else if (role === 'project manager' || role === 'pm') {
        setPage('pm-dashboard');
      } else {
        setPage('dashboard');
      }
    }
  }, [user]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  // Admin credential warning state
  const [adminWarning, setAdminWarning] = useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Blocklist of default admin emails/usernames
        const adminBlocklist = [
          "admin@example.com",
          "admin@admin.com",
          "admin@gmail.com",
          "adminbayya"
        ];
        // Check for default admin credentials (customize as needed)
        const isDefaultAdmin =
          (adminBlocklist.includes(firebaseUser.email) ||
           adminBlocklist.includes(firebaseUser.displayName) ||
           (firebaseUser.displayName && firebaseUser.displayName.toLowerCase().includes("adminbayya")));
        if (isDefaultAdmin) {
          setAdminWarning(true);
        } else {
          setAdminWarning(false);
        }
        // Role-based login: get role from Firestore (users collection, doc id = uid)
        let role = isDefaultAdmin ? 'admin' : 'user';
        try {
          const { getFirestore, doc, getDoc } = await import("firebase/firestore");
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists() && userDoc.data().role) {
            role = userDoc.data().role;
          }
        } catch (e) {
          // fallback to default role
        }
        dispatch(setUser({
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid,
          provider: firebaseUser.providerId,
          role
        }));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Listen for bug notifications if logged in
  React.useEffect(() => {
    if (!user) return;
    // Listen to all projects the user is a member of
    // (Assume user's projects are under /projects with user in members)
    import("firebase/database").then(({ ref, onChildAdded, get, child }) => {
      const db = require("./firebase").db;
      const projectsRef = ref(db, "projects");
      get(projectsRef).then(snapshot => {
        if (!snapshot.exists()) return;
        const projects = snapshot.val();
        Object.entries(projects).forEach(([pid, proj]) => {
          if (proj.members && proj.members[user.email]) {
            // Listen for new bugs
            const bugsRef = ref(db, `projects/${pid}/bugs`);
            onChildAdded(bugsRef, (snap) => {
              const bug = snap.val();
              if (bug && bug.createdBy !== user.email) {
                showNotification(`New bug reported: ${bug.title}`, "info");
              }
            });
            // Listen for bug status changes
            Object.keys(proj.bugs || {}).forEach(bid => {
              const bugRef = ref(db, `projects/${pid}/bugs/${bid}`);
              onChildAdded(bugRef, (snap) => {
                const bug = snap.val();
                if (bug && bug.status && bug.updatedBy !== user.email) {
                  showNotification(`Bug status updated: ${bug.title} → ${bug.status}`, "info");
                }
              });
            });
          }
        });
      });
    });
  }, [user]);

  // Logout handler
  const handleLogout = () => {
    import("firebase/auth").then(({ signOut }) => signOut(auth));
    dispatch(setUser(null));
  };

  if (user) {
    if (adminWarning) {
      return <>
        <ThemeToggle />
        <div style={{
          background: '#181824',
          color: '#fff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          fontWeight: 600
        }}>
          <div style={{
            background: '#ef4444',
            color: '#fff',
            borderRadius: '1rem',
            padding: '2rem 2.5rem',
            boxShadow: '0 2px 16px 0 rgba(239,68,68,0.18)',
            marginBottom: '2rem',
            maxWidth: 480,
            textAlign: 'center'
          }}>
            <span style={{fontSize:'2.2rem',marginBottom:'1rem',display:'block'}}>⚠️</span>
            <div>Default admin credentials detected!<br/>Please change your admin email and password before using in production.</div>
          </div>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "success" })} 
        />
      </>;
    }
    // Expose logout handler for dashboard
    window.handleLogout = handleLogout;
    let DashboardComponent = null;
    if (user.role && typeof user.role === 'string') {
      const role = user.role.toLowerCase();
      if (role === 'admin') {
        DashboardComponent = Dashboard;
      } else if (role === 'qa' || page === 'qa-dashboard') {
        DashboardComponent = require('./components/QADashboard').default;
      } else if (role === 'developer' || page === 'developer-dashboard') {
        DashboardComponent = require('./components/DeveloperDashboard').default;
      } else if (role === 'project manager' || role === 'pm' || page === 'pm-dashboard') {
        DashboardComponent = require('./components/ProjectManagerDashboard').default;
      } else {
        DashboardComponent = () => <div style={{color:'#fff',padding:'2rem'}}>No dashboard available for your role.</div>;
      }
    }
    return DashboardComponent ? <>
      <DashboardComponent />
      <Notification 
        message={notification.message} 
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "success" })} 
      />
    </> : null;
  }
  return (
    <div className="login-black-bg">
      <nav className="login-navbar">
        <div className="login-navbar-center">
          <span className="bug-anim-icon">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g className="bug-body">
                <ellipse cx="18" cy="22" rx="8" ry="10" fill="#18343a" stroke="#fff" strokeWidth="2"/>
                <ellipse cx="18" cy="16" rx="4" ry="5" fill="#2563eb" stroke="#fff" strokeWidth="1.5"/>
                <ellipse cx="15.5" cy="15.5" rx="1" ry="1.5" fill="#fff"/>
                <ellipse cx="20.5" cy="15.5" rx="1" ry="1.5" fill="#fff"/>
                <path d="M10 10 Q18 2 26 10" stroke="#fff" strokeWidth="2" fill="none"/>
                <path d="M10 34 Q18 28 26 34" stroke="#fff" strokeWidth="2" fill="none"/>
                <path d="M10 22 L2 18" stroke="#fff" strokeWidth="2"/>
                <path d="M26 22 L34 18" stroke="#fff" strokeWidth="2"/>
              </g>
            </svg>
          </span>
          <span className="login-navbar-title">BUG TRACKER</span>
        </div>
      </nav>
      <StarfallBackground />
      <AuthForm
        type={page}
        onSwitch={() => setPage(page === "signin" ? "signup" : "signin")}
      />
      <Notification 
        message={notification.message} 
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "success" })} 
      />
    </div>
  );
}

export default App;
