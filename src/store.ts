import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'
import loadReducer from './redux/load'
import loadsReducer from './redux/loads'

export const store = configureStore({
  reducer: {
    load: loadReducer,
    loads: loadsReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type LoadThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
export type LoadsThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
