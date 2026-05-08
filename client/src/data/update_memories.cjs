const fs = require('fs');
const path = require('path');

const dir = 'e:/Web Development/Projects/Batch2023_26/client/src/assets/images/Memories';
const files = fs.readdirSync(dir);

let imports = '';
let memories = 'export const MEMORIES = [\n';

files.forEach((file, i) => {
  const ext = path.extname(file).toLowerCase();
  const name = path.basename(file, ext);
  const importName = `mem${i + 1}`;
  const type = (ext === '.mp4' || ext === '.mov') ? 'video' : 'image';
  
  // Clean up title
  let title = name.replace(/\(\d+\)/g, '').trim();
  title = title.replace(/_/g, ' ');
  
  // Add emojis based on keywords
  if (title.toLowerCase().includes('bollywood')) title += ' 🎭';
  if (title.toLowerCase().includes('last day')) title += ' 🥺';
  if (title.toLowerCase().includes('ganpati')) title += ' 🙏';
  if (title.toLowerCase().includes('sports')) title += ' 🏆';
  if (title.toLowerCase().includes('traditional')) title += ' ✨';
  if (title.toLowerCase().includes('funny')) title += ' 😂';
  if (title.toLowerCase().includes('hackathon') || title.toLowerCase().includes('hackton')) title += ' 💻';
  if (title.toLowerCase().includes('teachers day')) title += ' 🍎';
  
  imports += `import ${importName} from '../assets/images/Memories/${file}';\n`;
  memories += `  { id: ${i + 1}, title: '${title}', media: ${importName}, type: '${type}' },\n`;
});

memories += '];\n';

const fullContent = imports + '\n' + memories;
fs.writeFileSync('e:/Web Development/Projects/Batch2023_26/client/src/data/memories.js', fullContent);
console.log('Successfully updated memories.js with ' + files.length + ' items.');
