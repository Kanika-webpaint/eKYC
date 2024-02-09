import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './slices/user'
import logger from 'redux-logger'

const reducer = combineReducers({
  login: authReducer,
})

// const store = configureStore({
//     reducer,
// })

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})


export default store;