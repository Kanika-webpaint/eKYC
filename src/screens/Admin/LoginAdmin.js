import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TextInput, Image, Text, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { LoginAdminAction } from '../../redux/actions/user'; // Import the login action
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
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [userData, setUserData] = useState({ email: '', password: '' });
    const [errorMessages, setErrorMessages] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useEffect(() => {
        if (route?.params?.isOrgReg === true) {
            setUserData({ email: '', password: '' });
        }
    }, [route?.params?.isOrgReg]);

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
            console.log(userData, "user dataaa")
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
            <View style={{ flex: 1, backgroundColor: colors.app_blue }}>

                <ScrollView keyboardShouldPersistTaps='handled'>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <Image source={back_arow} style={{ height: 20, width: 20, margin: 20, resizeMode: 'contain' }} />
                    </TouchableOpacity>
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

        </SafeAreaView>
    );
};

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
