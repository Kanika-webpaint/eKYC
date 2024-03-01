import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TextInput, Image, Text, ScrollView, TouchableOpacity, Keyboard, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { LoginAdminAction } from '../../redux/actions/user';
import Loader from '../../components/ActivityIndicator';
import ErrorMessage from '../../components/ErrorMsg';
import { mail, padlock, view, hide, back_arow } from '../../common/images';
import colors from '../../common/colors';
import Logo from '../../components/Logo';
import SignInUp from '../../components/SignInUp';
import { fonts } from '../../common/fonts';
import Status from '../../components/Status';
import RedButton from '../../components/RedButton';

const LoginAdmin = ({ route }) => {
    const [userData, setUserData] = useState({ email: '', password: '' });
    // const [userData, setUserData] = useState({ email: '', password:, role: 'organization' '', role: 'organization' });   // uncomment it when role field added from bacakend.
    const [errorMessages, setErrorMessages] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isPotrait, setIsPortrait] = useState(true)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (route?.params?.isOrgReg === true) {
            setUserData({ email: '', password: '' });
        }
    }, [route?.params?.isOrgReg]);

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

    const handleInputChange = (field, value) => {
        setUserData({ ...userData, [field]: value });
        setErrorMessages({ ...errorMessages, [field]: '' });
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
            <Status lightContent />
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={back_arow} style={styles.backArrow} />
                </TouchableOpacity>
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View style={styles.content}>
                        <Logo styleContainer={{ marginTop: isPotrait ? '30%' : '5%' }} fingerPrintStyle={[styles.fingerPrintStyle, { left: isPotrait ? 60 : 310}]}/>
                        <Text style={styles.title}>Login with your Admin (Portal) Details</Text>
                        <View style={styles.inputContainer}>
                            <Image source={mail} style={styles.icon} />
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
                        <View style={styles.inputContainer}>
                            <Image source={padlock} style={styles.icon} />
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
                    </View>
                    <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'SIGN IN'} contentStyle={styles.buttonText} onPress={() => handleLogin()} />
                    {route?.params?.isOrgReg === true ? null : <SignInUp viewBottomSignup={[styles.bottomSignUpView, { marginTop: isPotrait ? '8%' : '1%', marginBottom: isPotrait ? 0 : 20 }]} signupContent={'Do not have an account?'} signUpText={' ' + 'Sign Up'} onPress={() => navigation.navigate('Plan')} />}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.app_blue,
    },
    container: {
        flex: 1,
        backgroundColor: colors.app_blue,
    },
    backArrow: {
        height: 20,
        width: 20,
        margin: 20,
        resizeMode: 'contain',
    },
    bottomSignUpView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    content: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    title: {
        fontSize: 17,
        color: colors.white,
        fontFamily: fonts.regular,
        marginTop: 20,
        marginBottom: 50,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.white,
        marginHorizontal: 30,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.white,
        fontFamily: fonts.regular,
        width: '100%',
        marginLeft: 10,
    },
    icon: {
        height: 20,
        width: 20,
        tintColor: colors.white,
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
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.bold,
    },
});

export default LoginAdmin;
