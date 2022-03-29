import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  DocumentSnapshot,
  DocumentReference,
  getDoc,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDE1Q6OfX4sKGMB6yd7FO-gobUmpZLhztk",
  authDomain: "happysneeze---app.firebaseapp.com",
  projectId: "happysneeze---app",
  storageBucket: "happysneeze---app.appspot.com",
  messagingSenderId: "85449359186",
  appId: "1:85449359186:web:d7db19ff804f86a8bd048b",
  measurementId: "G-C5K2HKJKSD"
}

const fb = initializeApp(firebaseConfig)
export const db = getFirestore(fb)

export type IShortUser = {
  id: string
  email: string
  name: string
  surname: string
  avatar: string
}

export type Message = {
  author: IShortUser
  createdAt: Date
  text: string
}

export type Chat = {
  id: string
  interlocutors: IShortUser[]
  messages: Message[]
}

const getChatData = (doc: DocumentSnapshot): Promise<Chat> => {
  const chatRef = doc.data()
  const chat: Chat = {
    id: doc.id,
    interlocutors: [],
    messages: [],
  }
  const interlocutorsPromises = chatRef?.interlocutors.map((i: DocumentReference) => getDoc(i))
  return Promise.all(interlocutorsPromises).then((data) => {
    // @ts-ignore
    chat.messages = chatRef?.messages.map((m) => {
      return {
        ...m,
        author: {
          id: m.author.id,
          // @ts-ignore
          ...data.find((d) => d.id === m.author.id).data(),
        },
        createdAt: m.createdAt.toDate(),
      }
    })
    chat.interlocutors = data.map((d) => ({
      // @ts-ignore
      id: d.id,
      // @ts-ignore
      ...d.data(),
    }))

    return chat
  })
}

export const getAllChats = async (): Promise<Chat[]> => {
  const chatsCol = collection(db, 'chats');
  const chatsSnapshot = await getDocs(chatsCol);
  const promise: Promise<Chat[]> = new Promise((resolve) => {
    const promises = chatsSnapshot.docs.map(getChatData)
    Promise.all(promises).then((data) => {
      resolve(data)
    })
  })
  return promise
}

export const subscribeToChat = async (userId: string, handler: (v: Chat) => void) => {
  const q = query(collection(db, "chats"), where("interlocutors", "array-contains", doc(db, "users/" + userId)));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    if (!querySnapshot.empty) {
      getChatData(querySnapshot.docs[0]).then(data => {
        data.messages.sort((a, b) => (a.createdAt > b.createdAt ? 1 : 0))
        handler(data)
      })
    }
  });
  return unsubscribe;
}

export const createNewMessage = async (chatId: string, data: Message, adminUid: string) => {
  const snap = await getDoc(doc(db, 'chats', chatId))
  const chat = snap.data()
  if (chat) {
    setDoc(doc(db, "chats", chatId),
      {
        interlocutors: chat.interlocutors,
        messages: [
          ...chat.messages,
          {
            ...data,
            author: doc(db, "users/" + adminUid),
          }
        ],
      })
  }
}

export const updateUserData = async (uid: string, data: any) => {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    ...data
  })
}
