/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import colors from '../../common/colors';
import RedButton from '../../components/RedButton';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../components/Logo';
import { fonts } from '../../common/fonts';
import Status from '../../components/Status';
import { Inquiry, Environment } from 'react-native-persona';
import Loader from '../../components/ActivityIndicator';
import { TEMPLATE_ID } from '@env';
import showAlert from '../../components/showAlert';

function IdScreen({ route }) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCardData, setVerificationCardData] = useState();
  const { height: screenHeight } = Dimensions.get('window');

  const onPressStarted = () => {
    setIsLoading(true);
    setTimeout(() => onPressGo(), 1000);
  };

  const onPressGo = () => {
    setIsLoading(false);
    Inquiry.fromTemplate(TEMPLATE_ID)
      .environment(Environment.SANDBOX)
      .onComplete((inquiryId, status, fields) => {
        console.log(status, fields, "check on done call or not")
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
        <Logo

          fingerPrintStyle={styles.fingerPrint}
          logoStyle={styles.logo}
        />
        <View style={[styles.mainView, { height: screenHeight * 0.5 }]}>
          <Text style={styles.textVerify}>
            Simplify Identity Verification
          </Text>
          <Text style={styles.middleText}>
            Validyfy provides seamless digital verification solutions, empowering businesses to securely and conveniently interact with their customers.
          </Text>
        </View>
        <RedButton
          buttonContainerStyle={styles.buttonContainer}
          ButtonContent={isLoading ? <Loader /> : "Let's get started ->"}
          contentStyle={styles.buttonText}
          onPress={() => onPressStarted()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.app_blue,
  },
  mainView: {
    backgroundColor: colors.light_purple,
    margin: 30,
    marginTop: '10%',
    justifyContent: 'center',
    padding: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  middleText: {
    marginTop: 30,
    fontSize: 16, // Adjusted font size for better readability
    fontFamily: fonts.regular,
    color: colors.grey,
    lineHeight: 22, // Adjusted line height for better readability
  },
  textVerify: {
    fontSize: 32, // Adjusted font size for better visual hierarchy
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 10, // Added margin bottom for spacing
  },
  buttonContainer: {
    marginTop: '5%',
    backgroundColor: colors.app_red,
    paddingVertical: 10, // Adjusted padding for better button appearance
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 30,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    alignSelf: 'center',
    fontFamily: fonts.medium,
    marginRight: 5, 
  },
  logo: {
    width: '60%',
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  fingerPrint: {
    alignSelf: 'center',
    position: 'absolute',
    resizeMode: 'contain',
  },
});

export default IdScreen;
