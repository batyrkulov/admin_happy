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
  height: window.innerHeight - (70 + 100),
}

export const RIGHT = {
  flex: 2.2,
  flexDirection: 'column' as 'column',
  padding: 20,
}

export const LEFT = {
  marginTop: 4,
  overflowY: 'scroll' as 'scroll',
  height: window.innerHeight,
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

