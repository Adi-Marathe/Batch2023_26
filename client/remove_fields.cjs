const fs = require('fs');
const path = require('path');

const studentsFile = path.join(__dirname, 'src', 'data', 'students.js');
let content = fs.readFileSync(studentsFile, 'utf-8');

// Remove dob: "...", and quote: "...",
content = content.replace(/dob:\s*"[^"]*",\s*/g, '');
content = content.replace(/quote:\s*"[^"]*",\s*/g, '');

fs.writeFileSync(studentsFile, content);
console.log('Removed dob and quote from students.js');
