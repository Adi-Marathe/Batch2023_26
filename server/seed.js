const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('./models/Student');
const Staff = require('./models/Staff');

const students = [
  { name: "Aarav Sharma", rollNo: "BCS-001", dob: "15 Mar 2005", city: "Mumbai", quote: "Code is poetry written in logic.", dream: "Build the next big startup" },
  { name: "Ananya Patel", rollNo: "BCS-002", dob: "22 Jul 2004", city: "Ahmedabad", quote: "Dream big, start small.", dream: "AI Researcher at Google" },
  { name: "Arjun Reddy", rollNo: "BCS-003", dob: "08 Jan 2005", city: "Hyderabad", quote: "Stay hungry, stay foolish.", dream: "Game Developer" },
  { name: "Diya Nair", rollNo: "BCS-004", dob: "30 Sep 2004", city: "Kochi", quote: "Creativity is intelligence having fun.", dream: "UX Designer at Apple" },
  { name: "Ethan D'Souza", rollNo: "BCS-005", dob: "14 Feb 2005", city: "Goa", quote: "Life is short, write clean code.", dream: "Full-Stack Freelancer" },
  { name: "Fatima Khan", rollNo: "BCS-006", dob: "19 Nov 2004", city: "Lucknow", quote: "Hustle in silence, let success roar.", dream: "Data Scientist" },
  { name: "Gautam Iyer", rollNo: "BCS-007", dob: "25 Apr 2005", city: "Chennai", quote: "Bugs are just features in disguise.", dream: "Cybersecurity Expert" },
  { name: "Harsh Mehta", rollNo: "BCS-008", dob: "03 Aug 2004", city: "Surat", quote: "Think different, code different.", dream: "Cloud Architect" },
  { name: "Isha Verma", rollNo: "BCS-009", dob: "11 Dec 2004", city: "Delhi", quote: "The future belongs to the curious.", dream: "ML Engineer" },
  { name: "Jay Kulkarni", rollNo: "BCS-010", dob: "07 Jun 2005", city: "Pune", quote: "Simplicity is the soul of efficiency.", dream: "Product Manager at Meta" },
  { name: "Kavya Rao", rollNo: "BCS-011", dob: "28 Oct 2004", city: "Bangalore", quote: "Innovation distinguishes leaders.", dream: "Tech Entrepreneur" },
  { name: "Lakshya Singh", rollNo: "BCS-012", dob: "16 May 2005", city: "Jaipur", quote: "Work hard, nap harder.", dream: "DevOps Engineer" },
  { name: "Meera Joshi", rollNo: "BCS-013", dob: "09 Mar 2004", city: "Nashik", quote: "She believed she could, so she coded it.", dream: "Blockchain Developer" },
  { name: "Nikhil Gupta", rollNo: "BCS-014", dob: "21 Sep 2005", city: "Kanpur", quote: "Ctrl+S your dreams.", dream: "Software Architect" },
  { name: "Ojasvi Mishra", rollNo: "BCS-015", dob: "04 Jan 2004", city: "Bhopal", quote: "Every expert was once a beginner.", dream: "Open Source Contributor" },
  { name: "Pranav Desai", rollNo: "BCS-016", dob: "12 Jul 2005", city: "Vadodara", quote: "Debug the world.", dream: "Embedded Systems Engineer" },
  { name: "Qureshi Zain", rollNo: "BCS-017", dob: "18 Feb 2004", city: "Bhopal", quote: "Knowledge is the new currency.", dream: "AI Ethics Researcher" },
  { name: "Riya Kapoor", rollNo: "BCS-018", dob: "26 Nov 2005", city: "Chandigarh", quote: "Design is thinking made visual.", dream: "Creative Director" },
  { name: "Sahil Thakur", rollNo: "BCS-019", dob: "01 Aug 2004", city: "Shimla", quote: "Mountains teach patience; code teaches persistence.", dream: "Remote Developer, Mountain Life" },
  { name: "Tanvi Agarwal", rollNo: "BCS-020", dob: "13 Apr 2005", city: "Agra", quote: "Build bridges, not walls — in code and life.", dream: "Social Impact Technologist" },
  { name: "Uday Chauhan", rollNo: "BCS-021", dob: "29 Dec 2004", city: "Indore", quote: "The only way to do great work is to love what you do.", dream: "VP of Engineering" },
  { name: "Vidya Suresh", rollNo: "BCS-022", dob: "06 Jun 2005", city: "Trivandrum", quote: "Learn, unlearn, relearn.", dream: "Quantum Computing Researcher" },
  { name: "Wahid Ali", rollNo: "BCS-023", dob: "20 Oct 2004", city: "Aligarh", quote: "Progress, not perfection.", dream: "Mobile App Developer" },
  { name: "Xena Fernandes", rollNo: "BCS-024", dob: "17 Mar 2005", city: "Mangalore", quote: "Break things, then fix them better.", dream: "Startup Founder" },
  { name: "Yash Pandey", rollNo: "BCS-025", dob: "05 Sep 2004", city: "Varanasi", quote: "Ancient wisdom, modern code.", dream: "Tech Monk" },
  { name: "Zara Sheikh", rollNo: "BCS-026", dob: "23 Jan 2005", city: "Srinagar", quote: "In every line of code, a world is born.", dream: "VR Developer" },
  { name: "Aditya Mohan", rollNo: "BCS-027", dob: "10 Jul 2004", city: "Patna", quote: "Ship it, then iterate.", dream: "SRE at Netflix" },
  { name: "Bhavna Tiwari", rollNo: "BCS-028", dob: "02 Feb 2005", city: "Lucknow", quote: "Chai + Code = Magic.", dream: "Frontend Specialist" },
  { name: "Chirag Jain", rollNo: "BCS-029", dob: "14 Nov 2004", city: "Udaipur", quote: "Keep calm and commit often.", dream: "Open Source Maintainer" },
  { name: "Divya Hegde", rollNo: "BCS-030", dob: "27 May 2005", city: "Hubli", quote: "Grace in every interface.", dream: "Accessibility Advocate" },
  { name: "Eshan Roy", rollNo: "BCS-031", dob: "08 Aug 2004", city: "Kolkata", quote: "Art meets algorithm.", dream: "Creative Technologist" },
  { name: "Falguni Das", rollNo: "BCS-032", dob: "19 Apr 2005", city: "Guwahati", quote: "The code will set you free.", dream: "EdTech Founder" },
  { name: "Girish Menon", rollNo: "BCS-033", dob: "31 Dec 2004", city: "Kozhikode", quote: "Optimize your life, not just your code.", dream: "CTO by 30" },
  { name: "Himani Rawat", rollNo: "BCS-034", dob: "11 Jun 2005", city: "Dehradun", quote: "Nature inspires the best designs.", dream: "Green Tech Developer" },
  { name: "Ishaan Bose", rollNo: "BCS-035", dob: "24 Oct 2004", city: "Kolkata", quote: "Fail fast, learn faster.", dream: "Angel Investor & Dev" },
  { name: "Jhanvi Saxena", rollNo: "BCS-036", dob: "15 Mar 2005", city: "Noida", quote: "Data never lies.", dream: "Data Engineer at Spotify" },
  { name: "Kartik Nanda", rollNo: "BCS-037", dob: "07 Sep 2004", city: "Bhubaneswar", quote: "Code with purpose.", dream: "Social Media Platform Builder" },
  { name: "Lavanya Pillai", rollNo: "BCS-038", dob: "20 Jan 2005", city: "Coimbatore", quote: "Elegance in simplicity.", dream: "iOS Developer at Apple" },
  { name: "Manav Arora", rollNo: "BCS-039", dob: "03 Jul 2004", city: "Ludhiana", quote: "Hustle is my middle name.", dream: "SaaS Entrepreneur" },
  { name: "Nandini Shetty", rollNo: "BCS-040", dob: "16 Feb 2005", city: "Mangalore", quote: "Good vibes & good code.", dream: "Developer Advocate" },
  { name: "Om Prakash", rollNo: "BCS-041", dob: "28 Nov 2004", city: "Ranchi", quote: "Persistence beats talent.", dream: "Competitive Programmer & Coach" },
  { name: "Pooja Bhatt", rollNo: "BCS-042", dob: "09 May 2005", city: "Jammu", quote: "Write code that writes itself.", dream: "AI Tool Builder" },
  { name: "Rahul Venkat", rollNo: "BCS-043", dob: "22 Aug 2004", city: "Vizag", quote: "The sea teaches you to think big.", dream: "Remote Dev, Beach Life" },
  { name: "Sneha Malik", rollNo: "BCS-044", dob: "04 Apr 2005", city: "Faridabad", quote: "One commit at a time.", dream: "Tech Lead at Google" },
  { name: "Tejas Kale", rollNo: "BCS-045", dob: "17 Dec 2004", city: "Nagpur", quote: "Orange city, colorful code.", dream: "Game Studio Founder" },
  { name: "Uma Shankar", rollNo: "BCS-046", dob: "30 Jun 2005", city: "Varanasi", quote: "Tradition meets technology.", dream: "Heritage Tech Preservationist" },
  { name: "Varun Nair", rollNo: "BCS-047", dob: "12 Oct 2004", city: "Thrissur", quote: "Dance to the rhythm of your keyboard.", dream: "Full-Stack at Amazon" },
  { name: "Wren Thomas", rollNo: "BCS-048", dob: "25 Mar 2005", city: "Shillong", quote: "Music and code share the same soul.", dream: "Music Tech Developer" },
  { name: "Yuvika Rana", rollNo: "BCS-049", dob: "06 Sep 2004", city: "Dehradun", quote: "Adventure is out there — and in your IDE.", dream: "Travel Tech Builder" },
  { name: "Zubin Contractor", rollNo: "BCS-050", dob: "18 Jan 2005", city: "Mumbai", quote: "Build systems that outlive you.", dream: "Distributed Systems Engineer" },
  { name: "Akash Dubey", rollNo: "BCS-051", dob: "01 Jul 2004", city: "Allahabad", quote: "The sky is not the limit.", dream: "Space Tech Engineer" },
  { name: "Bhumika Sethi", rollNo: "BCS-052", dob: "13 Feb 2005", city: "Jodhpur", quote: "Desert dreams, digital realities.", dream: "AR/VR Designer" },
  { name: "Chetan Pawar", rollNo: "BCS-053", dob: "26 Nov 2004", city: "Pune", quote: "Strong coffee, stronger code.", dream: "Backend Architect" },
  { name: "Deepika Yadav", rollNo: "BCS-054", dob: "08 May 2005", city: "Mathura", quote: "Grace under pressure.", dream: "Engineering Manager" },
  { name: "Ekansh Goyal", rollNo: "BCS-055", dob: "21 Aug 2004", city: "Meerut", quote: "Minimal code, maximum impact.", dream: "Minimalist Tech Founder" },
  { name: "Farheen Ansari", rollNo: "BCS-056", dob: "03 Apr 2005", city: "Aurangabad", quote: "History shapes the future of tech.", dream: "Digital Historian" },
  { name: "Govind Rathi", rollNo: "BCS-057", dob: "16 Dec 2004", city: "Raipur", quote: "Patience is a superpower.", dream: "Principal Engineer" },
  { name: "Hrithika Sinha", rollNo: "BCS-058", dob: "29 Jun 2005", city: "Ranchi", quote: "Dance like nobody's watching, code like everybody is.", dream: "Tech YouTuber" },
  { name: "Ishan Luthra", rollNo: "BCS-059", dob: "11 Oct 2004", city: "Amritsar", quote: "Golden temple, golden code.", dream: "FinTech Developer" },
  { name: "Juhi Chandra", rollNo: "BCS-060", dob: "24 Mar 2005", city: "Dehradun", quote: "Stars align for those who code.", dream: "Astronomy + CS Researcher" },
  { name: "Keshav Bhardwaj", rollNo: "BCS-061", dob: "05 Sep 2004", city: "Meerut", quote: "Discipline > Motivation.", dream: "FAANG Engineer" },
  { name: "Lata Kumari", rollNo: "BCS-062", dob: "18 Jan 2005", city: "Patna", quote: "Rise and shine and code.", dream: "Women in Tech Leader" },
  { name: "Mohit Taneja", rollNo: "BCS-063", dob: "30 Jul 2004", city: "Karnal", quote: "No bugs, no glory.", dream: "Security Researcher" },
  { name: "Neha Soni", rollNo: "BCS-064", dob: "12 Feb 2005", city: "Ajmer", quote: "Beauty is in the UI.", dream: "UI/UX Lead" },
  { name: "Omkar Deshpande", rollNo: "BCS-065", dob: "25 Nov 2004", city: "Kolhapur", quote: "Keep pushing pixels.", dream: "Design Engineer" },
  { name: "Prachi Ahluwalia", rollNo: "BCS-066", dob: "07 May 2005", city: "Chandigarh", quote: "The grid is my canvas.", dream: "Creative Frontend Dev" },
  { name: "Rajat Tomar", rollNo: "BCS-067", dob: "20 Aug 2004", city: "Gwalior", quote: "Fortress of code.", dream: "Cyber Defense Analyst" },
  { name: "Sakshi Dubey", rollNo: "BCS-068", dob: "02 Apr 2005", city: "Jabalpur", quote: "Sunflowers and semicolons.", dream: "Technical Writer" },
  { name: "Tarun Bhagat", rollNo: "BCS-069", dob: "15 Dec 2004", city: "Dehradun", quote: "Last but never least.", dream: "The Batch Legend" },
];

