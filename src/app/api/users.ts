import {
  getDoc,
  doc,
} from 'firebase/firestore';
import { db } from './chats';

export interface IProfile {
  uid: string
  name: string
  surname: string
  email: string
  avatar: string
  active_day: number
  is_notification: boolean
  last_time_completed_at: number
  created_at: number
  answered_questions: IAnsweredQuestion[]
  progress_check_days_completed_dates: IWhenCompletedProgressCheckOfDay[]
  fcm_token: string
  last_action: number
  got_notification_after24h_from_last_action: boolean
  got_notification_after48h_from_last_action: boolean
  first_login_at: number
  got_message_after6h_from_first_login: boolean
  unread_messages_count: number
  admin_note: string
  timezone_offset: string
  timezone_name: string
}


export interface IWhenCompletedProgressCheckOfDay {
  day: number
  completed_at: number
}
export interface IAnsweredQuestion {
  question_id: string
  answers?: number[]
  text_answer?: string
  type: EQuestionType
}

export enum EQuestionType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
  TEXT = 'text',
}

export const getUserInfoById = async (uid: string): Promise<IProfile> => {
  const snap = await getDoc(doc(db, 'users', uid))
  const user = snap.data()
  return user as IProfile
}