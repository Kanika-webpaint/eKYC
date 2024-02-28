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
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  AlertIOS,
  ToastAndroid,
  Keyboard,
  Alert,
} from 'react-native';
import colors from '../../common/colors';
import { verification } from '../../common/images';
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
import { fonts } from '../../common/fonts';
import Status from '../../components/Status';
import showAlert from '../../components/showAlert';


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
    // setShowOTP(true)
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
      dispatch(PhoneNumberAction(requestData, navigation, setShowOTP, setIsLoading))
    };
  }


  const handleVerifyCode = useCallback(async (setLoggedIn) => {
    // dispatch(VerifyCodeAction(setLoggedIn))

    // Request for OTP verification
    setIsLoading(true)
    if (value.length == 6) {
      // const requestData = {
      //   phoneNumber: numberWithCode,
      //   receivedotp: value ? value : '1234'  //value should be '1234' for now, will check with static data
      //   role:'user'
      // };
      const requestData = {
        phoneNumber: numberWithCode,
        receivedotp: value ? value : 123456 //value should be '1234' for now, will check with static data
      };
      dispatch(VerifyCodeAction(requestData, setIsLoading, setLoggedIn))

      // dispatch(VerifyCodeAction(requestData, setIsLoading, setLoggedIn))
    } else {
      setIsLoading(false)
      showAlert('Please enter a 6 digit OTP code.')
    }
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
    Keyboard.dismiss();
    handleSendCode()
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

  const LoginAsAdmin = () => {
    return (
      <TouchableOpacity style={styles.codeView} onPress={() => navigation.navigate('LoginAdmin')}>
        <Text style={styles.adminText}>Login As Admin</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Status lightContent />
      <View style={{ flex: 1, backgroundColor: colors.app_blue }}>
        <ScrollView style={{ marginBottom: 10 }} keyboardShouldPersistTaps='handled'>
          <Logo styleContainer={{ marginTop: '30%' }} />
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.app_blue,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomColor: colors.white,
    borderBottomWidth: 1,
    marginHorizontal: 30,
    marginTop: '8%',
  },
  input: {
    flex: 1,
    borderWidth: 0,
    fontSize: 18,
    color: colors.white,
    fontFamily: fonts.regular,
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: '10%',
    marginBottom: '3%',
    backgroundColor: colors.app_red,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  bottomView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '8%',
  },
  codeView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2%',
  },
  codeText: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.light_grey,
  },
  contactText: {
    marginTop: '5%',
    fontSize: 14, 
    fontFamily: fonts.medium,
    color: colors.light_grey,
    alignSelf: 'center',
    textAlign: 'center',
  },
  root: {
    flex: 1,
    padding: 20,
  },
  codeFieldRoot: {
    marginTop: '5%',
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
    alignSelf: 'center',
  },
  codeSection: {
    marginHorizontal: 30,
    marginTop: '5%',
  },
  adminText: {
    fontSize: 16,
    color: colors.white,
    textDecorationLine: 'underline',
    fontFamily: fonts.regular,
    marginTop: '8%',
    textAlign: 'center',
  },
});

export default MobileNumber;


