/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaView,  View, Text, ScrollView, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import colors from '../../../common/colors';
import RedButton from '../../../components/RedButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ErrorMessage from '../../../components/ErrorMsg';
import { CreateUserAction, getUsersListAction } from '../../../redux/actions/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/ActivityIndicator';
import { back, phone, userCreate, userRed } from '../../../common/images';
import { fonts } from '../../../common/fonts';
import Status from '../../../components/Status';
import CountryPick from '../../../components/CountryPicker';
import showAlert from '../../../components/showAlert';
import { styles } from './styles';


function CreateUser() {
    const [userData, setFormData] = useState({ username: '', phoneNo: '' });
    const [errorMessages, setErrorMessages] = useState({ username: '', phoneNo: '' });
    const [isPotrait, setIsPortrait] = useState(true)
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false)
    const [token, setAuthToken] = useState('')
    const [countryCode, setCountryCode] = useState('')
    const navigation = useNavigation();
    const dispatch = useDispatch()

    const OrganizationHomeList = useSelector((state) => state?.login?.orgDetails)
    const getUsersList = useSelector(state => state?.login?.getUsersList);
    const adminDataList = useSelector(state => state?.login?.adminLogin?.data);
    const handleInputChange = (field, value) => {
        setFormData({ ...userData, [field]: value });
        setErrorMessages({ ...errorMessages, [field]: '' });
    };

    useEffect(() => {
        AsyncStorage.getItem("token").then((value) => {
            if (value) {
                setAuthToken(value)
                dispatch(getUsersListAction(value, setIsLoading))
            }
        })
            .then(res => {
                //do something else
            });
    }, [token]);

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

    const handleCreateUser = () => {
        const newErrorMessages = {};

        if (!userData.username) {
            newErrorMessages.username = 'Username is required';
        }

        if (!userData.phoneNo) {
            newErrorMessages.phoneNo = 'Phone Number is required';
        }

        if (Object.keys(newErrorMessages).length > 0) {
            setErrorMessages(newErrorMessages);
            return;
        } else {
            setIsLoading(true)
            let countryCodeSelected = countryCode ? countryCode : '+91'
            const requestData =
            {
                username: userData?.username,
                phoneNumber: countryCodeSelected + userData?.phoneNo,
                organizationId: OrganizationHomeList?.organization?.id || ''
            }
            dispatch(CreateUserAction(requestData, token, navigation, setIsLoading));
            // if (adminDataList?.amount === '4999' && getUsersList?.length <= 49) {
            //     dispatch(CreateUserAction(requestData, token, navigation, setIsLoading));
            // } else if (adminDataList?.amount === '4499' && getUsersList?.length <= 199) {
            //     dispatch(CreateUserAction(requestData, token, navigation, setIsLoading));
            // } else {
            //     if (adminDataList?.amount === '4999') {
            //         setIsLoading(false)
            //         showAlert('Please purchase premium plan to add more users.');
            //     } else if (adminDataList?.amount === '4499') {
            //         setIsLoading(false)
            //         showAlert('Please purchase enterprise plan to add more users.');
            //     }
            // }
        }
    };

    const onChangeCountryCode = () => {
        setShow(true)
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Status isLight />
            <ScrollView style={styles.safeArea} keyboardShouldPersistTaps='handled'>
                <View style={{ margin: 20 }}>
                    <View style={styles.containerHeader}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Image source={back} style={styles.backArrow} />
                            </TouchableOpacity>
                            <Text style={styles.title}>Create user</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Image source={userCreate} style={{ height: 150, width: 150, alignSelf: 'center', marginBottom: 20 }}></Image>
                        <Text style={styles.userNameText}>
                            Username
                        </Text>
                        <View style={styles.usernameinput}>
                            <Image source={userRed} style={{ height: 20, width: 20, alignSelf: 'center', resizeMode: 'contain' }} />
                            <TextInput
                                value={userData?.username}
                                style={{ fontSize: 20, fontFamily: fonts.regular, width: '90%', marginLeft: 10 }}
                                onChangeText={(text) => handleInputChange('username', text)}
                                keyboardType="email-address"
                            />
                        </View>
                        <ErrorMessage errorMessageText={errorMessages.username} style={{ marginLeft: 5 }} />
                        <Text style={{ margin: 5, color: colors.grey_text }}>
                            Phone number
                        </Text>
                        <View style={styles.input}>
                            <Image source={phone} style={{ height: 20, width: 20, alignSelf: 'center', marginLeft: 12, resizeMode: 'contain' }} />
                            <TouchableOpacity style={{ height: 30, width: 50, marginRight: 10, marginTop: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => onChangeCountryCode()}>
                                <Text style={{ color: colors.black, alignSelf: 'center', fontSize: 14, fontFamily: fonts.regular }}>{countryCode ? countryCode : '+234'}</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={{ width: '70%' }}
                                value={userData?.phoneNo}
                                onChangeText={(text) => handleInputChange('phoneNo', text)}
                                keyboardType="email-address"
                            />
                        </View>
                        <ErrorMessage errorMessageText={errorMessages.phoneNo} style={{ marginLeft: 5 }} />
                    </View>
                    <RedButton buttonContainerStyle={[styles.buttonContainer, { marginTop: isPotrait ? '15%' : '5%', }]} ButtonContent={isLoading ? <Loader /> : 'CREATE USER'} contentStyle={styles.buttonText} onPress={() => handleCreateUser()} />
                    <CountryPick show={show} onBackdropPress={() => setShow(false)} pickerButtonOnPress={(item) => {
                        setCountryCode(item.dial_code);
                        setShow(false);
                    }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}



export default CreateUser;


