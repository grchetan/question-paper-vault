import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import './UploadForm.css';

export const FileDropzone = ({ selectedFile, setSelectedFile }) => {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    // Validate type (must be PDF)
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast.error('Only PDF documents are allowed on this platform.');
      return;
    }

    // Validate size (must be under 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 10 MB.');
      return;
    }

    setSelectedFile(file);
    toast.success(`"${file.name}" loaded successfully!`);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    toast.info('File removed.');
  };

  return (
    <div className="form-group">
      <label>Upload Question Paper Document</label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      {!selectedFile ? (
        <div 
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <UploadCloud className="dropzone-icon" size={48} />
          <h4>Drag & Drop your PDF here</h4>
          <p>or click to browse from files</p>
          <p style={{ marginTop: '4px', fontSize: '0.72rem' }}>Only PDF documents up to 10 MB are accepted</p>
        </div>
      ) : (
        <div className="file-badge anim-fade-in">
          <div className="file-info">
            <FileText size={24} color="var(--primary)" />
            <div style={{ overflow: 'hidden' }}>
              <div className="file-name">{selectedFile.name}</div>
              <div className="file-size">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</div>
            </div>
          </div>
          <button className="remove-file-btn" onClick={removeFile} aria-label="Remove document">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
