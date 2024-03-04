/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView,  View, Text, ScrollView, Dimensions } from 'react-native';
import RedButton from '../../../components/RedButton';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../../components/Logo';
import Status from '../../../components/Status';
import { Inquiry, Environment } from 'react-native-persona';
import Loader from '../../../components/ActivityIndicator';
import { TEMPLATE_ID } from '@env';
import showAlert from '../../../components/showAlert';
import { styles } from './styles';

function IdScreen({ route }) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCardData, setVerificationCardData] = useState();
  const { height: screenHeight } = Dimensions.get('window');
  const [isPotrait, setIsPortrait] = useState(true)

  const onPressStarted = () => {
    setIsLoading(true);
    setTimeout(() => onPressGo(), 1000);
  };

  useEffect(() => {
    const updateOrientation = () => {
      const { height, width } = Dimensions.get('window');
      setIsPortrait(height > width);
    };
    Dimensions.addEventListener('change', updateOrientation);
    // Return a cleanup function
    // return () => {
    //     Dimensions?.removeEventListener('change', updateOrientation);
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

  const onPressGo = () => {
    setIsLoading(false);
    Inquiry.fromTemplate(TEMPLATE_ID)
      .environment(Environment.SANDBOX)
      .onComplete((inquiryId, status, fields) => {
        try {
          if (status === 'completed') {
            setVerificationCardData(fields);
            setTimeout(() => {
              navigation.navigate('HomeUser');
            }, 500);
          }
        } catch (e) {
          console.log(e, 'catch error');
        }
      })
      .onCanceled(
        (inquiryId, sessionToken) =>
          showAlert('You have canceled verification'),
        navigation.navigate('IdScreen'),
      )
      .onError(error => showAlert(error?.message))
      .build()
      .start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Status lightContent />
      <ScrollView keyboardShouldPersistTaps="handled">
        <Logo styleContainer={{ marginTop: isPotrait ? '30%' : '5%' }} fingerPrintStyle={[styles.fingerPrintStyle, { left: isPotrait ? 60 : 310 }]} />
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
          ButtonContent={isLoading ? <Loader /> : "Let's get started ->"}
          contentStyle={styles.buttonText}
          onPress={() => onPressStarted()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}



export default IdScreen;
