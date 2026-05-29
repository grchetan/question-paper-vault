import React, { useState } from 'react';
import { Mail, Lock, User, X, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './AuthModal.css';

export const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { loginWithEmail, registerWithEmail, loginWithGoogle, sendPasswordReset } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('login'); // 'login', 'signup', or 'forgot-password'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    onClose();
  };

  const validate = () => {
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return false;
    }
    if (activeTab === 'signup') {
      if (!formData.name.trim()) {
        toast.error('Please enter your name.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match.');
        return false;
      }
    }
    return true;
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordReset(formData.email);
      toast.success('Password reset email sent successfully! Please check your inbox.');
      setActiveTab('login');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (activeTab === 'login') {
        await loginWithEmail(formData.email, formData.password);
        toast.success('Welcome back! Logged in successfully.');
      } else {
        await registerWithEmail(formData.email, formData.password, formData.name);
        toast.success(`Welcome to PYQ Hub, ${formData.name}! Account created.`);
      }
      handleClose();
    } catch (err) {
      console.error(err);
      let errorMsg = err.message || 'Authentication failed. Please check details.';
      
      // Smart error overrides for Firebase email conflicts
      if (err.code === 'auth/email-already-in-use' || err.message?.includes('email-already-in-use')) {
        errorMsg = 'This email is already registered. If you originally signed in with Google, click the Google Account button below or use Forgot Password to set a password.';
      } else if (err.code === 'auth/wrong-password' || err.message?.includes('wrong-password')) {
        errorMsg = 'Incorrect password. If you registered via Google Account, please sign in with Google or use Forgot Password to reset.';
      } else if (err.code === 'auth/user-not-found' || err.message?.includes('user-not-found')) {
        errorMsg = 'No account found with this email. Click the Sign Up tab to create one, or Sign In with Google if that is what you used.';
      } else if (err.code === 'auth/account-exists-with-different-credential' || err.message?.includes('account-exists-with-different-credential')) {
        errorMsg = 'An account already exists with this email address. Please log in using your Google Account, or use Forgot Password to set an email password.';
      }
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google successfully!');
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={handleClose}>
      <div className="auth-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Left Side: Educational Marketing Intro */}
        <div className="auth-promo">
          <div className="auth-promo-logo">
            <BookOpen size={24} />
            <span>PYQ Hub</span>
          </div>
          <div className="auth-promo-content animate-fade-in">
            <h3>Boost Your Exam Preparation!</h3>
            <p>
              Get access to thousands of actual previous year papers, upload your own resources to help fellow students, and save your favorites for offline reference.
            </p>
          </div>
          <div className="auth-promo-footer">
            Join the largest collaborative student repository in India.
          </div>
        </div>

        {/* Right Side: Tab Forms */}
        <div className="auth-form-container">
          <button className="auth-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={18} />
          </button>

          {/* Form Loader */}
          {loading && (
            <div className="auth-loading-overlay">
              <div className="spinner"></div>
              <p style={{ fontWeight: 600, color: 'var(--primary)' }}>Please wait...</p>
            </div>
          )}

          {/* Sliding Tabs */}
          {activeTab !== 'forgot-password' ? (
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${activeTab === 'login' ? 'auth-tab-active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Sign In
              </button>
              <button 
                className={`auth-tab ${activeTab === 'signup' ? 'auth-tab-active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Reset Password</h3>
            </div>
          )}

          {activeTab === 'forgot-password' ? (
            /* Forgot Password Form */
            <form className="auth-form" onSubmit={handleForgotPasswordSubmit}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                Enter your email address and we will send you a secure link to reset your password and link your account credentials.
              </p>
              
              <div className="auth-field">
                <label htmlFor="reset-email">Email Address</label>
                <div className="auth-field-input">
                  <Mail size={16} />
                  <input
                    type="email"
                    id="reset-email"
                    name="email"
                    placeholder="name@university.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="glass-input"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                Send Reset Email
              </button>

              <button 
                type="button" 
                onClick={() => setActiveTab('login')}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.82rem', marginTop: '14px', fontWeight: '800', textAlign: 'center', width: '100%', display: 'block', textDecoration: 'underline' }}
              >
                Back to Login
              </button>
            </form>
          ) : (
            /* Form Fields */
            <form className="auth-form" onSubmit={handleSubmit}>
              {activeTab === 'signup' && (
                <div className="auth-field">
                  <label htmlFor="name">Full Name</label>
                  <div className="auth-field-input">
                    <User size={16} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      className="glass-input"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="email">Email Address</label>
                <div className="auth-field-input">
                  <Mail size={16} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@university.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="glass-input"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                  {activeTab === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('forgot-password')} 
                      style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: '800', padding: 0 }}
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="auth-field-input">
                  <Lock size={16} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="glass-input"
                    required
                  />
                </div>
              </div>

              {activeTab === 'signup' && (
                <div className="auth-field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="auth-field-input">
                    <Lock size={16} />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="glass-input"
                      required
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                {activeTab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Social Auth Divider */}
          <div className="auth-divider">or continue with</div>

          {/* Google SSO Button */}
          <button className="btn-google" onClick={handleGoogleSignIn}>
            <svg className="google-logo" viewBox="0 0 24 24" width="100%" height="100%">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.513 0-6.36-2.847-6.36-6.36s2.847-6.36 6.36-6.36c1.61 0 3.076.608 4.205 1.612l3.076-3.076C18.89 1.942 15.75 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.262 0 11.458-4.996 11.458-11.24 0-.693-.075-1.344-.19-1.955H12.24z"/>
            </svg>
            <span>Google Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
