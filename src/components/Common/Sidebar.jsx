import React from 'react';
import { X, BookOpen, Bookmark, User, Upload, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css'; // Shared navbar elements

export const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, onOpenAuth }) => {
  if (!isOpen) return null;

  const { currentUser, logout, isAuthenticated } = useAuth();

  const handleLinkClick = (tab) => {
    setActiveTab(tab);
    onClose();
  };

  const handleAuthClick = () => {
    onClose();
    onOpenAuth();
  };

  const handleLogoutClick = async () => {
    await logout();
    onClose();
    setActiveTab('home');
  };

  return (
    <div className="auth-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div 
        className="glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '280px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          animation: 'sidebarSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div className="navbar-logo" onClick={() => handleLinkClick('home')}>
            <BookOpen size={24} />
            <span>PYQ Hub</span>
          </div>
          <button className="auth-close-btn" onClick={onClose} style={{ position: 'static' }}>
            <X size={18} />
          </button>
        </div>

        {/* User Card */}
        {isAuthenticated && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            padding: '12px 16px', 
            borderRadius: 'var(--radius-md)', 
            background: 'rgba(var(--primary-rgb), 0.05)',
            marginBottom: '24px' 
          }}>
            <img 
              src={currentUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.displayName}`} 
              alt="avatar" 
              className="avatar-img"
              style={{ width: 42, height: 42 }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser.displayName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser.email}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1 }}>
          <button 
            className={`dropdown-item ${activeTab === 'home' ? 'dropdown-item-active' : ''}`}
            onClick={() => handleLinkClick('home')}
            style={{ 
              background: activeTab === 'home' ? 'rgba(var(--primary-rgb), 0.08)' : 'transparent',
              color: activeTab === 'home' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            <BookOpen size={18} />
            <span>Explore Papers</span>
          </button>

          <button 
            className={`dropdown-item ${activeTab === 'bookmarks' ? 'dropdown-item-active' : ''}`}
            onClick={() => {
              if (isAuthenticated) {
                handleLinkClick('bookmarks');
              } else {
                handleAuthClick();
              }
            }}
            style={{ 
              background: activeTab === 'bookmarks' ? 'rgba(var(--primary-rgb), 0.08)' : 'transparent',
              color: activeTab === 'bookmarks' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            <Bookmark size={18} />
            <span>Saved Papers</span>
          </button>

          <button 
            className={`dropdown-item ${activeTab === 'my-uploads' ? 'dropdown-item-active' : ''}`}
            onClick={() => {
              if (isAuthenticated) {
                handleLinkClick('my-uploads');
              } else {
                handleAuthClick();
              }
            }}
            style={{ 
              background: activeTab === 'my-uploads' ? 'rgba(var(--primary-rgb), 0.08)' : 'transparent',
              color: activeTab === 'my-uploads' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            <User size={18} />
            <span>My Uploads</span>
          </button>

          <button 
            className="dropdown-item"
            onClick={() => {
              if (isAuthenticated) {
                handleLinkClick('upload');
              } else {
                handleAuthClick();
              }
            }}
          >
            <Upload size={18} />
            <span>Upload Paper</span>
          </button>

          {isAuthenticated && (currentUser?.email === 'chetan.prajapat.work@gmail.com' || currentUser?.email === 'admin@plinth.com') && (
            <button 
              className={`dropdown-item ${activeTab === 'admin' ? 'dropdown-item-active' : ''}`}
              onClick={() => handleLinkClick('admin')}
              style={{ 
                background: activeTab === 'admin' ? 'rgba(var(--primary-rgb), 0.08)' : 'transparent',
                color: 'var(--primary)',
                fontWeight: '800'
              }}
            >
              <BookOpen size={18} />
              <span>Admin Panel</span>
            </button>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          {isAuthenticated ? (
            <button className="dropdown-item dropdown-item-danger" onClick={handleLogoutClick}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          ) : (
            <button className="dropdown-item" onClick={handleAuthClick} style={{ color: 'var(--primary)' }}>
              <LogIn size={18} />
              <span>Sign In / Log In</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes sidebarSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
