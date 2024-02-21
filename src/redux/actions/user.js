
import axios from 'axios'
import { API_URL } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { contactUsSlice, createUserSlice, getOrgDetailsslice, getUserListSlice, getUserSlice, loginAdminslice, phoneNumberslice, registerAdminslice, verifyCodeslice } from '../slices/user';
import { Platform, ToastAndroid } from 'react-native';
import DashboardAdmin from '../../screens/Admin/DashboardAdmin';


const showAlert = (message) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
        AlertIOS.alert(message);
    }
};

export const LoginAdminAction = (data, setIsLoading, setLoggedIn) => async (dispatch) => {
    try {
        const api_url = `${API_URL}/loginorganization`;
        const res = await axios.post(api_url, data);
        // console.log(res)
        if (res?.status == 200) {
            console.log("success", res)
            setIsLoading(false);

            await AsyncStorage.setItem('token', res?.data?.token);
            await AsyncStorage.setItem('role', "organization");

            const storedToken = await AsyncStorage.getItem('token');
            const storedRole = await AsyncStorage.getItem('role');

            if (storedRole && storedToken) {
                // Redirect to the dashboard screen after successful login
                // setLoggedIn(true);
                await dispatch(loginAdminslice({ data: res.data, setLoggedIn }));

            }
        }
    } catch (e) {
        if (e?.response?.status === 404) {
            setIsLoading(false);
            showAlert('Organization Not found.');
        } else if (e?.response?.status === 401) {
            setIsLoading(false);
            showAlert('Invalid email and password.');
        } else {
            showAlert('Try again later!')
            setIsLoading(false);
        }
    }
};


export const VerifyCodeAction =
    (
        data,
        setIsLoading,
        setLoggedIn
    ) =>
        async (dispatch) => {
            try {
                console.log(API_URL, "validateOTP")
                const api_url = `${API_URL}/validateOTP`
                const res = await axios.post(api_url, data)
                console.log(res, "response verify OTP")
                if (res?.status == 200) {
                    console.log("success", res)

                    setIsLoading(false);

                    // await AsyncStorage.setItem('tokenUser', res?.data?.token);
                    await AsyncStorage.setItem('roleUser', "user");

                    // const storedToken = await AsyncStorage.getItem('tokenUser');
                    const storedRole = await AsyncStorage.getItem('roleUser');
                    // console.log("storedToken", storedToken)
                    console.log("storedRole", storedRole)

                    if (storedRole) {
                        console.log("alllll settttt")
                        navigation.navigate('IdScreen')
                        // Redirect to the dashboard screen after successful login
                        // setLoggedIn(true);
                        await dispatch(verifyCodeslice({ data: res.data, setLoggedIn }));

                        // navigation.replace("DashboardAdmin");
                    } else {
                        showAlert(res?.data?.message)
                    }
                }
            } catch (e) {
                setIsLoading(false)
                showAlert(e?.response?.data?.message)
            }
        }


export const RegisterAdminAction =
    (data,
        navigation,
        setIsLoading
    ) => async (dispatch) => {
        try {
            console.log(API_URL, "createorganization")
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
            showAlert(e?.response?.data?.message)
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
        console.log(API_URL, "getorganizationdetails")
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
        showAlert(e?.response?.data?.message)
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
        console.log(API_URL, "users")
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
        showAlert(e?.response?.data?.message)
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
                console.log(API_URL, "createuser")
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
                showAlert(e?.response?.data?.message)
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
                console.log(API_URL, "users by id")
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
                showAlert(e?.response?.data?.message)
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
                console.log(data, "dataa in action")
                console.log(API_URL, "sendOTP")
                const api_url = `${API_URL}/sendOTP`
                // const api_url = 'http://192.168.1.14:5000/api/sendOTP'
                const res = await axios.post(api_url, data)
                console.log(res, "response send OTP")
                if (res?.status === 200) {
                    console.log(res.status, "response status")
                    setIsLoading(false)
                    showAlert(res?.data?.message)
                    setShowOTP(true)
                } else {
                    showAlert(res?.data?.message)
                }
                await dispatch(phoneNumberslice(res))
            } catch (e) {
                setIsLoading(false)
                showAlert(e?.response?.data?.message)
            }
        }

// export const VerifyCodeAction =
//     (
//         data,
//         navigation,
//         setIsLoading
//     ) =>
//         async (dispatch) => {
//             try {
//                 console.log(API_URL, "validateOTP")
//                 const api_url = `${API_URL}/validateOTP`
//                 const res = await axios.post(api_url, data)
//                 console.log(res, "response verify OTP")
//                 if (res.status === 200) {
//                     setIsLoading(false)
//                     showAlert(res?.data?.message)
//                     navigation.navigate('AuthStack')
//                     // navigation.navigate('UserStackScreen')
//                 } else {
//                     showAlert(res?.data?.message)
//                 }
//                 await dispatch(verifyCodeslice(res))
//             } catch (e) {
//                 setIsLoading(false)
//                 showAlert(e?.response?.data?.message)
//             }
//         }

export const ContactUsAction =
    (
        data,
        token,
        navigation,
        setIsLoading
    ) =>
        async (dispatch) => {
            try {
                console.log(API_URL, "contactorganization")
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
                showAlert(e?.response?.data?.message)
            }
        }