
import fs from 'fs';
import path from 'path';

const studentsFilePath = 'e:/Web Development/Projects/Batch2023_26/client/src/data/students.js';
const content = fs.readFileSync(studentsFilePath, 'utf8');

const importRegex = /import\s+\w+\s+from\s+['"]([^'"]+)['"]/g;
let match;
const errors = [];

while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('../assets/images/Friends/')) {
        const fullPath = path.resolve(path.dirname(studentsFilePath), importPath);
        if (!fs.existsSync(fullPath)) {
            errors.push({
                importPath,
                fullPath,
                exists: false
            });
            
            // Try to find if it exists with a different extension
            const ext = path.extname(fullPath);
            const base = fullPath.slice(0, -ext.length);
            ['.jpeg', '.jpg', '.png', '.webp', '.heic'].forEach(altExt => {
                if (altExt !== ext && fs.existsSync(base + altExt)) {
                    errors[errors.length - 1].suggestion = altExt;
                }
            });
        }
    }
}

console.log(JSON.stringify(errors, null, 2));
