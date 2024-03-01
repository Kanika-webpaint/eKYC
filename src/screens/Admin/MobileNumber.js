/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Keyboard, Dimensions } from 'react-native';
import colors from '../../common/colors';
import { verification } from '../../common/images';
import MobileNumberCodeVerification from '../../components/MobileNumberCodeVerification';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from 'react-native-confirmation-code-field';
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
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
  const CELL_COUNT = 6;
  const navigation = useNavigation();


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

  const handleSendCode = () => {
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
      <Status lightContent />
      <View style={{ flex: 1, backgroundColor: colors.app_blue }}>
        <ScrollView style={{ marginBottom: 10 }} keyboardShouldPersistTaps='handled'>
          <Logo styleContainer={{ marginTop: isPotrait ? '30%' : '5%' }} fingerPrintStyle={[styles.fingerPrintStyle, { left: isPotrait ? 60 : 310 }]} />
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
    textAlign: 'center',
  },
  fingerPrintStyle: {
    // Position 60 units to the left
    top: 0, // Adjust the top position as needed
    position: 'absolute', // Position the fingerprint image absolutely
    height: 70,
    width: 70,
  }

});

export default MobileNumber;


