/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    TextInput,
    Image,
    Text,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import colors from '../../common/colors';
import RedButton from '../../components/RedButton';
import { background_image, finger_print, validifyX } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { LoginAction, LoginAdminAction } from '../../redux/actions/user';
import Loader from '../../components/ActivityIndicator';
import Logo from '../../components/Logo';
import ErrorMessage from '../../components/ErrorMsg';
import SignInUp from '../../components/SignInUp';
import { fonts } from '../../common/fonts';

function LoginAdmin({ route }) {
    const navigation = useNavigation();
    const [userData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMessages, setErrorMessages] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        if (route?.params?.isOrgReg === true) {
            setFormData('')
        }
    }, []);

    const handleInputChange = (field, value) => {
        setFormData({ ...userData, [field]: value });
        setErrorMessages({ ...errorMessages, [field]: '' });
    };

    const handleLogin = () => {
        // Basic validation
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
            const requestData = {
                email: userData?.email,
                password: userData?.password
            };
            console.log('daataaa', requestData)
            dispatch(LoginAdminAction(requestData, navigation, setIsLoading))
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground
                source={background_image}
                style={{ flex: 1 }}
            >
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <Logo />
                    <View style={{ margin: 20 }}>
                        <Text style={styles.title}>LOGIN AS ADMIN</Text>
                        <TextInput
                            value={userData?.email}
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={colors.grey}
                            onChangeText={(text) => handleInputChange('email', text)}
                            keyboardType="email-address"
                        />
                        <ErrorMessage errorMessageText={errorMessages.email} />
                        <TextInput
                            value={userData?.password}
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={colors.grey}
                            onChangeText={(text) => handleInputChange('password', text)}
                            secureTextEntry
                        />
                        <ErrorMessage errorMessageText={errorMessages.password} />
                        <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'SIGN IN'} contentStyle={styles.buttonText} onPress={() => handleLogin()} />
                        {route?.params?.isOrgReg === true ? null : <SignInUp signupContent={'Do not have an account?'} signUpText={' ' + 'Sign Up'} onPress={() => navigation.navigate('Plan')} />}
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#06071A'
    },
    buttonContainer: {
        marginTop: 20,
        backgroundColor: colors.app_red,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        height: 50
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        alignSelf: 'center',
        fontFamily:fonts.bold
    },
    title: {
        alignSelf: 'center',
        fontSize: 18,
        color: colors.white,
        padding: 20,
        fontFamily:fonts.medium
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 50,
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 5,
        color: colors.black,
        borderWidth: 1,
        width: '100%',
        fontSize: 16,
        borderColor: colors.white,
        backgroundColor: colors.light_grey,
        fontFamily:fonts.regular
    },
});

export default LoginAdmin;


