import React, { useState, useEffect } from 'react';
import { Award, FileText } from 'lucide-react';
import { usePapers } from '../../context/PaperContext';
import './Dashboard.css';

export const SearchBar = () => {
  const { filters, setFilters } = usePapers();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Optimize coordinates update with requestAnimationFrame
  useEffect(() => {
    let frameId;
    const handleMouseMove = (e) => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth) - 0.5;
        const y = (clientY / innerHeight) - 0.5;
        setMousePos({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  // Clean, emoji-free professional category pills
  const categories = [
    { label: 'All Exams', value: '' },
    { label: 'CBSE Board', value: 'CBSE' },
    { label: 'JEE Entrance', value: 'JEE' },
    { label: 'NEET Medical', value: 'NEET' },
    { label: 'GATE Engineering', value: 'GATE' },
    { label: 'B.Tech Course', value: 'BTech' },
    { label: 'UPSC Civil', value: 'UPSC' },
    { label: 'Banking & SSC', value: 'Banking' }
  ];

  const handleCategoryPillClick = (value) => {
    setFilters(prev => ({ ...prev, category: value }));
    const target = document.getElementById('explore-anchor');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="hero">
      {/* Premium Floating Background Decorations (z-index: 1) */}
      <div className="hero-decorations">
        <div className="floating-orb orb-primary"></div>
        <div className="floating-orb orb-secondary"></div>
        <div className="floating-orb orb-tertiary"></div>
      </div>

      {/* Dynamic Floating Background Question Papers (Parallax responsive) */}
      <div className="hero-parallax-bg" style={{ pointerEvents: 'none' }}>
        {/* Floating Paper 1: Mathematics exam with integrals and formulas */}
        <div 
          className="floating-parallax-item parallax-paper paper-math"
          style={{
            transform: `translate3d(${mousePos.x * -45}px, ${mousePos.y * -45}px, 0) rotate(-8deg)`,
            top: '18%',
            left: '6%'
          }}
        >
          <div className="paper-header">
            <span className="subject">MATH EXAM</span>
            <span className="marks">100M</span>
          </div>
          <div className="paper-content-lines">
            <div className="line full"></div>
            <div className="line formula">∫ x² dx = x³/3 + C</div>
            <div className="line half"></div>
            <div className="line formula">e^(iπ) + 1 = 0</div>
          </div>
        </div>

        {/* Floating Paper 2: Computer Science paper with code mockup */}
        <div 
          className="floating-parallax-item parallax-paper paper-cs"
          style={{
            transform: `translate3d(${mousePos.x * 40}px, ${mousePos.y * 40}px, 0) rotate(12deg)`,
            bottom: '15%',
            left: '28%'
          }}
        >
          <div className="paper-header">
            <span className="subject">COMP SCI</span>
            <span className="marks">75M</span>
          </div>
          <div className="paper-content-lines">
            <div className="line full"></div>
            <div className="line code">def search(query):</div>
            <div className="line code" style={{ paddingLeft: '12px' }}>return db.match()</div>
            <div className="line half"></div>
          </div>
        </div>

        {/* Floating Paper 3: Physics with formulas & vector mockup */}
        <div 
          className="floating-parallax-item parallax-paper paper-physics"
          style={{
            transform: `translate3d(${mousePos.x * -25}px, ${mousePos.y * 50}px, 0) rotate(-14deg)`,
            top: '22%',
            right: '44%'
          }}
        >
          <div className="paper-header">
            <span className="subject">PHYSICS 101</span>
            <span className="marks">A+</span>
          </div>
          <div className="paper-content-lines">
            <div className="line full"></div>
            <div className="line formula">F = G·(m₁m₂)/r²</div>
            <div className="paper-mock-diagram">
              <svg viewBox="0 0 100 40" width="100%" height="24" fill="none">
                <circle cx="20" cy="20" r="8" stroke="var(--primary)" strokeWidth="1.5" />
                <circle cx="80" cy="20" r="8" stroke="var(--accent)" strokeWidth="1.5" />
                <line x1="28" y1="20" x2="72" y2="20" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="3,3" />
              </svg>
            </div>
            <div className="line half"></div>
          </div>
        </div>

        {/* Floating Paper 4: Grade Sheet capsule */}
        <div 
          className="floating-parallax-item parallax-badge grade-badge"
          style={{
            transform: `translate3d(${mousePos.x * 55}px, ${mousePos.y * -35}px, 0) rotate(15deg)`,
            bottom: '22%',
            right: '6%'
          }}
        >
          <div className="badge-ring">
            <span className="grade">A+</span>
          </div>
          <span className="label">Grade Verified</span>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-grid">
          {/* Left Column: Interactive Title, Subtitle, Pills */}
          <div className="hero-left anim-slide-up">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              color: 'var(--primary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '18px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <Award size={13} />
              <span>Verified Student Resources Repository</span>
            </div>

            {/* Split-Text Interactive Hover Cut Heading */}
            <h1 className="hero-title-interactive">
              <span className="split-layer top-layer">
                Find Any <span className="word-highlight">Question Paper</span> In Seconds.
              </span>
              <span className="split-layer bottom-layer" aria-hidden="true">
                Find Any <span className="word-highlight">Question Paper</span> In Seconds.
              </span>
              <span className="glow-paper-popout">
                <svg viewBox="0 0 60 80" width="46" height="62" fill="none">
                  <rect x="2" y="2" width="56" height="76" rx="8" fill="var(--card-bg)" stroke="var(--primary)" strokeWidth="3" />
                  <path d="M12 22h36M12 36h28M12 50h18" stroke="var(--text-secondary)" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M42 50h4v4h-4z" fill="var(--accent)" />
                  <circle cx="44" cy="36" r="3.5" fill="var(--success)" />
                </svg>
              </span>
            </h1>

            <p className="hero-subtitle" style={{ marginBottom: '28px' }}>
              Instant access to verified school board papers, college sessional assessments, and national entrance exams. Highly interactive, fully searchable, and student-powered.
            </p>

            {/* Quick Pill Filter buttons */}
            <div className="quick-pills">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className={`quick-pill ${filters.category === cat.value ? 'quick-pill-active' : ''}`}
                  onClick={() => handleCategoryPillClick(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Expanded Premium Transparent PNG Illustration */}
          <div className="hero-right anim-fade-in">
            <div className="hero-illustration-wrapper">
              <img 
                src="/assets/hero_illustration_v2.png" 
                alt="Futuristic Educational Hologram Illustration" 
                className="hero-image" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
