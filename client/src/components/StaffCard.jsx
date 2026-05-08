import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffCard.css';

export default function StaffCard({ staff, index }) {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const rotation = ((staff.id * 5) % 7) - 3;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 120);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index]);

  const initials = staff.name.split(' ').filter(n => n.length > 2).map(n => n[0]).join('').slice(0, 2);

  return (
    <div
      className="staff-card"
      ref={cardRef}
      onClick={() => navigate(`/staff/${staff.id}`)}
      style={{ '--rotation': `${rotation}deg` }}
    >
      <div className="staff-card-tape" />
      <span className="staff-card-star">⭐</span>
      <div className="staff-card-photo">
        {staff.photo ? (
          <img 
            src={staff.photo} 
            alt={staff.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            loading="lazy" 
            decoding="async"
          />
        ) : (
          <span className="staff-card-initials">{initials}</span>
        )}
      </div>
      <p className="staff-card-name">{staff.name}</p>
      <p className="staff-card-subject">{staff.designation}</p>
    </div>
  );
}
