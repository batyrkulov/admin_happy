import { Chat, createNewMessage, getAllChats, subscribeToChat, updateUserData, User } from 'app/api/chats';
import { ChatItem } from 'app/components/ChatItem';
import { RenderMessage } from 'app/components/RenderMessage';
import { setUid } from 'app/mainSlice';
import { color } from 'app/other/color';
import { COLOR, FLEX, MARGIN_BOTTTOM, MARGIN_TOP } from 'app/other/common-styles';
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

  const [chosenUid, setChosenUid] = useState<string>('')
  const [message, setMessage] = useState<string>("")
  const [data, setData] = useState<Chat | null>(null)

  useEffect(() => {
    getAllChats()
  })

  useEffect(() => {
    if (search)
      setSearchedChats(
        chats.filter(chat => {
          const user: User = chat.interlocutors[0].id === profile.uid
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
  }, [data])

  useEffect(() => {
    if (chosenUid) {
      subscribeToChat(chosenUid, setData)
    }
  }, [chosenUid])

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

  const chats2Show = search ? searchedChats : chats

  return (
    <div>
      <div style={S.HEADER}>
        <img src='logo.png' width={40} height={40} style={S.LOGO} />
        Admin HappySneeze
        <button
          onClick={() => logout()}
          style={S.LOGOUT}
        >Logout</button>
      </div>
      <div style={S.CONTAINER}>
        <div style={{ ...FLEX(1) }}>
          <div style={{ ...S.LEFT, }}>
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
        <div style={S.RIGHT}>
          {data && <>
            <div style={S.MESSAGES_CONTAINER}>
              {data.messages.map((m) => (
                <RenderMessage
                  key={m.createdAt.toString()}
                  name={m.author.name}
                  date={m.createdAt}
                  text={m.text}
                  isLeft={m.author.id !== profile.uid}
                />
              ))}
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
      </div>
    </div>
  );
}