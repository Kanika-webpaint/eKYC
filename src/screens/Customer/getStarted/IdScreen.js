/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, Dimensions, KeyboardAvoidingView, Image } from 'react-native';
import RedButton from '../../../components/RedButton';
import { useNavigation } from '@react-navigation/native';
import Status from '../../../components/Status';
import { Inquiry, Environment } from 'react-native-persona';
import Loader from '../../../components/ActivityIndicator';
import { TEMPLATE_ID } from '@env';
import showAlert from '../../../components/showAlert';
import { styles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { verifyCodeslice } from '../../../redux/slices/user/userSlice';
import { checkverifiedUser, verifedCustomerDataAction } from '../../../redux/actions/user/UserAction';
import { logoValidyfy } from '../../../common/images';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

function IdScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { height: screenHeight } = Dimensions.get('window');
  const [isPotrait, setIsPortrait] = useState(true)
  const dispatch = useDispatch();
  const [userToken, setTokenUser] = useState('')
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
  const isCheckStatus = useSelector(state => state.user.verified);

  useEffect(() => {
    AsyncStorage.getItem("token_user").then((value) => {
      if (value) {
        setTokenUser(value)
        dispatch(checkverifiedUser(navigation, userToken, setIsLoading));
      }
    })
      .then(res => {
      });
  }, [dispatch, userToken]);

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

  const onPressStarted = () => {
    setIsLoading(true);
    setTimeout(() => onPressGo(), 1000);
  };

  const onPressGo = async () => {
    if (isCheckStatus?.isVerified == 1) {
      showAlert('You are already verified')
      setIsLoading(false);
      await AsyncStorage.clear();
      dispatch(verifyCodeslice(false));
    } else {
      check(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log('This feature is not available (on this device / in this context)');
              break;
            case RESULTS.DENIED:
              console.log('The permission has not been requested / is denied but requestable');
              break;
            case RESULTS.LIMITED:
              console.log('The permission is limited: some actions are possible');
              break;
            case RESULTS.GRANTED:
              setIsLoading(false);
              Inquiry.fromTemplate(TEMPLATE_ID)
                .environment(Environment.SANDBOX)
                .onComplete((inquiryId, status, fields) => {
                  setTimeout(async () => {
                    try {
                      setIsLoading(true)
                      if (status === 'completed') {
                        const requestData =
                        {
                          addressCity: fields?.addressCity?.value ? fields?.addressCity?.value : '',
                          addressCountryCode: fields?.addressCountryCode?.value ? fields?.addressCountryCode?.value : '',
                          addressPostalCode: fields?.addressPostalCode?.value ? fields?.addressPostalCode?.value : '',
                          addressStreet1: fields?.addressStreet1?.value ? fields?.addressStreet1?.value : '',
                          addressStreet2: fields?.addressStreet2?.value ? fields?.addressStreet2?.value : '',
                          addressSubdivision: fields?.addressSubdivision?.value ? fields?.addressSubdivision?.value : '',
                          birthdate: fields?.birthdate?.value ? fields?.birthdate?.value : '',
                          currentGovernmentId: fields?.currentGovernmentId?.value ? fields?.currentGovernmentId?.value : '',
                          currentSelfie: fields?.currentSelfie?.value ? fields?.currentSelfie?.value : '',
                          emailAddress: fields?.emailAddress?.value ? fields?.emailAddress?.value : '',
                          expirationDate: fields?.expirationDate?.value ? fields?.expirationDate?.value : '',
                          identificationClass: fields?.identificationClass?.value ? fields?.identificationClass?.value : '',
                          identificationNumber: fields?.identificationNumber?.value ? fields?.identificationNumber?.value : '',
                          nameFirst: fields?.nameFirst?.value ? fields?.nameFirst?.value : '',
                          nameLast: fields?.nameLast?.value ? fields?.nameLast?.value : '',
                          nameMiddle: fields?.nameMiddle?.value ? fields?.nameMiddle?.value : '',
                          phoneNumber: fields?.phoneNumber?.value ? fields?.phoneNumber?.value : '',
                          selectedCountryCode: fields?.selectedCountryCode?.value ? fields?.selectedCountryCode?.value : '',
                          selectedIdClass: fields?.selectedIdClass?.value ? fields?.selectedIdClass?.value : '',
                          inquiryId: inquiryId,
                          status: status
                        }
                        dispatch(verifedCustomerDataAction(requestData, navigation, userToken, setIsLoading));
                      }
                    } catch (e) {
                      console.log(e, 'catch error');
                    }
                  }, 500);
                })
                .onCanceled(
                  (inquiryId, sessionToken) =>
                    showAlert('You have canceled verification,\nplease verify'),
                  navigation.navigate('IdScreen'),
                )
                .onError(error => showAlert(error?.message))
                .build()
                .start();
              break;
            case RESULTS.BLOCKED:
              console.log('The permission is denied and not requestable anymore');
              break;
          }
        })
        .catch((error) => {
          // …
        });

    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={keyboardVerticalOffset}>
        <ScrollView style={{ marginBottom: '10%' }} keyboardShouldPersistTaps='handled'>
          <Status lightContent />
          <Image source={logoValidyfy} style={{ marginTop: isPotrait ? '20%' : '5%', alignSelf: 'center', resizeMode: 'contain', height: 80, width: '60%', }} />
          <View style={[styles.mainView, { height: screenHeight * 0.5 }]}>
            <Text style={styles.textVerify}>
              Simplify Identity Verification
            </Text>
            <Text style={styles.middleText}>
              Validifyx provides seamless digital verification solutions, empowering businesses to securely and conveniently interact with their customers.
            </Text>
          </View>
          <RedButton
            buttonContainerStyle={[styles.buttonContainer, { marginBottom: isPotrait ? 0 : 20 }]}
            ButtonContent={isLoading ? <Loader /> : "Let's get started"}
            image
            contentStyle={styles.buttonText}
            onPress={() => onPressStarted()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default IdScreen;
