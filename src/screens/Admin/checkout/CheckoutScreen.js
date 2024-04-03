/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ScrollView, TextInput, FlatList, Dimensions, KeyboardAvoidingView } from 'react-native';
import colors from '../../../common/colors';
import RedButton from '../../../components/RedButton';
import { down } from '../../../common/images';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../../components/ActivityIndicator';
import { State, City } from 'country-state-city';
import ErrorMessageCheckout from '../../../components/ErrorMsgCheckout';
import Status from '../../../components/Status';
import { CardField, createToken } from '@stripe/stripe-react-native';
import { PUBLISH_KEY, STRIPE_CLIENT_SECRET_KEY, API_URL, PRICE_BASIC_PLAN, PRICE_PREMIUM_PLAN, STRIPE_PAYMENT_METHOD_API } from '@env'
import { StripeProvider } from '@stripe/stripe-react-native';
import axios from 'axios';
import showAlert from '../../../components/showAlert';
import { styles } from './styles';
import CheckoutForm from '../../../components/CheckoutForm';
import Header from '../../../components/Header';

function CheckoutScreen({ route }) {
    const [userData, setFormData] = useState({ email: '', cardNo: '', expDate: '', cvv: '', name: '', line1: '', line2: '', postalCode: '' });
    const [errorMessages, setErrorMessages] = useState({ email: '', name: '', address: '', country: '', line1: '', line2: '', postalCode: '' });
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [statesData, setStatesData] = useState();
    const [cardDetails, setCardDetails] = useState()
    const [cityData, setCitiesData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [showState, setShowState] = useState(false);
    const [stateErrMsg, setStateErrorMsg] = useState(false)
    const [cityErrMsg, setCityErrorMsg] = useState(false)
    const [cardDetailsErrMsg, setCardDetailsErrMsg] = useState(false)
    const [isPotrait, setIsPortrait] = useState(true)
    const [showCity, setShowCity] = useState(false)
    const navigation = useNavigation();
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

    useEffect(() => {
        const nigeriaStatesData = State && State?.getStatesOfCountry('NG');
        if (nigeriaStatesData) {
            setStatesData(nigeriaStatesData);
        }
    }, []);

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

    const getCities = async (option) => {
        const nigeriaStatesCitiesData = await City && City?.getCitiesOfState('NG', option?.isoCode);
        if (nigeriaStatesCitiesData && option?.isoCode) {
            setCitiesData(nigeriaStatesCitiesData);
        }
    }

    const handleStatePress = (option) => {
        setSelectedState(option?.name)
        setShowState(false)
        getCities(option)
    }

    const handleCityPress = (option) => {
        setSelectedCity(option?.name)
        setShowCity(false)
    }

    const fetchCardDetails = (cardDetails) => {
        if (cardDetails?.complete) {
            setCardDetails(cardDetails)
        } else {
            setCardDetails(null)
        }
    }

    const handleCheckout = async () => {
        const newErrorMessages = {};
        if (!userData.name.trim()) {
            newErrorMessages.name = 'Name is required';
        }
        if (!userData.email.trim()) {
            newErrorMessages.email = 'Email is required';
        }
        if (!userData.line1.trim()) {
            newErrorMessages.line1 = 'Line 1 is required';
        }
        if (!userData.line2.trim()) {
            newErrorMessages.line2 = 'Line 2 is required';
        }
        if (!userData.postalCode.trim()) {
            newErrorMessages.postalCode = 'Postal code is required';
        }
        if (!cardDetails) {
            setCardDetailsErrMsg(true)
        }
        if (selectedState === null) {
            setStateErrorMsg(true)
        }
        if (selectedCity === null) {
            setCityErrorMsg(true)
        }
        if (Object.keys(newErrorMessages).length > 0) {
            setErrorMessages(newErrorMessages);
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
                setCardDetailsErrMsg(false)
                setStateErrorMsg(false)
                setCityErrorMsg(false)
                try {
                    setIsLoading(true)
                    showAlert('Subscribing..please wait!!')
                    const config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            Authorization: `Bearer ${STRIPE_CLIENT_SECRET_KEY}`,
                        },
                    };
                    const resToken = await createToken({ ...cardDetails, type: 'Card' })
                    if (resToken && resToken?.token && resToken?.token?.id) {
                        const data =
                        {
                            type: 'card',
                            card: { token: resToken?.token?.id },
                        }
                        axios.post(STRIPE_PAYMENT_METHOD_API, data, config)
                            .then(async function (resPaymentMethod) {
                                if (resPaymentMethod && resPaymentMethod?.data && resPaymentMethod?.data?.id) {
                                    const configSubscription = {
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                    };
                                    const subscriptionData = {
                                        name: userData?.name,
                                        email: userData?.email,
                                        address: {
                                            city: selectedCity,
                                            country: 'Nigeria',
                                            line1: userData?.line1,
                                            line2: userData?.line2,
                                            postal_code: userData?.postalCode,
                                            state: selectedState
                                        },
                                        price_id: route?.params?.amount == 'N14999' ? PRICE_BASIC_PLAN : PRICE_PREMIUM_PLAN,
                                        paymentMethod: resPaymentMethod?.data?.id
                                    }
                                    const api_url = `${API_URL}/stripesubscription`
                                    await axios.post(api_url, JSON.stringify(subscriptionData), configSubscription)
                                        .then(async function (resSubscription) {
                                            const clientSecret = resSubscription?.data?.clientSecret?.payment_intent?.client_secret;
                                            if (clientSecret) {
                                                resSubscription?.data?.clientSecret?.lines?.data?.map(async item => {
                                                    const responseSubs = {
                                                        subscriptionId: resSubscription?.data?.clientSecret?.subscription,
                                                        customerId: resSubscription?.data?.clientSecret?.customer,
                                                        paymentIntentId: resSubscription?.data?.clientSecret?.payment_intent?.id,
                                                        planStatus: item?.plan?.active, // this should be in the api
                                                        amount: resSubscription?.data?.clientSecret?.payment_intent?.amount,
                                                        currency: resSubscription?.data?.clientSecret?.currency,
                                                        planInterval: item?.plan?.interval,
                                                        planDescription: item?.plan?.nickname,
                                                        quantity: item?.quantity,
                                                        city: resSubscription?.data?.clientSecret?.customer_address?.city,
                                                        country: resSubscription?.data?.clientSecret?.customer_address?.country,
                                                        address: resSubscription?.data?.clientSecret?.customer_address?.line1,
                                                        zip: resSubscription?.data?.clientSecret?.customer_address?.postal_code,
                                                        state: resSubscription?.data?.clientSecret?.customer_address?.state,
                                                        email: resSubscription?.data?.clientSecret?.customer_email,
                                                        name: resSubscription?.data?.clientSecret?.customer_name
                                                    }
                                                    const api_url = `${API_URL}/orgcheckout`
                                                    await axios.post(api_url, JSON.stringify(responseSubs), configSubscription)
                                                        .then(async function (subsResData) {
                                                            if (subsResData?.status === 201) {
                                                                setIsLoading(false)
                                                                setTimeout(async () => {
                                                                    setIsLoading(false)
                                                                    showAlert('Password has been sent on your email.')
                                                                    navigation.navigate('SuccessScreen')
                                                                }, 500);
                                                            } else {
                                                                setIsLoading(false)
                                                                showAlert('Please try again later.')
                                                            }
                                                        })
                                                        .catch(function (error) {
                                                            console.log(error, "error")
                                                        });
                                                })
                                            } else {
                                                setIsLoading(false)
                                                showAlert('Apologies for the inconvenience,\nplease try again later.')
                                            }
                                        })
                                        .catch(function (error) {
                                            console.log(error?.response?.data?.error,"errorrr")
                                            if (error?.response?.data?.error?.statusCode == 402 || error?.response?.data?.error?.code === 'card_declined') {
                                                setIsLoading(false)
                                                showAlert('Your card was declined.\nPlease enter valid card details.');
                                            }
                                        });
                                }
                            }).catch(function (error) {
                                setIsLoading(false)
                                showAlert('Something went wrong.\nPlease try again later.');
                            });
                    } else {
                        if (resToken && resToken?.error && resToken?.error?.code == 'Failed') {
                            showAlert(resToken?.error?.message)
                            setIsLoading(false)
                        }
                    }
                } catch (error) {
                    setIsLoading(false)
                    showAlert('Something went wrong.\nPlease try again later.');
                }
            }
        }
    }

    const onPressStateItem = (item) => {
        return (
            <TouchableOpacity onPress={() => handleStatePress(item)}>
                <Text style={styles.itemm}>{item?.name}</Text>
            </TouchableOpacity>
        )
    }

    const onPressCityItem = (item) => {
        return (
            <TouchableOpacity onPress={() => handleCityPress(item)}>
                <Text style={styles.itemm}>{item?.name}</Text>
            </TouchableOpacity>
        )
    }

    const buttonContent = useCallback(() => {
        if (isLoading) {
            return <Loader />;
        } else {
            return route?.params?.amount === 'N13499' ? ' PAY N13,499' : 'PAY N14,999';
        }
    }, [isLoading, route?.params?.amount]);


    return (
        <SafeAreaView style={styles.safeArea}>
            <StripeProvider publishableKey={PUBLISH_KEY}>
                <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={keyboardVerticalOffset}>
                    <ScrollView keyboardShouldPersistTaps='handled'>
                        <Status isLight />
                        <Header title={'Checkout'} />
                        <View style={{ margin: 20 }}>
                            <CheckoutForm value={userData?.name} placeholder="Enter name here" onChangeText={(text) => handleInputChange('name', text)} title={'Name'} />
                            <ErrorMessageCheckout errorMessageText={errorMessages.name} />
                            <CheckoutForm value={userData?.email} placeholder="Enter email here" onChangeText={(text) => handleInputChange('email', text)} keyboardType="email-address" title={'Email'} />
                            <ErrorMessageCheckout errorMessageText={errorMessages.email} />
                            <CheckoutForm value={'Nigeria'} title={'Country'} editable={false} />
                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.titleText}>State</Text>
                                <View style={styles.addressField}>
                                    <TextInput value={selectedState} editable={false} style={styles.inputCount} placeholder="Select State" placeholderTextColor={colors.light_grey} />
                                    <TouchableOpacity onPress={() => setShowState(!showState)} style={{ marginRight: 20 }}>
                                        <Image source={down} style={styles.dropdownStyle} />
                                    </TouchableOpacity>
                                </View>
                                {stateErrMsg && <Text style={styles.errorMessageStyle}>{'State is required'}</Text>}
                                {showState && (
                                    <View style={styles.flatlistStyle}>
                                        <FlatList nestedScrollEnabled contentContainerStyle={{ flexGrow: 1 }} style={{ padding: 10 }} data={statesData && statesData} renderItem={({ item }) => onPressStateItem(item)} keyExtractor={(item) => item.code} />
                                    </View>
                                )}
                            </View>
                            {selectedState && (
                                <View style={{ marginTop: 18 }}>
                                    <Text style={styles.titleText}>City</Text>
                                    <View style={styles.addressField}>
                                        <TextInput value={selectedCity} editable={false} style={styles.inputCount} placeholder="Select City" placeholderTextColor={colors.light_grey} />
                                        <TouchableOpacity onPress={() => setShowCity(!showCity)} style={{ marginRight: 20 }}>
                                            <Image source={down} style={{ width: 20, height: 20 }} />
                                        </TouchableOpacity>
                                    </View>
                                    {cityErrMsg && <Text style={styles.errorMessageStyle}>{'City is required'}</Text>}
                                    {showCity && (
                                        <View style={styles.flatlistStyle}>
                                            <FlatList nestedScrollEnabled contentContainerStyle={{ flexGrow: 1 }} style={{ padding: 10 }} data={cityData && cityData} renderItem={({ item }) => onPressCityItem(item)} keyExtractor={(item) => item.code} />
                                        </View>
                                    )}
                                </View>
                            )}
                            <View style={{ marginTop: 12 }}>
                                <Text style={styles.titleText}>Line 1</Text>
                                <TextInput value={userData?.line1} style={styles.input} placeholder="Enter line 1" placeholderTextColor={colors.light_grey} onChangeText={(text) => handleInputChange('line1', text)} />
                            </View>
                            <ErrorMessageCheckout errorMessageText={errorMessages.line1} />
                            <Text style={styles.titleText}>Line 2</Text>
                            <TextInput value={userData?.line2} style={styles.input} placeholder="Enter line 2" placeholderTextColor={colors.light_grey} onChangeText={(text) => handleInputChange('line2', text)} />
                            <ErrorMessageCheckout errorMessageText={errorMessages.line2} />
                            <Text style={styles.titleText}>Postal Code</Text>
                            <TextInput value={userData?.postalCode} style={styles.input} placeholder="Enter postal code" placeholderTextColor={colors.light_grey} onChangeText={(text) => handleInputChange('postalCode', text)} />
                            <ErrorMessageCheckout errorMessageText={errorMessages.postalCode} />
                            <Text style={styles.titleText}>Card details</Text>
                            <CardField
                                placeholders={{
                                    number: 'Enter card number',
                                }}
                                placeholderTextColor={'#CCD0D4'}
                                cardStyle={styles.cardStyling}
                                style={styles.cardStripe}
                                onCardChange={(cardDetails) => {
                                    fetchCardDetails(cardDetails)
                                }}
                                onFocus={(focusedField) => {
                                    console.log('focusField', focusedField);
                                }}
                            />
                            {cardDetailsErrMsg && <Text style={styles.errorText}>
                                Card details are required
                            </Text>}
                            <RedButton
                                buttonContainerStyle={[styles.buttonContainer, { marginTop: isPotrait ? '8%' : '8%' }]}
                                ButtonContent={buttonContent()}
                                contentStyle={styles.buttonText}
                                onPress={() => handleCheckout()}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </StripeProvider>
        </SafeAreaView>
    );
}

export default CheckoutScreen;


