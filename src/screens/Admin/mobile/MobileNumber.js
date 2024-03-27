/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Keyboard, Dimensions, Image, KeyboardAvoidingView } from 'react-native';
import colors from '../../../common/colors';
import { logoValidyfy, verification } from '../../../common/images';
import MobileNumberCodeVerification from '../../../components/MobileNumberCodeVerification';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from 'react-native-confirmation-code-field';
import { useNavigation } from '@react-navigation/native';
import RedButton from '../../../components/RedButton';
import auth from '@react-native-firebase/auth';
import Loader from '../../../components/ActivityIndicator';
import Logo from '../../../components/Logo';
import CountryPick from '../../../components/CountryPicker';
import { PhoneNumberAction, VerifyCodeAction } from '../../../redux/actions/user';
import { useDispatch } from 'react-redux';
import { fonts } from '../../../common/fonts';
import Status from '../../../components/Status';
import showAlert from '../../../components/showAlert';
import { styles } from './styles';
import { phoneNumberslice, verifyCodeslice } from '../../../redux/slices/user';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env"

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

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

  useEffect(() => {
    const updateOrientation = () => {
      const { height, width } = Dimensions.get('window');
      setIsPortrait(height > width);
    };
    Dimensions.addEventListener('change', updateOrientation);
    // Return a cleanup function
    // return () => {
    //   Dimensions?.removeEventListener('change', updateOrientation);
    // };
  }, []);

  useEffect(() => {
    const updateOrientation = () => {
      const { height, width } = Dimensions.get('window');
      setIsPortrait(height > width);
    };
    // Add event listener when the screen focuses
    const unsubscribeFocus = navigation.addListener('focus', updateOrientation);
    // Remove event listener when the screen unfocuses
    return unsubscribeFocus;
  }, [navigation]);


  const SubmitButton = () => {
    return (
      <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'SUBMIT'} contentStyle={styles.buttonText} onPress={() => submitMobileNumber()} />
    );
  };

  const SubmitOTP = () => {
    return (
      <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'SUBMIT'} contentStyle={styles.buttonText} onPress={() => submitOTP()} />
    );
  };

  console.log("call function", API_URL)
  const checkUserRegister = async () => {
    try {
      if (mobileNumber === '') {
        setIsLoading(true)
        setShowError(true)
        setIsLoading(false)
      } else {
        setIsLoading(true)
        let mobileNumberCode = countryCode ? countryCode : '+91'
        console.log(mobileNumberCode + mobileNumber, "mobileee")
        setNumberWithCode(mobileNumberCode + mobileNumber)
        const requestData = {
          phoneNumber: mobileNumberCode + mobileNumber
        };
        const api_url = `${API_URL}/validateuser`
        const res = await axios.post(api_url, requestData)
        console.log(res.status, res?.data?.token, "response validateuser")
        if (res?.status === 200 && res?.data?.token) {
          console.log(res, "response register userr")
          await AsyncStorage.setItem('token_user', res?.data?.token);
          await AsyncStorage.setItem('role_user', "user");
          const storedToken = await AsyncStorage.getItem('token_user');
          const storedRole = await AsyncStorage.getItem('role_user');
          console.log(storedToken, storedRole, "checkkkk")
          if (storedRole && storedToken) {

            console.log("yes call")
            handleSendCode(numberWithCode)  // firebase call then 
          }
        } else {
          showAlert(res?.data?.message)
        }
        // await dispatch(phoneNumberslice(res))

        // dispatch(PhoneNumberAction(requestData, navigation, setShowOTP, setIsLoading))
      };
    } catch (e) {
      setIsLoading(false)
      showAlert(e?.response?.data?.message)
    }
  }

  const handleSendCode = async (numberWithCode) => {
    console.log(numberWithCode, "codeee with number")
    if (numberWithCode) {
      await auth().signInWithPhoneNumber(numberWithCode, true) //true added for resend code
        .then(confirmResult => {
          console.log(confirmResult, "resulttt")
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
          console.log(error, ">>>")
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
    // }
  }


  const handleVerifyCode = () => {
    // Request for OTP verification
    setIsLoading(true)
    if (value.length == 6) {
      confirmResult
        .confirm(value)
        .then(user => {
          setIsLoading(false)
          if (user) {
            console.log("callll")
            dispatch(verifyCodeslice(true));
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
      Alert.alert('Please enter a 6 digit OTP code.')
    }
  }

  // const handleVerifyCode = useCallback(async (setLoggedIn) => {
  //   // Request for OTP verification
  //   setIsLoading(true)
  //   if (value.length == 6) {
  //     // const requestData = {
  //     //   phoneNumber: numberWithCode,
  //     //   receivedotp: value ? value : '1234'  //value should be '1234' for now, will check with static data
  //     //   role:'user'
  //     // };
  //     const requestData = {
  //       phoneNumber: numberWithCode,
  //       receivedotp: value ? value : 123456 //value should be '1234' for now, will check with static data
  //     };
  //     dispatch(VerifyCodeAction(requestData, setIsLoading, setLoggedIn))
  //     // dispatch(VerifyCodeAction(requestData, setIsLoading, setLoggedIn))
  //   } else {
  //     setIsLoading(false)
  //     showAlert('Please enter a 6 digit OTP code.')
  //   }
  // }, [numberWithCode, value])


  const submitMobileNumber = () => {
    Keyboard.dismiss();
    // handleSendCode()
    checkUserRegister()
  }

  const submitOTP = () => {
    Keyboard.dismiss();
    handleVerifyCode()
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
    // Check if the value reaches the desired length
    if (value.length === CELL_COUNT) {
      Keyboard.dismiss(); // Dismiss the keyboard
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
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={value}
                onChangeText={(text) => setValue(text)}
                cellCount={CELL_COUNT}
                // rootStyle={styles.codeFieldRoot}
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


