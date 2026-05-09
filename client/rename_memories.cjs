const fs = require('fs');
const path = require('path');

const dir = 'e:/Web Development/Projects/Batch2023_26/client/src/assets/images/Memories';
const files = fs.readdirSync(dir);

function cleanString(str) {
  let s = str;
  // Fix spellings
  s = s.replace(/Departmeent/ig, 'Department');
  s = s.replace(/\bClg\b/ig, 'College');
  s = s.replace(/Idustrial/ig, 'Industrial');
  s = s.replace(/vist\b/ig, 'Visit');
  s = s.replace(/Archna/ig, 'Archana');
  s = s.replace(/Submition/ig, 'Submission');
  s = s.replace(/Hackthon|Hackton/ig, 'Hackathon');
  s = s.replace(/Tarditional|Trditional/ig, 'Traditional');
  s = s.replace(/momemt/ig, 'Moment');
  s = s.replace(/memor\b/ig, 'Memories');
  s = s.replace(/WhatsApp Image \d{4}-\d{2}-\d{2} at [^.]+/ig, 'College Memory');
  s = s.replace(/WhatsApp Video \d{4}-\d{2}-\d{2} at [^.]+/ig, 'College Memory Video');

  // Proper Casing
  s = s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  // Fix capitalization of specific abbreviations
  s = s.replace(/\b(Fy|Sy|Ty)\b/g, match => match.toUpperCase());
  s = s.replace(/\b(Os|Ui|Ux|Ict)\b/g, match => match.toUpperCase());

  // Remove duplicate spaces
  s = s.replace(/\s+/g, ' ').trim();
  
  return s;
}

let counter = 1;
files.forEach(file => {
  const ext = path.extname(file);
  const baseName = path.basename(file, ext);
  
  // Preserve the (2), (3) suffixes if they exist
  let cleanBase = baseName.replace(/\(\d+\)/g, '').trim();
  cleanBase = cleanString(cleanBase);
  
  const match = baseName.match(/\(\d+\)/);
  if (match) {
    cleanBase += ` ${match[0]}`;
  }
  
  let newName = `${cleanBase}${ext}`;
  let newPath = path.join(dir, newName);
  
  if (newName !== file && newName.toLowerCase() !== file.toLowerCase()) {
    // Avoid overwriting if file already exists with completely different case
    if (fs.existsSync(newPath)) {
      newName = `${cleanBase} ${counter++}${ext}`;
      newPath = path.join(dir, newName);
    }
    try {
        fs.renameSync(path.join(dir, file), newPath);
    } catch (e) {
        console.error("Could not rename", file, newPath);
    }
  } else if (newName !== file) {
    // Same name but different case (Windows is case insensitive, so rename via temp)
    const tempPath = path.join(dir, newName + '.tmp');
    fs.renameSync(path.join(dir, file), tempPath);
    fs.renameSync(tempPath, newPath);
  }
});

// Run update script logic
const newFiles = fs.readdirSync(dir);
let imports = '';
let memories = 'export const MEMORIES = [\n';

newFiles.forEach((file, i) => {
  const ext = path.extname(file).toLowerCase();
  const name = path.basename(file, ext);
  const importName = `mem${i + 1}`;
  const type = (ext === '.mp4' || ext === '.mov') ? 'video' : 'image';
  
  let title = name.replace(/\(\d+\)/g, '').trim();
  
  if (title.toLowerCase().includes('bollywood')) title += ' 🎭';
  if (title.toLowerCase().includes('last day')) title += ' 🥺';
  if (title.toLowerCase().includes('ganpati')) title += ' 🙏';
  if (title.toLowerCase().includes('sports') || title.toLowerCase().includes('kho kho')) title += ' 🏆';
  if (title.toLowerCase().includes('traditional')) title += ' ✨';
  if (title.toLowerCase().includes('funny')) title += ' 😂';
  if (title.toLowerCase().includes('hackathon')) title += ' 💻';
  if (title.toLowerCase().includes('teachers day')) title += ' 🍎';
  if (title.toLowerCase().includes('wedding')) title += ' 💍';
  if (title.toLowerCase().includes('holi')) title += ' 🎨';
  if (title.toLowerCase().includes('swachata')) title += ' 🧹';
  if (title.toLowerCase().includes('bunk')) title += ' 🤫';
  
  // Remove quotes inside strings for safety
  title = title.replace(/'/g, "\\'");

  imports += `import ${importName} from '../assets/images/Memories/${file.replace(/'/g, "\\'")}';\n`;
  memories += `  { id: ${i + 1}, title: '${title}', media: ${importName}, type: '${type}' },\n`;
});

memories += '];\n';

const fullContent = imports + '\n' + memories;
fs.writeFileSync('e:/Web Development/Projects/Batch2023_26/client/src/data/memories.js', fullContent);
console.log('Successfully renamed files and updated memories.js with ' + newFiles.length + ' items.');
