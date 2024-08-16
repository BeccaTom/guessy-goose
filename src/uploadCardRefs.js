import { storage, db } from './firebase-config.js'; // Ensure this points to your Firebase config
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const uploadCardsToFirestore = async () => {
  try {
    // Reference to the "cards" folder in Firebase Storage
    const storageRef = ref(storage, 'cards');
    
    // List all files in the "cards" folder
    const result = await listAll(storageRef);
    
    // Loop through each file
    for (const itemRef of result.items) {
      // Get the download URL
      const downloadURL = await getDownloadURL(itemRef);
      
      // Create a Firestore document for this card
      const cardRef = doc(db, 'cards', itemRef.name);
      await setDoc(cardRef, {
        name: itemRef.name,
        url: downloadURL,
        createdAt: serverTimestamp(),
      });

      console.log(`Uploaded metadata for ${itemRef.name}`);
    }
  } catch (error) {
    console.error('Error uploading cards to Firestore:', error);
  }
};

// Run the function
uploadCardsToFirestore();
