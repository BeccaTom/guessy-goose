// gameService.ts
import { collection, deleteDoc, doc, addDoc } from "firebase/firestore";
import { db } from './firebase-config';
import { auth } from "./firebase-config";  // Assuming auth is imported to get the current user

export const createGame = async (maxPlayers: number, allowStrangers: boolean): Promise<string> => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const gameCode = Math.random().toString(36).substr(2, 6).toUpperCase();  // Generate game code
    const userObject = {
      uid: currentUser.uid,
      username: currentUser.displayName || "Anonymous",
      profilePic: currentUser.photoURL || "https://example.com/default-profile-pic.jpg"
    };

    const docRef = await addDoc(collection(db, "games"), {
      maxPlayers: maxPlayers,
      playersJoined: [userObject],  // Initial player array with the creator
      allowStrangers: allowStrangers,
      gameCode: gameCode,
      createdAt: new Date()
    });
    console.log("Game created with ID: ", docRef.id);
    return gameCode;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Failed to create game");
  }
};

export const deleteGame = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "games", docId));
      console.log("Game deleted with ID: ", docId);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };
