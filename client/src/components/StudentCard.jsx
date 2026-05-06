import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentCard.css';

const PASTEL_COLORS = [
  'var(--pastel-yellow)',
  'var(--pastel-coral)',
  'var(--pastel-mint)',
  'var(--pastel-lavender)',
  'var(--pastel-sky)',
];

export default function StudentCard({ student, index }) {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const rotation = ((student.id * 7) % 11) - 5;
  const bgColor = PASTEL_COLORS[student.id % PASTEL_COLORS.length];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, (index % 10) * 80);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index]);

  const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const nameParts = student.name.split(' ');
  const shortName = nameParts.length > 2
    ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}`
    : student.name;

  return (
    <div
      className="student-card"
      ref={cardRef}
      onClick={() => navigate(`/student/${student.id}`)}
      style={{ '--rotation': `${rotation}deg` }}
    >
      <div className="student-card-tape" />
      <div className="student-card-photo" style={{ background: bgColor }}>
        {student.photo ? (
          <img src={student.photo} alt={student.name} />
        ) : (
          <span className="student-card-initials">{initials}</span>
        )}
      </div>
      <p className="student-card-name">{shortName}</p>
      <span className="student-card-badge">{student.rollNo}</span>
    </div>
  );
}
