import * as React from 'react'
import { color } from 'app/other/color'
import moment from 'moment'

interface IRenderMessageProps {
  name?: string
  text: string
  date: Date
  isLeft?: boolean
}

export const RenderMessage = ({ name, text, date, isLeft } : IRenderMessageProps): JSX.Element => {
  
  const MESSAGE_CONTAINER = {
    display: 'flex',
    flexDirection: 'column' as 'column',
    width: isLeft ? "90%" : "65%",
    borderRadius: 13,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 20,
    paddingLeft: 20,
    alignSelf: isLeft ? "flex-start" : "flex-end",
    backgroundColor: isLeft ? color.palette.white : color.palette.darkBlue,
    marginTop: 5,
    marginBottom: 5,
  }
  
  const NAME_AND_TIME = {
    display: 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between',
  }

  const NAME = {
    fontWeight: 'bold',
    color: isLeft ? color.palette.yellow3 : color.palette.white,
  }

  const TIME = {
    fontWeight: 'bold',
    color: isLeft ? color.palette.moreMilky : color.palette.white,
  }

  const MESSAGE = {
    color: isLeft ? color.palette.black : color.palette.white,
    marginTop: 8,
  }

  const time = moment(date).format("hh:mm")

  return (
    <div style={MESSAGE_CONTAINER}>
      <div style={NAME_AND_TIME}>
        <div style={NAME}>{name}</div>
        <div style={TIME}>{time}</div>
      </div>
      <div style={MESSAGE}>{text}</div>
    </div>
  )
}