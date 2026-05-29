import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { useAuth } from './AuthContext';

const PaperContext = createContext();

export const PaperProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [papers, setPapers] = useState([]);
  const [allPapers, setAllPapers] = useState([]); // Persistent unfiltered database mirror for bookmarks/uploads
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced Filter Settings
  const [filters, setFilters] = useState({
    examType: '',
    semester: '',
    year: '',
    category: '', // e.g. CBSE, JEE, BTech, UPSC, etc.
    boardOrUniversity: ''
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // 1. Debounce the raw search term input (350ms delay) to optimize Supabase query performance
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. Fetch and query papers from Supabase dynamically based on Search & Refine Results filters
  const refreshPapers = async () => {
    setLoading(true);
    try {
      const data = await dbService.queryPapers(debouncedSearchTerm, filters);
      setPapers(data);
    } catch (error) {
      console.error('Error querying papers from database:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2b. Fetch the complete, unfiltered universe of papers once for persistent saved bookmark sections
  const fetchAllPapers = async () => {
    try {
      const data = await dbService.getPapers();
      setAllPapers(data);
    } catch (error) {
      console.error('Error fetching all papers for persistence store:', error);
    }
  };

  // Re-run search/filter query whenever debounced text or drop-down filters change
  useEffect(() => {
    refreshPapers();
  }, [debouncedSearchTerm, filters]);

  // Fetch full persistent list on mount and when currentUser changes
  useEffect(() => {
    fetchAllPapers();
  }, [currentUser]);

  // Fetch user specific bookmarks on login / change
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const paperIds = await dbService.getUserBookmarks(currentUser?.uid);
        setBookmarks(paperIds);
      } catch (error) {
        console.error('Error fetching user bookmarks:', error);
      }
    };
    fetchBookmarks();
  }, [currentUser]);

  // Upload Paper (Synchronizes both states statefully)
  const uploadPaper = async (paperData, file) => {
    try {
      const uploadedRecord = await dbService.uploadPaper(paperData, file, currentUser);
      setPapers(prev => [uploadedRecord, ...prev]);
      setAllPapers(prev => [uploadedRecord, ...prev]);
      return uploadedRecord;
    } catch (error) {
      throw error;
    }
  };

  // Toggle Save/Bookmark Paper
  const toggleBookmark = async (paperId) => {
    try {
      const { bookmarked } = await dbService.toggleBookmark(paperId, currentUser?.uid);
      setBookmarks(prev => {
        if (bookmarked) {
          return [...prev, paperId];
        } else {
          return prev.filter(id => id !== paperId);
        }
      });
      return bookmarked;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  };

  // Track Downloads count (Synchronizes both states statefully)
  const downloadPaper = async (paperId) => {
    try {
      await dbService.incrementDownloads(paperId);
      // Update download count locally in both lists
      setPapers(prev => 
        prev.map(p => p.id === paperId ? { ...p, downloadsCount: (p.downloadsCount || 0) + 1 } : p)
      );
      setAllPapers(prev => 
        prev.map(p => p.id === paperId ? { ...p, downloadsCount: (p.downloadsCount || 0) + 1 } : p)
      );
    } catch (error) {
      console.error('Error incrementing download:', error);
    }
  };

  // Delete Paper securely (Synchronizes both states statefully)
  const deletePaper = async (paperId) => {
    if (!currentUser) return;
    try {
      await dbService.deletePaper(paperId, currentUser.uid, currentUser.email);
      setPapers(prev => prev.filter(p => p.id !== paperId));
      setAllPapers(prev => prev.filter(p => p.id !== paperId));
    } catch (error) {
      console.error('Error deleting paper:', error);
      throw error;
    }
  };

  // Verify Paper status (Admin only helper)
  const verifyPaper = async (paperId, status) => {
    if (!currentUser) return;
    try {
      const updatedRecord = await dbService.verifyPaper(paperId, status);
      if (updatedRecord) {
        setPapers(prev => prev.map(p => p.id === paperId ? { ...p, verificationStatus: status } : p));
        setAllPapers(prev => prev.map(p => p.id === paperId ? { ...p, verificationStatus: status } : p));
      }
      return updatedRecord;
    } catch (error) {
      console.error('Error verifying paper:', error);
      throw error;
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      examType: '',
      semester: '',
      year: '',
      category: '',
      boardOrUniversity: ''
    });
    setSearchTerm('');
  };

  // Filter and Search Logic applied to state (for explorer UI)
  const filteredPapers = papers.filter(paper => {
    if (!paper) return false;
    
    // Safety check fallback fields
    const title = (paper.title || '').toLowerCase();
    const subjectName = (paper.subjectName || '').toLowerCase();
    const boardOrUni = (paper.boardOrUniversity || '').toLowerCase();
    const category = (paper.category || '').toLowerCase();
    const examType = (paper.examType || '').toLowerCase();
    const semester = (paper.semester || '').toLowerCase();
    const search = searchTerm.toLowerCase().trim();

    // 1. Search Query Match
    const matchesSearch = search === '' || 
      title.includes(search) ||
      subjectName.includes(search) ||
      boardOrUni.includes(search) ||
      category.includes(search);

    // 2. Exam Type Filter
    const matchesExamType = !filters.examType || examType === filters.examType.toLowerCase();

    // 3. Semester Filter
    const matchesSemester = !filters.semester || semester === filters.semester.toLowerCase();

    // 4. Year Filter
    const matchesYear = !filters.year || (paper.year || '').toString() === filters.year.toString();

    // 5. Category Filter
    const matchesCategory = !filters.category || category === filters.category.toLowerCase();

    // 6. Board/University Filter
    const matchesBoardOrUni = !filters.boardOrUniversity || 
      boardOrUni.includes(filters.boardOrUniversity.toLowerCase());

    return matchesSearch && matchesExamType && matchesSemester && matchesYear && matchesCategory && matchesBoardOrUni;
  });

  // Extract unique options from the current universe
  const uniqueBoards = Array.from(new Set(allPapers.map(p => p.boardOrUniversity))).filter(Boolean);
  const uniqueYears = Array.from(new Set(allPapers.map(p => p.year))).sort((a,b) => b - a);

  const value = {
    papers,
    allPapers,
    filteredPapers,
    bookmarks,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    resetFilters,
    uploadPaper,
    toggleBookmark,
    downloadPaper,
    deletePaper,
    verifyPaper,
    uniqueBoards,
    uniqueYears,
    refreshPapers,
    fetchAllPapers
  };

  return (
    <PaperContext.Provider value={value}>
      {children}
    </PaperContext.Provider>
  );
};

export const usePapers = () => {
  const context = useContext(PaperContext);
  if (!context) {
    throw new Error('usePapers must be used within a PaperProvider');
  }
  return context;
};
