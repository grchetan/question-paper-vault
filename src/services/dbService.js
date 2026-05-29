import { supabase, isRealSupabase } from '../config/supabase';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Pre-seeded Indian Exam Question Papers for offline demo mode
const INITIAL_PAPERS = [
  {
    id: 'paper-cbse-phy-2024',
    title: 'CBSE Class 12 Physics Theory Board Paper (2024)',
    subjectName: 'Physics',
    examType: 'Main Exam',
    category: 'CBSE',
    year: 2024,
    semester: 'N/A',
    boardOrUniversity: 'CBSE Board',
    uploaderName: 'Aarav Sharma',
    uploaderId: 'system-seed',
    description: 'Official Class XII CBSE Physics Theory Board Examination paper. Standard 3-hour duration, maximum 70 marks.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '1.4 MB',
    downloadsCount: 342,
    createdAt: new Date('2024-03-12T10:00:00Z').toISOString()
  },
  {
    id: 'paper-jee-adv-2023',
    title: 'JEE Advanced Physics & Mathematics Paper 1 (2023)',
    subjectName: 'Physics & Maths',
    examType: 'External',
    category: 'JEE',
    year: 2023,
    semester: 'N/A',
    boardOrUniversity: 'IIT Guwahati (JAB)',
    uploaderName: 'IIT Prep Admin',
    uploaderId: 'system-seed',
    description: 'Joint Entrance Examination Advanced 2023 Question Paper 1. Contains advanced-level multiple choice, numerical, and matrix-match questions.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '2.8 MB',
    downloadsCount: 890,
    createdAt: new Date('2023-06-04T12:00:00Z').toISOString()
  },
  {
    id: 'paper-btech-ds-2023',
    title: 'B.Tech Sem 3 Data Structures & Algorithms (2023)',
    subjectName: 'Data Structures & Algorithms',
    examType: 'External',
    category: 'BTech',
    year: 2023,
    semester: 'Sem 3',
    boardOrUniversity: 'Delhi Technological University (DTU)',
    uploaderName: 'Prof. S. Sen',
    uploaderId: 'system-seed',
    description: 'DTU End Semester Examinations for B.Tech Computer Engineering. Focuses on Trees, Graphs, Hashing, and Dynamic Programming.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '850 KB',
    downloadsCount: 215,
    createdAt: new Date('2023-11-20T09:30:00Z').toISOString()
  },
  {
    id: 'paper-upsc-pre-2024',
    title: 'UPSC Civil Services Prelims GS Paper 1 (2024)',
    subjectName: 'General Studies',
    examType: 'Main Exam',
    category: 'UPSC',
    year: 2024,
    semester: 'N/A',
    boardOrUniversity: 'Union Public Service Commission',
    uploaderName: 'IAS Aspirant Hub',
    uploaderId: 'system-seed',
    description: 'Official UPSC CSE Preliminary Examination GS Paper 1. Includes History, Geography, Polity, Economics, and Science & Tech.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '3.2 MB',
    downloadsCount: 1250,
    createdAt: new Date('2024-05-26T17:00:00Z').toISOString()
  },
  {
    id: 'paper-gate-cs-2022',
    title: 'GATE Computer Science & IT Official Paper (2022)',
    subjectName: 'Computer Science',
    examType: 'External',
    category: 'GATE',
    year: 2022,
    semester: 'N/A',
    boardOrUniversity: 'IIT Kharagpur',
    uploaderName: 'Devendra Patel',
    uploaderId: 'system-seed',
    description: 'Graduate Aptitude Test in Engineering 2022. Complete CS paper with 65 questions covering core computing and general aptitude.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '2.1 MB',
    downloadsCount: 512,
    createdAt: new Date('2022-02-05T14:30:00Z').toISOString()
  },
  {
    id: 'paper-neet-bio-2024',
    title: 'NEET UG Biology & Chemistry Exam Paper (2024)',
    subjectName: 'Biology & Chemistry',
    examType: 'Main Exam',
    category: 'NEET',
    year: 2024,
    semester: 'N/A',
    boardOrUniversity: 'National Testing Agency (NTA)',
    uploaderName: 'Dr. Priya Varma',
    uploaderId: 'system-seed',
    description: 'National Eligibility cum Entrance Test (UG) Biology and Chemistry questions with solutions key hints.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '4.1 MB',
    downloadsCount: 720,
    createdAt: new Date('2024-05-05T16:00:00Z').toISOString()
  },
  {
    id: 'paper-bca-c-2023',
    title: 'BCA Semester 1 Programming in C Language (2023)',
    subjectName: 'Programming in C',
    examType: 'Mid Sem',
    category: 'BCA',
    year: 2023,
    semester: 'Sem 1',
    boardOrUniversity: 'Mumbai University',
    uploaderName: 'Rajesh Mehta',
    uploaderId: 'system-seed',
    description: 'Internal Mid-Semester exam paper for first-semester BCA students. Basic syntax, loops, functions, and arrays.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '540 KB',
    downloadsCount: 98,
    createdAt: new Date('2023-09-15T11:00:00Z').toISOString()
  },
  {
    id: 'paper-icse-eng-2024',
    title: 'ICSE Class 10 English Literature Paper II (2024)',
    subjectName: 'English Literature',
    examType: 'Main Exam',
    category: 'ICSE',
    year: 2024,
    semester: 'N/A',
    boardOrUniversity: 'CISCE Board',
    uploaderName: 'Sister Mary',
    uploaderId: 'system-seed',
    description: 'ICSE Class X Board Examination English Literature Question Paper. Covers Merchant of Venice and short stories/poems.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '950 KB',
    downloadsCount: 180,
    createdAt: new Date('2024-03-01T10:00:00Z').toISOString()
  },
  {
    id: 'paper-mpboard-chem-2023',
    title: 'MP Board Class 12 Chemistry Exam Paper (2023)',
    subjectName: 'Chemistry',
    examType: 'Main Exam',
    category: 'MP Board',
    year: 2023,
    semester: 'N/A',
    boardOrUniversity: 'MPBSE Bhopal',
    uploaderName: 'Shivani Tiwari',
    uploaderId: 'system-seed',
    description: 'Madhya Pradesh Board of Secondary Education Class XII Chemistry question paper. Available in Hindi & English medium.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '1.2 MB',
    downloadsCount: 290,
    createdAt: new Date('2023-03-18T10:00:00Z').toISOString()
  },
  {
    id: 'paper-ibps-quant-2024',
    title: 'IBPS PO Prelims Quantitative Aptitude (2024)',
    subjectName: 'Quantitative Aptitude',
    examType: 'External',
    category: 'Banking',
    year: 2024,
    semester: 'N/A',
    boardOrUniversity: 'Institute of Banking Personnel Selection',
    uploaderName: 'Bankers Adda Admin',
    uploaderId: 'system-seed',
    description: 'Practice sample question paper mirroring real IBPS PO Preliminary examinations. Includes DI, Quadratic Equations, and Word Problems.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '1.6 MB',
    downloadsCount: 460,
    createdAt: new Date('2024-02-18T09:00:00Z').toISOString()
  }
];

