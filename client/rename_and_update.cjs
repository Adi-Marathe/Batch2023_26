const fs = require('fs');
const path = require('path');

const friendsDir = path.join(__dirname, 'src', 'assets', 'images', 'Friends');
const studentsFile = path.join(__dirname, 'src', 'data', 'students.js');

const friendFolders = fs.readdirSync(friendsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const mappings = [];

for (const folder of friendFolders) {
  const folderPath = path.join(friendsDir, folder);
  const files = fs.readdirSync(folderPath);
  
  // Filter for image files
  const imageFiles = files.filter(f => /\.(png|jpe?g|webp|heic)$/i.test(f));
  
  // Create a mapping of current files to temp names to avoid collision if renaming to same name with different case
  // But standard approach is rename sequentially. 
  let counter = 1;
  for (const oldFileName of imageFiles) {
    const ext = path.extname(oldFileName);
    // Standardize naming: Folder Name 1.ext, Folder Name 2.ext, etc.
    const newFileName = `${folder} ${counter}${ext}`;
    
    if (oldFileName !== newFileName) {
      const oldFilePath = path.join(folderPath, oldFileName);
      const newFilePath = path.join(folderPath, newFileName);
      
      // Keep track of paths as they appear in students.js
      const oldRelative = `../assets/images/Friends/${folder}/${oldFileName}`.replace(/\\/g, '/');
      const newRelative = `../assets/images/Friends/${folder}/${newFileName}`.replace(/\\/g, '/');
      
      mappings.push({ oldFilePath, newFilePath, oldRelative, newRelative });
    }
    counter++;
  }
}

// Rename files
for (const map of mappings) {
  // If target already exists, wait - what if "Name 1.jpg" already exists and we are trying to rename another to it?
  // We'll rename them to temp names first, then to actual names if there are collisions, but usually safe.
  try {
    fs.renameSync(map.oldFilePath, map.newFilePath + '.tmp');
  } catch(e) {
    console.error('Error renaming to tmp', e);
  }
}

for (const map of mappings) {
  try {
    fs.renameSync(map.newFilePath + '.tmp', map.newFilePath);
  } catch(e) {
    console.error('Error renaming from tmp', e);
  }
}

// Update students.js
if (mappings.length > 0) {
  let content = fs.readFileSync(studentsFile, 'utf-8');
  for (const map of mappings) {
    // Replace all occurrences of oldRelative with newRelative
    content = content.split(map.oldRelative).join(map.newRelative);
  }
  fs.writeFileSync(studentsFile, content);
  console.log(`Renamed files and updated ${mappings.length} paths in students.js`);
} else {
  console.log('No files needed renaming.');
}
