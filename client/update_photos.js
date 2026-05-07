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
// We'll keep existing imports, but let's parse existing lines.
// Let's just generate new imports and replace the file content.
// Since we are replacing the whole thing, let's parse the objects using regex.

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
      // If no exact last name match, maybe just first name if unique enough, but let's stick to first+last or similar
      if (folderLower.includes(firstName)) {
         // wait, there are multiple 'Yash', 'Om', 'Rutik'/'Rutuja', 'Vaishnavi'
         // Let's rely on first name + last name
      }
    }

    if (!bestMatch) {
      for (const folder of Object.keys(folderToImage)) {
        const folderLower = folder.toLowerCase();
        // Sometimes spelling differs: Ingle vs Ingale, Savte vs Savate
        // Let's check first name + first 3 letters of last name
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
          break; // risk of mismatch for duplicate first names, but let's see
        }
      }
    }

    if (bestMatch) {
      const varName = bestMatch.replace(/[^a-zA-Z0-9]/g, '');
      imports.add(`import ${varName} from '${folderToImage[bestMatch]}';`);
      
      // replace photo: "" or photo: Aditya with photo: VarName
      return line.replace(/photo:\s*("[^"]*"|[a-zA-Z0-9_]+)/, `photo: ${varName}`);
    }
  }
  return line;
});

const newImports = Array.from(imports).join('\n') + '\n\n';

// Remove old imports (everything before const students =)
const finalContent = newImports + updatedLines.join('\n') + '\n\nexport default students;\n';

fs.writeFileSync(studentsFile, finalContent);
console.log('Updated students.js with matching photos');
