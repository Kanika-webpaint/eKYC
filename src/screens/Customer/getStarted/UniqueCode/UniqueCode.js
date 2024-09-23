import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {styles} from './styles';
import colors from '../../../../common/colors';
import Status from '../../../../components/Status';
import {
  admin,
  logoValidyfy,
  splashLogo,
  x_logo,
} from '../../../../common/images';
import RedButton from '../../../../components/RedButton';
import {TextInput} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import LoginAdmin from '../../../Admin/login/LoginAdmin';
import {loginUserAction} from '../../../../redux/actions/user/UserAction';
import showAlert from '../../../../components/showAlert';

const UniqueCode = () => {
  const [isPotrait, setIsPortrait] = useState(true);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  const submitOTP = () => {
    if (inputValue == '') {
      showAlert('Please enter unique code');
      return;
    }
    setIsLoading(true);
    // Keyboard.dismiss();
    const requestData = {
      logincode: inputValue,
    };

    dispatch(loginUserAction(requestData, navigation, setIsLoading));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={{marginBottom: '10%'}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}>
        <Status lightContent />
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'flex-end',
            alignSelf: 'flex-end',
            marginTop: 5,
          }}
          onPress={() => {
            navigation.navigate(LoginAdmin);
          }}>
          <Image
            source={admin}
            onPress={() => {}}
            style={{
              // flex: 1,
              // alignSelf: 'center',
              height: 40,
              // width: '80%',
              resizeMode: 'contain',
              marginTop: isPotrait ? '10%' : '13%',
              //   alignSelf: 'flex-end',
              tintColor: 'white',
            }}
          />
        </TouchableOpacity>

        <Text style={styles.start}>To begin, please enter your</Text>
        <View style={styles.uniqueView}>
          <Text style={[styles.unique, {marginBottom: 5}]}>Unique</Text>
          <Text style={[styles.unique, {marginBottom: 5}]}>Registration</Text>
          <Text style={styles.unique}>Code.</Text>
        </View>
        <TextInput
          style={styles.textIn}
          value={inputValue} // Bind the value to the state
          onChangeText={text => setInputValue(text)} // Update state on change
          placeholder="Enter text here" // Optional placeholder
        ></TextInput>
        <Text style={styles.uniqReg}>
          You should've received your Unique Registration Code either via email
          or SMS.
        </Text>
        <Text style={styles.uniqReg}>
          If you haven't received a code, please contact your agent to request a
          new one.
        </Text>
        <RedButton
          buttonContainerStyle={styles.buttonContainer}
          ButtonContent={'Submit'}
          contentStyle={styles.buttonText}
          onPress={() => {
            submitOTP();
          }}></RedButton>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UniqueCode;
