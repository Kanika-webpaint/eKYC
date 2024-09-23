import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import showAlert from '../../../components/showAlert';
import {
  createUserSlice,
  getOrgDetailsslice,
  getUserListSlice,
  getUserSlice,
  loginAdminslice,
} from '../../slices/organization/organizationSlice';

export const LoginAdminAction =
  (data, setIsLoading, setLoggedIn) => async dispatch => {
    console.log();
    try {
      const api_url = `${API_URL}/loginorganization`;
      const res = await axios.post(api_url, data);
      console.log(res, '0-0-0-0-0-0-0');
      if (res?.status == 200) {
        setIsLoading(false);
        await AsyncStorage.setItem('token', res?.data?.token);
        await AsyncStorage.setItem('role', 'organization');
        // await AsyncStorage.setItem('subscriptionId', res?.data?.subscriptionId);

        const storedToken = await AsyncStorage.getItem('token');
        const storedRole = await AsyncStorage.getItem('role');
        // const suscriptionId = await AsyncStorage.getItem('subscriptionId');

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
        showAlert('Try again later!');
        setIsLoading(false);
      }
    }
  };

export const getOrgDetailsAction = (token, setIsLoading) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    };
    const api_url = `${API_URL}/getorganizationdetails`;
    const res = await axios.get(api_url, config);
    await dispatch(getOrgDetailsslice(res));
    AsyncStorage.setItem('org_id', JSON.stringify(res?.data?.organization?.id));
    AsyncStorage.setItem(
      'org_name',
      JSON.stringify(res?.data?.organization?.name),
    );
    if (res?.status === 200) {
      setIsLoading(false);
    } else {
      showAlert(res?.data?.message);
    }
  } catch (e) {
    setIsLoading(false);
    showAlert(e?.response?.data?.message);
  }
};

export const getUsersListAction = (token, setIsLoading) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    };
    console.log(token, 'token ------------');
    const api_url = `${API_URL}/organizationusers`;
    const res = await axios.get(api_url, config);
    await dispatch(getUserListSlice(res));
    console.log(res, '888888888');
    if (res?.status === 200) {
      setIsLoading(false);
    } else {
      showAlert(res?.data?.message);
    }
  } catch (e) {
    setIsLoading(false);
    console.log(e, '777777777', e?.response?.data?.message);
    showAlert(e?.response?.data?.message);
  }
};

export const CreateUserAction =
  (data, token, navigation, setIsLoading) => async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      };
      const api_url = `${API_URL}/createuser`;
      const res = await axios.post(api_url, data, config);
      if (res.status === 201) {
        setIsLoading(false);
        showAlert(res?.data?.message);
        dispatch(getUsersListAction(token, setIsLoading));
        navigation.goBack();
      } else {
        showAlert(res?.data?.message);
      }
      await dispatch(createUserSlice(res));
    } catch (e) {
      setIsLoading(false);
      showAlert(e?.response?.data?.message);
    }
  };

export const getUserByIdAction =
  (id, token, setIsLoading) => async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      };
      const api_url = `${API_URL}/users/${id}`;
      const res = await axios.get(api_url, config);
      if (res.status === 200) {
        setIsLoading(false);
      } else {
        showAlert(res?.data?.message);
      }
      await dispatch(getUserSlice(res));
    } catch (e) {
      setIsLoading(false);
      showAlert(e?.response?.data?.message);
    }
  };

export const deleteUserAction =
  (id, token, navigation, setIsLoading) => async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      };

      const api_url = `${API_URL}/deleteuser/${id}`;
      const res = await axios.delete(api_url, config);
      if (res.status === 200) {
        dispatch(getUsersListAction(token, setIsLoading));
      } else {
        showAlert(res?.data?.message);
      }
      await dispatch(getUserSlice(res));
    } catch (e) {
      setIsLoading(false);
      showAlert(e?.response?.data?.message);
    }
  };

export const updatePassowrdAction =
  (data, token, navigation, setIsLoading) => async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      };
      const api_url = `${API_URL}/updatepassword`;
      const res = await axios.put(api_url, data, config);
      if (res.status === 200) {
        setTimeout(() => {
          setIsLoading(false);
          showAlert(res?.data?.message);
          navigation.goBack();
        }, 200);
      } else {
        showAlert(res?.data?.message);
      }
    } catch (e) {
      setIsLoading(false);
      showAlert(e?.response?.data?.message);
    }
  };
