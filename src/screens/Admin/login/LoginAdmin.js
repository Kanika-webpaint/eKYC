import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Loader from '../../../components/ActivityIndicator';
import ErrorMessage from '../../../components/ErrorMsg';
import {
  mail,
  padlock,
  view,
  hide,
  back_arow,
  logoValidyfy,
} from '../../../common/images';
import colors from '../../../common/colors';
import SignInUp from '../../../components/SignInUp';
import Status from '../../../components/Status';
import RedButton from '../../../components/RedButton';
import {styles} from './styles';
import {LoginAdminAction} from '../../../redux/actions/Organization/organizationActions';

const LoginAdmin = ({route}) => {
  const [userData, setUserData] = useState({email: '', password: ''});
  const [errorMessages, setErrorMessages] = useState({email: '', password: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [isPotrait, setIsPortrait] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

  useEffect(() => {
    if (route?.params?.isOrgReg === true) {
      setUserData({email: '', password: ''});
    }
  }, [route?.params?.isOrgReg]);

  useEffect(() => {
    const updateOrientation = () => {
      const {height, width} = Dimensions.get('window');
      setIsPortrait(height > width);
    };
    Dimensions.addEventListener('change', updateOrientation);
  }, []);

  useEffect(() => {
    const updateOrientation = () => {
      const {height, width} = Dimensions.get('window');
      setIsPortrait(height > width);
    };
    const unsubscribeFocus = navigation.addListener('focus', updateOrientation);
    return unsubscribeFocus;
  }, [navigation]);

  const handleInputChange = (field, value) => {
    setUserData({...userData, [field]: value});
    setErrorMessages({...errorMessages, [field]: ''});
  };

  const handleLogin = () => {
    Keyboard.dismiss();
    const newErrorMessages = {};

    if (!userData.email) {
      newErrorMessages.email = 'Email is required';
    }

    if (!userData.password) {
      newErrorMessages.password = 'Password is required';
    }

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);
      return;
    } else {
      setIsLoading(true);
      dispatch(LoginAdminAction(userData, setIsLoading));
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={'padding'}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Status lightContent />
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}
              style={{height: 60, width: 60}}>
              <Image source={back_arow} style={styles.backArrow} />
            </TouchableOpacity>
            <View style={styles.content}>
              <Image
                source={logoValidyfy}
                style={{
                  marginTop: isPotrait ? '20%' : '5%',
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  height: 80,
                  width: '60%',
                }}
              />
              <Text style={styles.title}>
                Login with your Admin (Portal) Details
              </Text>
              <View style={styles.inputContainer}>
                <Image source={mail} style={styles.icon} />
                <TextInput
                  value={userData?.email}
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.placeholder_grey}
                  onChangeText={text => handleInputChange('email', text)}
                  keyboardType="email-address"
                />
              </View>
              <ErrorMessage
                errorMessageText={errorMessages.email}
                style={{marginLeft: 0}}
              />
              <View style={styles.inputContainer}>
                <Image source={padlock} style={styles.icon} />
                <TextInput
                  value={userData?.password}
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.placeholder_grey}
                  onChangeText={text => handleInputChange('password', text)}
                  secureTextEntry={!isPasswordVisible}
                />
                {userData?.password && (
                  <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Image
                      source={isPasswordVisible ? view : hide}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <ErrorMessage
                errorMessageText={errorMessages.password}
                style={{marginLeft: 0}}
              />
            </View>
            <RedButton
              buttonContainerStyle={styles.buttonContainer}
              ButtonContent={isLoading ? <Loader /> : 'SIGN IN'}
              contentStyle={styles.buttonText}
              onPress={() => handleLogin()}
            />
            {route?.params?.isOrgReg === true ? null : (
              <SignInUp
                viewBottomSignup={[
                  styles.bottomSignUpView,
                  {
                    marginTop: isPotrait ? '8%' : '1%',
                    marginBottom: isPotrait ? 0 : 20,
                  },
                ]}
                signupContent={'Do not have an account?'}
                signUpText={' ' + 'Sign Up'}
                onPress={() => navigation.navigate('Plan')}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginAdmin;
