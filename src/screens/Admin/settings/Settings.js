import React, {useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
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

function Settings({route}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

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
