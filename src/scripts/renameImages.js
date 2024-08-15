const fs = require('fs');
const path = require('path');

const downloadsDir = path.join(process.env.HOME, 'Downloads');
const desktopDir = path.join(process.env.HOME, 'Desktop', 'gg_cards');

if (!fs.existsSync(desktopDir)) {
    fs.mkdirSync(desktopDir);
}

fs.readdir(downloadsDir, (err, files) => {
    if (err) {
        console.error('Error reading Downloads folder:', err);
        return;
    }

    files.forEach((file, index) => {
        const filePath = path.join(downloadsDir, file);

        if (fs.lstatSync(filePath).isFile() && file.startsWith('DALL·E')) {
            const newFileName = `ggcard_1_${index + 1}_${Date.now()}.png`; 
            const newFilePath = path.join(desktopDir, newFileName);

            fs.rename(filePath, newFilePath, err => {
                if (err) {
                    console.error(`Error moving and renaming file ${file}:`, err);
                } else {
                    console.log(`Renamed and moved: ${file} -> ${newFileName}`);
                }
            });
        }
    });
});
