
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.cwd(), 'video-frames');
const targetDir = path.join(process.cwd(), 'public', 'frames');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

fs.readdir(sourceDir, (err, files) => {
    if (err) {
        console.error('Could not list the directory.', err);
        process.exit(1);
    }

    // Filter for jpg files and sort them to ensure order
    const jpgFiles = files.filter(file => file.endsWith('.jpg')).sort();

    jpgFiles.forEach((file, index) => {
        const extension = path.extname(file);
        const newName = `frame_${index.toString().padStart(3, '0')}${extension}`;
        const oldPath = path.join(sourceDir, file);
        const newPath = path.join(targetDir, newName);

        fs.copyFileSync(oldPath, newPath);
        console.log(`Copied ${file} to ${newName}`);
    });

    console.log(`Processed ${jpgFiles.length} files.`);
});
