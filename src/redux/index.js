import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import { orgReducer } from './slices/organization/organizationSlice'
import { userReducer } from './slices/user/userSlice'

const reducer = combineReducers({
  org: orgReducer,
  user: userReducer
})

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store;