import staffData from '../data/staff';
import StaffCard from './StaffCard';
import './Staff.css';

export default function Staff() {
  return (
    <section className="staff" id="staff">
      <div className="staff-header">
        <h2 className="staff-title">
          Our Mentors <span className="staff-owl">🦉</span>
          <svg className="staff-title-underline" width="250" height="16" viewBox="0 0 250 16">
            <path d="M5,10 Q60,2 125,10 Q190,18 245,8" />
          </svg>
        </h2>
      </div>

      <div className="staff-grid">
        {staffData.map((member, index) => (
          <StaffCard
            key={member.id}
            staff={member}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
