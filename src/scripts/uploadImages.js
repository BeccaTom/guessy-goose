const fs = require('fs');
const path = require('path');
const { storage } = require('../firebase-config.js'); // Ensure this points to your Firebase config
const { ref, uploadBytes } = require('firebase/storage');

// Folder paths
const ggCardsFolderPath = path.join(process.env.HOME, 'Desktop/gg_cards');
const ggUploadedFolderPath = path.join(process.env.HOME, 'Desktop/gguploaded');

// Ensure the gguploaded folder exists
if (!fs.existsSync(ggUploadedFolderPath)) {
  fs.mkdirSync(ggUploadedFolderPath);
}

// Upload each image to Firebase Storage and move it to gguploaded
async function uploadImages() {
  try {
    // Read all files in the ggcards directory
    const files = fs.readdirSync(ggCardsFolderPath);

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      const filePath = path.join(ggCardsFolderPath, fileName);
      
      // Only proceed if it's an image file (e.g., png or jpg)
      if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
        console.log(`Uploading ${fileName}...`);
        
        // Read the file as a buffer
        const fileBuffer = fs.readFileSync(filePath);
        
        // Create a reference to the file location in Firebase Storage
        const storageRef = ref(storage, `cards/${fileName}`);
        
        // Upload the file
        await uploadBytes(storageRef, fileBuffer);
        console.log(`${fileName} uploaded successfully!`);
        
        // Move the file to the gguploaded folder
        const newFilePath = path.join(ggUploadedFolderPath, fileName);
        fs.renameSync(filePath, newFilePath);
        console.log(`${fileName} moved to gguploaded!`);
      }
    }
  } catch (error) {
    console.error('Error uploading or moving images:', error);
  }
}

// Run the upload and move function
uploadImages();
