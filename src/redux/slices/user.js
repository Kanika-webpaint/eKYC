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
        getUser: [],
        contact: [],
        isLogged:false,
        isLoggedUser:false
    },

    reducers: {
        phoneNumberslice: (state, action) => {
            state.phoneNumber = action?.payload?.data
        },
        verifyCodeslice: (state, action) => {
            state.verifyCode = action?.payload?.data
            state.isLoggedUser = true
        },
        loginAdminslice: (state, action) => {
            state.adminLogin = action?.payload?.data;
            state.isLogged = action.payload
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
        },
        contactUsSlice: (state, action) => {
            state.contact = action?.payload?.data
        },
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
    contactUsSlice
    // add more slices here
} = authSlice.actions
