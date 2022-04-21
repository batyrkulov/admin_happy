import { Chat, createNewMessage, getAllChats, IShortUser, subscribeToChat, updateChatData, updateUserData } from 'app/api/chats';
import { getAllDays, getAllProgresses, getAllQuestions, getAllQuestionsOfDay, IQuestion } from 'app/api/other';
import { getUserInfoById, IProfile } from 'app/api/users';
import { ChatItem } from 'app/components/ChatItem';
import { RenderMessage } from 'app/components/RenderMessage';
import { setUid } from 'app/mainSlice';
import { COLOR, FLEX, LINE_HEIGHT, MARGIN_BOTTTOM, MARGIN_TOP } from 'app/other/common-styles';
import { main } from 'app/selectors';
import { FirebaseApp } from 'firebase/app';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as S from './styles'

interface IChatWithLastMessageSentAt extends Chat {
  lastMessageSentAt: number
}

export const Main = ({ fb }: { fb: FirebaseApp }) => {
  const dispatch = useDispatch()
  const [chats, setChats] = useState<IChatWithLastMessageSentAt[]>([])
  const [searchedChats, setSearchedChats] = useState<Chat[]>([])
  const [search, setSearch] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const uid: string | null = useSelector(main.uid)
  const profile = { uid }
  const messageRef = useRef<null | HTMLDivElement>(null)

  const [chosenUid, setChosenUid] = useState<string>('')
  const [message, setMessage] = useState<string>("")
  const [data, setData] = useState<Chat | null>(null)

  const [user, setUser] = useState<IProfile | null>(null)
  const [results, setResults] = useState<number[]>([0, 0, 0, 0, 0])
  const [chosenDay, setChosenDay] = useState<number>(0)
  const [chosenBlockOfPages, setChosenBlockOfPages] = useState<1 | 2 | 3>(1)
  const [visiblePages, setVisiblePages] = useState<number[]>([1, 2, 3])
  const [questionsOfChosenDay, setQuestionsOfChosenDay] = useState<IQuestion[]>([])
  const [admin_note, setAdmin_note] = useState<string>('')
  const [days, setDays] = useState<number[]>([])
  const [intervalId, setIntervalId] = useState<any>(null)

  const [middleHeight, setLeftHeight] = useState<number>(window.innerHeight)
  const [messagesContainerHeight, setMessagesContainerHeight] = useState<number>(window.innerHeight - (70 + 100))

  const rightHeightWithoutQuestionsBlock: number = 430
  const [questionsWrapperHeight, setQuestionsWrapperHeight] = useState<number>(window.innerHeight - rightHeightWithoutQuestionsBlock)

  useEffect(() => {
    updateChats()
    getAllDays().then(res => setDays(res.docs.map(item => (parseInt(item.id))).sort((a, b) => a - b)))
    window.addEventListener('resize', () => {
      setLeftHeight(window.innerHeight)
      setMessagesContainerHeight(window.innerHeight - (70 + 100))
      setQuestionsWrapperHeight(window.innerHeight - rightHeightWithoutQuestionsBlock)
    })

    setIntervalId(setInterval(() => {
      updateChats()
    }, 10000))

    return () => clearInterval(intervalId)
  }, [])

  const MIDDLE_STYLE = {
    ...S.LEFT,
    height: middleHeight,
  }

  const MESSAGES_CONTAINER_STYLE = {
    ...S.MESSAGES_CONTAINER,
    height: messagesContainerHeight,
  }

  useEffect(() => {
    if (search)
      setSearchedChats(
        chats.filter(chat => {
          const user: IShortUser = chat.interlocutors[0].id === profile.uid
            ? chat.interlocutors[1]
            : chat.interlocutors[0]
          if (user.name || user.surname)
            return (user.name?.toLowerCase().includes(search.toLowerCase()) || user.surname?.toLowerCase().includes(search.toLowerCase()))
          else
            return (user.email?.toLowerCase().includes(search.toLowerCase()))
        })
      )
    else setSearchedChats([])
  }, [search])

  useEffect(() => {
    updateChats()
    if (messageRef.current) {
      messageRef.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
    }
  }, [data])

  useEffect(() => {
    if (chosenUid) {
      setChosenDay(1)
      setResults([0, 0, 0, 0, 0])
      subscribeToChat(chosenUid, setData)
      getUserInfoById(chosenUid).then(res => setUser(res))
      updateChatData(chosenUid, { hasNewMessages: false })
    }
  }, [chosenUid])

  useEffect(() => {
    if (chosenDay) {
      setQuestionsOfChosenDay([])
      getAllQuestionsOfDay(chosenDay).then(questions => setQuestionsOfChosenDay(questions))
      if (chosenBlockOfPages === 1) {
        if (chosenDay > visiblePages[0]) {
          setChosenBlockOfPages(2)
        } else if (chosenDay < visiblePages[0]) {
          setVisiblePages([
            visiblePages[0] - 1,
            visiblePages[1] - 1,
            visiblePages[2] - 1,
          ])
        }
      } else if (chosenBlockOfPages === 3) {
        if (chosenDay < visiblePages[2]) {
          setChosenBlockOfPages(2)
        } else if (chosenDay > visiblePages[2]) {
          setVisiblePages([
            visiblePages[0] + 1,
            visiblePages[1] + 1,
            visiblePages[2] + 1,
          ])
        }
      } else if (chosenBlockOfPages === 2) {
        if (chosenDay < visiblePages[1]) {
          setChosenBlockOfPages(1)
        } else if (chosenDay > visiblePages[1]) {
          setChosenBlockOfPages(3)
        }
      }
    }
  }, [chosenDay])

  useEffect(() => {
    if (user) {
      setAdmin_note(user.admin_note || '')

      getAllProgresses().then(progresses => {
        const questionsWithPoints: any[] = []
        getAllQuestions().then(res => {
          res.forEach(question => {
            // @ts-ignore
            if (question.withPoint) {
              questionsWithPoints.push({
                ...question,
                progressDay: parseInt(
                  // @ts-ignore
                  progresses.find(
                    // @ts-ignore
                    progress => progress.questions.some(q => q.id === question.id)
                  )?.id
                )
              })
            }
          })

          const users_with_points = []
          if (user.answered_questions?.length) {
            if (user.answered_questions.some(a_question => questionsWithPoints.some(
              questionsWithPoint => (questionsWithPoint.id === a_question.question_id)
            ))) {
              users_with_points.push(user)
            }
          }

          const userResults = {
            day1: 0,
            day10: 0,
            day20: 0,
            day30: 0,
            day40: 0,
          }
          user.answered_questions.forEach(a_question => {
            questionsWithPoints.forEach(questionsWithPoint => {
              if (questionsWithPoint.id === a_question.question_id && questionsWithPoint.type !== 'text') {
                let pointOfCurrentAnsweredQuestion = 0
                a_question.answers?.forEach(answer => {
                  // @ts-ignore
                  pointOfCurrentAnsweredQuestion += questionsWithPoint.answers.find(answer2 => answer2.value === answer).point
                })
                switch (questionsWithPoint.progressDay) {
                  case 1: {
                    userResults.day1 += pointOfCurrentAnsweredQuestion
                    break;
                  }
                  case 10: {
                    userResults.day10 += pointOfCurrentAnsweredQuestion
                    break;
                  }
                  case 20: {
                    userResults.day20 += pointOfCurrentAnsweredQuestion
                    break;
                  }
                  case 30: {
                    userResults.day30 += pointOfCurrentAnsweredQuestion
                    break;
                  }
                  case 40: {
                    userResults.day40 += pointOfCurrentAnsweredQuestion
                    break;
                  }
                }
              }
            })
          })
          setResults([
            userResults.day1,
            userResults.day10,
            userResults.day20,
            userResults.day30,
            userResults.day40,
          ])
        })
      })
    }
  }, [user])

  useEffect(() => {
    if (user) {
      updateUserData(user.uid, { admin_note })
    }
  }, [admin_note])

  const updateChats = () => {
    setIsLoading(true)
    getAllChats().then((res) => {
      const newChats: IChatWithLastMessageSentAt[] = res.map(chat => ({
        ...chat,
        lastMessageSentAt: chat.messages.length
          ? chat.messages[chat.messages.length - 1].createdAt.getTime()
          : 1607498176
      }))
      setChats(newChats.sort((a, b) => (a.lastMessageSentAt > b.lastMessageSentAt ? -1 : 1)))
      setIsLoading(false)
    })
  }

  const sendMessage = () => {
    createNewMessage(chosenUid as string, {
      text: message,
      author: {
        id: chosenUid,
        email: '',
        name: '',
        surname: '',
        avatar: '',
      },
      createdAt: new Date(),
    },
      uid as string)
    updateUserData(chosenUid, { unread_messages_count: 1 })
    updateChatData(chosenUid, { hasNewMessages: false })
    setMessage("")
  }

  const logout = () => {
    dispatch(setUid(''))
  }

  const chats2Show = search ? searchedChats : chats

  let completed_at_text = 'Not completed yet'
  if (user?.progress_check_days_completed_dates?.length) {
    const res = user.progress_check_days_completed_dates.find(item => item.day === chosenDay)
    if (res) {
      completed_at_text = moment(res.completed_at).format('hh:mm:ss a - DD/MM/YYYY')
    }
  }

  return (
    <div>
      <div style={S.HEADER}>
        <img src='logo.png' width={40} height={40} style={S.LOGO} />
        Admin HappySneeze
        <button
          onClick={() => logout()}
          style={S.LOGOUT}
        >Logout
        </button>
      </div>
      <div style={S.CONTAINER}>
        <div style={{ ...FLEX(2) }}>
          <div style={MIDDLE_STYLE}>
            <input
              style={S.SEARCH_INPUT}
              placeholder='Search'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {!chats2Show.length && (!isLoading) &&
              <div>No users</div>
            }
            {isLoading && !chats2Show.length &&
              <div style={MARGIN_TOP(20)}>Loading...</div>
            }
            {chats2Show.map((c) => (
              <div key={c.id} style={MARGIN_BOTTTOM(20)}>
                <ChatItem
                  hasNewMessages={c.hasNewMessages && chosenUid !== c.interlocutors[0].id &&  chosenUid !== c.interlocutors[1].id }
                  isActive={chosenUid === c.id}
                  id={c.id}
                  interlocutor={
                    c.interlocutors[0].id === profile.uid
                      ? c.interlocutors[1]
                      : c.interlocutors[0]
                  }
                  lastMessage={c.messages.length ? c.messages[c.messages.length - 1] : null}
                  onItemClick={() => setChosenUid(c.id)}
                />
              </div>
            ))}
          </div>
        </div>
        <div style={S.MIDDLE}>
          {data && <>
            <div style={MESSAGES_CONTAINER_STYLE}>
              {data.messages.map((m) => (
                <RenderMessage
                  key={m.createdAt.toString()}
                  name={m.author.name}
                  date={m.createdAt}
                  text={m.text}
                  isLeft={m.author.id !== profile.uid}
                />
              ))}
              <div ref={messageRef}></div>
            </div>
            <div style={S.INPUT_AND_BTN}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={S.INPUT}
                placeholder='Write a message...'
              />
              <button
                onClick={sendMessage}
                style={{ ...S.BUTTON, ... (message?.replace(/\s/g, "").length) && COLOR('white') }}
                disabled={!message?.replace(/\s/g, "").length}
              >
                SEND
              </button>
            </div>
          </>}
        </div>
        <div style={S.RIGHT}>
          {!!user && (<>
            <div style={S.RIGHT_HEADER}>
              <img
                style={S.AVATAR}
                src={
                  user.avatar
                  ||
                  "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"
                }
              />
              <div style={S.RIGHT_NAME_CONTAINER}>
                <h4 style={LINE_HEIGHT(0.1)}>{user.name} {user.surname}</h4>
                <h5>{user.email}</h5>
                <textarea
                  value={admin_note}
                  rows={3}
                  style={S.RIGHT_TEXTAREA}
                  onChange={e => setAdmin_note(e.target.value)}
                >
                </textarea>
              </div>
            </div>
            <div style={S.DAYS_BIG_WRAPPER}>
              <div style={FLEX(1)}></div>
              <div
                style={{ ...FLEX(1), ...S.NEXT_PREV_BTNS }}
                onClick={() => {
                  if (chosenDay !== 1)
                    setChosenDay((chosenDay - 1))
                }}
              >
                《
              </div>
              <div
                style={{ ...FLEX(1), ...S.DAY, ...chosenDay === visiblePages[0] && S.DAY_ACTIVE }}
                onClick={() => setChosenDay(visiblePages[0])}
              >
                {visiblePages[0]}
              </div>
              <div
                style={{ ...FLEX(1), ...S.DAY, ...(chosenDay === visiblePages[1]) && S.DAY_ACTIVE }}
                onClick={() => setChosenDay(visiblePages[1])}
              >
                {visiblePages[1]}
              </div>
              <div
                style={{ ...FLEX(1), ...S.DAY, ...chosenDay === visiblePages[2] && S.DAY_ACTIVE }}
                onClick={() => setChosenDay(visiblePages[2])}
              >
                {visiblePages[2]}
              </div>
              <div
                style={{ ...FLEX(1), ...S.NEXT_PREV_BTNS }}
                onClick={() => {
                  if (chosenDay !== days.length)
                    setChosenDay((chosenDay + 1))
                }}
              >
                》
              </div>
              <div style={FLEX(1)}></div>
            </div>
            <div style={S.TIME_COMPLETED}>Time completed: {completed_at_text}</div>
            <div style={{...S.QUESTIONS_WRAPPER, ...{ height: questionsWrapperHeight }}}>
              {!!questionsOfChosenDay.length && (
                questionsOfChosenDay.map((current_question, index) => {
                  let answer2obj = ''
                  const found_answered_question = user.answered_questions.find(
                    answered_question => (answered_question.question_id === current_question.id)
                  )
                  if (found_answered_question) {
                    if (found_answered_question.type === 'text')
                      // @ts-ignore
                      answer2obj = found_answered_question.text_answer
                    else if (found_answered_question.answers?.length) {
                      found_answered_question.answers.forEach(answer => {
                        questionsOfChosenDay.forEach(question => {
                          if (question.id === current_question.id) {
                            if (question.answers.some(answer2 => (answer == answer2.value))) {
                              // @ts-ignore
                              answer2obj += (answer2obj.length ? ', ' : '') + question
                                .answers
                                .find(answer2 => (answer === answer2.value)).text
                            }
                          }
                        })
                      })
                    }
                  }
                  return (
                    <div>
                      {index + 1}. {current_question.question}
                      {answer2obj && <div style={S.ANSWER_WRAPPER}><span style={S.ANSWER}>{answer2obj}</span></div>}
                    </div>
                  )
                })
              )}
            </div>
            <div style={S.RESULTS_HEADER}>Results for Progress Checks</div>
            <div style={S.DAYS_TABLE}>
              <div style={S.PROGRESS_ROW}>
                <div style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>Day 1</div>
                <div style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>Day 10</div>
                <div style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>Day 20</div>
                <div style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>Day 30</div>
                <div style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>Day 40</div>
              </div>
              <div style={S.PROGRESS_ROW}>
                <div style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>{results[0]}</div>
                <div style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>{results[1]}</div>
                <div style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>{results[2]}</div>
                <div style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>{results[3]}</div>
                <div style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>{results[4]}</div>
              </div>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}