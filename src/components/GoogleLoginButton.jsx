import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser, setError, setLoading } from "../store/userSlice";

export default function GoogleLoginButton() {
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    dispatch(setLoading(true));
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      dispatch(setUser({
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        uid: result.user.uid,
        provider: "google"
      }));
    } catch (err) {
      dispatch(setError(err.message));
    }
    dispatch(setLoading(false));
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg shadow-lg hover:bg-white/20 hover:shadow-xl focus:ring-4 focus:ring-white/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> 
          <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.375 0-6.148-2.789-6.148-6.148 0-3.359 2.773-6.148 6.148-6.148 1.922 0 3.211.773 3.953 1.453l2.703-2.648c-1.789-1.664-4.102-2.68-6.656-2.68-5.523 0-10 4.477-10 10s4.477 10 10 10c5.773 0 9.594-4.055 9.594-9.773 0-.656-.07-1.148-.156-1.652z" fill="#4285F4"></path> 
          <path d="M3.153 7.345l3.289 2.414c.891-1.781 2.578-2.961 4.598-2.961 1.406 0 2.672.477 3.664 1.414l2.742-2.68c-1.664-1.555-3.797-2.532-6.406-2.532-3.789 0-7.016 2.555-8.18 6.055z" fill="#34A853"></path> 
          <path d="M12 22c2.43 0 4.664-.805 6.398-2.18l-2.953-2.414c-.82.578-1.867.977-3.445.977-2.664 0-4.922-1.797-5.734-4.211l-3.273 2.523c1.523 3.055 4.703 5.305 8.007 5.305z" fill="#4CAF50"></path> 
          <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.375 0-6.148-2.789-6.148-6.148 0-3.359 2.773-6.148 6.148-6.148 1.922 0 3.211.773 3.953 1.453l2.703-2.648c-1.789-1.664-4.102-2.68-6.656-2.68-5.523 0-10 4.477-10 10s4.477 10 10 10c5.773 0 9.594-4.055 9.594-9.773 0-.656-.07-1.148-.156-1.652z" fill="#4285F4"></path> 
        </g>
      </svg>
      Continue with Google
    </button>
  );
}
