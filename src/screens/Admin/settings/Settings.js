import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {lock, logout, rightArrow, userRed} from '../../../common/images';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Status from '../../../components/Status';
import {styles} from './styles';
import Header from '../../../components/Header';
import {useNavigation} from '@react-navigation/native';
import {loginAdminslice} from '../../../redux/slices/organization/organizationSlice';
import showAlert from '../../../components/showAlert';
import axios from 'axios';
import {API_URL} from '@env';

function Settings({route}) {
  console.log(route?.params?.data, 'ppppppp');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const handleCancelImmediate = async () => {
    const subscriptionId = route?.params?.data; // Get the subscription ID
    console.log(subscriptionId, 'Subscription ID'); // Log the subscription ID

    if (!subscriptionId) {
      showAlert('Subscription ID is not available.');
      return; // Exit the function if subscription ID is not available
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showAlert('Token is not available.');
        return;
      }

      console.log(token, 'Token retrieved');

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      };
      console.log(config, '-------');
      const data = {
        subscriptionId,
        immediate: 'immediateCancel', // Change to boolean if API expects it
      };
      console.log(data, 'data-------');

      console.log('formData', data);
      const api_url = `${API_URL}/cancel-subscription`;
      console.log('API URL', api_url);

      // Await the Axios request
      const res = await axios.post(api_url, data, config);
      console.log('Response:', res);

      if (res.data) {
        // Check if response data exists
        console.log(res.data, 'Response Data'); // Log the response data
        showAlert(res.data.message);
        const storedToken = await AsyncStorage.getItem('token');
        console.log(storedToken, 'kkkkkk');
        // const url = `${API_URL}/user`;
        // console.log(url, '----url', config);
        // const result = await axios.get(url, config);
        // console.log(result, '----result');

        // console.log(res, 'ooooooooo');
        // await dispatch(loginAdminslice(storedToken, true));
        // Optionally, update your state to reflect the canceled subscription
        // e.g., setSubscriptionCanceled(true);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      showAlert('Failed to cancel subscription. Please try again later.');
    }
  };

  const handleCancelAtSubscriptionPeriod = () => {
    // Logic for cancellation at the end of the subscription period
    setModalVisible(false);
  };
  const logoutAccount = useCallback(async () => {
    await AsyncStorage.clear();
    dispatch(loginAdminslice(false));
    showAlert('Logout successfully!');
  }, [dispatch]);

  const buttonAlert = () =>
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Logout',
        onPress: () => logoutAccount(),
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Status isLight />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{justifyContent: 'center'}}>
          <Header title={'Settings'} />
          <View
            style={{borderWidth: 0.3, borderColor: colors.light_grey}}></View>
          <View style={styles.imageView}>
            <Image source={userRed} style={styles.img} />
          </View>
        </View>
        <View style={{margin: 20}}>
          <TouchableOpacity
            style={styles.input}
            onPress={() => navigation.navigate('AdminProfile')}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={userRed}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}></Image>
              <Text style={styles.itemSetting}>Profile</Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Image
                source={rightArrow}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}></Image>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => navigation.navigate('ChangePassword')}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={lock}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}></Image>
              <Text style={styles.itemSetting}>Change password</Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Image
                source={rightArrow}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}></Image>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setModalVisible(true)}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={lock}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}></Image>
              <Text style={styles.itemSetting}>Cancel Subscription</Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Image
                source={rightArrow}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}></Image>
            </View>
          </TouchableOpacity>
          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Cancel Subscription</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCancelImmediate}>
                  <Text style={styles.buttonText}>Cancel Immediate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCancelAtSubscriptionPeriod}>
                  <Text style={styles.buttonText}>
                    Cancel at Subscription Period
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <TouchableOpacity style={styles.input} onPress={() => buttonAlert()}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={logout}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}></Image>

              <Text style={styles.itemSetting}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Settings;
