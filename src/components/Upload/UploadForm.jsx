import React, { useState, useEffect } from 'react';
import { FileCheck, ArrowRight, PlusCircle, ArrowLeft, Award, Sparkles } from 'lucide-react';
import { usePapers } from '../../context/PaperContext';
import { useToast } from '../../context/ToastContext';
import { FileDropzone } from './FileDropzone';
import { ProgressBar } from './ProgressBar';
import './UploadForm.css';

export const UploadForm = ({ setActiveTab }) => {
  const { uploadPaper } = usePapers();
  const toast = useToast();

  const [formData, setFormData] = useState({
    subjectName: '',
    year: '2024',
    semester: 'N/A',
    category: '', // e.g. CBSE
    boardOrUniversity: '',
    customBoardOrUniversity: '',
    description: '',
    customTitle: '',
    useCustomTitle: false
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [success, setSuccess] = useState(false);

  // Clean, professional, emoji-free categories for selection
  const categories = [
    { label: '-- Select Category --', value: '' },
    { label: 'CBSE Board (School)', value: 'CBSE' },
    { label: 'ICSE Board (School)', value: 'ICSE' },
    { label: 'MP Board (School)', value: 'MP Board' },
    { label: 'State Boards (School)', value: 'State Boards' },
    { label: 'School Classes (9th - 12th)', value: 'School Classes' },
    { label: 'JEE Mains & Advanced Prep', value: 'JEE' },
    { label: 'NEET Medical Exam Prep', value: 'NEET' },
    { label: 'GATE Engineering Test Prep', value: 'GATE' },
    { label: 'UPSC Civil Services Prep', value: 'UPSC' },
    { label: 'SSC Recruitment Exams', value: 'SSC' },
    { label: 'Indian Railways (RRB)', value: 'Railway' },
    { label: 'Banking Exam Prep (IBPS/SBI)', value: 'Banking' },
    { label: 'CUET UG Entrance Test', value: 'CUET' },
    { label: 'B.Tech / B.E. Course', value: 'BTech' },
    { label: 'BCA Course', value: 'BCA' },
    { label: 'MCA Course', value: 'MCA' },
    { label: 'Polytechnic Diploma', value: 'Diploma' },
    { label: 'College Sessional Papers', value: 'College Exams' },
    { label: 'University Final Papers', value: 'University Exams' }
  ];

  const examTypes = [
    { label: '-- Select Exam Type --', value: '' },
    { label: 'Main / Final Board Exam', value: 'Main Exam' },
    { label: 'External Semester Exam', value: 'External' },
    { label: 'Internal Assessment', value: 'Internal' },
    { label: 'Mid Sem Exam', value: 'Mid Sem' },
    { label: 'Unit Test / Class Test', value: 'Unit Test' },
    { label: 'Preparatory / Mock Exam', value: 'Preparatory' }
  ];

  const boardsList = [
    { label: '-- Select Board/University --', value: '' },
    { label: 'Central Board of Secondary Education (CBSE)', value: 'CBSE Board' },
    { label: 'Council for the Indian School Certificate Examinations', value: 'CISCE Board' },
    { label: 'Madhya Pradesh Board (MPBSE)', value: 'MPBSE Bhopal' },
    { label: 'National Testing Agency (NTA)', value: 'National Testing Agency (NTA)' },
    { label: 'Union Public Service Commission (UPSC)', value: 'Union Public Service Commission' },
    { label: 'Indian Institute of Technology (IITs)', value: 'IIT' },
    { label: 'Delhi Technological University (DTU)', value: 'Delhi Technological University (DTU)' },
    { label: 'Visvesvaraya Technological University (VTU)', value: 'VTU' },
    { label: 'University of Delhi (DU)', value: 'Delhi University' },
    { label: 'University of Mumbai', value: 'Mumbai University' },
    { label: 'Anna University', value: 'Anna University' },
    { label: 'Other Board / University', value: 'OTHER' }
  ];

  const semesters = [
    { label: 'Not Applicable (School/Competitive)', value: 'N/A' },
    { label: 'Semester 1', value: 'Sem 1' },
    { label: 'Semester 2', value: 'Sem 2' },
    { label: 'Semester 3', value: 'Sem 3' },
    { label: 'Semester 4', value: 'Sem 4' },
    { label: 'Semester 5', value: 'Sem 5' },
    { label: 'Semester 6', value: 'Sem 6' },
    { label: 'Semester 7', value: 'Sem 7' },
    { label: 'Semester 8', value: 'Sem 8' }
  ];

  // Auto-generate title logic
  useEffect(() => {
    if (!formData.useCustomTitle) {
      const parts = [];
      if (formData.category) {
        const catLabel = categories.find(c => c.value === formData.category)?.label.split(' ')[0] || '';
        parts.push(catLabel);
      }
      if (formData.semester && formData.semester !== 'N/A') {
        parts.push(formData.semester);
      }
      if (formData.subjectName.trim()) {
        parts.push(formData.subjectName.trim());
      } else {
        parts.push('Question Paper');
      }
      if (formData.year) {
        parts.push(`(${formData.year})`);
      }

      setFormData(prev => ({ ...prev, customTitle: parts.join(' ') }));
    }
  }, [formData.subjectName, formData.year, formData.semester, formData.category, formData.useCustomTitle]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleReset = () => {
    setFormData({
      subjectName: '',
      year: '2024',
      semester: 'N/A',
      category: '',
      boardOrUniversity: '',
      customBoardOrUniversity: '',
      description: '',
      customTitle: '',
      useCustomTitle: false
    });
    setSelectedFile(null);
    setSuccess(false);
    setProgress(0);
  };

  const validate = () => {
    if (!formData.category) {
      toast.error('Please select an exam/course category.');
      return false;
    }
    if (!formData.subjectName.trim()) {
      toast.error('Please enter the subject name.');
      return false;
    }
    if (!formData.boardOrUniversity) {
      toast.error('Please select or specify a board or university.');
      return false;
    }
    if (formData.boardOrUniversity === 'OTHER' && !formData.customBoardOrUniversity.trim()) {
      toast.error('Please specify your custom university/board name.');
      return false;
    }
    if (!selectedFile) {
      toast.error('Please upload a question paper PDF.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setUploading(true);
    setProgress(0);
    setStatusText('Preparing PDF document...');

    try {
      const finalBoard = formData.boardOrUniversity === 'OTHER' 
        ? formData.customBoardOrUniversity 
        : boardsList.find(b => b.value === formData.boardOrUniversity)?.label || formData.boardOrUniversity;

      const uploadMetadata = {
        title: formData.customTitle,
        subjectName: formData.subjectName,
        examType: formData.examType || 'Main Exam',
        category: formData.category,
        year: formData.year,
        semester: formData.semester,
        boardOrUniversity: finalBoard,
        description: formData.description
      };

      // Call dynamic uploadPaper service passing the real progress handler
      await uploadPaper(uploadMetadata, selectedFile, (percent) => {
        setProgress(percent);
        if (percent < 100) {
          setStatusText(`Uploading file: ${Math.round(percent)}%`);
        } else {
          setStatusText('Publishing details to database...');
        }
      });
      
      setProgress(100);
      setStatusText('Paper live on PYQ Hub!');
      
      setTimeout(() => {
        setUploading(false);
        setSuccess(true);
        toast.success('Question paper successfully published!');
      }, 500);

    } catch (err) {
      setUploading(false);
      setProgress(0);
      setStatusText('');
      toast.error(err.message || 'File upload failed. Please try again.');
    }
  };

  return (
    <div className="container upload-container">
      <div className="upload-card glass-panel anim-slide-up">
        {success ? (
          /* Success Screen View spans full layout */
          <div className="success-view anim-fade-in">
            <div className="success-check-circle">
              <FileCheck size={36} />
            </div>
            <h3>Upload Successful!</h3>
            <p>
              Your paper "<strong>{formData.customTitle}</strong>" has been uploaded successfully and is now live. Students across India can now search, preview, and download it!
            </p>
            <div className="success-actions">
              <button className="btn btn-secondary" onClick={handleReset}>
                <PlusCircle size={16} />
                <span>Upload Another</span>
              </button>
              <button className="btn btn-primary" onClick={() => setActiveTab('home')}>
                <span>Go to Explore Hub</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Split Grid Layout for Form entry */
          <div className="upload-split-grid">
            {/* Left Side: The Form */}
            <div className="upload-left-form">
              <h2 className="upload-title">Share a Paper</h2>
              <p className="upload-subtitle">
                Help your juniors by uploading sessional and board papers. Accurate details make searching faster for others.
              </p>

              <form className="upload-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Academic Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="filter-select"
                      disabled={uploading}
                      required
                    >
                      {categories.map((c, idx) => (
                        <option key={idx} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="examType">Exam Type *</label>
                    <select
                      id="examType"
                      name="examType"
                      value={formData.examType}
                      onChange={handleChange}
                      className="filter-select"
                      disabled={uploading}
                      required
                    >
                      {examTypes.map((et, idx) => (
                        <option key={idx} value={et.value}>{et.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="subjectName">Subject Name *</label>
                    <input
                      type="text"
                      id="subjectName"
                      name="subjectName"
                      placeholder="e.g. Organic Chemistry, Algorithms"
                      value={formData.subjectName}
                      onChange={handleChange}
                      className="glass-input"
                      disabled={uploading}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="year">Exam Year *</label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="filter-select"
                      disabled={uploading}
                      required
                    >
                      {Array.from({ length: 9 }, (_, i) => 2026 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="semester">Semester (if College)</label>
                    <select
                      id="semester"
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="filter-select"
                      disabled={uploading}
                    >
                      {semesters.map((s, idx) => (
                        <option key={idx} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="boardOrUniversity">Board / University *</label>
                    <select
                      id="boardOrUniversity"
                      name="boardOrUniversity"
                      value={formData.boardOrUniversity}
                      onChange={handleChange}
                      className="filter-select"
                      disabled={uploading}
                      required
                    >
                      {boardsList.map((b, idx) => (
                        <option key={idx} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.boardOrUniversity === 'OTHER' && (
                  <div className="form-group anim-fade-in">
                    <label htmlFor="customBoardOrUniversity">Specify Board / University Name *</label>
                    <input
                      type="text"
                      id="customBoardOrUniversity"
                      name="customBoardOrUniversity"
                      placeholder="e.g. VTU Karnataka, Maharashtra State Board"
                      value={formData.customBoardOrUniversity}
                      onChange={handleChange}
                      className="glass-input"
                      disabled={uploading}
                      required
                    />
                  </div>
                )}

                <div className="form-group" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label htmlFor="customTitle" style={{ marginBottom: 0 }}>Document Title *</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        name="useCustomTitle"
                        checked={formData.useCustomTitle}
                        onChange={handleChange}
                        disabled={uploading}
                      />
                      <span>Customize Title</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    id="customTitle"
                    name="customTitle"
                    value={formData.customTitle}
                    onChange={handleChange}
                    className="glass-input"
                    disabled={!formData.useCustomTitle || uploading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Optional Description / Notes</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Mention sessional markers, total marks, or reference answer details..."
                    value={formData.description}
                    onChange={handleChange}
                    className="glass-input"
                    disabled={uploading}
                  />
                </div>

                <FileDropzone selectedFile={selectedFile} setSelectedFile={setSelectedFile} />

                {uploading && <ProgressBar progress={progress} statusText={statusText} />}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveTab('home')}
                    disabled={uploading}
                    style={{ padding: '8px 18px', borderRadius: 'var(--radius-sm)' }}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploading}
                    style={{ padding: '8px 18px', borderRadius: 'var(--radius-sm)' }}
                  >
                    <span>Publish Paper</span>
                    <PlusCircle size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side: Educational Illustration & Tips Banner (emoji-free, clean icons) */}
            <div className="upload-right-promo">
              <div className="upload-illustration-box">
                <img 
                  src="/assets/upload_illustration.png" 
                  alt="Student uploading files" 
                />
              </div>
              <div className="upload-promo-text">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.78rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <Sparkles size={13} />
                  <span>Academic Network</span>
                </div>
                <h3>Collaborative Repository</h3>
                <p>
                  Sessional and final examinations are highly repetitive. Sharing a single paper today assists hundreds of peers in your junior classes!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
