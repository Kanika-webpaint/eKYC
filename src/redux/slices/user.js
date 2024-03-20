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
        isLoggedUser:false,
        verifiedDataList:[],
        verifiedDataListDashboard:[],
        stripeSubs:[],
        planDetailList:[]
    },

    reducers: {
        phoneNumberslice: (state, action) => {
            state.phoneNumber = action?.payload?.data
        },
        verifyCodeslice: (state, action) => {
            state.verifyCode = action?.payload?.data
            state.isLoggedUser = action.payload
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
        verifiedDataSlice: (state, action) => {
            state.verifiedDataList = action?.payload?.data
        },
        getVerifiedUserListSlice:(state, action) => {
            state.verifiedDataListDashboard = action?.payload?.data
        },
        stripeSubscriptionSlice:(state, action) => {
            state.stripeSubs = action?.payload?.data
        },
        getPlanDetailSlice:(state, action) => {
            state.planDetailList = action?.payload?.data
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
    contactUsSlice,
    verifiedDataSlice,
    getVerifiedUserListSlice,
    stripeSubscriptionSlice,
    getPlanDetailSlice
    // add more slices here
} = authSlice.actions
