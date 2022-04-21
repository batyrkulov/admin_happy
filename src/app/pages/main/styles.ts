import { color } from "app/other/color";

export const HEADER = {
  height: 70,
  backgroundColor: color.palette.darkBlue,
  paddingLeft: 20,
  fontWeight: 'bold',
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

export const LOGOUT = {
  marginLeft: 50,
  borderRadius: 5,
  borderColor: color.palette.yellow,
  color: color.palette.darkBlue,
}

export const CONTAINER = {
  display: 'flex',
  flex: 1,
}

export const MESSAGES_CONTAINER = {
  display: 'flex',
  flexDirection: 'column' as 'column',
  backgroundColor: color.palette.slowMilky,
  overflowY: 'scroll' as 'scroll',
  paddingRight: 10,
  paddingLeft: 10,
}

export const MIDDLE = {
  flex: 2.7,
  flexDirection: 'column' as 'column',
  padding: 20,
  paddingTop: 3,
}

export const RIGHT = {
  flex: 3,
  flexDirection: 'column' as 'column',
  padding: 20,
  paddingTop: 0,
}

export const LEFT = {
  marginTop: 4,
  overflowY: 'scroll' as 'scroll',
  paddingTop: 20,
  paddingRight: 10,
  paddingLeft: 10,
  flexBasis: '100%'
}

export const LOGO = {
  borderRadius: 20,
  marginRight: 15,
}

export const INPUT_AND_BTN = {
  display: 'flex',
  flexDirection: 'row' as 'row'
}

export const SEARCH_INPUT = {
  width: '92%',
  height: 30,
  borderColor: color.palette.darkBlue,
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: 10,
  padding: 7,
  paddingLeft: 15,
  paddingRight: 15,
  justifyContent: 'center',
  marginBottom: 20,
}

export const INPUT = {
  flex: 85,
  height: 60,
  borderColor: color.palette.darkBlue,
  borderStyle: 'solid',
  borderWidth: 1,
  borderTopLeftRadius: 17,
  borderBottomLeftRadius: 17,
  padding: 7,
  paddingLeft: 15,
  paddingRight: 15,
}

export const BUTTON = {
  flex: 15,
  height: 76,
  backgroundColor: color.palette.darkBlue,
  borderColor: color.palette.darkBlue,
  borderStyle: 'solid',
  borderWidth: 1,
  borderTopRightRadius: 17,
  borderBottomRightRadius: 17,
  fontWeight: 'bold',
}

export const RIGHT_HEADER = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 15,
}

export const AVATAR = {
  borderRadius: 48,
  marginRight: 16,
  width: 80,
  height: 80,
}

export const RIGHT_NAME_CONTAINER = {
  flexGrow: 1,
}

export const RIGHT_TEXTAREA = {
  width: '90%',
  padding: 15,
}

export const DAYS_BIG_WRAPPER = {
  display: 'flex',
  alignItems: 'center',
}

export const DAY = {
  cursor: 'pointer',
  justifyContent: 'center',
  fontSize: 18,
}

export const DAY_ACTIVE = {
  backgroundColor: color.primary,
  color: 'white',
  borderRadius: 7,
  fontWeight: 'bold',
}

export const DISPLAY_FLEX = {
  display: 'flex',
}

export const NEXT_PREV_BTNS = {
  justifyContent: 'center',
  cursor: 'pointer',
  color: color.palette.darkBlue,
  fontSize: 'large',
  fontWeight: 'bold',
}

export const QUESTIONS_WRAPPER = {
  display: 'flex',
  flexDirection: 'column' as 'column',
  overflowY: 'auto' as 'auto', 
  marginTop: 15,
}

export const ANSWER = {
  backgroundColor: color.primary,
  color: 'white',
  padding: 4,
  borderRadius: 3,
}

export const ANSWER_WRAPPER = {
  margin: 10,
  marginBottom: 15,
}

export const RESULTS_HEADER = {
  display: 'flex',
  paddingTop: 5,
  paddingBottom: 5,
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 13,
  fontWeight: 'bold',
}

export const DAYS_TABLE = {
  display: 'flex',
  flexDirection: 'column' as 'column',
}

export const PROGRESS_ROW = {
  display: 'flex',
  flex: 1,
}

export const PROGRESS_ROW_ITEM = {
  borderStyle: 'solid',
  borderWidth: 1,
  padding: 10,
  fontSize: 15,
}

export const TIME_COMPLETED = {
  marginTop: 10,
  fontWeight: '500',
  fontSize: 15,
}
