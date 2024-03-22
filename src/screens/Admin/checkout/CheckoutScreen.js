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
import { back, close, coupan, down } from '../../../common/images';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Loader from '../../../components/ActivityIndicator';
import { State, City } from 'country-state-city';
import ErrorMessageCheckout from '../../../components/ErrorMsgCheckout';
import Status from '../../../components/Status';
import { CardField, createToken } from '@stripe/stripe-react-native';
import { PUBLISH_KEY, STRIPE_CLIENT_SECRET_KEY, API_URL, PRICE_BASIC_PLAN, PRICE_PREMIUM_PLAN } from '@env'
import { StripeProvider, confirmPayment } from '@stripe/stripe-react-native';
import axios from 'axios';
import showAlert from '../../../components/showAlert';
import { styles } from './styles';
import { useDispatch } from 'react-redux';
import { stripeSubscriptionAction } from '../../../redux/actions/user';
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
    const [showCity, setShowCity] = useState();
    const [coupanCode, setCoupanCode] = useState()
    const [grandTotalAmount, setTotalAmount] = useState()
    const [resetAmount, setResetAmount] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [showState, setShowState] = useState(false);
    const [stateErrMsg, setStateErrorMsg] = useState(false)
    const [cityErrMsg, setCityErrorMsg] = useState(false)
    const [cardDetailsErrMsg, setCardDetailsErrMsg] = useState(false)
    const [isPotrait, setIsPortrait] = useState(true)
    const [showSummary, setShowSummary] = useState(false)
    const [load, setLoad] = useState(false)
    const [discountedAmount, setDiscountedVal] = useState(0)
    const navigation = useNavigation();
    const dispatch = useDispatch()
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
        console.log(cardDetails, "card DETAILS")
        if (cardDetails?.complete) {
            setCardDetails(cardDetails)
        } else {
            setCardDetails(null)
        }
    }

    console.log(API_URL, PRICE_PREMIUM_PLAN, PRICE_BASIC_PLAN, STRIPE_CLIENT_SECRET_KEY, PUBLISH_KEY, "api url test")

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
                try {
                    setIsLoading(true)
                    showAlert('Subscribing..please wait!!')
                    const config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            Authorization: `Bearer ${STRIPE_CLIENT_SECRET_KEY}`, // Add 'Bearer' prefix before token
                        },
                    };
                    const resToken = await createToken({ ...cardDetails, type: 'Card' })
                    console.log(resToken, "response tokenn")
                    if (resToken && resToken?.token && resToken?.token?.id) {
                        const data =
                        {
                            type: 'card',
                            card: { token: resToken?.token?.id },
                        }
                        axios.post('https://api.stripe.com/v1/payment_methods', data, config)
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
                                        price_id: route?.params?.amount == 'N14999' ? PRICE_BASIC_PLAN : PRICE_PREMIUM_PLAN,   // check issue here
                                        paymentMethod: resPaymentMethod?.data?.id
                                    }
                                    const api_url = `${API_URL}/stripesubscription`
                                    await axios.post(api_url, JSON.stringify(subscriptionData), configSubscription)
                                        .then(async function (resSubscription) {
                                            console.log(clientSecret, "secret client")
                                            const clientSecret = resSubscription?.data?.clientSecret;
                                            if (clientSecret) {
                                                setIsLoading(true)
                                                setTimeout(async () => {
                                                    setIsLoading(false)
                                                    navigation.navigate('SuccessScreen')

                                                    // no need to do.........

                                                    // save success response
                                                    // let confirmPaymentIntent = await confirmPayment(resSubscription?.data?.clientSecret, {
                                                    //     paymentMethodType: 'Card', paymentMethodData: {
                                                    //         paymentMethodId: resPaymentMethod?.data?.id
                                                    //     }
                                                    // })

                                                    // try {
                                                    //     if (confirmPaymentIntent?.paymentIntent?.status == 'Succeeded') {
                                                    //         setIsLoading(false)
                                                    //         navigation.navigate('SuccessScreen')
                                                    //         // call the API to save data to DB

                                                    //         // const confirmationSubsData = {
                                                    //         //     dataSubscription: confirmPaymentIntent?.paymentIntent
                                                    //         // }
                                                    //         // dispatch(stripeSubscriptionAction(confirmationSubsData, navigation, setIsLoading))

                                                    //     } else {
                                                    //         setIsLoading(false)
                                                    //     }
                                                    // } catch (error) {
                                                    //     setIsLoading(false)
                                                    //     console.log(error, "error")
                                                    // };
                                                }, 500);

                                            } else {
                                                setIsLoading(false)
                                                showAlert('Apologies for the inconvenience, please try again later.')
                                            }
                                        })
                                        .catch(function (error) {
                                            console.log(error, "error")
                                        });
                                }
                            })
                    }

                } catch (error) {
                    setIsLoading(false)
                    showAlert('Error', 'Something went wrong. Please try again later.');
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

    const removeCoupanCode = useCallback(() => {
        const resetedAmount = route?.params?.amount === 'N4999' ? 4999 : 4499
        setCoupanCode('');
        setShowSummary(false)
        setResetAmount(true)
        setTotalAmount(resetedAmount)
    }, [coupanCode, resetAmount, grandTotalAmount])

    const handleCoupan = useCallback((text) => {
        if (text) {
            setCoupanCode(text);
        } else {
            const resetedAmount = route?.params?.amount === 'N4999' ? 4999 : 4499
            setCoupanCode('');
            setShowSummary(false)
            setResetAmount(true)
            setTotalAmount(resetedAmount)
        }
    }, [coupanCode, resetAmount, grandTotalAmount]);

    const buttonContent = useCallback(() => {
        if (isLoading) {
            return <Loader />;
        } else if (grandTotalAmount) {
            return `PAY N${grandTotalAmount}`;
        } else if (!showSummary && resetAmount && route?.params?.amount) {
            return route?.params?.amount === 'N13499' ? ' PAY N13,499' : 'PAY N14,999';
        } else {
            return route?.params?.amount === 'N13499' ? ' PAY N13,499' : 'PAY N14,999';
        }
    }, [resetAmount, grandTotalAmount, isLoading, route?.params?.amount]);

    const handleCoupanCode = useCallback(() => {
        setLoad(true); // Show loader

        setTimeout(() => {
            const previousAmount = route?.params?.amount === 'N4999' ? 4999 : 4499; // Parse to number

            if (!coupanCode.trim()) {
                showAlert('Please enter a valid coupon code.');
                setLoad(false); // Hide loader
                return;
            }

            setShowSummary(true);

            const discountPercentage = 10; // static 10% discount for now, change it later
            const discountedAmount = previousAmount * (1 - discountPercentage / 100);
            const discountAmount = previousAmount * (discountPercentage / 100);

            if (discountedAmount > 0) {
                setLoad(false); // Hide loader
                setDiscountedVal(discountAmount.toFixed(0));
                setTotalAmount(discountedAmount.toFixed(0));
                showAlert('Coupon Code Applied successfully!');
            } else {
                setLoad(false); // Hide loader
                showAlert('Coupon amount exceeds total amount.');
            }
        }, 1000); // Delay execution of the main code by 1000 milliseconds
    }, [route?.params?.amount, coupanCode]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StripeProvider publishableKey={PUBLISH_KEY}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={keyboardVerticalOffset}>
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
                                // postalCodeEnabled={false}
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
                            {/* <Text style={[styles.titleText, { marginTop: 30, marginBottom: 3 }]}>Have a coupan code?</Text> */}
                            {/* <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.coupanCodeView}>
                                        <Image source={coupan} style={{ resizeMode: 'contain', height: 20, width: 20, alignSelf: 'center', marginLeft: 10 }} />
                                        <TextInput
                                            value={coupanCode}
                                            style={[styles.input, { borderRadius: 0, width: '70%' }]}
                                            placeholder="Enter coupan code"
                                            placeholderTextColor={colors.light_grey}
                                            onChangeText={(text) => handleCoupan(text)}
                                        />
                                        {coupanCode?.length > 0 && (
                                            <TouchableOpacity style={{ justifyContent: 'center', width: 30 }} onPress={() => removeCoupanCode()}>
                                                <Image source={close} style={{ resizeMode: 'contain', height: 13, width: 13, alignSelf: 'center', }} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <TouchableOpacity onPress={() => {
                                        if (!coupanCode) {
                                            showAlert('Please enter a valid coupon code.');
                                        } else {
                                            handleCoupanCode();
                                        }
                                    }} style={[styles.input, { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5, width: '28%', marginLeft: 10, borderWidth: 1, justifyContent: 'center', alignSelf: 'center' }]}>
                                        <Text style={styles.applyText}>{'APPLY'}</Text>
                                    </TouchableOpacity>
                                </View> */}
                            {/* {load ?
                                    <ActivityIndicator size="small" color={colors.app_red} style={{ marginTop: 20 }} /> :
                                    showSummary ?
                                        <View style={styles.summaryView}>
                                            <Text style={styles.ordersummaryText}>Order summary</Text>
                                            <View style={styles.viewAll}>
                                                <Text style={styles.subTotal}>Subtotal</Text>
                                                <Text style={styles.subTotal}>{route?.params?.amount === 'N4999' ? 'N4999' : 'N4499'}</Text>
                                            </View>
                                            <View style={styles.viewAll}>
                                                <View style={styles.coupanView}>
                                                    <Image source={coupan} style={styles.imgCoupan} />
                                                    <Text style={styles.subTotal}>{coupanCode}</Text>
                                                </View>
                                                <Text style={styles.subTotal}>{'-' + 'N' + discountedAmount}</Text>
                                            </View>
                                            <View style={styles.viewAll}>
                                                <Text style={styles.subTotal}>Grand total</Text>
                                                <Text style={styles.subTotal}>{'N' + grandTotalAmount}</Text>
                                            </View>
                                        </View>
                                        :
                                        null
                                } */}
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