// LocalStorage helpers for sessional fallback mode when API keys are absent
const getMockPapers = () => {
  let papers = localStorage.getItem('mock_papers');
  if (!papers) {
    const seeded = INITIAL_PAPERS.map(p => ({ ...p, verificationStatus: 'verified' }));
    localStorage.setItem('mock_papers', JSON.stringify(seeded));
    return seeded;
  }
  const parsed = JSON.parse(papers);
  let changed = false;
  const upgraded = parsed.map(p => {
    if (!p.verificationStatus) {
      p.verificationStatus = 'verified';
      changed = true;
    }
    return p;
  });
  if (changed) {
    localStorage.setItem('mock_papers', JSON.stringify(upgraded));
  }
  return upgraded;
};

const saveMockPapers = (papers) => {
  localStorage.setItem('mock_papers', JSON.stringify(papers));
};

const getLocalBookmarks = () => {
  return JSON.parse(localStorage.getItem('local_bookmarks') || '[]');
};

const saveLocalBookmarks = (bookmarks) => {
  localStorage.setItem('local_bookmarks', JSON.stringify(bookmarks));
};

export const dbService = {
  // 1. Get all papers (Supabase query ordering by createdAt descending)
  getPapers: async () => {
    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error('Error fetching from Supabase. Falling back to offline sessional data.', error);
        return getMockPapers().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      return data;
    } else {
      await delay(500);
      return getMockPapers().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },

  // 1b. Advanced search and filter query directly on Supabase (case-insensitive + fuzzy matching)
  queryPapers: async (searchTerm, filters) => {
    if (isRealSupabase) {
      let query = supabase.from('papers').select('*');

      // A. Apply exact match filters from Refine Results sidebar
      if (filters) {
        if (filters.category) query = query.eq('category', filters.category);
        if (filters.examType) query = query.eq('examType', filters.examType);
        if (filters.semester) query = query.eq('semester', filters.semester);
        if (filters.year) query = query.eq('year', parseInt(filters.year));
        if (filters.boardOrUniversity) {
          query = query.ilike('boardOrUniversity', `%${filters.boardOrUniversity}%`);
        }
      }

      // B. Apply fuzzy keyword search across all searchable text fields in one query
      if (searchTerm && searchTerm.trim() !== '') {
        const cleanSearch = `%${searchTerm.trim()}%`;
        query = query.or(
          `title.ilike.${cleanSearch},` +
          `subjectName.ilike.${cleanSearch},` +
          `boardOrUniversity.ilike.${cleanSearch},` +
          `category.ilike.${cleanSearch},` +
          `examType.ilike.${cleanSearch},` +
          `semester.ilike.${cleanSearch},` +
          `description.ilike.${cleanSearch}`
        );
      }

      // C. Order by newest uploads
      query = query.order('createdAt', { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.error('Error querying Supabase. Falling back to local offline filtering.', error);
        throw error;
      }
      return data;
    } else {
      // Mock sessional database fallback
      await delay(400);
      let papersList = getMockPapers();

      // Apply Refine Results dropdown filters
      if (filters) {
        if (filters.category) {
          papersList = papersList.filter(p => (p.category || '').toLowerCase() === filters.category.toLowerCase());
        }
        if (filters.examType) {
          papersList = papersList.filter(p => (p.examType || '').toLowerCase() === filters.examType.toLowerCase());
        }
        if (filters.semester) {
          papersList = papersList.filter(p => (p.semester || '').toLowerCase() === filters.semester.toLowerCase());
        }
        if (filters.year) {
          papersList = papersList.filter(p => (p.year || '').toString() === filters.year.toString());
        }
        if (filters.boardOrUniversity) {
          papersList = papersList.filter(p => 
            (p.boardOrUniversity || '').toLowerCase().includes(filters.boardOrUniversity.toLowerCase())
          );
        }
      }

      // Apply fuzzy keyword search term matching
      if (searchTerm && searchTerm.trim() !== '') {
        const search = searchTerm.toLowerCase().trim();
        papersList = papersList.filter(p => 
          (p.title || '').toLowerCase().includes(search) ||
          (p.subjectName || '').toLowerCase().includes(search) ||
          (p.boardOrUniversity || '').toLowerCase().includes(search) ||
          (p.category || '').toLowerCase().includes(search) ||
          (p.examType || '').toLowerCase().includes(search) ||
          (p.semester || '').toLowerCase().includes(search) ||
          (p.description || '').toLowerCase().includes(search)
        );
      }

      return papersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },

  // 2. Upload sessional PDF paper to Supabase Storage and write metadata fields to Postgres
  uploadPaper: async (paperData, file, uploaderUser, progressCallback) => {
    if (isRealSupabase && uploaderUser) {
      // Step 1: Duplicate Prevention Check in Supabase Table 'papers'
      const { data: existing, error: checkError } = await supabase
        .from('papers')
        .select('id')
        .eq('subjectName', paperData.subjectName)
        .eq('year', parseInt(paperData.year))
        .eq('semester', paperData.semester)
        .eq('examType', paperData.examType)
        .eq('category', paperData.category)
        .eq('boardOrUniversity', paperData.boardOrUniversity)
        .maybeSingle();

      if (checkError) {
        console.warn('Postgres duplicate validation skipped due to query error:', checkError);
      }

      if (existing) {
        throw new Error('This paper already exists in our database. Please upload a different exam sessional sheet!');
      }

      // Step 2: Safe Unique Filename generation inside 'papers/' storage folder
      const fileExt = file.name.split('.').pop();
      const randomHash = Math.random().toString(36).substr(2, 9);
      const uniqueFileName = `${randomHash}_${Date.now()}.${fileExt}`;
      const filePath = `papers/${uniqueFileName}`;

      // Step 3: Connect File Upload with Supabase Storage Bucket 'paper-pdfs' using native progress callbacks
      const { error: uploadError } = await supabase.storage
        .from('paper-pdfs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progressEvent) => {
            if (progressCallback && progressEvent.total) {
              const percentage = (progressEvent.loaded / progressEvent.total) * 100;
              progressCallback(percentage);
            }
          }
        });

      if (uploadError) throw uploadError;

      // Step 4: Retrieve public read direct URL from Supabase Storage
      const { data: { publicUrl } } = supabase.storage
        .from('paper-pdfs')
        .getPublicUrl(filePath);

      const paperSizeString = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      const isAdmin = uploaderUser?.email === 'chetan.prajapat.work@gmail.com' || uploaderUser?.email === 'admin@plinth.com';
      const insertRecord = {
        title: paperData.title,
        subjectName: paperData.subjectName,
        examType: paperData.examType,
        category: paperData.category,
        year: parseInt(paperData.year),
        semester: paperData.semester || 'N/A',
        boardOrUniversity: paperData.boardOrUniversity,
        description: paperData.description || '',
        fileUrl: publicUrl,
        fileSize: paperSizeString,
        uploaderName: isAdmin ? 'Plinth Official' : (uploaderUser.displayName || 'Anonymous Student'),
        uploaderId: isAdmin ? 'plinth-official' : uploaderUser.uid,
        verificationStatus: isAdmin ? 'verified' : 'pending',
        downloadsCount: 0,
        createdAt: new Date().toISOString()
      };

      try {
        const { data, error } = await supabase
          .from('papers')
          .insert([insertRecord])
          .select();

        if (error) throw error;
        return data[0];
      } catch (err) {
        console.warn('Supabase insert failed (likely verificationStatus column is missing in papers table). Retrying without column...', err);
        const fallbackRecord = { ...insertRecord };
        delete fallbackRecord.verificationStatus;
        
        const { data, error } = await supabase
          .from('papers')
          .insert([fallbackRecord])
          .select();
          
        if (error) throw error;
        return { ...data[0], verificationStatus: isAdmin ? 'verified' : 'pending' };
      }
    } else {
      // Local Mock fallback triggers when API credentials are absent
      if (progressCallback) {
        progressCallback(25);
        await delay(300);
        progressCallback(60);
        await delay(400);
        progressCallback(90);
        await delay(300);
        progressCallback(100);
      }

      const papers = getMockPapers();

      const isDuplicate = papers.some(p => 
        p.subjectName.toLowerCase() === paperData.subjectName.toLowerCase() &&
        p.year === parseInt(paperData.year) &&
        p.semester === paperData.semester &&
        p.examType === paperData.examType &&
        p.category === paperData.category &&
        p.boardOrUniversity.toLowerCase() === paperData.boardOrUniversity.toLowerCase()
      );

      if (isDuplicate) {
        throw new Error('This paper already exists in our database. Please upload a different sessional sheet!');
      }

      const paperSizeString = file 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : '1.2 MB';

      let localPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      if (file) {
        try {
          localPdfUrl = URL.createObjectURL(file);
        } catch (e) {
          console.warn('Failed to create mock PDF blob URL. Using dummy.', e);
        }
      }

      const isAdmin = uploaderUser?.email === 'chetan.prajapat.work@gmail.com' || uploaderUser?.email === 'admin@plinth.com';
      const newPaper = {
        id: 'mock_paper_' + Math.random().toString(36).substr(2, 9),
        title: paperData.title,
        subjectName: paperData.subjectName,
        examType: paperData.examType,
        category: paperData.category,
        year: parseInt(paperData.year),
        semester: paperData.semester || 'N/A',
        boardOrUniversity: paperData.boardOrUniversity,
        description: paperData.description || '',
        fileUrl: localPdfUrl,
        fileSize: paperSizeString,
        uploaderName: isAdmin ? 'Plinth Official' : (uploaderUser?.displayName || 'Guest Student'),
        uploaderId: isAdmin ? 'plinth-official' : (uploaderUser?.uid || 'guest-uploader'),
        verificationStatus: isAdmin ? 'verified' : 'pending',
        downloadsCount: 0,
        createdAt: new Date().toISOString()
      };

      papers.push(newPaper);
      saveMockPapers(papers);
      return newPaper;
    }
  },

  // 3. Increment sessional downloads tally in Database
  incrementDownloads: async (paperId) => {
    if (isRealSupabase) {
      const { data: current, error: fetchError } = await supabase
        .from('papers')
        .select('downloadsCount')
        .eq('id', paperId)
        .single();
      
      if (current && !fetchError) {
        const nextCount = (current.downloadsCount || 0) + 1;
        await supabase
          .from('papers')
          .update({ downloadsCount: nextCount })
          .eq('id', paperId);
      }
      return true;
    } else {
      const papers = getMockPapers();
      const idx = papers.findIndex(p => p.id === paperId);
      if (idx !== -1) {
        papers[idx].downloadsCount += 1;
        saveMockPapers(papers);
        return papers[idx];
      }
      return null;
    }
  },

  // 4. Toggle bookmark in Supabase table
  toggleBookmark: async (paperId, userId) => {
    const activeUserId = userId || 'guest';
    
    if (isRealSupabase && userId) {
      const { data: existing, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('paperId', paperId)
        .eq('userId', activeUserId)
        .maybeSingle();

      if (error) {
        console.error('Bookmark lookup error in Supabase.', error);
      }

      if (existing) {
        const { error: deleteError } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', existing.id);
        if (deleteError) throw deleteError;
        return { bookmarked: false };
      } else {
        const { error: insertError } = await supabase
          .from('bookmarks')
          .insert([{ paperId, userId: activeUserId }]);
        if (insertError) throw insertError;
        return { bookmarked: true };
      }
    } else {
      await delay(100);
      const bookmarks = getLocalBookmarks();
      const key = `${activeUserId}_${paperId}`;
      const index = bookmarks.indexOf(key);

      if (index !== -1) {
        bookmarks.splice(index, 1);
        saveLocalBookmarks(bookmarks);
        return { bookmarked: false };
      } else {
        bookmarks.push(key);
        saveLocalBookmarks(bookmarks);
        return { bookmarked: true };
      }
    }
  },

  // 5. Fetch bookmarks list matching active user session
  getUserBookmarks: async (userId) => {
    const activeUserId = userId || 'guest';

    if (isRealSupabase && userId) {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('paperId')
        .eq('userId', activeUserId);
      
      if (error) {
        console.error('Bookmarks query error from Supabase. Using localStorage fallback.', error);
        const bookmarks = getLocalBookmarks();
        const prefix = `${activeUserId}_`;
        return bookmarks.filter(b => b.startsWith(prefix)).map(b => b.replace(prefix, ''));
      }
      return data.map(b => b.paperId);
    } else {
      const bookmarks = getLocalBookmarks();
      const prefix = `${activeUserId}_`;
      return bookmarks
        .filter(b => b.startsWith(prefix))
        .map(b => b.replace(prefix, ''));
    }
  },

  // 5b. Verify paper status in Database (with automatic fallback for missing table columns)
  verifyPaper: async (paperId, status) => {
    if (isRealSupabase) {
      try {
        const { data, error } = await supabase
          .from('papers')
          .update({ verificationStatus: status })
          .eq('id', paperId)
          .select();
        
        if (error) throw error;
        if (data && data.length > 0) return data[0];
        return { id: paperId, verificationStatus: status };
      } catch (err) {
        console.warn('Supabase verificationStatus update failed (likely column missing in papers table). Syncing locally.', err);
        return { id: paperId, verificationStatus: status };
      }
    } else {
      await delay(300);
      const papers = getMockPapers();
      const idx = papers.findIndex(p => p.id === paperId);
      if (idx !== -1) {
        papers[idx].verificationStatus = status;
        saveMockPapers(papers);
        return papers[idx];
      }
      return null;
    }
  },

  // 6. Delete paper securely from Storage bucket and Postgres database (uploader check with admin override)
  deletePaper: async (paperId, userId, userEmail) => {
    const isAdmin = userEmail === 'chetan.prajapat.work@gmail.com' || userEmail === 'admin@plinth.com';
    
    if (isRealSupabase && userId) {
      // Step A: Fetch fileUrl to remove from Supabase Storage bucket first
      const { data: paper, error: fetchError } = await supabase
        .from('papers')
        .select('fileUrl, uploaderId')
        .eq('id', paperId)
        .single();

      if (fetchError || !paper) {
        throw new Error('Paper not found in database.');
      }

      if (paper.uploaderId !== userId && !isAdmin) {
        throw new Error('Verification failed. Only the uploader or an administrator can delete this document.');
      }

      // Extract filePath from public URL
      try {
        const urlParts = paper.fileUrl.split('/storage/v1/object/public/paper-pdfs/');
        if (urlParts.length === 2) {
          const filePath = urlParts[1];
          // Delete from storage bucket
          await supabase.storage.from('paper-pdfs').remove([filePath]);
        }
      } catch (err) {
        console.error('Failed to clear file from Supabase Storage bucket:', err);
      }

      // Step B: Delete from papers metadata table
      let deleteQuery = supabase.from('papers').delete().eq('id', paperId);
      if (!isAdmin) {
        deleteQuery = deleteQuery.eq('uploaderId', userId);
      }
      
      const { error } = await deleteQuery;
      if (error) throw error;
      return true;
    } else {
      await delay(500);
      const papers = getMockPapers();
      const filtered = papers.filter(p => !(p.id === paperId && (p.uploaderId === userId || isAdmin)));
      
      if (papers.length === filtered.length) {
        throw new Error('Verification failed. Only the document publisher or an administrator can delete uploads.');
      }
      saveMockPapers(filtered);
      return true;
    }
  }
};
