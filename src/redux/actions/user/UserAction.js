import axios from 'axios'
import { API_URL } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserVerfiedSlice, verifiedDataSlice, verifyCodeslice } from '../../slices/user/userSlice';
import showAlert from '../../../components/showAlert';


export const verifedCustomerDataAction =
    (data,
        navigation,
        token,
        setIsLoading
    ) => async (dispatch) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
            }
            const api_url = `${API_URL}/document`
            const res = await axios.post(api_url, data, config)
            if (res.status === 200) {
                const requestBody = {
                    isVerified: "true"
                }
                await dispatch(verificationStatusAction(requestBody, navigation, token, setIsLoading))
            } else {
                showAlert(res?.data?.message)
            }
            await dispatch(verifiedDataSlice(res))
        } catch (e) {
            setIsLoading(false)
            showAlert(e?.response?.data?.message)
        }
    }


export const verificationStatusAction =
    (data,
        navigation,
        token,
        setIsLoading
    ) => async (dispatch) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
            }
            const api_url = `${API_URL}/updateuser`
            const res = await axios.put(api_url, data, config)
            if (res.status === 200) {
                setTimeout(async () => {
                    setIsLoading(false)
                    await AsyncStorage.clear();
                    dispatch(verifyCodeslice(false));
                    showAlert("Verification complete.\nThank you for your cooperation.");
                }, 500);
            } else {
                showAlert(res?.data?.message)
            }
        } catch (e) {
            setIsLoading(false)
            showAlert(e?.response?.data?.message)
        }
    }


export const loginUserAction =
    (data,
        navigation,
        setIsLoading
    ) => async (dispatch) => {
        try {
            const api_url = `${API_URL}/loginuser`
            const res = await axios.post(api_url, data)
            if (res?.status == 200) {

                await AsyncStorage.setItem('token_user', res?.data?.token);
                await AsyncStorage.setItem('role_user', "user");
                const storedToken = await AsyncStorage.getItem('token_user');
                const storedRole = await AsyncStorage.getItem('role_user');
                if (storedRole && storedToken) {
                    setIsLoading(false);
                    await dispatch(verifyCodeslice(true));

                }
            }
        } catch (e) {
            setIsLoading(false)
            showAlert(e?.response?.data?.message)
        }
    }

export const checkverifiedUser =
    (
        navigation,
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
                const api_url = `${API_URL}/user`
                const res = await axios.get(api_url, config)
                if (res.status === 200) {
                    setIsLoading(false)
                } else {
                    showAlert(res?.data?.message)
                }
                await dispatch(getUserVerfiedSlice(res))
            } catch (e) {
                setIsLoading(false)
                // showAlert(e?.response?.data?.message)
            }
        }




