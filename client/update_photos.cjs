const fs = require('fs');
const path = require('path');

const studentsFile = path.join(__dirname, 'src', 'data', 'students.js');
const friendsDir = path.join(__dirname, 'src', 'assets', 'images', 'Friends');

// 1. Get all folders in Friends dir
const friendFolders = fs.readdirSync(friendsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Map folder to its first image
const folderToImage = {};
for (const folder of friendFolders) {
  const folderPath = path.join(friendsDir, folder);
  const files = fs.readdirSync(folderPath);
  const image = files.find(f => /\.(png|jpe?g|webp)$/i.test(f));
  if (image) {
    folderToImage[folder] = `../assets/images/Friends/${folder}/${image}`.replace(/\\/g, '/');
  }
}

// 2. Read students.js
let content = fs.readFileSync(studentsFile, 'utf-8');

// Extract the students array part
const arrayStart = content.indexOf('const students = [');
const arrayEnd = content.indexOf('];', arrayStart);
const arrayContent = content.substring(arrayStart, arrayEnd + 2);

// Extract individual student objects
const lines = arrayContent.split('\n');

const imports = new Set();
let updatedLines = lines.map(line => {
  const match = line.match(/{.*?name:\s*"([^"]+)".*?}/);
  if (match) {
    const fullName = match[1];
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0].toLowerCase();
    const lastName = nameParts[nameParts.length - 1].toLowerCase();

    // Find matching folder
    let bestMatch = null;
    for (const folder of Object.keys(folderToImage)) {
      const folderLower = folder.toLowerCase();
      if (folderLower.includes(firstName) && folderLower.includes(lastName)) {
        bestMatch = folder;
        break;
      }
    }

    if (!bestMatch) {
      for (const folder of Object.keys(folderToImage)) {
        const folderLower = folder.toLowerCase();
        if (folderLower.includes(firstName) && folderLower.includes(lastName.substring(0, 3))) {
          bestMatch = folder;
          break;
        }
      }
    }

    if (!bestMatch) {
      for (const folder of Object.keys(folderToImage)) {
        const folderLower = folder.toLowerCase();
        if (folderLower.includes(firstName)) {
          bestMatch = folder;
          break;
        }
      }
    }

    if (bestMatch) {
      const varName = bestMatch.replace(/[^a-zA-Z0-9]/g, '');
      imports.add(`import ${varName} from '${folderToImage[bestMatch]}';`);
      return line.replace(/photo:\s*("[^"]*"|[a-zA-Z0-9_]+)/, `photo: ${varName}`);
    }
  }
  return line;
});

const newImports = Array.from(imports).join('\n') + '\n\n';
const finalContent = newImports + 'const students = [\n' + updatedLines.join('\n').replace(/^.*?const students = \[\n?/, '') + '\n\nexport default students;\n';

fs.writeFileSync(studentsFile, finalContent);
console.log('Updated students.js with matching photos');
