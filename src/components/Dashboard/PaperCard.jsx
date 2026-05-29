import React from 'react';
import { Bookmark, Download, Eye, Calendar, Award, User, RefreshCcw, Trash2 } from 'lucide-react';
import { usePapers } from '../../context/PaperContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Dashboard.css';

export const PaperCard = ({ paper, onViewPaper }) => {
  const { toggleBookmark, bookmarks, downloadPaper, deletePaper } = usePapers();
  const { isAuthenticated, currentUser } = useAuth();
  const toast = useToast();

  const isBookmarked = bookmarks.includes(paper.id);

  // Return a class for beautiful Indian exam category color coding
  const getBadgeClass = (category) => {
    switch (category?.toUpperCase()) {
      case 'CBSE': return 'badge-cbse';
      case 'ICSE': return 'badge-icse';
      case 'JEE': return 'badge-jee';
      case 'NEET': return 'badge-neet';
      case 'GATE': return 'badge-gate';
      case 'UPSC': return 'badge-upsc';
      case 'BTECH': return 'badge-btech';
      default: return 'badge-default';
    }
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    try {
      const bookmarked = await toggleBookmark(paper.id);
      if (bookmarked) {
        toast.success(`"${paper.subjectName}" paper saved to bookmarks!`);
      } else {
        toast.info(`"${paper.subjectName}" paper removed from bookmarks.`);
      }
    } catch (err) {
      toast.error('Could not bookmark paper. Please try again.');
    }
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    // Simulate standard download
    downloadPaper(paper.id);
    toast.success(`Starting download for "${paper.title}"`);
    
    // Programmatically trigger window download using a temporary anchor
    const link = document.createElement('a');
    link.href = paper.fileUrl;
    link.target = '_blank';
    link.download = `${paper.subjectName}_${paper.year}_${paper.examType}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAdmin = currentUser?.email === 'chetan.prajapat.work@gmail.com' || currentUser?.email === 'admin@plinth.com';
  const isUploader = isAuthenticated && paper.uploaderId === currentUser?.uid;
  const canDelete = isUploader || isAdmin;
  const isPlinthOfficial = paper.uploaderId === 'plinth-official';

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this sessional paper?')) {
      try {
        await deletePaper(paper.id);
        toast.success('Question paper deleted successfully!');
      } catch (err) {
        toast.error(err.message || 'Failed to delete paper. Please try again.');
      }
    }
  };

  return (
    <div className="paper-card glass-panel anim-slide-up" onClick={() => onViewPaper(paper)}>
      {/* Badge & Bookmark header */}
      <div className="paper-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className={`paper-badge ${getBadgeClass(paper.category)}`}>
            {paper.category || 'Exam'}
          </span>
          {paper.verificationStatus === 'verified' && (
            <span className="verified-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#10B981', color: '#ffffff', border: '2px solid var(--border)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '2px 2px 0px var(--border)' }}>
              <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.15))' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Verified</span>
            </span>
          )}
        </div>
        <button 
          className={`bookmark-card-btn ${isBookmarked ? 'bookmark-active' : ''}`}
          onClick={handleBookmarkClick}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
        >
          <Bookmark size={20} />
        </button>
      </div>

      {/* Main Title Section */}
      <div>
        <h4>{paper.title}</h4>
        
        {/* Visual Details */}
        <div className="paper-details">
          <div className="detail-item">
            <Calendar size={14} color="var(--primary)" />
            <span>{paper.year}</span>
          </div>
          {paper.semester && paper.semester !== 'N/A' && (
            <div className="detail-item">
              <RefreshCcw size={14} color="var(--secondary)" />
              <span>{paper.semester}</span>
            </div>
          )}
          <div className="detail-item">
            <Award size={14} color="var(--accent)" />
            <span>{paper.boardOrUniversity}</span>
          </div>
        </div>
      </div>

      {/* Footer Uploader Info + Actions */}
      <div className="paper-uploader">
        <div className="uploader-info">
          {isPlinthOfficial ? (
            <span className="plinth-official-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(253, 155, 155, 0.12)', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: '800' }}>
              <Award size={12} fill="var(--primary)" />
              <span>Plinth Official</span>
            </span>
          ) : (
            <>
              <User size={13} />
              <span>Uploaded by <strong>{paper.uploaderName.split(' ')[0]}</strong></span>
            </>
          )}
        </div>
        <div className="paper-actions">
          {canDelete && (
            <button 
              className="btn btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
              onClick={handleDeleteClick}
              aria-label="Delete paper"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          )}
          <button 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
            onClick={(e) => { e.stopPropagation(); onViewPaper(paper); }}
            aria-label="Preview paper"
          >
            <Eye size={14} />
            <span>View</span>
          </button>
          <button 
            className="btn btn-primary" 
            style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
            onClick={handleDownloadClick}
            aria-label="Download paper"
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
