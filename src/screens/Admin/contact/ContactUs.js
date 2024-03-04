/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import colors from '../../../common/colors';
import { back, contact } from '../../../common/images';
import { useNavigation } from '@react-navigation/native';
import { items } from '../../../common/PlansList';
import { fonts } from '../../../common/fonts';
import Status from '../../../components/Status';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/ActivityIndicator';
import { ContactUsAction } from '../../../redux/actions/user';
import { useDispatch } from 'react-redux';
import RedButton from '../../../components/RedButton';
import ErrorMessage from '../../../components/ErrorMsg';
import { styles } from './styles';

function ContactUs() {
    const [isLoading, setIsLoading] = useState(false);
    const [token, setAuthToken] = useState('')
    const [userData, setFormData] = useState({ subject: '', email: '', phNo: '', description: '' });
    const [errorMessages, setErrorMessages] = useState({ subject: '', email: '', phNo: '', description: '' });
    const navigation = useNavigation();
    const dispatch = useDispatch()
    
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




export default ContactUs;


