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
        backgroundColor: colors.light_purple,
    },
    containerHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.light_purple,
        paddingVertical: 10,
        alignItems: 'center',
        width: '100%',
    },
    backArrow: {
        height: 25,
        width: 25,
        marginRight: 10,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
        fontFamily: fonts.bold,
    },
    imagePlanSelect: {
        marginVertical: 20,
        height: 100,
        width: 100,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    midTitle: {
        color: colors.grey,
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 10,
        marginTop:10,
        fontFamily: fonts.regular,
    },
    mainView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        marginTop: 20,
        backgroundColor: colors.app_red,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.bold,
    },
    input: {
        borderWidth: 0.8,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    text: {
        fontFamily: fonts.regular,
        fontSize: 16,
    },
    err: {
        marginLeft: 0,
        marginTop: -5,
        marginBottom: 5,
        fontFamily: fonts.regular,
        color: 'red',
    },
});


export default ContactUs;


