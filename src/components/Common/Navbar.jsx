import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Sun, Moon, Upload, LogIn, LogOut, User, Bookmark, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AuthModal } from './AuthModal';
import './Navbar.css';

export const Navbar = ({ activeTab, setActiveTab, onOpenMobileSidebar }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUploadClick = () => {
    if (isAuthenticated) {
      setActiveTab('upload');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleDropdownItemClick = (tab) => {
    setActiveTab(tab);
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = async () => {
    await logout();
    setIsDropdownOpen(false);
    setActiveTab('home');
  };

  return (
    <>
      <nav className="navbar glass-panel">
        <div className="container navbar-container">
          {/* Logo Section */}
          <div className="navbar-logo" onClick={() => setActiveTab('home')}>
            <div className="brand-glyph" style={{ display: 'flex', alignItems: 'center' }}>
              <svg viewBox="0 0 32 32" width="28" height="28" fill="none" style={{ filter: 'drop-shadow(2px 2px 0px var(--border))' }}>
                <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--primary)" stroke="var(--border)" strokeWidth="2.5" />
                <path d="M11 22V10h5.5c2.5 0 4.5 1.2 4.5 3.5s-2 3.5-4.5 3.5H11" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="brand-name">Plinth</span>
          </div>

          {/* Navigation Links */}
          <div className="navbar-links">
            <span 
              className={`navbar-link ${activeTab === 'home' ? 'navbar-link-active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Explore Papers
            </span>
            <span 
              className={`navbar-link ${activeTab === 'bookmarks' ? 'navbar-link-active' : ''}`}
              onClick={() => {
                if (isAuthenticated) {
                  setActiveTab('bookmarks');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
            >
              My Saved Papers
            </span>
            <span 
              className={`navbar-link ${activeTab === 'my-uploads' ? 'navbar-link-active' : ''}`}
              onClick={() => {
                if (isAuthenticated) {
                  setActiveTab('my-uploads');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
            >
              My Uploads
            </span>
            {isAuthenticated && (currentUser?.email === 'chetan.prajapat.work@gmail.com' || currentUser?.email === 'admin@plinth.com') && (
              <span 
                className={`navbar-link ${activeTab === 'admin' ? 'navbar-link-active' : ''}`}
                onClick={() => setActiveTab('admin')}
                style={{ color: 'var(--primary)', fontWeight: '800' }}
              >
                Admin Panel
              </span>
            )}
          </div>

          {/* Action Actions */}
          <div className="navbar-actions">
            {/* Theme Toggle */}
            <button 
              className="btn-icon theme-toggle-btn" 
              onClick={toggleTheme} 
              aria-label="Toggle Theme"
            >
              <span className="theme-icon-container">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </span>
            </button>

            {/* Quick Upload Button */}
            <button className="btn btn-primary" onClick={handleUploadClick}>
              <Upload size={18} />
              <span style={{ marginLeft: '4px' }} className="navbar-links">Upload Paper</span>
            </button>

            {/* User Session Handler */}
            {isAuthenticated ? (
              <div className="profile-menu" ref={dropdownRef}>
                <button 
                  className="avatar-btn" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="Open profile menu"
                >
                  <img 
                    src={(!currentUser.photoURL || currentUser.photoURL.includes('googleusercontent.com/a/'))
                      ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.displayName || 'User')}`
                      : currentUser.photoURL} 
                    alt="avatar" 
                    className="avatar-img"
                  />
                  <span className="avatar-name">{currentUser.displayName.split(' ')[0]}</span>
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu glass-panel">
                    <div className="dropdown-header">
                      <div className="dropdown-header-name">{currentUser.displayName}</div>
                      <div className="dropdown-header-email">{currentUser.email}</div>
                    </div>

                    {(currentUser?.email === 'chetan.prajapat.work@gmail.com' || currentUser?.email === 'admin@plinth.com') && (
                      <button className="dropdown-item" onClick={() => handleDropdownItemClick('admin')} style={{ color: 'var(--primary)', fontWeight: '700' }}>
                        <BookOpen size={16} color="var(--primary)" />
                        <span>Admin Panel</span>
                      </button>
                    )}

                    <button className="dropdown-item" onClick={() => handleDropdownItemClick('my-uploads')}>
                      <User size={16} />
                      <span>My Uploads</span>
                    </button>

                    <button className="dropdown-item" onClick={() => handleDropdownItemClick('bookmarks')}>
                      <Bookmark size={16} />
                      <span>My Bookmarks</span>
                    </button>

                    <button className="dropdown-item dropdown-item-danger" onClick={handleLogoutClick}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn-secondary" onClick={() => setIsAuthModalOpen(true)}>
                <LogIn size={18} />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button 
              className="btn-icon mobile-toggle" 
              onClick={onOpenMobileSidebar}
              aria-label="Open mobile drawer"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Shared Authentication Overlay Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
