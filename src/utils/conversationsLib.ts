import {hostName} from "@/utils/constants";
import {firebaseApp} from "@/utils/firebaseConfig";


export const firebaseCollection :any = {
   devEnv:'devConversations',
   mainEnv:'mainConversations',
   stagingEnv:'stgConversations',
}

export const getCollectionNameByEnv = () => {
    const windowHostName: string = window.location.hostname
   return firebaseCollection[hostName[windowHostName]] || 'devConversations'
}

export const db= getFirestore(firebaseApp)
import {doc, getDoc, updateDoc, arrayUnion, onSnapshot, setDoc, getFirestore} from 'firebase/firestore';

class ChatManager {
   private readonly collectionName: string;

   constructor(collectionName: string) {
      this.collectionName = collectionName;
   }

   private getCollectionNameByEnv(): string {
      return this.collectionName;
   }

   async listenToCollection(conversationName: string, updateChatWindow: (messages: any[]) => void) {
      const conversationRef = doc(db, this.getCollectionNameByEnv(), conversationName);
      const docSnap = await getDoc(conversationRef);

      if (docSnap.exists()) {
         const docData = docSnap.data();
         if (docData) {
            const messages = docData.messages;
            updateChatWindow(messages);
         }
      } else {
         console.log("No such document!");
      }
   }

   async sendMessage(documentName: string, newMessage: any) {
      try {
         const conversationRef = doc(db, this.getCollectionNameByEnv(), documentName);
         const docSnap = await getDoc(conversationRef);

         if (docSnap.exists()) {
            await updateDoc(conversationRef, {
               messages: arrayUnion(newMessage),
            });
         } else {
            const newConversationRef = doc(db, this.getCollectionNameByEnv(), documentName);
            await setDoc(newConversationRef, {
               messages: [newMessage],
            });
         }
      } catch (e) {
         console.error("Error sending message: ", e);
      }
   }

   async deleteMessageInConversation(conversationName: string, index: number) {
      try {
         const conversationRef = doc(db, this.getCollectionNameByEnv(), conversationName);
         const docSnap = await getDoc(conversationRef);

         if (docSnap.exists()) {
            const messages = docSnap.data().messages;
            if (index >= 0 && index < messages.length) {
               messages.splice(index, 1);
               await updateDoc(conversationRef, {
                  messages: messages,
               });
               console.log('Message deleted successfully.');
            } else {
               console.error('Invalid message index.');
            }
         } else {
            console.error('Conversation does not exist.');
         }
      } catch (error) {
         console.error('Error deleting message:', error);
      }
   }
}

export default ChatManager;


