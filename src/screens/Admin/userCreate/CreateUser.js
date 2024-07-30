import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, ScrollView, TextInput, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView } from 'react-native';
import colors from '../../../common/colors';
import RedButton from '../../../components/RedButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ErrorMessage from '../../../components/ErrorMsg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/ActivityIndicator';
import { phone, userCreate, userRed } from '../../../common/images';
import Status from '../../../components/Status';
import CountryPick from '../../../components/CountryPicker';
import showAlert from '../../../components/showAlert';
import { styles } from './styles';
import Header from '../../../components/Header';
import { CreateUserAction, getUsersListAction } from '../../../redux/actions/Organization/organizationActions';

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
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
    const getUsersList = useSelector(state => state?.org?.getUsersList);
    const planDetailsList = useSelector((state) => state?.org?.orgDetails)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const value = await AsyncStorage.getItem("token");
                if (value) {
                    setAuthToken(value);
                    dispatch(getUsersListAction(value, setIsLoading));
                }
            } catch (error) {
                // Handle errors, e.g., logging or notifying the user
                console.error("Error fetching token:", error);
            }
        };

        fetchData();

    }, [token]);


    useEffect(() => {
        const updateOrientation = () => {
            const { height, width } = Dimensions.get('window');
            setIsPortrait(height > width);
        };
        Dimensions.addEventListener('change', updateOrientation);
    }, []);

    useEffect(() => {
        const updateOrientation = () => {
            const { height, width } = Dimensions.get('window');
            setIsPortrait(height > width);
        };
        const unsubscribeFocus = navigation.addListener('focus', updateOrientation);
        return unsubscribeFocus;
    }, [navigation]);

    const handleInputChange = (field, value) => {
        setFormData({ ...userData, [field]: value });
        setErrorMessages({ ...errorMessages, [field]: '' });
    };

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
            }

            const isBasicPlan = planDetailsList?.organization?.amount === 1499900 ? true : false
            const isPlanActive = planDetailsList?.organization?.planStatus == 1 ? true : false
            if (isPlanActive) {
                if (isBasicPlan && getUsersList?.length <= 49) {
                    dispatch(CreateUserAction(requestData, token, navigation, setIsLoading));
                } else if (!isBasicPlan && getUsersList?.length <= 199) {
                    dispatch(CreateUserAction(requestData, token, navigation, setIsLoading));
                } else {
                    setIsLoading(false);
                    if (isBasicPlan) {
                        showAlert('Please purchase premium plan to add more users.');
                    } else {
                        showAlert('Please purchase enterprise plan to add more users.');
                    }
                }
            } else {
                setIsLoading(false);
                showAlert('Your subscription plan is inactive.Please activate to create users.');
            }
        }
    };

    const onChangeCountryCode = () => {
        setShow(true)
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={keyboardVerticalOffset}>
                <ScrollView style={{ marginBottom: '10%' }} keyboardShouldPersistTaps='handled'>
                    <Status isLight />
                    <View >
                        <Header title={'Create user'} />
                        <View style={{ margin: 20 }}>
                            <Image source={userCreate} style={styles.addButton}></Image>
                            <Text style={styles.userNameText}>
                                Name
                            </Text>
                            <View style={styles.usernameinput}>
                                <Image source={userRed} style={styles.userRed} />
                                <TextInput
                                    value={userData?.username}
                                    placeholderTextColor={colors.light_grey}
                                    placeholder='Enter name here'
                                    style={styles.emailAddress}
                                    onChangeText={(text) => handleInputChange('username', text)}
                                    keyboardType="email-address"
                                />
                            </View>
                            <ErrorMessage errorMessageText={errorMessages.username} style={{ marginLeft: 5 }} />
                            <Text style={styles.phoneText}>
                                Phone number
                            </Text>
                            <View style={styles.input}>
                                <Image source={phone} style={styles.imagePhone} />
                                <TouchableOpacity style={styles.code} onPress={() => onChangeCountryCode()}>
                                    <Text style={styles.textCountryCode}>{countryCode ? countryCode : '+234'}</Text>
                                </TouchableOpacity>
                                <TextInput
                                    value={userData?.phoneNo}
                                    placeholderTextColor={colors.light_grey}
                                    placeholder='Enter phone number here'
                                    style={styles.number}
                                    onChangeText={(text) => handleInputChange('phoneNo', text)}
                                    keyboardType="email-address"
                                />
                            </View>
                            <ErrorMessage errorMessageText={errorMessages.phoneNo} style={{ marginLeft: 5 }} />
                            <RedButton buttonContainerStyle={[styles.buttonContainer, { marginTop: isPotrait ? '10%' : '5%', }]} ButtonContent={isLoading ? <Loader /> : 'CREATE USER'} contentStyle={styles.buttonText} onPress={() => handleCreateUser()} />
                        </View>
                        <CountryPick show={show} onBackdropPress={() => setShow(false)} pickerButtonOnPress={(item) => {
                            setCountryCode(item.dial_code);
                            setShow(false);
                        }} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default CreateUser;


