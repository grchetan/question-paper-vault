import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, isRealFirebase } from '../config/firebase';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// LocalStorage helpers for offline demo mode
const getMockUsers = () => JSON.parse(localStorage.getItem('mock_users') || '[]');
const saveMockUsers = (users) => localStorage.setItem('mock_users', JSON.stringify(users));

let mockCurrentUser = JSON.parse(localStorage.getItem('mock_current_user') || 'null');
const mockAuthListeners = new Set();

const triggerMockAuthChange = (user) => {
  mockCurrentUser = user;
  if (user) {
    localStorage.setItem('mock_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('mock_current_user');
  }
  mockAuthListeners.forEach(listener => listener(user));
};

export const authService = {
  // 1. Sign In using Firebase Email/Password Auth
  signInWithEmail: async (email, password) => {
    if (isRealFirebase) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } else {
      await delay(500);
      const users = getMockUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('No user account found matching this email. Sign up first!');
      }
      if (user.password !== password) {
        throw new Error('Incorrect password. Please verify and try again.');
      }
      
      const sessionUser = { 
        uid: user.uid, 
        email: user.email, 
        displayName: user.displayName,
        photoURL: user.photoURL 
      };
      triggerMockAuthChange(sessionUser);
      return sessionUser;
    }
  },

  // 2. Sign Up using Firebase Email/Password Auth
  signUpWithEmail: async (email, password, displayName) => {
    if (isRealFirebase) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      return userCredential.user;
    } else {
      await delay(600);
      const users = getMockUsers();
      
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('This email is already registered. Please sign in!');
      }

      const newUser = {
        uid: 'mock_firebase_uid_' + Math.random().toString(36).substr(2, 9),
        email,
        password, // Simple text storage for demo purposes only
        displayName,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`
      };

      users.push(newUser);
      saveMockUsers(users);

      const sessionUser = { 
        uid: newUser.uid, 
        email: newUser.email, 
        displayName: newUser.displayName,
        photoURL: newUser.photoURL 
      };
      triggerMockAuthChange(sessionUser);
      return sessionUser;
    }
  },

  // 3. Google Sign-In using Firebase OAuth Popup
  signInWithGoogle: async () => {
    if (isRealFirebase) {
      const userCredential = await signInWithPopup(auth, googleProvider);
      return userCredential.user;
    } else {
      await delay(600);
      const mockGoogleUser = {
        uid: 'google_firebase_uid_' + Math.random().toString(36).substr(2, 9),
        email: 'student.demo@gmail.com',
        displayName: 'Google Demo Student',
        photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=GoogleDemo'
      };
      
      const users = getMockUsers();
      if (!users.some(u => u.email === mockGoogleUser.email)) {
        users.push({ ...mockGoogleUser, password: 'google_auth_placeholder' });
        saveMockUsers(users);
      }

      triggerMockAuthChange(mockGoogleUser);
      return mockGoogleUser;
    }
  },

  // 4. Sign Out User
  signOutUser: async () => {
    if (isRealFirebase) {
      await signOut(auth);
    } else {
      await delay(200);
      triggerMockAuthChange(null);
    }
  },

  // 5. Subscribe to Auth Session changes
  onAuthStateChangedListener: (callback) => {
    if (isRealFirebase) {
      return onAuthStateChanged(auth, callback);
    } else {
      // Synchronously emit current session, then subscribe
      callback(mockCurrentUser);
      mockAuthListeners.add(callback);
      return () => {
        mockAuthListeners.delete(callback);
      };
    }
  }
};
