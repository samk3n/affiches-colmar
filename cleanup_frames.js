const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'sequence');

for (let i = 93; i <= 191; i++) {
    const paddedIndex = String(i).padStart(3, '0');
    const filename = `frame_${paddedIndex}.jpg`;
    const filePath = path.join(dir, filename);

    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            console.log(`Deleted ${filename}`);
        } catch (err) {
            console.error(`Error deleting ${filename}:`, err);
        }
    }
}
console.log("Cleanup complete.");
