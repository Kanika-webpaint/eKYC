/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Keyboard, Dimensions, Image, KeyboardAvoidingView } from 'react-native';
import colors from '../../../common/colors';
import { logoValidyfy, verification } from '../../../common/images';
import MobileNumberCodeVerification from '../../../components/MobileNumberCodeVerification';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from 'react-native-confirmation-code-field';
import { useNavigation } from '@react-navigation/native';
import RedButton from '../../../components/RedButton';
import auth from '@react-native-firebase/auth';
import Loader from '../../../components/ActivityIndicator';
import CountryPick from '../../../components/CountryPicker';
import { useDispatch } from 'react-redux';
import Status from '../../../components/Status';
import showAlert from '../../../components/showAlert';
import { styles } from './styles';
import axios from 'axios';
import { API_URL } from "@env"
import { loginUserAction } from '../../../redux/actions/user/UserAction';

function MobileNumber() {
  const [value, setValue] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [numberWithCode, setNumberWithCode] = useState('')
  const [show, setShow] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [countryCode, setCountryCode] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isPotrait, setIsPortrait] = useState(true)
  const dispatch = useDispatch()
  const [confirmResult, setConfirmResult] = useState('')
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
  const CELL_COUNT = 6;
  const navigation = useNavigation();
  const [enable, setDisabled] = useState(true)
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

  useEffect(() => {
    const updateOrientation = () => {
      const { height, width } = Dimensions.get('window');
      setIsPortrait(height > width);
    };
    Dimensions.addEventListener('change', updateOrientation);
  }, []);

  useEffect(() => {
    const updateOrientation = () => {
      const { height, width } = Dimensions.get('window');
      setIsPortrait(height > width);
    };
    const unsubscribeFocus = navigation.addListener('focus', updateOrientation);
    return unsubscribeFocus;
  }, [navigation]);


  const SubmitButton = () => {
    return (
      <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'SUBMIT'} contentStyle={styles.buttonText} onPress={() => submitMobileNumber()} />
    );
  };

  const SubmitOTP = () => {
    return (
      <RedButton disabled={enable} buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'SUBMIT'} contentStyle={styles.buttonText} onPress={() => submitOTP()} />
    );
  };

  const checkUserRegister = async () => {
    try {
      setIsLoading(true);

      if (mobileNumber === '') {
        setShowError(true);
        setIsLoading(false);
        return;
      }

      let mobileNumberCode = countryCode ? countryCode : '+234';
      const phoneNumber = mobileNumberCode + mobileNumber;


      setNumberWithCode(phoneNumber);

      const requestData = {
        phoneNumber: phoneNumber
      };

      const api_url = `${API_URL}/validateuser`;

      const res = await axios.post(api_url, requestData);

      if (res.status === 200) {
        handleSendCode(phoneNumber);
      } else {
        showAlert(res.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      showAlert(error.response?.data?.message || error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleSendCode = async (numberWithCode) => {
    if (numberWithCode) {
      await auth().signInWithPhoneNumber(numberWithCode, true)
        .then(confirmResult => {
          setIsLoading(false)
          setConfirmResult(confirmResult)
          if (confirmResult._verificationId) {
            setIsLoading(false)
            setShowOTP(true)
          } else {
            setIsLoading(false)
            showAlert('Please try again later!')
          }
        })
        .catch(error => {
          setIsLoading(false)
          switch (error.code) {
            case 'auth/too-many-requests' || 'auth/app-not-authorized':
              showAlert('Too many attempts with One-Time Passwords.\nPlease try again later.')
              break;
            case 'auth/invalid-phone-number':
              showAlert('Please enter valid phone number')
              break;
            case 'auth/credential-already-in-use':
              showAlert('This phone number is already in use.')
              break;
            case 'auth/missing-phone-number':
              showAlert('Phone number is missing.')
              break;
            default:
              break;
          }
        })
    }
    else {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = (text) => {
    if (text && text.length == 6) {
      confirmResult
        .confirm(text)
        .then(user => {
          if (user) {
            setDisabled(false)
          }
        })
        .catch(error => {
          setIsLoading(false)
          switch (error.code) {
            case 'auth/invalid-verification-code':
              console.log(error.code, 'case 1')
              showAlert('Invalid verification code.\nPlease enter a valid code.')
              break;
            case 'auth/missing-verification-code':
              console.log(error.code, 'case 2')
              showAlert('Verification code is missing.')
              break;
            default:
              break;
          }
        })
    } else {
      setIsLoading(false)
      showAlert('Please enter a 6 digit OTP code.')
    }
  }

  const submitMobileNumber = () => {
    Keyboard.dismiss();
    checkUserRegister()
  }

  const submitOTP = () => {
    setIsLoading(true)
    Keyboard.dismiss();
    const requestData = {
      phoneNumber: numberWithCode
    };   
    dispatch(loginUserAction(requestData, navigation, setIsLoading))
  }

  const onChangeMobile = (text) => {
    setMobileNumber(text)
  }

  const onChangeCountryCode = () => {
    setShow(true)
  }

  const codeResend = useCallback(() => {
    setShowOTP(false)
    setMobileNumber('')
  }, [mobileNumber])

  const BottomView = () => {
    return (
      <View style={styles.bottomView}>
        <TouchableOpacity style={styles.codeView} onPress={() => codeResend()}>
          <Text style={styles.codeText}>You should've received your code via SMS.</Text>
          <Text style={styles.contactText}>If you haven't received a code, please contact {'\n'}             your agent to request a new one.</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    if (value.length === CELL_COUNT) {
      Keyboard.dismiss();
    }
  }, [value]);

  const LoginAsAdmin = () => {
    return (
      <TouchableOpacity style={styles.codeView} onPress={() => navigation.navigate('LoginAdmin')}>
        <Text style={[styles.adminText, { marginTop: isPotrait ? '5%' : ' 3%', marginBottom: isPotrait ? 0 : 20 }]}>Login As Admin</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={keyboardVerticalOffset}>
        <ScrollView style={{ marginBottom: '10%' }} keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }}>
          <Status lightContent />
          <Image source={logoValidyfy} style={{ flex: 1, alignSelf: 'center', height: 80, width: '60%', resizeMode: 'contain', marginTop: isPotrait ? 0 : '3%' }} />
          <MobileNumberCodeVerification verificationImageSource={verification} textFirst={'To begin, Please enter your'} textMiddle={showOTP ? 'Unique Registration code' : 'Mobile Number'} textLast={showOTP ? '(Received by SMS)' : '(Receive an OTP by SMS)'} />
          {showOTP ?
            <View style={styles.codeSection}>
              <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={(text) => {
                  setValue(text);
                  if (text.length === CELL_COUNT) {
                    handleVerifyCode(text)
                  }
                }}
                cellCount={CELL_COUNT}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </View>
            :
            <>
              <View style={styles.container}>
                <TouchableOpacity style={{ height: 30, width: 50, marginLeft: 10, marginRight: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => onChangeCountryCode()}>
                  <Text style={{ color: colors.white }}>{countryCode ? countryCode : '+234'}</Text>
                </TouchableOpacity>
                <TextInput
                  value={mobileNumber}
                  style={styles.input}
                  placeholder="Enter mobile number"
                  placeholderTextColor={colors.placeholder_grey}
                  keyboardType="phone-pad"
                  onChangeText={(text) => onChangeMobile(text)}
                />
              </View>
              {showError && (
                <View style={{ marginLeft: 33, marginTop: 5 }}>
                  <Text style={{ color: colors.app_red }}>Mobile number is required.</Text>
                </View>
              )}
            </>
          }
          {showOTP ?
            <SubmitOTP />
            :
            <SubmitButton />
          }
          {showOTP ? <BottomView /> : <LoginAsAdmin />}
          <CountryPick show={show} onBackdropPress={() => setShow(false)} pickerButtonOnPress={(item) => {
            setCountryCode(item.dial_code);
            setShow(false);
          }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default MobileNumber;


