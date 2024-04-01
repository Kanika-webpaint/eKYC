import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        phoneNumber: [],
        verifyCode: [],
        isLoggedUser: false,
    },
    reducers: {
        phoneNumberslice: (state, action) => {
            state.phoneNumber = action?.payload?.data
        },
        verifyCodeslice: (state, action) => {
            state.verifyCode = action?.payload?.data
            state.isLoggedUser = action.payload
        },
        verifiedDataSlice: (state, action) => {
            state.verifiedDataList = action?.payload?.data
        },
    }
})

export const userReducer = userSlice.reducer

export const {
    phoneNumberslice,
    verifyCodeslice,
    verifiedDataSlice,
} = userSlice.actions
