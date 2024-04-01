import axios from 'axios'
import { API_URL } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';
import showAlert from '../../../components/showAlert';
import { createUserSlice, getOrgDetailsslice, getUserListSlice, getUserSlice, loginAdminslice } from '../../slices/organization/organizationSlice';

console.log(API_URL, "URL")
export const LoginAdminAction = (data, setIsLoading, setLoggedIn) => async (dispatch) => {
    try {
        const api_url = `${API_URL}/loginorganization`;
        const res = await axios.post(api_url, data);
        if (res?.status == 200) {
            setIsLoading(false);
            await AsyncStorage.setItem('token', res?.data?.token);
            await AsyncStorage.setItem('role', "organization");
            const storedToken = await AsyncStorage.getItem('token');
            const storedRole = await AsyncStorage.getItem('role');
            if (storedRole && storedToken) {
                await dispatch(loginAdminslice(res, setLoggedIn));
            }
        }
    } catch (e) {
        if (e?.response?.status === 404) {
            setIsLoading(false);
            showAlert('Organization Not found.');
        } else if (e?.response?.status === 401) {
            setIsLoading(false);
            showAlert('Invalid email and password.');
        } else if (e?.response?.status === 400) {
            setIsLoading(false);
            showAlert('Organization with this email already exists');
        } else {
            showAlert('Try again later!')
            setIsLoading(false);
        }
    }
};

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
        await dispatch(getOrgDetailsslice(res))
        AsyncStorage.setItem('org_id', JSON.stringify(res?.data?.organization?.id))
        AsyncStorage.setItem('org_name', JSON.stringify(res?.data?.organization?.name))
        if (res?.status === 200) {
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
        const api_url = `${API_URL}/organizationusers`
        const res = await axios.get(api_url, config)
        await dispatch(getUserListSlice(res))
        if (res?.status === 200) {
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
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                }
                const api_url = `${API_URL}/createuser`
                const res = await axios.post(api_url, data, config)
                if (res.status === 201) {
                    setIsLoading(false)
                    showAlert(res?.data?.message)
                    dispatch(getUsersListAction(token, setIsLoading))
                    navigation.goBack()
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
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                }
                const api_url = `${API_URL}/users/${id}`
                const res = await axios.get(api_url, config)
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


export const deleteUserAction =
    (
        id,
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

                const api_url = `${API_URL}/deleteuser/${id}`
                const res = await axios.delete(api_url, config)
                if (res.status === 200) {
                    dispatch(getUsersListAction(token, setIsLoading))
                } else {
                    showAlert(res?.data?.message)
                }
                await dispatch(getUserSlice(res))
            } catch (e) {
                setIsLoading(false)
                showAlert(e?.response?.data?.message)
            }
        }

export const editProfileAction =
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
                const api_url = `${API_URL}/edit`
                const res = await axios.post(api_url, data, config)
                if (res.status === 200) {
                    dispatch(getOrgDetailsAction(token, setIsLoading))
                } else {
                    showAlert(res?.data?.message)
                }
            } catch (e) {
                setIsLoading(false)
                showAlert(e?.response?.data?.message)
            }
        }



