

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

function FallingStarsBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black">
      <div className="falling-stars pointer-events-none absolute inset-0 w-full h-full" />
      <style>{`
        .falling-stars {
          position: absolute;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
        }
        .falling-stars span {
          position: absolute;
          top: -10px;
          width: 2px;
          height: 80px;
          background: linear-gradient(180deg, #fff 0%, #fff0 100%);
          opacity: 0.7;
          border-radius: 1px;
          animation: fall 2.5s linear infinite;
        }
        @keyframes fall {
          to {
            transform: translateY(110vh) scaleX(0.7);
            opacity: 0;
          }
        }
      `}</style>
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
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      {/* Glassmorphism Card */}
      <div className="auth-card backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        {/* Title */}
        <h2 className="text-4xl font-bold text-white mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Confirm Password Field (Sign Up only) */}
          {isSignUp && (
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-300 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-400/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </div>
            ) : (
              isSignUp ? "Create Account" : "Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <span className="mx-4 text-gray-300 text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>

          {/* Google Login Button */}
          <GoogleLoginButton />
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <button
            className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
            onClick={onSwitch}
            type="button"
          >
            {isSignUp ? (
              <>Already have an account? <span className="text-blue-400 font-semibold hover:text-blue-300">Sign In</span></>
            ) : (
              <>Don't have an account? <span className="text-blue-400 font-semibold hover:text-blue-300">Sign Up</span></>
            )}
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .auth-card {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
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
    <div className={`relative min-h-screen w-full overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
    }`}>
      <ThemeToggle />
      {isDarkMode && <FallingStarsBackground />}
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
