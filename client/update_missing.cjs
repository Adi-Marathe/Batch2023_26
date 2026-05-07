const fs = require('fs');
const path = require('path');

const studentsFile = path.join(__dirname, 'src', 'data', 'students.js');

const additions = [
  { id: 8, varName: 'AsavariDalvi', path: '../assets/images/Friends/Asawai Dalvi/Asawari Dalvi 1.jpeg' },
  { id: 22, varName: 'SarvadnyaMahale', path: '../assets/images/Friends/Sarvdnya Mahale/Sarvadnya.png' },
  { id: 29, varName: 'AnushkaNikam', path: '../assets/images/Friends/Anuska Nikam/Anushka Nikam.jpeg' },
  { id: 35, varName: 'GopalRathod', path: '../assets/images/Friends/Gopal Rathod/607660068_17988551552869443_5146380297402817197_n.heic' },
  { id: 38, varName: 'ShravaniChavan', path: '../assets/images/Friends/Shravni Chavan/Shravani Chavan.jpeg' },
  { id: 62, varName: 'VedantSonar', path: '../assets/images/Friends/Vedant Sonar/621394109_18054367475680625_662434041814256726_n.heic' },
  { id: 66, varName: 'YogeshwariKale', path: '../assets/images/Friends/Yogeshwar Kale/Yogeshwari Kale.jpeg' },
];

let content = fs.readFileSync(studentsFile, 'utf-8');

let newImports = additions.map(a => `import ${a.varName} from '${a.path}';`).join('\n') + '\n';
content = newImports + content;

additions.forEach(a => {
  const regex = new RegExp(`({ id: ${a.id},.*?photo: )""( })`);
  content = content.replace(regex, `$1${a.varName}$2`);
});

fs.writeFileSync(studentsFile, content);
console.log('Fixed missing students');
