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
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import colors from '../../common/colors';
import RedButton from '../../components/RedButton';
import { back } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux'
import { RegisterAdminAction } from '../../redux/actions/user';
import Loader from '../../components/ActivityIndicator';
import ErrorMessage from '../../components/ErrorMsg';
import { fonts } from '../../common/fonts';

function CheckoutScreen({ route }) {
    const [userData, setFormData] = useState({
        email: '',
        cardNo: '',
        expDate: '',
        cvv: '',
        name: ''
    });
    const [errorMessages, setErrorMessages] = useState({
        email: '',
        cardNo: '',
        expDate: '',
        cvv: '',
        name: ''
    });
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        const newErrorMessages = {};

        if (!userData.name) {
            newErrorMessages.name = 'Name is required';
        }
        if (!userData.email) {
            newErrorMessages.email = 'Email is required';
        }
        if (!userData.cardNo) {
            newErrorMessages.cardNo = 'Card No is required';
        }
        if (!userData.expDate) {
            newErrorMessages.expDate = 'ExpDate is required';
        }
        if (!userData.cvv) {
            newErrorMessages.cvv = 'CVV is required';
        }


        if (Object.keys(newErrorMessages).length > 0) {
            setErrorMessages(newErrorMessages);
            return;
        } else {
            // const requestData = {
            //     name: userData?.name,
            //     email: userData?.email,
            //     cardNumber: userData?.cardNo,
            //     expiryDate: userData?.expDate,
            //     transactionId: "2564",
            //     planPrice: route?.params?.amount || ''
            // }
            const requestData =
            {
                name: "webpaint",
                email: userData?.email,
                cardNumber: "123456789",
                expiryDate: "03-04-2024",
                transactionId: "2564",
                planPrice: "256"
            }
            setIsLoading(true)
            dispatch(RegisterAdminAction(requestData, navigation, setIsLoading))
        }
    }

    const handleInputChange = (field, value) => {
        setFormData({ ...userData, [field]: value });
        setErrorMessages({ ...errorMessages, [field]: '' });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={{ margin: 20 }}>
                    <View style={styles.containerHeader}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Image source={back} style={styles.backArrow} />
                            </TouchableOpacity>
                            <Text style={styles.title}>Payment</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Text style={styles.titleText}>
                            Name
                        </Text>
                        <TextInput
                            value={userData?.name}
                            style={styles.input}
                            placeholder="Enter name here"
                            placeholderTextColor={colors.light_grey}
                            onChangeText={(text) => handleInputChange('name', text)}
                            keyboardType="email-address"
                        />
                        <ErrorMessage errorMessageText={errorMessages.name} />
                        <Text style={styles.titleText}>
                            Email
                        </Text>
                        <TextInput
                            value={userData?.email}
                            style={styles.input}
                            placeholder="Enter email here"
                            placeholderTextColor={colors.light_grey}
                            onChangeText={(text) => handleInputChange('email', text)}
                            keyboardType="email-address"
                        />
                        <ErrorMessage errorMessageText={errorMessages.email} />
                        <Text style={styles.titleText}>
                            Card number
                        </Text>
                        <TextInput
                            value={userData?.cardNo}
                            style={styles.input}
                            placeholder="Enter card number here"
                            placeholderTextColor={colors.light_grey}
                            onChangeText={(text) => handleInputChange('cardNo', text)}
                            keyboardType="numeric"
                        />
                        <ErrorMessage errorMessageText={errorMessages.cardNo} />
                        <View style={styles.fileds}>
                            <View >
                                <Text style={styles.titleText}>
                                    Exp date
                                </Text>
                                <TextInput
                                    value={userData?.expDate}
                                    style={styles.inputSmall}
                                    placeholder="DD/MM"
                                    placeholderTextColor={colors.light_grey}
                                    onChangeText={(text) => handleInputChange('expDate', text)}
                                    keyboardType="numeric"
                                />
                                <ErrorMessage errorMessageText={errorMessages.expDate} />
                            </View>
                            <View>
                                <Text style={styles.titleText}>
                                    CVV
                                </Text>
                                <TextInput
                                    value={userData?.cvv}
                                    style={styles.inputSmall}
                                    placeholder="Enter cvv"
                                    placeholderTextColor={colors.light_grey}
                                    onChangeText={(text) => handleInputChange('cvv', text)}
                                    keyboardType="numeric"
                                />
                                <ErrorMessage errorMessageText={errorMessages.cvv} />
                            </View>
                        </View>
                    </View>
                    <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : route?.params?.amount + ' ' + 'PAY NOW'} contentStyle={styles.buttonText} onPress={() => handleLogin()} />
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
    buttonContainer: {
        marginTop: 50,
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
        alignSelf: 'center',
        fontFamily:fonts.bold
    },
    containerHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.light_purple,
        padding: 5,
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
        fontFamily: fonts.bold,
        color: 'black', // Assuming text color
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
        fontSize: 18,
        borderColor: colors.white,
        backgroundColor: colors.white,
        fontFamily: fonts.regular,
        marginBottom: 10
    },
    inputSmall: {
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        color: colors.black,
        borderWidth: 1,
        fontSize: 18,
        borderColor: colors.white,
        backgroundColor: colors.white,
        fontFamily: fonts.regular,
        marginBottom: 10,
        width: 180
    },
    titleText: {
        margin: 5,
        color: colors.grey,
        fontFamily: fonts.regular
    },
    fileds: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default CheckoutScreen;


