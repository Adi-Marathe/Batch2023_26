import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import studentsData from '../data/students';
import StudentCard from './StudentCard';
import './Students.css';

// Debounce hook — delays filtering until user stops typing (300ms)
// Prevents re-rendering 69 cards on every keystroke
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef(null);
  
  useEffect(() => {
    timer.current = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer.current);
  }, [value, delay]);
  
  return debounced;
}

export default function Students() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 250);

  // Memoize filtered list — only recomputes when debounced search changes
  const filtered = useMemo(() => {
    if (!debouncedSearch) return studentsData;
    const term = debouncedSearch.toLowerCase();
    return studentsData.filter(s => (
      (s.name && String(s.name).toLowerCase().includes(term)) ||
      (s.rollNo && String(s.rollNo).toLowerCase().includes(term)) ||
      (s.city && String(s.city).toLowerCase().includes(term)) ||
      (s.enrollmentNo && String(s.enrollmentNo).toLowerCase().includes(term))
    ));
  }, [debouncedSearch]);

  return (
    <section className="students" id="students">
      <div className="students-header">
        <h2 className="students-title">
          The Squad 👯
          <svg className="students-title-underline" width="250" height="16" viewBox="0 0 250 16">
            <path d="M5,10 Q60,2 125,10 Q190,18 245,8" />
          </svg>
        </h2>
      </div>

      <div className="students-search">
        <span className="students-search-icon">✏️</span>
        <input
          type="text"
          placeholder="Search by name, roll no, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="student-search"
        />
      </div>

      <div className="students-grid">
        {filtered.length === 0 ? (
          <p className="students-no-results">No legends found... 🤔</p>
        ) : (
          filtered.map((student, index) => (
            <StudentCard
              key={student.id}
              student={student}
              index={index}
            />
          ))
        )}
      </div>
    </section>
  );
}
