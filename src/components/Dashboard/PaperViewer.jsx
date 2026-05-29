import React from 'react';
import { X, Download, FileText, Calendar, Award, User, RefreshCcw, HardDrive } from 'lucide-react';
import { usePapers } from '../../context/PaperContext';
import { useToast } from '../../context/ToastContext';
import './Dashboard.css';

export const PaperViewer = ({ paper, onClose }) => {
  if (!paper) return null;

  const { downloadPaper } = usePapers();
  const toast = useToast();

  const handleDownload = () => {
    downloadPaper(paper.id);
    toast.success(`Starting download for "${paper.title}"`);
    
    // Create temporary download link
    const link = document.createElement('a');
    link.href = paper.fileUrl;
    link.target = '_blank';
    link.download = `${paper.subjectName}_${paper.year}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header Section */}
        <header className="viewer-header">
          <div className="viewer-header-info">
            <h4 className="viewer-title">{paper.title}</h4>
            <div className="viewer-meta">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} /> Year: {paper.year}
              </span>
              <span className="viewer-meta-sep" aria-hidden="true">•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={12} /> {paper.boardOrUniversity}
              </span>
              <span className="viewer-meta-sep" aria-hidden="true">•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <HardDrive size={12} /> {paper.fileSize || '1.2 MB'}
              </span>
            </div>
          </div>
          <div className="viewer-actions">
            <button className="btn btn-primary" onClick={handleDownload}>
              <Download size={16} />
              <span>Download PDF</span>
            </button>
            <button className="auth-close-btn" onClick={onClose} style={{ position: 'static' }} aria-label="Close preview">
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Body Section */}
        <div className="viewer-body">
          {/* PDF embedded frame */}
          <iframe 
            src={`${paper.fileUrl}#toolbar=0&navpanes=0`}
            title="Question Paper Document Preview"
            className="viewer-pdf-frame"
          />

          {/* Right side metadata container */}
          <aside className="viewer-sidebar">
            <div className="sidebar-section">
              <h5>Description</h5>
              <p className="sidebar-desc">
                {paper.description || 'No detailed description provided by the uploader. This is a verified question paper resource.'}
              </p>

              <h5>Paper Attributes</h5>
              <div className="sidebar-attributes">
                <div className="attribute-row">
                  <span className="attribute-label">Subject:</span>
                  <span className="attribute-value">{paper.subjectName}</span>
                </div>
                <div className="attribute-row">
                  <span className="attribute-label">Exam Type:</span>
                  <span className="attribute-value">{paper.examType}</span>
                </div>
                <div className="attribute-row">
                  <span className="attribute-label">Category:</span>
                  <span className="attribute-value">{paper.category}</span>
                </div>
                {paper.semester && paper.semester !== 'N/A' && (
                  <div className="attribute-row">
                    <span className="attribute-label">Semester:</span>
                    <span className="attribute-value">{paper.semester}</span>
                  </div>
                )}
                <div className="attribute-row">
                  <span className="attribute-label">Year:</span>
                  <span className="attribute-value">{paper.year}</span>
                </div>
              </div>
            </div>

            {/* Uploader section */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <User size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.85rem' }}>Uploaded by <strong>{paper.uploaderName}</strong></span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total Downloads: <strong>{paper.downloadsCount || 0}</strong> students
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