const staffData = [
  { name: "Dr. Raghav Menon", designation: "HOD, Computer Science", subject: "Data Structures & Algorithms", knownFor: "Making trees fun (binary ones, not real)", advice: "Master the basics — everything else is just an API call." },
  { name: "Prof. Sunita Sharma", designation: "Associate Professor", subject: "Database Management Systems", knownFor: "Query queen — can normalize anything", advice: "Your data model is your foundation. Get it right." },
  { name: "Dr. Amitabh Verma", designation: "Professor", subject: "Operating Systems", knownFor: "Deadlock jokes that actually land", advice: "Don't just learn to code — learn how the machine thinks." },
  { name: "Ms. Priya Nambiar", designation: "Assistant Professor", subject: "Web Technologies", knownFor: "Building side projects during lectures (as demos)", advice: "Ship something. Anything. Just ship it." },
  { name: "Dr. Farhan Qureshi", designation: "Professor", subject: "Machine Learning", knownFor: "Explaining neural networks with food analogies", advice: "The best model is the one that solves the problem." },
  { name: "Prof. Lakshmi Iyer", designation: "Associate Professor", subject: "Computer Networks", knownFor: "Can trace a packet route in her sleep", advice: "Understand the network — it connects everything." },
  { name: "Mr. Vikram Joshi", designation: "Lab Instructor", subject: "Programming Lab", knownFor: "Debugging your code faster than you wrote it", advice: "Read the error message. No, actually READ it." },
  { name: "Dr. Anita Deshmukh", designation: "Professor", subject: "Software Engineering", knownFor: "Making Agile feel like common sense", advice: "Good software is built by good teams, not lone wolves." },
  { name: "Prof. Suresh Pillai", designation: "Associate Professor", subject: "Theory of Computation", knownFor: "Turning abstract math into 'aha!' moments", advice: "If you can think formally, you can solve anything." },
  { name: "Ms. Kavita Rangan", designation: "Assistant Professor", subject: "Cyber Security", knownFor: "Ethical hacking demos that terrify the class", advice: "Security isn't a feature — it's a mindset." },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Student.deleteMany({});
    await Staff.deleteMany({});
    console.log('🗑️  Cleared existing data');

    await Student.insertMany(students);
    console.log('✅ Inserted 69 students');

    await Staff.insertMany(staffData);
    console.log('✅ Inserted 10 staff members');

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
}

seed();
