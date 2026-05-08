import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoCalendarOutline, IoLocationOutline, IoChatbubbleOutline, IoRocketOutline, IoPersonOutline, IoDocumentTextOutline, IoCardOutline } from 'react-icons/io5';
import studentsData from '../data/students';
import EditProfileModal from './EditProfileModal';
import './StudentProfile.css';

const PASTEL_COLORS = [
  'var(--pastel-yellow)',
  'var(--pastel-coral)',
  'var(--pastel-mint)',
  'var(--pastel-lavender)',
  'var(--pastel-sky)',
];

export default function StudentProfile() {
  const { id } = useParams();

  const student = studentsData.find(s => s.id === Number(id));

  const [profileData, setProfileData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const loggedInUserEnrollmentNo = localStorage.getItem('userEnrollmentNo');
  const canEdit = student && loggedInUserEnrollmentNo === student.enrollmentNo;

  useEffect(() => {
    if (student && student.enrollmentNo) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students/${student.enrollmentNo}`)
        .then(res => res.json())
        .then(data => {
          if (data) setProfileData(data);
        })
        .catch(err => console.error(err));
    }
  }, [student]);

  if (!student) {
    return (
      <div className="student-profile">
        <div className="student-profile-notfound">
          <h2>Student not found 😕</h2>
        </div>
      </div>
    );
  }

  const bgColor = PASTEL_COLORS[student.id % PASTEL_COLORS.length];
  const nameParts = student.name.trim().split(/\s+/);
  const initials = nameParts.length > 1 
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : (nameParts[0][0] || '').toUpperCase();

  const fields = [
    { icon: <IoPersonOutline />, label: 'Full Name', value: student.name },
    { icon: <IoDocumentTextOutline />, label: 'Roll Number', value: student.rollNo },
    ...(student.enrollmentNo ? [{ icon: <IoCardOutline />, label: 'Enrollment No', value: student.enrollmentNo }] : []),
    { icon: <IoCalendarOutline />, label: 'Date of Birth', value: profileData?.dob || 'Still calculating their age 🧮' },
    { icon: <IoLocationOutline />, label: 'City', value: profileData?.city || student.city || 'Lost in the wilderness 🏕️' },
    { icon: <IoChatbubbleOutline />, label: 'Core Memory', value: profileData?.coreMemory || 'Brain empty, no thoughts 🫥' },
    { icon: <IoRocketOutline />, label: 'Current Status', value: profileData?.currentStatus || 'Sleeping in class 😴' },
    { icon: <IoRocketOutline />, label: 'Dream', value: profileData?.dream || student.dream || 'To survive the next semester 😅' },
    { icon: <IoChatbubbleOutline />, label: 'College Life in 3 Emojis', value: profileData?.emojis || '🤷‍♂️🤷‍♀️🤷' },
  ];

  return (
    <div className="student-profile">
      <div className="student-profile-content">
        <div className="student-profile-left">
          <div className="student-profile-polaroid">
            <div className="student-profile-tape" />
            <div className="student-profile-photo" style={{ background: bgColor }}>
              {student.photo ? (
                <img src={student.photo} alt={student.name} />
              ) : (
                <span className="student-profile-initials">{initials}</span>
              )}
            </div>
          </div>
          <p className="student-profile-name-under-photo">{student.name}</p>
          {canEdit && (
            <button 
              className="student-modal-edit-btn" 
              style={{ marginTop: '1rem' }}
              onClick={() => setIsEditModalOpen(true)}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        <div className="student-profile-right">
          <h1 className="student-profile-header-name">{student.name}</h1>
          <span className="student-profile-roll">{student.rollNo}</span>
          <div className="student-profile-divider" />
          <div className="student-profile-fields">
            {fields.map((field, i) => (
              <div key={i} className="student-profile-field" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="student-profile-field-label">{field.icon} {field.label}</span>
                <span className={`student-profile-field-value ${field.isQuote ? 'quote' : ''}`}>{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        student={student} 
        profileData={profileData} 
        onSaveSuccess={(newData) => setProfileData(newData)}
      />
    </div>
  );
}
