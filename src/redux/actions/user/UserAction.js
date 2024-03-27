import axios from 'axios'
import { API_URL } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifiedDataSlice, verifyCodeslice } from '../../slices/user';

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
                await dispatch(verificationStatusAction(requestBody, token, setIsLoading))
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
        token,
        setIsLoading
    ) => async (dispatch) => {
        try {
            console.log(token, data, "token in status API")
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