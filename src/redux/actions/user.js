
import axios from 'axios'
import { API_URL } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { contactUsSlice, createUserSlice, getOrgDetailsslice, getUserListSlice, getUserSlice, phoneNumberslice, registerAdminslice, verifyCodeslice } from '../slices/user';
import { Platform, ToastAndroid } from 'react-native';


const showAlert = (message) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
        AlertIOS.alert(message);
    }
};

export const LoginAdminAction =
    (data,
        navigation,
        setIsLoading
    ) => async (dispatch) => {
        try {
            const api_url = `${API_URL}/loginorganization`
            // const api_url = 'http://192.168.1.26:5000/api/loginorganization'
            const res = await axios.post(api_url, data)
            console.log(res, api_url, "response login ADMIN")
            if (res?.status === 200) {
                setIsLoading(false)
                showAlert("Logged in successfully", res)
                AsyncStorage.setItem('authToken', res?.data?.token)
                navigation.navigate('OrganizationHomeStack')
            } else {
                showAlert(res?.data?.message)
            }
            await dispatch(loginAdminslice(res))
        } catch (e) {
            setIsLoading(false)
            showAlert('Organization not found')
        }
    }


export const RegisterAdminAction =
    (data,
        navigation,
        setIsLoading
    ) => async (dispatch) => {
        try {
            const api_url = `${API_URL}/createorganization`
            const res = await axios.post(api_url, data)
            if (res?.status === 201) {
                setIsLoading(false)
                showAlert(res?.data)
                navigation.navigate('SuccessScreen', { invoiceDetail: data }) // send amount from here to show on success screen
            } else {
                showAlert(res?.data)
            }
            await dispatch(registerAdminslice(res))
        } catch (e) {
            setIsLoading(false)
            showAlert('Try again later!')
        }
    }

export const getOrgDetailsAction = (token, setIsLoading) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
            },
        }
        const api_url = `${API_URL}/getorganizationdetails`
        const res = await axios.get(api_url, config)
        console.log(res, "response org detailss")
        await dispatch(getOrgDetailsslice(res))
        AsyncStorage.setItem('org_id', JSON.stringify(res?.data?.organization?.id))
        AsyncStorage.setItem('org_name', JSON.stringify(res?.data?.organization?.name))
        if (res?.status === 200) {
            console.log(res, "res get details of orgggg")
            setIsLoading(false)
        } else {
            showAlert(res?.data?.message)
        }
    } catch (e) {
        setIsLoading(false)
        showAlert('Network error')
    }
}


export const getUsersListAction = (token, setIsLoading) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
            },
        }
        const api_url = `${API_URL}/users`
        // const api_url = 'http://192.168.1.26:5000/api/users'
        const res = await axios.get(api_url, config)
        console.log(res, "response get users")
        await dispatch(getUserListSlice(res))
        if (res?.status === 200) {
            console.log(res, "res get users....")
            setIsLoading(false)
        } else {
            showAlert(res?.data?.message)
        }
    } catch (e) {
        setIsLoading(false)
        showAlert('Network error')
    }
}


export const CreateUserAction =
    (
        data,
        token,
        navigation,
        setIsLoading
    ) =>
        async (dispatch) => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                }
                const api_url = `${API_URL}/createuser`
                const res = await axios.post(api_url, data, config)
                console.log(res, "response create user by admin ")
                if (res.status === 201) {
                    setIsLoading(false)
                    showAlert(res?.data?.message)
                    navigation.navigate('DashboardAdmin')
                } else {
                    showAlert(res?.data?.message)
                }
                await dispatch(createUserSlice(res))
            } catch (e) {
                setIsLoading(false)
                showAlert('User already exists')
            }
        }

export const getUserByIdAction =
    (
        id,
        token,
        setIsLoading
    ) =>
        async (dispatch) => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                }
                const api_url = `${API_URL}/users/${id}`
                // const api_url = `http://192.168.1.26:5000/api/users/${id}`;
                const res = await axios.get(api_url, config)
                console.log(res, "get particular user detail:::")
                if (res.status === 200) {
                    setIsLoading(false)
                } else {
                    showAlert(res?.data?.message)
                }
                await dispatch(getUserSlice(res))
            } catch (e) {
                setIsLoading(false)
                showAlert('Unable to fetch details')
            }
        }

export const PhoneNumberAction =
    (
        data,
        navigation,
        setShowOTP,
        setIsLoading
    ) =>
        async (dispatch) => {
            try {
                // const api_url = `${API_URL}/sendOTP`
                const api_url = 'http://192.168.1.14:5000/api/sendOTP'
                const res = await axios.post(api_url, data)
                console.log(res, "response send OTP")
                if (res?.status === 200) {
                    setIsLoading(false)
                    showAlert(res?.data?.message)
                    setShowOTP(true)
                } else {
                    showAlert(res?.data?.message)
                }
                await dispatch(phoneNumberslice(res))
            } catch (e) {
                setIsLoading(false)
                showAlert('Mobile number not registered')
            }
        }

export const VerifyCodeAction =
    (
        data,
        navigation,
        setIsLoading
    ) =>
        async (dispatch) => {
            try {
                const api_url = `${API_URL}/validateOTP`
                const res = await axios.post(api_url, data)
                console.log(res, "response verify OTP")
                if (res.status === 200) {
                    setIsLoading(false)
                    showAlert(res?.data?.message)
                    navigation.navigate('HomeUser')
                    // navigation.navigate('UserStackScreen')
                } else {
                    showAlert(res?.data?.message)
                }
                await dispatch(verifyCodeslice(res))
            } catch (e) {
                setIsLoading(false)
                showAlert('Network error')
            }
        }

export const ContactUsAction =
    (
        data,
        token,
        navigation,
        setIsLoading
    ) =>
        async (dispatch) => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                }
                const api_url = `${API_URL}/contactorganization`
                const res = await axios.post(api_url, data, config)
                if (res.status === 200) {
                    showAlert(res?.data?.message)
                    setTimeout(() => navigation.navigate('Plan'), 1000)
                    setIsLoading(false)
                } else {
                    showAlert(res?.data?.message)
                }
                await dispatch(contactUsSlice(res))
            } catch (e) {
                setIsLoading(false)
                showAlert('You already made request')
            }
        }