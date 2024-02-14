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
import { hide, mail, padlock, view } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { LoginAction, LoginAdminAction } from '../../redux/actions/user';
import Loader from '../../components/ActivityIndicator';
import Logo from '../../components/Logo';
import ErrorMessage from '../../components/ErrorMsg';
import SignInUp from '../../components/SignInUp';
import { fonts } from '../../common/fonts';
import Status from '../../components/Status';

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
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useEffect(() => {
        if (route?.params?.isOrgReg === true) {
            setFormData('')
        }
    }, [route?.params?.isOrgReg]);

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
            setIsLoading(true)
            const requestData = {
                email: userData?.email,
                password: userData?.password
            };
            dispatch(LoginAdminAction(requestData, navigation, setIsLoading))
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Status lightContent />
            <View style={{ flex: 1, backgroundColor: colors.app_blue }}>

                {/* <ImageBackground
                source={background_image}
                style={{ flex: 1 }}
            > */}
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <Logo />
                    <View >
                        <Text style={styles.title}>Login with your Admin (Portal) Details</Text>
                        <View style={styles.container}>
                            <Image source={mail} style={{ marginLeft: 10, marginRight: 10, height: 20, width: 20 }} />
                            <TextInput
                                value={userData?.email}
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={colors.placeholder_grey}
                                onChangeText={(text) => handleInputChange('email', text)}
                                keyboardType="email-address"
                            />
                        </View>
                        <ErrorMessage errorMessageText={errorMessages.email} />
                        <View style={styles.container}>
                            <Image source={padlock} style={{ marginLeft: 10, marginRight: 10, height: 20, width: 20 }} />
                            <TextInput
                                value={userData?.password}
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={colors.placeholder_grey}
                                onChangeText={(text) => handleInputChange('password', text)}
                                secureTextEntry={!isPasswordVisible}
                            />
                            {userData?.password && (
                                <TouchableOpacity onPress={togglePasswordVisibility}>
                                    <Image source={isPasswordVisible ? view : hide} style={styles.icon} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <ErrorMessage errorMessageText={errorMessages.password} />
                        <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'SIGN IN'} contentStyle={styles.buttonText} onPress={() => handleLogin()} />
                        {route?.params?.isOrgReg === true ? null : <SignInUp signupContent={'Do not have an account?'} signUpText={' ' + 'Sign Up'} onPress={() => navigation.navigate('Plan')} />}
                    </View>
                </ScrollView>
            </View>
            {/* </ImageBackground> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#06071A'
    },
    buttonContainer: {
        marginTop: '5%',
        backgroundColor: colors.app_red,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 30,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        alignSelf: 'center',
        fontFamily: fonts.bold
    },
    title: {
        alignSelf: 'center',
        fontSize: 17,
        color: colors.white,
        padding: 20,
        marginBottom: '10%',
        fontFamily: fonts.regular
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderBottomColor: colors.white,
        borderBottomWidth: 1,
        marginHorizontal: 30,
    },
    input: {
        flex: 1, // Ensure the TextInput fills the available space
        borderWidth: 0,
        fontSize: 16,
        color: colors.white,
        fontFamily: fonts.regular,
        width: '100%'
    },
    icon: {
        height: 20,
        width: 20,
        marginHorizontal: 5,
    },
});

export default LoginAdmin;


