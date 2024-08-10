import { collection, addDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { db } from './firebase-config';
import { auth } from "./firebase-config";  // Assuming auth is imported to get the current user

export const createGame = async (maxPlayers: number, allowStrangers: boolean): Promise<string> => {
    try {
      const currentUser = auth.currentUser;
  
      if (!currentUser) {
        throw new Error("No authenticated user found");
      }
  
      const gameCode = Math.random().toString(36).substr(2, 6).toUpperCase();
  
      // Create user object for the creator
      const userObject = {
        uid: currentUser.uid,
        username: currentUser.displayName || "Anonymous",
        profilePic: currentUser.photoURL || "https://example.com/default-profile-pic.jpg"
      };
  
      const gameData = {
        maxPlayers: maxPlayers,
        allowStrangers: allowStrangers,
        gameCode: gameCode,
        createdAt: new Date(),
        creator: userObject,
        playersJoined: [userObject]  // Add the creator to the list of players joined
      };
  
      const docRef = await addDoc(collection(db, "games"), gameData);
      console.log("Game created with ID: ", docRef.id);
  
      return gameCode;
    } catch (e) {
      console.error("Error adding document: ", e);
      throw new Error("Failed to create game");
    }
};

export const deleteGame = async (gameCode: string) => {
    try {
        const q = query(collection(db, "games"), where("gameCode", "==", gameCode));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const gameDoc = querySnapshot.docs[0];  
          const gameRef = gameDoc.ref;
          await deleteDoc(gameRef);   
          console.log("Game deleted with game code: ", gameCode);
        } else {
          console.log("No game found with the provided game code.");
        }
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw new Error("Failed to delete game");
    }
};