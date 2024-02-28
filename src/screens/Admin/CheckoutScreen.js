/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, TextInput, FlatList, ToastAndroid, Alert } from 'react-native';
import colors from '../../common/colors';
import RedButton from '../../components/RedButton';
import { back, down } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../components/ActivityIndicator';
import { fonts } from '../../common/fonts';
import { Country, State, City } from 'country-state-city';
import ErrorMessageCheckout from '../../components/ErrorMsgCheckout';
import Status from '../../components/Status';
import { CardField, CardForm, createToken } from '@stripe/stripe-react-native';
import { PUBLISH_KEY, API_URL } from '@env'
import { StripeProvider, confirmPayment } from '@stripe/stripe-react-native';
import axios from 'axios';
import showAlert from '../../components/showAlert';


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

    // const creatPaymentIntent = (data) => {
    //     return new Promise((resolve, reject) => {
    //         axios.post('http://192.168.1.10:5000/api/stripecheckout', data).then(function (res) {
    //             resolve(res)
    //         }).catch(function (error) {
    //             reject(error)
    //         })
    //     })
    // }


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
                            amount: route?.params?.amount === 'N4999' ? '4999' : '4499',
                            address: userData?.address,
                            country: selectedOption,
                            state: selectedState,
                            city: selectedCity,
                            // userId: '', //will update it later
                            zip: '123', // make it dynamic later
                            token: resToken?.token?.id   // stripe token
                        }
                        try {
                            const res = await creatPaymentIntent(requestData)
                            console.log("payment intent create succesfully...!!!", res)

                            if (res?.data?.clientSecret) {
                                let confirmPaymentIntent = await confirmPayment(res?.data?.clientSecret, { paymentMethodType: 'Card' })
                                console.log("confirmPaymentIntent res++++", confirmPaymentIntent)
                                if (confirmPaymentIntent) {
                                    //set payment method id here and send it to backend to store the transaction for future.
                                    setIsLoading(false)
                                    navigation.navigate('SuccessScreen', { purchasedPlanAmount: confirmPaymentIntent?.paymentIntent?.amount })
                                } else {
                                    setIsLoading(false)
                                    showAlert('Payment failed, please try again!!')
                                }
                            }
                        } catch (error) {
                            setIsLoading(false)
                            console.log("Error rasied during payment intent", error)
                        }
                    } else {
                        showAlert('Something went wrong. Please try again later.');

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
                            <Text style={styles.titleText}>
                                Card details
                            </Text>
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

                            {/* <CardForm
                                style={{height:170,width:'90%'}}
                            /> */}
                            {cardDetailsErrMsg && <Text style={styles.errorText}>
                                Card details are required
                            </Text>}
                        </View>
                        <RedButton
                            buttonContainerStyle={styles.buttonContainer}
                            ButtonContent={isLoading ? <Loader /> : route?.params?.amount === 'N4999' ? 'N4999 PAY NOW' : 'N4499 PAY NOW'}
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
        backgroundColor: colors.light_purple,
    },
    buttonContainer: {
        marginTop: '20%', // Adjusted for spacing
        backgroundColor: colors.app_red,
        paddingVertical: 10, // Adjusted for spacing
        borderRadius: 8,
        alignSelf: 'center',
        alignItems: 'center',
        width: '100%', // Adjusted for better responsiveness
        marginBottom: 20, // Adjusted for spacing
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.bold,
    },
    containerHeader: {
        alignItems: 'center', // Centering horizontally
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.light_purple,
        paddingVertical: 10, // Adjusted for better spacing
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
        fontFamily: fonts.bold,
        color: colors.black,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        height: 50,
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 5,
        color: colors.black,
        borderColor: colors.white,
        backgroundColor: colors.white,
        fontFamily: fonts.regular,
        marginBottom: 10,
        fontSize: 16,
        width: '100%', // Adjusted for full width
    },
    inputCount: {
        flex: 1, // Adjusted to fill available space
        color: colors.black,
        fontSize: 16,
        fontFamily: fonts.regular,
    },
    titleText: {
        marginVertical: 2, // Adjusted for spacing
        color: colors.grey,
        fontFamily: fonts.regular,
    },
    addressField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%', // Adjusted for full width
        height: 50,
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 5,
        color: colors.black,
        borderColor: colors.white,
        backgroundColor: colors.white,
        fontFamily: fonts.regular,
        marginBottom: 10,
        fontSize: 16,
    },
    errorMessageStyle: {
        color: colors.app_red,
        fontFamily: fonts.regular,
        marginLeft: 5
    },
    errorText: {
        marginTop: 5,
        marginLeft: 5,
        color: colors.app_red,
        fontFamily: fonts.regular,
    },
    cardStyling: {
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        borderRadius: 5,
        fontFamily: fonts.regular,
        fontSize: 16
    },
    cardStripe: {
        marginTop: 2,
        height: 50,
        width: '100%', // Adjusted for full width
    },
});


export default CheckoutScreen;


