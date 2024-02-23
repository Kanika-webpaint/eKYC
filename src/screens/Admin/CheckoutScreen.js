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
    TextInput,
    Image,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    ToastAndroid,
} from 'react-native';
import colors from '../../common/colors';
import RedButton from '../../components/RedButton';
import { back, down } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../components/ActivityIndicator';
import { fonts } from '../../common/fonts';
import { Country, State, City } from 'country-state-city';
import ErrorMessageCheckout from '../../components/ErrorMsgCheckout';
import Status from '../../components/Status';
import { CardField, createToken } from '@stripe/stripe-react-native';
import { PUBLISH_KEY, API_URL } from '@env'
import { StripeProvider, confirmPayment } from '@stripe/stripe-react-native';
import axios from 'axios';


function CheckoutScreen({ route }) {
    const [userData, setFormData] = useState({
        email: '',
        cardNo: '',
        expDate: '',
        cvv: '',
        name: '',
        address: ''
    });
    const [errorMessages, setErrorMessages] = useState({
        email: '',
        name: '',
        address: '',
        country: ''
    });
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showState, setShowState] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [countryData, setCountryData] = useState([]);
    const [countryErrMsg, setCountryErrorMsg] = useState(false)
    const [stateErrMsg, setStateErrorMsg] = useState(false)
    const [statesData, setStatesData] = useState();
    const [cityErrMsg, setCityErrorMsg] = useState(false)
    const [cityData, setCitiesData] = useState();
    const [showCity, setShowCity] = useState();
    const [selectedCity, setSelectedCity] = useState(null);
    const [cardDetails, setCardDetails] = useState()
    const [cardDetailsErrMsg, setCardDetailsErrMsg] = useState(false)


    useEffect(() => {
        const nigeriaData = Country && Country?.getCountryByCode('NG');
        if (nigeriaData) {
            setCountryData([nigeriaData]);
        }
    }, []);

    useEffect(() => {
        const nigeriaStatesData = State && State?.getStatesOfCountry('NG');
        if (nigeriaStatesData) {
            setStatesData(nigeriaStatesData);
        }
    }, []);


    const showAlert = (message) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            AlertIOS.alert(message);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...userData, [field]: value });
        setErrorMessages({ ...errorMessages, [field]: '' });
    };

    const handleOptionPress = (option) => {
        setSelectedOption(option?.name);
        setShowOptions(false);

    };

    const handleStatePress = (option) => {
        setSelectedState(option?.name)
        setShowState(false)
        getCities(option)
    }

    const handleCityPress = (option) => {
        setSelectedCity(option?.name)
        setShowCity(false)
    }

    const getCities = async (option) => {
        const nigeriaStatesCitiesData = await City && City?.getCitiesOfState('NG', option?.isoCode);
        if (nigeriaStatesCitiesData && option?.isoCode) {
            setCitiesData(nigeriaStatesCitiesData);
        }
    }


    const onPressCountryItem = (item) => {
        return (
            <TouchableOpacity onPress={() => handleOptionPress(item)}>
                <Text style={{ fontSize: 18, paddingVertical: 10 }}>{item?.name}</Text>
            </TouchableOpacity>
        )
    }

    const fetchCardDetails = (cardDetails) => {
        if (cardDetails?.complete) {
            setCardDetails(cardDetails)
        } else {
            setCardDetails(null)
        }
    }

    const creatPaymentIntent = (data) => {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/stripecheckout`, data).then(function (res) {
                resolve(res)
            }).catch(function (error) {
                reject(error)
            })
        })
    }

    // const handleLogin = async () => {
    //     if (!cardDetails || !cardDetails.complete) {
    //         showAlert('Please enter valid card details');
    //         return;
    //     } else {
    //         try {
    //             const resToken = await createToken({ ...cardDetails, type: 'Card' })
    //             const requestData =
    //             {
    //                 name: userData?.name,
    //                 email: userData?.email,
    //                 currency: 'usd',
    //                 amount: "234",
    //                 address: "1644",
    //                 country: "India",
    //                 state: "Abia",
    //                 city: "Burch",
    //                 userId: 1,
    //                 zip: '123',
    //                 token: resToken?.token?.id
    //             }
    //             console.log(requestData, "requestData")
    //             try {
    //                 const res = await creatPaymentIntent(requestData)
    //                 console.log("payment intent create succesfully...!!!", res)

    //                 if (res?.data?.clientSecret) {
    //                     let confirmPaymentIntent = await confirmPayment(res?.data?.clientSecret, { paymentMethodType: 'Card' })
    //                     console.log("confirmPaymentIntent res++++", confirmPaymentIntent)
    //                     alert("Payment succesfully...!!!")
    //                 }
    //             } catch (error) {
    //                 console.log("Error rasied during payment intent", error)
    //             }
    //         } catch (error) {
    //             console.error('Error generating token:', error);
    //             Alert.alert('Error', 'Something went wrong. Please try again later.');
    //         }
    //     }
    // };

    const handleLogin = async () => {

        const newErrorMessages = {};

        if (!userData.name) {
            newErrorMessages.name = 'Name is required';
        }
        if (!userData.email) {
            newErrorMessages.email = 'Email is required';
        }
        if (!userData.address) {
            newErrorMessages.address = 'Address is required';
        }

        if (!cardDetails) {
            setCardDetailsErrMsg(true)
        }
        if (selectedOption === null) {
            setCountryErrorMsg(true)
        }
        if (selectedState === null) {
            setStateErrorMsg(true)
        }
        if (selectedCity === null) {
            setCityErrorMsg(true)
        }

        if (Object.keys(newErrorMessages).length > 0) {
            setErrorMessages(newErrorMessages);
            if (selectedOption !== null && selectedOption.length > 0) {
                setCountryErrorMsg(false)
            }
            if (selectedState !== null) {
                setStateErrorMsg(false)
            }
            if (selectedCity !== null) {
                setCityErrorMsg(false)
            }
            return;
        } else {
            if (!cardDetails || !cardDetails.complete) {
                showAlert('Please enter valid card details');
                return;
            } else {
                try {
                    setIsLoading(true)
                    const resToken = await createToken({ ...cardDetails, type: 'Card' })
                    if (resToken) {
                        const requestData =
                        {
                            name: userData?.name,
                            email: userData?.email,
                            currency: 'NGN', // Set currency to NGN for Nigerian Naira
                            amount: route?.params?.amount === 'N1000' ? '1000' : '1500',
                            // currency: 'usd',
                            // amount: "200",
                            address: userData?.address,
                            country: selectedOption,
                            state: selectedState,
                            city: selectedCity,
                            userId: 1, //will update it later
                            zip: '123', // make it dynamic later
                            token: resToken?.token?.id   // stripe token
                        }
                        console.log(requestData, "requestData")
                        try {
                            const res = await creatPaymentIntent(requestData)
                            console.log("payment intent create succesfully...!!!", res)

                            if (res?.data?.clientSecret) {
                                let confirmPaymentIntent = await confirmPayment(res?.data?.clientSecret, { paymentMethodType: 'Card' })
                                console.log("confirmPaymentIntent res++++", confirmPaymentIntent)
                                if (confirmPaymentIntent) {
                                    //set payment method id here and send it to backend to store the transaction for future.
                                    setIsLoading(false)
                                    navigation.navigate('SuccessScreen')
                                } else {
                                    setIsLoading(false)
                                    showAlert('Payment failed, please try again!!')
                                }
                            }
                        } catch (error) {
                            setIsLoading(false)
                            console.log("Error rasied during payment intent", error)
                        }
                    }

                } catch (error) {
                    setIsLoading(false)
                    console.error('Error generating token:', error);
                    showAlert('Error', 'Something went wrong. Please try again later.');
                }
            }
        }
    }


    const onPressStateItem = (item) => {
        return (
            <TouchableOpacity onPress={() => handleStatePress(item)}>
                <Text style={{ fontSize: 18, paddingVertical: 10 }}>{item?.name}</Text>
            </TouchableOpacity>
        )
    }

    const onPressCityItem = (item) => {
        return (
            <TouchableOpacity onPress={() => handleCityPress(item)}>
                <Text style={{ fontSize: 18, paddingVertical: 10 }}>{item?.name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StripeProvider
                publishableKey={PUBLISH_KEY}
            >
                <Status isLight />
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View style={{ margin: 20 }}>
                        <View style={styles.containerHeader}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Image source={back} style={styles.backArrow} />
                                </TouchableOpacity>
                                <Text style={styles.title}>Checkout</Text>
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
                            <ErrorMessageCheckout errorMessageText={errorMessages.name} />
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
                            <ErrorMessageCheckout errorMessageText={errorMessages.email} />
                            <View style={{ marginBottom: 10 }}>
                                <Text style={styles.titleText}>Country</Text>
                                <View style={styles.addressField}>
                                    <TextInput
                                        value={selectedOption}
                                        editable={false}
                                        style={styles.inputCount}
                                        placeholder="Select country"
                                        placeholderTextColor={colors.light_grey}
                                    // onChangeText={(text) => handleInputChange('address', text)}
                                    />
                                    <TouchableOpacity onPress={() => setShowOptions(!showOptions)} style={{ marginRight: 20 }}>
                                        <Image
                                            source={down} // Change the path to your dropdown icon
                                            style={{ width: 20, height: 20 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {countryErrMsg && <Text style={styles.errorMessageStyle}>{'Country is required'}</Text>}
                                {showOptions && (
                                    <View style={{
                                        backgroundColor: colors.white,
                                        borderRadius: 5,
                                        color: '#fff',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.8,
                                        shadowRadius: 2,
                                        elevation: 5
                                    }}>
                                        <FlatList
                                            style={{ color: 'red', padding: 10 }}
                                            data={countryData && countryData}
                                            renderItem={({ item }) => onPressCountryItem(item)}
                                            keyExtractor={(item) => item.code}
                                        />
                                    </View>
                                )}
                            </View>
                            {selectedOption && (
                                <View>
                                    <Text style={styles.titleText}>State</Text>
                                    <View style={styles.addressField}>
                                        <TextInput
                                            value={selectedState}
                                            editable={false}
                                            style={styles.inputCount}
                                            placeholder="Select State"
                                            placeholderTextColor={colors.light_grey}
                                        // onChangeText={(text) => handleInputChange('address', text)}
                                        />
                                        <TouchableOpacity onPress={() => setShowState(!showState)} style={{ marginRight: 20 }}>
                                            <Image
                                                source={down} // Change the path to your dropdown icon
                                                style={{ width: 20, height: 20 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {stateErrMsg && <Text style={styles.errorMessageStyle}>{'State is required'}</Text>}
                                    {showState && (
                                        <View style={{
                                            backgroundColor: colors.white,
                                            borderRadius: 5,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.8,
                                            shadowRadius: 2,
                                            elevation: 5,
                                            height: 200,
                                            flex: 1 // Allow the container to expand
                                        }}>
                                            <FlatList
                                                nestedScrollEnabled
                                                contentContainerStyle={{ flexGrow: 1 }}
                                                style={{ padding: 10 }}
                                                data={statesData && statesData}
                                                renderItem={({ item }) => onPressStateItem(item)}
                                                keyExtractor={(item) => item.code}
                                            />
                                        </View>
                                    )}
                                </View>
                            )}

                            {selectedOption && selectedState && (
                                <View>
                                    <Text style={styles.titleText}>City</Text>
                                    <View style={styles.addressField}>
                                        <TextInput
                                            value={selectedCity}
                                            editable={false}
                                            style={styles.inputCount}
                                            placeholder="Select City"
                                            placeholderTextColor={colors.light_grey}
                                        // onChangeText={(text) => handleInputChange('address', text)}
                                        />
                                        <TouchableOpacity onPress={() => setShowCity(!showCity)} style={{ marginRight: 20 }}>
                                            <Image
                                                source={down} // Change the path to your dropdown icon
                                                style={{ width: 20, height: 20 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {cityErrMsg && <Text style={styles.errorMessageStyle}>{'City is required'}</Text>}
                                    {showCity && (
                                        <View style={{
                                            backgroundColor: colors.white,
                                            borderRadius: 5,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.8,
                                            shadowRadius: 2,
                                            elevation: 5,
                                            height: 200,
                                            flex: 1 // Allow the container to expand
                                        }}>
                                            <FlatList
                                                nestedScrollEnabled
                                                contentContainerStyle={{ flexGrow: 1 }}
                                                style={{ padding: 10 }}
                                                data={cityData && cityData}
                                                renderItem={({ item }) => onPressCityItem(item)}
                                                keyExtractor={(item) => item.code}
                                            />
                                        </View>
                                    )}
                                </View>
                            )}
                            <Text style={styles.titleText}>
                                Address
                            </Text>
                            <TextInput
                                value={userData?.address}
                                style={styles.input}
                                placeholder="Enter address here"
                                placeholderTextColor={colors.light_grey}
                                onChangeText={(text) => handleInputChange('address', text)}
                            />
                            <ErrorMessageCheckout errorMessageText={errorMessages.address} />
                            <CardField
                                postalCodeEnabled={false}
                                placeholders={{
                                    number: 'Enter card number',
                                }}
                                placeholderTextColor={'#CCD0D4'}
                                cardStyle={styles.cardStyling}
                                style={styles.cardStripe}
                                onCardChange={(cardDetails) => {
                                    console.log('cardDetails', cardDetails);
                                    fetchCardDetails(cardDetails)
                                }}
                                onFocus={(focusedField) => {
                                    console.log('focusField', focusedField);
                                }}
                            />
                            {cardDetailsErrMsg && <Text style={styles.errorText}>
                                Card details are required
                            </Text>}
                        </View>
                        <RedButton
                            buttonContainerStyle={styles.buttonContainer}
                            ButtonContent={isLoading ? <Loader /> : route?.params?.amount + ' ' + 'PAY NOW'}
                            contentStyle={styles.buttonText}
                            onPress={() => handleLogin()}
                        />
                    </View>
                </ScrollView>
            </StripeProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.light_purple
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
        width: 150
    },
    inputCount: {
        color: colors.black,
        fontSize: 18,
        fontFamily: fonts.regular,
    },
    titleText: {
        margin: 5,
        color: colors.grey,
        fontFamily: fonts.regular
    },
    fileds: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    addressField: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 5,
        borderWidth: 1,
        width: '100%',
        borderColor: colors.white,
        backgroundColor: colors.white,
        marginBottom: 10,
        justifyContent: 'space-between'
    },
    errorMessageStyle: {
        color: colors.app_red,
        marginTop: 5,
        fontFamily: fonts.regular
    },
    errorText: {
        color: colors.app_red,
        fontFamily: fonts.regular,
        marginTop: 10
    },
    cardStyling: {
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        borderRadius: 5,
    },
    cardStripe: {
        marginTop: 10,
        height: 50,
    }
});

export default CheckoutScreen;


