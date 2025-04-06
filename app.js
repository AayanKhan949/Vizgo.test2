import { loginWithGoogle, logout, initAuthListener } from 'auth.js';
import { createUserProfile, getUserData, addEarning } from 'firestore.js';

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const watchAdBtn = document.getElementById('watchAdBtn');
const balanceDisplay = document.getElementById('balance');

// Initialize Auth Listener
initAuthListener(async (user) => {
  if (user) {
    // User is logged in
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    
    // Check/create user profile
    if (!(await getUserData(user.uid))) {
      await createUserProfile(user);
    }
    
    // Update UI
    const userData = await getUserData(user.uid);
    balanceDisplay.textContent = userData.balance.toFixed(2);
  } else {
    // User is logged out
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    balanceDisplay.textContent = '0.00';
  }
});

// Event Listeners
loginBtn.addEventListener('click', async () => {
  try {
    await loginWithGoogle();
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
});

logoutBtn.addEventListener('click', logout);

watchAdBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) return alert("Please login first");
  
  try {
    const earnings = 5.00; // Example amount
    await addEarning(user.uid, earnings, 'ad');
    alert(`You earned ₹${earnings.toFixed(2)}!`);
    
    // Refresh balance
    const userData = await getUserData(user.uid);
    balanceDisplay.textContent = userData.balance.toFixed(2);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});