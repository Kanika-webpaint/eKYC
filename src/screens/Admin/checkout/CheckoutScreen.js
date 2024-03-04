/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ScrollView, TextInput, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import colors from '../../../common/colors';
import RedButton from '../../../components/RedButton';
import { back, close, coupan, down } from '../../../common/images';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../../components/ActivityIndicator';
import { Country, State, City } from 'country-state-city';
import ErrorMessageCheckout from '../../../components/ErrorMsgCheckout';
import Status from '../../../components/Status';
import { CardField, createToken } from '@stripe/stripe-react-native';
import { PUBLISH_KEY, API_URL } from '@env'
import { StripeProvider, confirmPayment } from '@stripe/stripe-react-native';
import axios from 'axios';
import showAlert from '../../../components/showAlert';
import { styles } from './styles';


function CheckoutScreen({ route }) {
    const [userData, setFormData] = useState({ email: '', cardNo: '', expDate: '', cvv: '', name: '', address: '' });
    const [errorMessages, setErrorMessages] = useState({ email: '', name: '', address: '', country: '' });
    const [countryData, setCountryData] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
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
    const [showOptions, setShowOptions] = useState(false);
    const [showState, setShowState] = useState(false);
    const [countryErrMsg, setCountryErrorMsg] = useState(false)
    const [stateErrMsg, setStateErrorMsg] = useState(false)
    const [cityErrMsg, setCityErrorMsg] = useState(false)
    const [cardDetailsErrMsg, setCardDetailsErrMsg] = useState(false)
    const [isPotrait, setIsPortrait] = useState(true)
    const [showSummary, setShowSummary] = useState(false)
    const [load, setLoad] = useState(false)
    const [discountedAmount, setDiscountedVal] = useState(0)
    const navigation = useNavigation();


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
                    let amount;
                    if (grandTotalAmount) {
                        amount = grandTotalAmount;
                    } else if (route?.params?.amount === 'N4999') {
                        amount = 4999;
                    } else {
                        amount = 4499;
                    }
                    if (resToken && amount) {
                        const requestData =
                        {
                            name: userData?.name,
                            email: userData?.email,
                            currency: 'NGN', // Set currency to NGN for Nigerian Naira
                            amount: amount,
                            address: userData?.address,
                            country: selectedOption,
                            state: selectedState,
                            city: selectedCity,
                            // userId: '', //will update it later
                            zip: '123', // make it dynamic later
                            token: resToken?.token?.id   // stripe token
                        }
                        console.log(requestData, "dataaaaa")
                        try {
                            const res = await creatPaymentIntent(requestData)
                            if (res?.data?.clientSecret) {
                                let confirmPaymentIntent = await confirmPayment(res?.data?.clientSecret, { paymentMethodType: 'Card' })
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

    const removeCoupanCode = useCallback(() => {
        const resetedAmount = route?.params?.amount === 'N4999' ? 4999 : 4499
        setCoupanCode('');
        setShowSummary(false)
        setResetAmount(true)
        setTotalAmount(resetedAmount)
    }, [coupanCode, resetAmount, grandTotalAmount])

    const handleCoupan = useCallback((text) => {
        if (text) {
            console.log(text)
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
            return route?.params?.amount === 'N4999' ? ' PAY N4999' : 'PAY N4499';
        } else {
            return route?.params?.amount === 'N4999' ? ' PAY N4999' : 'PAY N4499';
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
                            <Text style={styles.titleText}>Name</Text>
                            <TextInput
                                value={userData?.name}
                                style={styles.input}
                                placeholder="Enter name here"
                                placeholderTextColor={colors.light_grey}
                                onChangeText={(text) => handleInputChange('name', text)}
                                keyboardType="email-address"
                            />
                            <ErrorMessageCheckout errorMessageText={errorMessages.name} />
                            <Text style={styles.titleText}>Email</Text>
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
                                        {countryData?.map(item => {
                                            return (
                                                <TouchableOpacity onPress={() => handleOptionPress(item)}>
                                                    <Text style={{ fontSize: 18, padding: 15 }}>{item?.name}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
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
                            <Text style={styles.titleText}>Address</Text>
                            <TextInput
                                value={userData?.address}
                                style={styles.input}
                                placeholder="Enter address here"
                                placeholderTextColor={colors.light_grey}
                                onChangeText={(text) => handleInputChange('address', text)}
                            />
                            <ErrorMessageCheckout errorMessageText={errorMessages.address} />
                            <Text style={styles.titleText}>Card details</Text>
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
                            <Text style={[styles.titleText, { marginTop: 30, marginBottom: 3 }]}>Have a coupan code?</Text>
                            <View style={{ flexDirection: 'row' }}>
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
                            </View>
                            {load ?
                                <ActivityIndicator size="small" color={colors.app_red} style={{marginTop:20}}/> :
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
                            }

                        </View>
                        <RedButton
                            buttonContainerStyle={[styles.buttonContainer, { marginTop: isPotrait ? '20%' : '8%' }]}
                            ButtonContent={buttonContent()}
                            contentStyle={styles.buttonText}
                            onPress={() => handleLogin()}
                        />
                    </View>
                </ScrollView>
            </StripeProvider>
        </SafeAreaView>
    );
}

export default CheckoutScreen;


