const fs = require('fs');
const path = require('path');

const studentsFile = path.join(__dirname, 'src', 'data', 'students.js');
let content = fs.readFileSync(studentsFile, 'utf-8');

// Remove city: "...", and dream: "...",
content = content.replace(/city:\s*"[^"]*",\s*/g, '');
content = content.replace(/dream:\s*"[^"]*",\s*/g, '');

fs.writeFileSync(studentsFile, content);
console.log('Removed city and dream from students.js');
