

import React, { useState } from "react";
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
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
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
        await createUserWithEmailAndPassword(auth, form.email, form.password);
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
          <div className="login-input-row">
            <span className="login-input-icon">
              <svg width="32" height="32" fill="none" stroke="#18343a" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4.5"/><path d="M20 20c0-4-3.6-7-8-7s-8 3-8 7"/></svg>
            </span>
            <input
              id="email"
              type="email"
              className="login-input"
              placeholder="Username"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="username"
            />
          </div>
          <div className="login-input-row">
            <span className="login-input-icon">
              <svg width="32" height="32" fill="none" stroke="#18343a" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="11" width="12" height="7" rx="3.5"/><path d="M12 15v-2.5"/><circle cx="12" cy="8" r="2"/></svg>
            </span>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </div>
          {isSignUp && (
            <div className="login-input-row">
              <span className="login-input-icon">
                <svg width="32" height="32" fill="none" stroke="#18343a" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="11" width="12" height="7" rx="3.5"/><path d="M12 15v-2.5"/><circle cx="12" cy="8" r="2"/></svg>
              </span>
              <input
                id="confirm"
                type="password"
                className="login-input"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required
                autoComplete="new-password"
              />
            </div>
          )}
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

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setUser({
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid,
          provider: firebaseUser.providerId
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
    return <>
      <ThemeToggle />
      <Dashboard />
      <Notification 
        message={notification.message} 
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "success" })} 
      />
    </>;
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
