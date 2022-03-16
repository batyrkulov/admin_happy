export const ROW = {
  display: 'flex',
  flexDirection: 'row' as 'row',
}

export const COLUMN = {
  display: 'flex',
  flexDirection: 'column' as 'column',
}

export const SPACE_BETWEEN = {
  display: 'flex',
  justifyContent: "space-between",
  alignItems: 'center',
}

export const border = {
  borderWidth: 1,
  borderColor: 'black',
  borderStyle: 'solid',
}

export const FLEX = (n: number) => ({ display: 'flex', flex: n })

export const HEIGHT = (n: number) => ({ height: n })

export const WIDTH = (n: number | string) => ({ width: n })

export const MARGIN_TOP = (n: number) => ({ marginTop: n })

export const OWERFLOWY = (s: string) => ({ owerflow: s })

export const COLOR = (c: string) => ({ color: c })

export const MARGIN_BOTTTOM = (n: number) => ({ marginBottom: n })
