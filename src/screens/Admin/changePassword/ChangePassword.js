/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, ScrollView, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux'
import Status from '../../../components/Status';
import { styles } from './styles';
import Header from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import RedButton from '../../../components/RedButton';
import Loader from '../../../components/ActivityIndicator';
import showAlert from '../../../components/showAlert';
import { updatePassowrdAction } from '../../../redux/actions/Organization/organizationActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hide, view } from '../../../common/images';


function ChangePassword({ route }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState('')
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)


    useEffect(() => {
        AsyncStorage.getItem("token").then((value) => {
            if (value) {
                setToken(value)
            }
        })
            .then(res => {
            });
    }, [dispatch, setIsLoading]);

    const handleUpdatePassword = () => {
        setIsLoading(true)
        if (!newPassword) {
            setIsLoading(false)
            showAlert('Please enter new password.');
            return;
        }

        if (!confirmPassword) {
            setIsLoading(false)
            showAlert('Please confirm the password.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setIsLoading(false)
            showAlert('New password and confirm password must match.');
            return;
        }

        const requestData = {
            newPassword: newPassword
        }

        dispatch(updatePassowrdAction(requestData, token, navigation, setIsLoading))
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Status isLight />
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={{ justifyContent: 'center' }}>
                    <Header title={'Change password'} />
                </View>
                <View style={{ margin: 20 }}>
                    <Text style={styles.textUpper}>New Password</Text>
                    <View style={styles.textInputField}>
                        <TextInput value={newPassword} onChangeText={(text) => setNewPassword(text)} placeholder='Enter new password' secureTextEntry={!isPasswordVisible} />
                        <TouchableOpacity onPress={togglePasswordVisibility}>
                            <Image source={isPasswordVisible ? view : hide} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.textUpper}>Confirm Password</Text>
                    <View style={styles.textInputField}>
                        <TextInput value={confirmPassword} onChangeText={(text) => setConfirmPassword(text)} placeholder='Confirm new password' secureTextEntry={!isConfirmPasswordVisible} />
                        <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                            <Image source={isConfirmPasswordVisible ? view : hide} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <RedButton buttonContainerStyle={styles.buttonContainer}
                        ButtonContent={isLoading ? <Loader /> : "UPDATE"}
                        contentStyle={styles.buttonText}
                        onPress={handleUpdatePassword} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ChangePassword;


