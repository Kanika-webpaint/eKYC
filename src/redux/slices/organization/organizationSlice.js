import {createSlice} from '@reduxjs/toolkit';

const orgSlice = createSlice({
  name: 'org',
  initialState: {
    adminLogin: [],
    orgDetails: [],
    userCreateAdmin: [],
    getUsersList: [],
    getUser: [],
    isLogged: false,
    stripeSubs: [],
    planDetailList: [],
    subscriptionId: [],
  },

  reducers: {
    loginAdminslice: (state, action) => {
      state.adminLogin = action?.payload?.data;
      state.isLogged = action.payload;
    },
    getOrgDetailsslice: (state, action) => {
      state.orgDetails = action?.payload?.data;
    },
    createUserSlice: (state, action) => {
      state.userCreateAdmin = action?.payload?.data;
    },
    getUserListSlice: (state, action) => {
      state.getUsersList = action?.payload?.data;
    },
    getUserSlice: (state, action) => {
      state.getUser = action?.payload?.data;
    },
    stripeSubscriptionSlice: (state, action) => {
      state.stripeSubs = action?.payload?.data;
    },
    getPlanDetailSlice: (state, action) => {
      state.planDetailList = action?.payload?.data;
    },
  },
});

export const orgReducer = orgSlice.reducer;

export const {
  loginslice,
  loginAdminslice,
  getOrgDetailsslice,
  createUserSlice,
  getUserListSlice,
  getUserSlice,
  stripeSubscriptionSlice,
  getPlanDetailSlice,
} = orgSlice.actions;
