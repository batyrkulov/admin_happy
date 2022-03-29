import { Chat, createNewMessage, getAllChats, IShortUser, subscribeToChat, updateUserData } from 'app/api/chats';
import { getAllDays, getAllProgresses, getAllQuestions, getAllQuestionsOfDay, IQuestion } from 'app/api/other';
import { getUserInfoById, IProfile } from 'app/api/users';
import { ChatItem } from 'app/components/ChatItem';
import { RenderMessage } from 'app/components/RenderMessage';
import { setUid } from 'app/mainSlice';
import { COLOR, FLEX, HEIGHT, MARGIN_BOTTTOM, MARGIN_TOP } from 'app/other/common-styles';
import { main } from 'app/selectors';
import { FirebaseApp } from 'firebase/app';
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
  const [questionsOfChosenDay, setQuestionsOfChosenDay] = useState<IQuestion[]>([])
  const [admin_note, setAdmin_note] = useState<string>('')
  const [days, setDays] = useState<number[]>([])
  const daysRef = useRef<null | HTMLDivElement>(null)

  const [middleHeight, setLeftHeight] = useState<number>(window.innerHeight)
  const [messagesContainerHeight, setMessagesContainerHeight] = useState<number>(window.innerHeight - (70 + 100))

  useEffect(() => {
    updateChats()
    getAllDays().then(res => setDays(res.docs.map(item => (parseInt(item.id))).sort((a, b) => a - b)))
    window.addEventListener('resize', () => {
      setLeftHeight(window.innerHeight)
      setMessagesContainerHeight(window.innerHeight - (70 + 100))
    })
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
            return (user.email.toLowerCase().includes(search.toLowerCase()))
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
    }
  }, [chosenUid])

  useEffect(() => {
    if (chosenDay) {
      setQuestionsOfChosenDay([])
      getAllQuestionsOfDay(chosenDay).then(questions => setQuestionsOfChosenDay(questions))
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
    setMessage("")
  }

  const logout = () => {
    dispatch(setUid(''))
  }

  const scrollDaysList = (n: number) => {
    if (daysRef.current) {
      daysRef.current!.scrollLeft += n
    }
  }

  const chats2Show = search ? searchedChats : chats

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
            {isLoading &&
              <div style={MARGIN_TOP(20)}>Loading...</div>
            }
            {chats2Show.map((c) => (
              <div key={c.id} style={MARGIN_BOTTTOM(20)}>
                <ChatItem
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
                src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"
              />
              <div style={S.RIGHT_NAME_CONTAINER}>
                <h3>{user.name} {user.surname}</h3>
                <h4>{user.email}</h4>
                <textarea
                  value={admin_note}
                  rows={5}
                  style={S.RIGHT_TEXTAREA}
                  onChange={e => setAdmin_note(e.target.value)}
                >
                </textarea>
              </div>
            </div>
            <div style={S.DAYS_BIG_WRAPPER}>
              <div style={{ ...FLEX(1), ...S.NEXT_PREV_BTNS }} onClick={() => scrollDaysList(-400)}>
                《
              </div>
              <div style={{ ...S.DAYS, ...FLEX(10) }} ref={daysRef}>
                {days.map(d => (
                  <h3
                    style={{ ...S.DAY, ...chosenDay === d && S.DAY_ACTIVE }}
                    onClick={() => setChosenDay(d)}
                  >
                    {d}
                  </h3>
                ))}
              </div>
              <div style={{ ...FLEX(1), ...S.NEXT_PREV_BTNS }} onClick={() => scrollDaysList(400)}>
                》
              </div>
            </div>
            <div style={S.QUESTIONS_AND_RESULTS_WRAPPER}>
              <div style={HEIGHT(1800)}>
                <div style={S.QUESTIONS_WRAPPER}>
                  {!!questionsOfChosenDay.length && (
                    questionsOfChosenDay.map(current_question => {
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
                          <p>
                            {current_question.question}
                            <br></br>
                            <br></br>
                            {answer2obj && <span style={S.ANSWER}>{answer2obj}</span>}
                          </p>
                        </div>
                      )
                    })
                  )}
                </div>
                <div style={S.RESULTS_HEADER}><h2>Results for Progress Checks</h2></div>
                <div style={S.DAYS_TABLE}>
                  <div style={S.PROGRESS_ROW}>
                    <h3 style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>Day 1</h3>
                    <h3 style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>Day 10</h3>
                    <h3 style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>Day 20</h3>
                    <h3 style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>Day 30</h3>
                    <h3 style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>Day 40</h3>
                  </div>
                  <div style={S.PROGRESS_ROW}>
                    <h3 style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>{results[0]}</h3>
                    <h3 style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>{results[1]}</h3>
                    <h3 style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>{results[2]}</h3>
                    <h3 style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>{results[3]}</h3>
                    <h3 style={{ ...FLEX(1), ...S.PROGRESS_ROW_ITEM }}>{results[4]}</h3>
                  </div>
                </div>
              </div>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}