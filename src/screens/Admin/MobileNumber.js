/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
  ImageBackground,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  AlertIOS,
  ToastAndroid,
  Alert,
  Keyboard,
} from 'react-native';
import colors from '../../common/colors';
import { background_image, verification } from '../../common/images';
import MobileNumberCodeVerification from '../../components/MobileNumberCodeVerification';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useNavigation } from '@react-navigation/native';
import RedButton from '../../components/RedButton';
import auth from '@react-native-firebase/auth';
import Loader from '../../components/ActivityIndicator';
import Logo from '../../components/Logo';
import CountryPick from '../../components/CountryPicker';
import { PhoneNumberAction, VerifyCodeAction } from '../../redux/actions/user';
import { useDispatch } from 'react-redux';
import NetworkLogger from 'react-native-network-logger';
import { fonts, regular, thin } from '../../common/fonts';
import Status from '../../components/Status';


function MobileNumber() {
  const [showOTP, setShowOTP] = useState(false)
  const [value, setValue] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [userID, setUserId] = useState('')
  const [confirmResult, setConfirmResult] = useState('')
  const [show, setShow] = useState(false)
  const [countryCode, setCountryCode] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [numberWithCode, setNumberWithCode] = useState('')
  const [openLogs, setOpenLogs] = useState(false)
  const dispatch = useDispatch()
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const CELL_COUNT = 6;
  const navigation = useNavigation();


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

  const showAlert = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(message);
    }
    Keyboard.dismiss();
  };


  // const handleSendCode = async () => {
  //   if (mobileNumber === '') {
  //     setIsLoading(true)
  //     setShowError(true)
  //     setIsLoading(false)
  //   } else {
  //     setIsLoading(true)
  //     // Request to send OTP
  //     setShowError(false)
  //     let mobileNumberCode = countryCode ? countryCode : '+91'
  //     if (mobileNumberCode !== '' && mobileNumber !== '') {
  //       await auth().signInWithPhoneNumber(mobileNumberCode + mobileNumber, true) //true added for resend code
  //         .then(confirmResult => {
  //           setIsLoading(false)
  //           setConfirmResult(confirmResult)
  //           if (confirmResult._verificationId) {
  //             setIsLoading(false)
  //             setShowOTP(true)
  //           } else {
  //             setIsLoading(false)
  //             showAlert('Please try again later!')
  //           }
  //         })
  //         .catch(error => {
  //           console.log(error, ">>>")
  //           setIsLoading(false)
  //           switch (error.code) {
  //             case 'auth/too-many-requests' || 'auth/app-not-authorized':
  //               showAlert('Please try again later!')
  //               break;
  //             case 'auth/invalid-phone-number':
  //               showAlert('Please enter valid phone number')
  //               break;
  //             case 'auth/credential-already-in-use':
  //               showAlert('This phone number is already in use.')
  //               break;
  //             case 'auth/missing-phone-number':
  //               showAlert('Phone number is missing.')
  //               break;

  //             default:
  //               break;
  //           }
  //         })
  //     }
  //     else {
  //       setIsLoading(false)
  //       showAlert('Please enter valid phone number')
  //     }
  //   }
  // }

  const handleSendCode = () => {
    setShowOTP(true)
    // if (mobileNumber === '') {
    //   setIsLoading(true)
    //   setShowError(true)
    //   setIsLoading(false)
    // } else {
    //   setIsLoading(true)
    //   let mobileNumberCode = countryCode ? countryCode : '+91'
    //   console.log(mobileNumberCode + mobileNumber, "mobileee")
    //   setNumberWithCode(mobileNumberCode + mobileNumber)
    //   const requestData = {
    //     phoneNumber: mobileNumberCode + mobileNumber
    //   };
    //   console.log(requestData,">>>>>>>>>>>>")
    //   dispatch(PhoneNumberAction(requestData, navigation, setShowOTP, setIsLoading))
    // };
  }


  const handleVerifyCode = useCallback(() => {
    navigation.navigate('UserStackScreen')
    // Request for OTP verification
    // setIsLoading(true)
    // console.log(value, "length of value")
    // if (value.length == 6) {
    //   const requestData = {
    //     phoneNumber: numberWithCode,
    //     receivedotp: value
    //   };
    //   dispatch(VerifyCodeAction(requestData, navigation, setIsLoading))
    // } else {
    //   setIsLoading(false)
    //   showAlert('Please enter a 6 digit OTP code.')
    // }
  }, [numberWithCode, value])


  // const handleVerifyCode = () => {
  //   // Request for OTP verification
  //   setIsLoading(true)
  //   if (value.length == 6) {
  //     confirmResult
  //       .confirm(value)
  //       .then(user => {
  //         setIsLoading(false)
  //         setUserId(user.uid)
  //         console.log(user.uid, "???????")
  //         if (user?.uid) {
  //           console.log("callll")
  //           navigation.navigate('Login')
  //         }
  //       })
  //       .catch(error => {
  //         setIsLoading(false)
  //         switch (error.code) {
  //           case 'auth/invalid-verification-code':
  //             console.log(error.code, 'case 1')
  //             showAlert('Invalid verification code. Please enter a valid code.')
  //             break;
  //           case 'auth/missing-verification-code':
  //             console.log(error.code, 'case 2')
  //             showAlert('Verification code is missing.')
  //             break;
  //           default:
  //             break;
  //         }
  //       })
  //   } else {
  //     setIsLoading(false)
  //     Alert.alert('Please enter a 6 digit OTP code.')
  //   }
  // }


  const submitMobileNumber = () => {
    handleSendCode()
  }

  const submitOTP = () => {
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

  const LoginAsAdmin = () => {
    return (
      <TouchableOpacity style={styles.codeView} onPress={() => navigation.navigate('LoginAdmin')}>
        <Text style={styles.adminText}>Login As Admin</Text>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
    <Status lightContent/>
      <View style={{ flex: 1, backgroundColor: colors.app_blue }}>

        {/* <ImageBackground
        source={background_image}
        style={{ flex: 1 }}
      > */}
        <ScrollView style={{ marginBottom: 10 }} keyboardShouldPersistTaps='handled'>
          <Logo />
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
                  <Text style={{ color: colors.white }}>{countryCode ? countryCode : '+91'}</Text>
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
                <View style={{ marginLeft: 35 }}>
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
      </View>
      {/* </ImageBackground> */}
      {/* remove later */}
      {/* <TouchableOpacity style={{ margin: 30, height: 50, width: 50, borderRadius: 25, backgroundColor: colors.app_red, justifyContent: 'center', alignItems: 'center' }} onPress={() => setOpenLogs(!openLogs)}>
        <Text style={{ alignSelf: 'center', color: colors.white }}>Logs</Text>
      </TouchableOpacity>
      {openLogs && <NetworkLogger />} */}
      {/* remove later */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomColor: colors.white,
    borderBottomWidth: 1,
    marginHorizontal: 30,
    marginTop: 20,
  },
  input: {
    flex: 1, // Ensure the TextInput fills the available space
    borderWidth: 0,
    fontSize: 16,
    color: colors.grey,
    fontFamily: fonts.regular
  },
  buttonContainer: {
    marginTop: '10%',
    marginBottom: '3%',
    backgroundColor: colors.app_red,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.bold
  },
  bottomView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  codeView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  codeText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.light_grey
  },
  contactText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.light_grey,
    alignSelf: 'center'
  },
  root: {
    flex: 1,
    padding: 20
  },
  codeFieldRoot: {
    marginTop: 20
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 35,
    fontSize: 24,
    borderRadius: 5,
    borderBottomColor: colors.white,
    borderBottomWidth: 1,
    color: colors.white,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: colors.white,
    alignSelf: 'center'
  },
  codeSection: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 18
  },
  adminText: {
    fontSize: 18,
    color: colors.white,
    textDecorationLine: 'underline',
    fontFamily: fonts.regular
  }
});

export default MobileNumber;