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
    TextInput,
    Image,
    Text,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import colors from '../common/colors';
import RedButton from '../components/RedButton';
import { background_image, finger_print, validifyX } from '../common/images';
import { useNavigation } from '@react-navigation/native';
import { RegisterAction } from '../redux/actions/user';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/ActivityIndicator';
import Logo from '../components/Logo';
import ErrorMessage from '../components/ErrorMsg';
import SignInUp from '../components/SignInUp';


function RegisterDetails() {
    const [userData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [errorMessages, setErrorMessages] = useState({
        username: '',
        email: '',
        password: '',
    });
    const handleInputChange = (field, value) => {
        setFormData({ ...userData, [field]: value });
        setErrorMessages({ ...errorMessages, [field]: '' });
    };
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleRegistration = () => {
        const newErrorMessages = {};

        if (!userData.username) {
            newErrorMessages.username = 'Username is required';
        }

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
            const formData = new FormData()
            formData.append('username', userData?.username)
            formData.append('email', userData?.email)
            formData.append('password', userData?.password)
            dispatch(RegisterAction(formData, navigation, setIsLoading))
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
                        <Text style={styles.title}>REGISTRATION</Text>
                        <TextInput
                            value={userData.username}
                            style={styles.input}
                            placeholderTextColor={colors.grey}
                            placeholder="Username"
                            onChangeText={(text) => handleInputChange('username', text)}
                        />
                        <ErrorMessage errorMessageText={errorMessages.username} />
                        <TextInput
                            value={userData.email}
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={colors.grey}
                            onChangeText={(text) => handleInputChange('email', text)}
                            keyboardType="email-address"
                        />
                        <ErrorMessage errorMessageText={errorMessages.email} />
                        <TextInput
                            value={userData.password}
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={colors.grey}
                            onChangeText={(text) => handleInputChange('password', text)}
                            secureTextEntry
                        />
                        <ErrorMessage errorMessageText={errorMessages.password} />
                        <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'SIGN UP'} contentStyle={styles.buttonText} onPress={() => handleRegistration()} />
                        <SignInUp signupContent={'Already have an account?'} signUpText={' ' + 'Sign In'} onPress={() => navigation.navigate('Login')} />
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
        alignSelf: 'center'
    },
    title: {
        alignSelf: 'center',
        fontWeight: '500',
        fontSize: 20,
        color: colors.white,
        padding: 20
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
        fontFamily: 'Arial'
    },
    signUpText: {
        color: colors.app_red,
        fontSize: 15,
        fontWeight: '600'
    },
});

export default RegisterDetails;


