import { auth, googleProvider, signInWithPopup, signOut } from 'firebase-config.js';

// Google Sign-In
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Optional: Verify email domain
    const emailDomain = result.user.email.split('@')[1];
    const allowedDomains = ['gmail.com', 'yahoo.com']; // 👈 Add your allowed domains
    
    if (!allowedDomains.includes(emailDomain)) {
      await signOut(auth);
      throw new Error("Only Gmail/Yahoo emails allowed");
    }
    
    return result.user;
  } catch (error) {
    console.error("Google login failed:", error);
    throw error;
  }
};

// Sign Out
export const logout = () => signOut(auth);

// Auth State Listener
export const initAuthListener = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};