import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IMainReducerState {
  uid: string | null
}

const initialState: IMainReducerState = {
  uid: null
}

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setUid(state, { payload }: PayloadAction<string>) {
      state.uid = payload
    },
  },
  extraReducers: (builder) => {
  },
})

export const {
  setUid,
} = mainSlice.actions
export default mainSlice.reducer