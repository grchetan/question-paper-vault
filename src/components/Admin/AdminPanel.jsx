import React, { useState } from 'react';
import { usePapers } from '../../context/PaperContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Trash2, CheckCircle, FileText, User, Calendar, Award, RefreshCw, Layers, ExternalLink } from 'lucide-react';

export const AdminPanel = ({ onViewPaper }) => {
  const { allPapers, verifyPaper, deletePaper } = usePapers();
  const toast = useToast();
  const [adminTab, setAdminTab] = useState('pending'); // 'pending' | 'archive'

  const pendingPapers = allPapers.filter(p => p.verificationStatus === 'pending' || !p.verificationStatus);
  const verifiedPapers = allPapers.filter(p => p.verificationStatus === 'verified');
  const officialPapers = allPapers.filter(p => p.uploaderId === 'plinth-official');

  const handleApprove = async (paperId, title) => {
    try {
      await verifyPaper(paperId, 'verified');
      toast.success(`"${title}" successfully approved and verified!`);
    } catch (err) {
      toast.error('Failed to approve paper. Please try again.');
    }
  };

  const handleReject = async (paperId, title) => {
    if (window.confirm(`Are you absolutely sure you want to reject "${title}" and permanently delete it?`)) {
      try {
        await deletePaper(paperId);
        toast.success(`"${title}" permanently deleted from database.`);
      } catch (err) {
        toast.error('Failed to delete paper. Please try again.');
      }
    }
  };

  return (
    <section className="section-padding anim-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        
        {/* Header Block */}
        <div className="dashboard-header glass-panel" style={{ padding: '28px 36px', borderRadius: 'var(--radius-md)', marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.78rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <ShieldCheck size={14} />
              <span>Administrative Access Only</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Plinth Admin Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.92rem' }}>
              Verify student-uploaded question sheets as <strong>Verified</strong> (Genuine) or delete spam/fake files.
            </p>
          </div>
          <div className="paper-badge badge-gate" style={{ fontSize: '0.82rem', fontWeight: '800', padding: '6px 16px', borderRadius: 'var(--radius-sm)' }}>
            System Auditor
          </div>
        </div>

        {/* Bento Stats Matrix */}
        <div className="stats-grid" style={{ marginBottom: '40px' }}>
          <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <h3 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--primary)' }}>
              {pendingPapers.length}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pending Moderation
            </p>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
            <h3 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--success)' }}>
              {verifiedPapers.length}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Verified Papers
            </p>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <h3 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--accent)' }}>
              {officialPapers.length}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Plinth Official Uploads
            </p>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid var(--text-primary)' }}>
            <h3 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--text-primary)' }}>
              {allPapers.length}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Papers Database
            </p>
          </div>
        </div>

        {/* Action Tabs Selector */}
        <div className="explore-tabs-container" style={{ marginBottom: '28px', borderBottom: '2px solid var(--border)' }}>
          <div className="explore-tabs" style={{ marginBottom: '-2px' }}>
            <button 
              className={`explore-tab ${adminTab === 'pending' ? 'explore-tab-active' : ''}`}
              onClick={() => setAdminTab('pending')}
              style={{ padding: '12px 24px', fontWeight: 800, fontSize: '0.9rem' }}
            >
              Pending Verification ({pendingPapers.length})
            </button>
            <button 
              className={`explore-tab ${adminTab === 'archive' ? 'explore-tab-active' : ''}`}
              onClick={() => setAdminTab('archive')}
              style={{ padding: '12px 24px', fontWeight: 800, fontSize: '0.9rem' }}
            >
              All Database Archive ({allPapers.length})
            </button>
          </div>
        </div>

        {/* LISTINGS CONTAINER */}
        {adminTab === 'pending' ? (
          /* PENDING REVIEW VIEW */
          pendingPapers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {pendingPapers.map(paper => (
                <div key={paper.id} className="glass-panel anim-slide-up" style={{ padding: '24px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center' }} className="admin-pending-card">
                  
                  {/* Left Side: Metadata info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="paper-badge badge-cbse" style={{ textTransform: 'uppercase', fontSize: '0.7rem', padding: '3px 8px', fontWeight: '800' }}>
                        {paper.category}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Uploaded by <strong>{paper.uploaderName}</strong> ({paper.uploaderId})
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      {paper.title}
                    </h3>

                    {paper.description && (
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '4px 0', lineHeight: '1.5' }}>
                        {paper.description}
                      </p>
                    )}

                    {/* Metadata chips */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <Calendar size={13} color="var(--primary)" />
                        <span>Year: <strong>{paper.year}</strong></span>
                      </div>
                      {paper.semester && paper.semester !== 'N/A' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <RefreshCw size={13} color="var(--secondary)" />
                          <span>Semester: <strong>{paper.semester}</strong></span>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <Award size={13} color="var(--accent)" />
                        <span>Institution: <strong>{paper.boardOrUniversity}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <Layers size={13} color="var(--success)" />
                        <span>Size: <strong>{paper.fileSize}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Quick Mod Toggles */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '180px' }} className="admin-actions-col">
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => onViewPaper(paper)}
                      style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}
                    >
                      <ExternalLink size={14} />
                      <span>Preview File</span>
                    </button>
                    
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleApprove(paper.id, paper.title)}
                      style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', backgroundColor: 'var(--success)', color: '#ffffff', borderColor: 'var(--border)' }}
                    >
                      <CheckCircle size={14} />
                      <span>Verify & Approve</span>
                    </button>
 
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleReject(paper.id, paper.title)}
                      style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    >
                      <Trash2 size={14} />
                      <span>Reject & Delete</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state glass-panel anim-fade-in" style={{ padding: '56px 24px', textAlign: 'center', borderStyle: 'dashed' }}>
              <CheckCircle size={44} color="var(--success)" style={{ display: 'block', margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>All Clean! No Pending Papers</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '8px auto 0 auto', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Every single uploaded question sheet has been audited. Excellent job keeping Plinth's vaults 100% genuine and high yield!
              </p>
            </div>
          )
        ) : (
          /* DATABASE ARCHIVE VIEW */
          allPapers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-sm)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border)' }}>
                      <th style={{ padding: '12px 16px', fontWeight: '800' }}>Verification</th>
                      <th style={{ padding: '12px 16px', fontWeight: '800' }}>Document Title</th>
                      <th style={{ padding: '12px 16px', fontWeight: '800' }}>Category</th>
                      <th style={{ padding: '12px 16px', fontWeight: '800' }}>Publisher</th>
                      <th style={{ padding: '12px 16px', fontWeight: '800' }}>Downloads</th>
                      <th style={{ padding: '12px 16px', fontWeight: '800', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPapers.map(paper => {
                      const isVerified = paper.verificationStatus === 'verified';
                      const isPlinth = paper.uploaderId === 'plinth-official';
                      return (
                        <tr key={paper.id} style={{ borderBottom: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                          <td style={{ padding: '12px 16px' }}>
                            {isVerified ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>
                                Verified
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>
                                Pending
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span>{paper.title}</span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>{paper.boardOrUniversity}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span className="paper-badge badge-cbse" style={{ fontSize: '0.7rem', fontWeight: '800', padding: '2px 6px' }}>
                              {paper.category}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                            {isPlinth ? (
                              <span style={{ color: 'var(--primary)', fontWeight: '800' }}>Plinth Official</span>
                            ) : (
                              paper.uploaderName
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: '700' }}>
                            {paper.downloadsCount || 0}
                          </td>
                          <td style={{ padding: '12px 16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button 
                              className="btn btn-secondary" 
                              onClick={() => onViewPaper(paper)}
                              style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: 'var(--radius-sm)' }}
                            >
                              View
                            </button>
                            {!isVerified && (
                              <button 
                                className="btn btn-primary" 
                                onClick={() => handleApprove(paper.id, paper.title)}
                                style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--success)', borderColor: 'var(--border)' }}
                              >
                                Approve
                              </button>
                            )}
                            <button 
                              className="btn btn-secondary" 
                              onClick={() => handleReject(paper.id, paper.title)}
                              style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: 'var(--radius-sm)', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="empty-state glass-panel anim-fade-in" style={{ padding: '40px 24px', textAlign: 'center' }}>
              <FileText size={36} color="var(--text-muted)" style={{ display: 'block', margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>No database papers found</h3>
            </div>
          )
        )}
      </div>

      <style>{`
        .admin-pending-card {
          border: 2px solid var(--border);
          box-shadow: 4px 4px 0px var(--border);
          background-color: var(--card-bg);
          transition: all var(--transition-fast);
        }
        .admin-pending-card:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px var(--border);
        }
        
        @media (max-width: 768px) {
          .admin-pending-card {
            grid-template-columns: 1fr !important;
          }
          .admin-actions-col {
            flex-direction: row !important;
            flex-wrap: wrap !important;
          }
          .admin-actions-col .btn {
            flex: 1 1 120px !important;
          }
        }
      `}</style>
    </section>
  );
};
