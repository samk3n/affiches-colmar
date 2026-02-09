const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'sequence');

fs.readdir(dir, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach(file => {
        // Expected format: frame_00_delay-0.042s.jpg (or similar)
        // We want: frame_000.jpg

        // Regex to capture the number after "frame_"
        const match = file.match(/frame_(\d+)/);
        if (match) {
            const number = match[1]; // "00", "01", etc.
            // Pad to 3 digits: "00" -> "000", "92" -> "092"
            const paddedNumber = number.padStart(3, "0");

            const oldPath = path.join(dir, file);
            const newPath = path.join(dir, `frame_${paddedNumber}.jpg`);

            fs.rename(oldPath, newPath, (err) => {
                if (err) console.error(`Error renaming ${file}`, err);
            });
        }
    });
});
