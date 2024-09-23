import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import {styles} from './styles';
import colors from '../../../../common/colors';
import Status from '../../../../components/Status';
import {logoValidyfy, splashLogo, x_logo} from '../../../../common/images';
import RedButton from '../../../../components/RedButton';
import {useNavigation} from '@react-navigation/native';

const Welcome = () => {
  const [isPotrait, setIsPortrait] = useState(true);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={{marginBottom: '10%'}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}>
        <Status lightContent />
        <ImageBackground source={x_logo} style={{height: '100%'}}>
          <Image
            source={logoValidyfy}
            style={{
              // flex: 1,
              // alignSelf: 'center',
              height: 60,
              width: '40%',
              resizeMode: 'contain',
              marginTop: isPotrait ? '10%' : '13%',
              marginLeft: '3%',
            }}
          />
          <Text style={styles.welcome}>Welcome.</Text>
          <Text style={styles.descText}>
            Secure identity {'\n'}verification and{'\n'} document authentication
            {'\n'} technologies, shaped by{'\n'} legislation.
          </Text>
          <RedButton
            buttonContainerStyle={styles.buttonContainer}
            ButtonContent={'Lets Go'}
            contentStyle={styles.buttonText}
            onPress={() => {
              navigation.navigate('UniqueCode');
            }}></RedButton>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Welcome;
