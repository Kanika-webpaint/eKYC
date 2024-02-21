/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import colors from '../../common/colors';
import { back, checked, contact, plan_select, unchecked } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import { items } from '../../common/PlansList';
import { fonts } from '../../common/fonts';
import Status from '../../components/Status';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/ActivityIndicator';
import { ContactUsAction } from '../../redux/actions/user';
import { useDispatch } from 'react-redux';
import RedButton from '../../components/RedButton';
import ErrorMessage from '../../components/ErrorMsg';

function ContactUs() {
    const [selectedItem, setSelectedItem] = useState(items[0]);
    const navigation = useNavigation();
    const [selectedEnterprise, setSelectEnterprise] = useState(false)
    const [token, setAuthToken] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    const [userData, setFormData] = useState({
        subject: '',
        email: '',
        phNo: '',
        description: ''
    });
    const [errorMessages, setErrorMessages] = useState({
        subject: '',
        email: '',
        phNo: '',
        description: ''
    });
    useEffect(() => {
        AsyncStorage.getItem("token").then((value) => {
            if (value) {
                setAuthToken(value)
            }
        })
            .then(res => {
                //do something else
            });
    }, [token]);

    const handleInputChange = (field, value) => {
        setFormData({ ...userData, [field]: value });
        setErrorMessages({ ...errorMessages, [field]: '' });
    };

    const submitRequest = () => {
        const newErrorMessages = {};

        if (!userData.subject) {
            newErrorMessages.subject = 'Subject is required';
        }

        if (!userData.email) {
            newErrorMessages.email = 'Email is required';
        }

        if (!userData.phNo) {
            newErrorMessages.phNo = 'Phone number is required';
        }

        if (!userData.description) {
            newErrorMessages.description = 'Description is required';
        }

        if (Object.keys(newErrorMessages).length > 0) {
            setErrorMessages(newErrorMessages);
            return;
        } else {
            setIsLoading(true)
            const requestData = {
                subject: userData?.subject || '',
                description: userData?.description || '',
                email: userData?.email || '',
                phoneNumber: userData?.phNo || ''
            }
            dispatch(ContactUsAction(requestData, token, navigation, setIsLoading))
        }
    }


    return (
        <SafeAreaView style={styles.safeArea}>
            <Status isLight />
            <ScrollView>
                <View style={styles.containerHeader}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={back} style={styles.backArrow} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Contact Us</Text>
                    </View>
                </View>
                <View style={styles.mainView}>
                    <Text style={styles.midTitle}>Get in touch and let us know how {'\n'}we can help.</Text>
                    <Image source={contact} style={styles.imagePlanSelect} />
                    <View style={{ padding: 10 }}>
                        <Text style={styles.text}>{'Subject'}</Text>
                        <TextInput
                            value={userData?.subject}
                            style={styles.input}
                            onChangeText={(text) => handleInputChange('subject', text)}
                        />
                        <ErrorMessage errorMessageText={errorMessages.subject} style={styles.err} />
                        <Text style={styles.text}>{'Email'}</Text>
                        <TextInput
                            value={userData?.email}
                            style={styles.input}
                            onChangeText={(text) => handleInputChange('email', text)}
                        />
                        <ErrorMessage errorMessageText={errorMessages.email} style={styles.err} />
                        <Text style={styles.text}>{'Phone Number'}</Text>
                        <TextInput
                            value={userData?.phNo}
                            style={styles.input}
                            onChangeText={(text) => handleInputChange('phNo', text)}
                        />
                        <ErrorMessage errorMessageText={errorMessages.phNo} style={styles.err} />
                        <Text style={styles.text}>{'Description'}</Text>
                        <TextInput
                            value={userData?.description}
                            textAlignVertical='top'
                            multiline={true}
                            numberOfLines={4}
                            style={styles.input}
                            onChangeText={(text) => handleInputChange('description', text)}
                        />
                        <ErrorMessage errorMessageText={errorMessages.description} style={styles.err} />
                        <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'SUBMIT'} contentStyle={styles.buttonText} onPress={() => submitRequest()} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.light_purple
    },
    containerHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.light_purple,
        padding: 20,
        alignItems: 'center', // Vertical alignment
        width: '100%', // Take full width of the screen
    },
    backArrow: {
        height: 25,
        width: 25,
        marginRight: 10, // Add some space between back arrow and text
    },
    title: {
        flex: 1, // Allow text to take remaining space
        textAlign: 'center', // Center the text horizontally
        fontSize: 20,
        color: 'black', // Assuming text color
        fontFamily: fonts.bold
    },
    imagePlanSelect: {
        margin: 20,
        height: 100,
        width: 100,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    midTitle: {
        color: colors.grey,
        fontSize: 17,
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: fonts.regular
    },
    mainView: {
        flex: 1,
        padding: 10,
    },
    buttonContainer: {
        marginTop: '10%',
        backgroundColor: colors.app_red,
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
        width: '100%'
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        alignSelf: 'center',
        fontFamily: fonts.bold
    },
    input: {
        borderWidth: 0.8,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        padding: 10
    },
    text: {
        fontFamily: fonts.regular,
    },
    err: {
        marginLeft: 0,
        marginTop: -5,
        marginBottom: 5,
        fontFamily: fonts.regular
    }
});

export default ContactUs;


