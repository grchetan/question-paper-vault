import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { usePapers } from '../../context/PaperContext';
import './Dashboard.css';

export const FilterSidebar = () => {
  const { filters, setFilters, resetFilters } = usePapers();

  // Clean, emoji-free professional exam categories as requested by user
  const categories = [
    { label: 'All Courses & Exams (Show All)', value: '' },
    { label: 'CBSE Board', value: 'CBSE' },
    { label: 'ICSE Board', value: 'ICSE' },
    { label: 'MP Board', value: 'MP Board' },
    { label: 'State Boards', value: 'State Boards' },
    { label: 'School Classes (9-12)', value: 'School Classes' },
    { label: 'JEE Mains & Advanced', value: 'JEE' },
    { label: 'NEET Medical Entrance', value: 'NEET' },
    { label: 'GATE CS & IT', value: 'GATE' },
    { label: 'UPSC Civil Services', value: 'UPSC' },
    { label: 'SSC (CGL / CHSL)', value: 'SSC' },
    { label: 'Indian Railways (RRB)', value: 'Railway' },
    { label: 'Banking PO & Clerk', value: 'Banking' },
    { label: 'CUET (University Entrance)', value: 'CUET' },
    { label: 'B.Tech / B.E.', value: 'BTech' },
    { label: 'BCA (Computer Applications)', value: 'BCA' },
    { label: 'MCA (Post-Grad Computing)', value: 'MCA' },
    { label: 'Polytechnic Diploma', value: 'Diploma' },
    { label: 'College Exams', value: 'College Exams' },
    { label: 'University Exams', value: 'University Exams' }
  ];

  const boardsList = [
    { label: 'All Boards & Universities (Show All)', value: '' },
    { label: 'Central Board of Secondary Education (CBSE)', value: 'CBSE Board' },
    { label: 'Council for the Indian School Certificate Examinations', value: 'CISCE Board' },
    { label: 'Madhya Pradesh Board (MPBSE)', value: 'MPBSE Bhopal' },
    { label: 'National Testing Agency (NTA)', value: 'National Testing Agency (NTA)' },
    { label: 'Union Public Service Commission (UPSC)', value: 'Union Public Service Commission' },
    { label: 'IIT / JAB Entrance', value: 'IIT' },
    { label: 'Delhi Technological University (DTU)', value: 'Delhi Technological University (DTU)' },
    { label: 'Visvesvaraya Technological University (VTU)', value: 'VTU' },
    { label: 'University of Delhi (DU)', value: 'Delhi University' },
    { label: 'University of Mumbai', value: 'Mumbai University' },
    { label: 'Anna University', value: 'Anna University' }
  ];

  const examTypes = [
    { label: 'All Exam Formats (Show All)', value: '' },
    { label: 'Main / Final Board Exam', value: 'Main Exam' },
    { label: 'External Semester Exam', value: 'External' },
    { label: 'Internal Assessment', value: 'Internal' },
    { label: 'Mid Sem Exam', value: 'Mid Sem' },
    { label: 'Unit Test / Class Test', value: 'Unit Test' },
    { label: 'Preparatory / Mock Exam', value: 'Preparatory' }
  ];

  const semesters = [
    { label: 'All Semesters (Show All)', value: '' },
    { label: 'Semester 1', value: 'Sem 1' },
    { label: 'Semester 2', value: 'Sem 2' },
    { label: 'Semester 3', value: 'Sem 3' },
    { label: 'Semester 4', value: 'Sem 4' },
    { label: 'Semester 5', value: 'Sem 5' },
    { label: 'Semester 6', value: 'Sem 6' },
    { label: 'Semester 7', value: 'Sem 7' },
    { label: 'Semester 8', value: 'Sem 8' },
    { label: 'Not Applicable (School/Competitive)', value: 'N/A' }
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const isAnyFilterActive = Object.values(filters).some(val => val !== '');

  return (
    <aside className="filter-sidebar anim-slide-up">
      <div className="filter-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={16} color="var(--primary)" />
          <h3>Refine Results</h3>
        </div>
        {isAnyFilterActive && (
          <button className="clear-filters-btn" onClick={resetFilters} aria-label="Clear all selections">
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Category Selection */}
      <div className="filter-group">
        <label htmlFor="filter-category">Category / Field</label>
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="filter-select"
        >
          {categories.map((c, idx) => (
            <option key={idx} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Exam Type Selection */}
      <div className="filter-group">
        <label htmlFor="filter-examType">Exam Format</label>
        <select
          id="filter-examType"
          value={filters.examType}
          onChange={(e) => handleFilterChange('examType', e.target.value)}
          className="filter-select"
        >
          {examTypes.map((e, idx) => (
            <option key={idx} value={e.value}>{e.label}</option>
          ))}
        </select>
      </div>

      {/* Semester Selection */}
      <div className="filter-group">
        <label htmlFor="filter-semester">Semester</label>
        <select
          id="filter-semester"
          value={filters.semester}
          onChange={(e) => handleFilterChange('semester', e.target.value)}
          className="filter-select"
        >
          {semesters.map((s, idx) => (
            <option key={idx} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Year Selection */}
      <div className="filter-group">
        <label htmlFor="filter-year">Year</label>
        <select
          id="filter-year"
          value={filters.year}
          onChange={(e) => handleFilterChange('year', e.target.value)}
          className="filter-select"
        >
          <option value="">-- Select Year --</option>
          {Array.from({ length: 9 }, (_, i) => 2026 - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Board or University Selection */}
      <div className="filter-group" style={{ marginBottom: '8px' }}>
        <label htmlFor="filter-board">Board / University</label>
        <select
          id="filter-board"
          value={filters.boardOrUniversity}
          onChange={(e) => handleFilterChange('boardOrUniversity', e.target.value)}
          className="filter-select"
        >
          {boardsList.map((b, idx) => (
            <option key={idx} value={b.value}>{b.label}</option>
          ))}
        </select>
      </div>

      {/* Always Visible "Show All Papers" Reset Button */}
      <button
        className="btn btn-secondary"
        style={{
          width: '100%',
          marginTop: '16px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          fontWeight: '600'
        }}
        onClick={resetFilters}
      >
        <RotateCcw size={14} />
        <span>Show All Papers (Reset)</span>
      </button>
    </aside>
  );
};
