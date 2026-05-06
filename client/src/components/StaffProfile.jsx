import { useParams } from 'react-router-dom';
import { IoPersonOutline, IoBriefcaseOutline, IoBookOutline, IoFlashOutline, IoChatbubblesOutline } from 'react-icons/io5';
import staffData from '../data/staff';
import './StaffProfile.css';

export default function StaffProfile() {
  const { id } = useParams();

  const staff = staffData.find(s => s.id === Number(id));

  if (!staff) {
    return (
      <div className="staff-profile">
        <div className="staff-profile-notfound">
          <h2>Staff member not found 😕</h2>
        </div>
      </div>
    );
  }

  const initials = staff.name.split(' ').filter(n => n.length > 2).map(n => n[0]).join('').slice(0, 2);

  const fields = [
    { icon: <IoPersonOutline />, label: 'Full Name', value: staff.name },
    { icon: <IoBriefcaseOutline />, label: 'Designation', value: staff.designation },
    { icon: <IoBookOutline />, label: 'Subject', value: staff.subject },
    { icon: <IoFlashOutline />, label: 'Known For', value: staff.knownFor },
    { icon: <IoChatbubblesOutline />, label: 'Best Advice Given', value: `"${staff.advice}"`, isAdvice: true },
  ];

  return (
    <div className="staff-profile">
      <div className="staff-profile-content">
        <div className="staff-profile-left">
          <div className="staff-profile-polaroid">
            <div className="staff-profile-tape" />
            <span className="staff-profile-star">⭐</span>
            <div className="staff-profile-photo">
              {staff.photo ? (
                <img src={staff.photo} alt={staff.name} />
              ) : (
                <span className="staff-profile-initials">{initials}</span>
              )}
            </div>
          </div>
          <p className="staff-profile-name-under-photo">{staff.name}</p>
        </div>

        <div className="staff-profile-right">
          <h1 className="staff-profile-header-name">{staff.name}</h1>
          <span className="staff-profile-designation">{staff.designation}</span>
          <div className="staff-profile-divider" />
          <div className="staff-profile-fields">
            {fields.map((field, i) => (
              <div key={i} className="staff-profile-field" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="staff-profile-field-label">{field.icon} {field.label}</span>
                <span className={`staff-profile-field-value ${field.isAdvice ? 'advice' : ''}`}>{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
