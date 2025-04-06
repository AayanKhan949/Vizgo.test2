import { db, doc, setDoc, getDoc, updateDoc, increment } from 'firebase-config.js';

// User Management
export const createUserProfile = async (user) => {
  await setDoc(doc(db, "users", user.uid), {
    name: user.displayName,
    email: user.email,
    balance: 0,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  });
};

export const getUserData = async (userId) => {
  const docSnap = await getDoc(doc(db, "users", userId));
  return docSnap.exists() ? docSnap.data() : null;
};

// Earnings
export const addEarning = async (userId, amount, type) => {
  // Validate amount
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error("Invalid earning amount");
  }

  await updateDoc(doc(db, "users", userId), {
    balance: increment(amount),
    lastUpdated: new Date().toISOString()
  });

  // Record transaction
  await setDoc(doc(db, "transactions", `${userId}_${Date.now()}`), {
    userId,
    amount,
    type,
    timestamp: new Date().toISOString()
  });
};