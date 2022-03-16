import { Message, User } from "app/api/chats"
import { color } from "app/other/color"
import { FLEX, ROW, SPACE_BETWEEN } from "app/other/common-styles"
import moment from "moment"
import React, { FC, useMemo } from "react"

const AVATAR = {
  borderRadius: 48,
  marginRight: 16,
  width: 48,
  height: 48,
}

const WRAPPER = {
  padding: 10,
  cursor: 'pointer',
}

const CONTENT = { alignSelf: "stretch", justifyContent: "space-between" }

const NAME = {
  color: color.palette.black,
  cursor: 'pointer',
}

const MESSAGE_TEXT = {
  color: color.palette.bayoux,
  fontWeight: "300",
  cursor: 'pointer',
}

const DATE = {
  ...MESSAGE_TEXT,
  color: color.palette.black,
  alignSelf: "flex-start",
  paddingHorizontal: 1,
  cursor: 'pointer',
}

const ACTIVE = {
  borderWidth: 2,
  borderColor: color.palette.darkBlue,
  borderStyle: 'solid',
  borderTopLeftRadius: 17,
  borderBottomRightRadius: 17,
}

type ChatItemProps = {
  interlocutor: User
  lastMessage: Message | null
  id: string
  onItemClick: () => void
  isActive?: boolean
}

export const ChatItem: FC<ChatItemProps> = ({ interlocutor, lastMessage, id, onItemClick, isActive }) => {
  const date = useMemo(() => {
    return moment(lastMessage?.createdAt).isSame(new Date(), "day")
      ? moment(lastMessage?.createdAt).format("hh:mm")
      : moment(lastMessage?.createdAt).calendar(null, {
        // when the date is closer, specify custom values
        lastWeek: "dddd",
        lastDay: "[Yesterday]",
        sameDay: moment(lastMessage?.createdAt).format("hh:mm"),
        nextDay: "[Tomorrow]",
        nextWeek: "dddd",
      })
  }, [lastMessage?.createdAt])

  return (
    <div
      onClick={onItemClick}
      style={{ ...ROW, ...isActive && ACTIVE, ...WRAPPER }}
    >
      <img
        style={AVATAR}
        src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"
      />
      <div style={{ ...ROW, ...FLEX(1), ...SPACE_BETWEEN }}>
        <div style={CONTENT}>
          <div style={NAME}>
            {(interlocutor.name || interlocutor.surname)
              ? `${interlocutor.name} ${interlocutor.surname}`
              : interlocutor.email
            }
          </div>
          <div style={MESSAGE_TEXT}>
            {lastMessage?.text?.slice(0, 50)}{(lastMessage?.text?.length && lastMessage?.text?.length > 50) && '...'}
          </div>
        </div>
        <div style={DATE}>{date}</div>
      </div>
    </div>
  )
}
