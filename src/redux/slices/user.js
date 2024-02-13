import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'user',
    initialState: {
        phoneNumber: [],
        verifyCode: [],
        adminLogin: [],
        adminRegister: [],
        orgDetails: [],
        userCreateAdmin: [],
        getUsersList: [],
        getUser: []
    },

    reducers: {
        phoneNumberslice: (state, action) => {
            state.phoneNumber = action?.payload?.data
        },
        verifyCodeslice: (state, action) => {
            state.verifyCode = action?.payload?.data
        },
        loginAdminslice: (state, action) => {
            state.adminLogin = action?.payload?.data
        },
        registerAdminslice: (state, action) => {
            state.adminRegister = action?.payload?.data
        },
        getOrgDetailsslice: (state, action) => {
            state.orgDetails = action?.payload?.data
        },
        createUserSlice: (state, action) => {
            state.userCreateAdmin = action?.payload?.data
        },
        getUserListSlice: (state, action) => {
            state.getUsersList = action?.payload?.data
        },
        getUserSlice: (state, action) => {
            state.getUser = action?.payload?.data
        }
        //add more slices here
    }
})

export const authReducer = authSlice.reducer

export const {
    loginslice,
    registerslice,
    phoneNumberslice,
    verifyCodeslice,
    loginAdminslice,
    registerAdminslice,
    getOrgDetailsslice,
    createUserSlice,
    getUserListSlice,
    getUserSlice,
    // add more slices here
} = authSlice.actions
