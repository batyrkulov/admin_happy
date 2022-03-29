import {
  collection,
  getDocs,
  DocumentReference,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db } from './chats';

export type IQuestion = {
  id: string
  type: "multiple" | "single" | "text"
  question: string
  answers: {
    value: number
    text: string
  }[]
  photo?: string
}

export const getAllDays = async () => {
  const daysCol = collection(db, 'days')
  const daysSnapshot = await getDocs(daysCol);
  return daysSnapshot
}

export const getAllProgresses = async () => {
  const progressCol = collection(db, 'progress')
  const progressDocs = await getDocs(progressCol);
  return progressDocs.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
}

export const getAllQuestions = async () => {
  const questionsCol = collection(db, 'questions')
  const questionsDocs = await getDocs(questionsCol);
  return questionsDocs.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
}

export const getAllQuestionsOfDay = async (day: number): Promise<IQuestion[]> => {
  const snap = await getDoc(doc(db, 'progress', day.toString()))
  const questionsRefs = snap.data()?.questions

  const promises = questionsRefs.map((ref: DocumentReference) => getDoc(ref))
  const res = await Promise.all(promises)

  return res.map((doc) => {
    return {
      // @ts-ignore
      id: doc.id,
      // @ts-ignore
      ...doc.data()
    }
  })
}