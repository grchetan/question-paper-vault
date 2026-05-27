import React from 'react';
import { BookOpen, Heart } from 'lucide-react';
import './Footer.css';

// Custom inline SVG GitHub icon
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const Footer = ({ setActiveTab, setFilters }) => {
  const currentYear = new Date().getFullYear();

  const handleCategoryClick = (category) => {
    if (setFilters) {
      setFilters(prev => ({
        examType: '',
        semester: '',
        year: '',
        boardOrUniversity: '',
        category: category
      }));
    }
    setActiveTab('home');
    // Scroll smoothly to interactive papers section
    const target = document.getElementById('explore-anchor');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="brand-glyph" style={{ display: 'flex', alignItems: 'center' }}>
                <svg viewBox="0 0 32 32" width="24" height="24" fill="none" style={{ filter: 'drop-shadow(1.5px 1.5px 0px var(--border))' }}>
                  <rect x="2" y="2" width="28" height="28" rx="5" fill="var(--primary)" stroke="var(--border)" strokeWidth="2.5" />
                  <path d="M11 22V10h5.5c2.5 0 4.5 1.2 4.5 3.5s-2 3.5-4.5 3.5H11" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="brand-name" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>Plinth</span>
            </div>
            <p className="footer-desc">
              India's premier collaborative exam paper platform. Search, download, and share past papers to achieve academic excellence together.
            </p>
            <div className="footer-socials">
              <a href="https://github.com/grchetan" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="GitHub">
                <GithubIcon />
              </a>
            </div>
          </div>

          {/* Column 1 - Education Levels */}
          <div className="footer-col">
            <h4>Quick Categories</h4>
            <ul className="footer-links">
              <li className="footer-link" onClick={() => handleCategoryClick('CBSE')}>CBSE & ICSE Board</li>
              <li className="footer-link" onClick={() => handleCategoryClick('BTech')}>Engineering Exams</li>
              <li className="footer-link" onClick={() => handleCategoryClick('JEE')}>Competitive Portals</li>
              <li className="footer-link" onClick={() => handleCategoryClick('MP Board')}>State Boards</li>
            </ul>
          </div>

          {/* Column 2 - Useful Resources */}
          <div className="footer-col">
            <h4>Features</h4>
            <ul className="footer-links">
              <li className="footer-link" onClick={() => {
                setActiveTab('home');
                const searchInput = document.querySelector('.search-input');
                if (searchInput) searchInput.focus();
              }}>Paper Search</li>
              <li className="footer-link" onClick={() => setActiveTab('upload')}>Upload Portal</li>
              <li className="footer-link" onClick={() => setActiveTab('bookmarks')}>Saved Bookmarks</li>
              <li className="footer-link" onClick={() => setActiveTab('my-uploads')}>My Uploads</li>
            </ul>
          </div>

          {/* Column 3 - Technical Links */}
          <div className="footer-col">
            <h4>About Project</h4>
            <ul className="footer-links">
              <li className="footer-link" onClick={() => setActiveTab('docs')}>Documentation</li>
              <li className="footer-link" onClick={() => setActiveTab('firebase-status')}>Firebase Auth Status</li>
              <li className="footer-link" onClick={() => setActiveTab('supabase-status')}>Supabase Storage</li>
              <li className="footer-link" onClick={() => setActiveTab('support')}>Contact Support</li>
            </ul>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="footer-bottom">
          <div>
            &copy; {currentYear} Plinth. Made with <Heart size={12} fill="var(--primary)" color="var(--border)" style={{ display: 'inline', margin: '0 2px', verticalAlign: 'middle' }} /> for scholars.
          </div>
          <div className="footer-bottom-links">
            <span className="footer-link" onClick={() => setActiveTab('privacy')}>Privacy Policy</span>
            <span className="footer-link" onClick={() => setActiveTab('terms')}>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
