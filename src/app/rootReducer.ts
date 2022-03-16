import { combineReducers } from '@reduxjs/toolkit'
import mainSlice from './mainSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'main',
    storage: storage,
  };

const rootReducer = combineReducers({
    main: persistReducer(persistConfig, mainSlice)
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer