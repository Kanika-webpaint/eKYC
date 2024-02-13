/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    TextInput,
    Image,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    FlatList,
} from 'react-native';
import colors from '../../common/colors';
import RedButton from '../../components/RedButton';
import { back, down } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux'
import { RegisterAdminAction } from '../../redux/actions/user';
import Loader from '../../components/ActivityIndicator';
import ErrorMessage from '../../components/ErrorMsg';
import { fonts } from '../../common/fonts';
import { Country, State, City } from 'country-state-city';
import ErrorMessageCheckout from '../../components/ErrorMsgCheckout';
import Status from '../../components/Status';

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
        cardNo: '',
        expDate: '',
        cvv: '',
        name: '',
        address: '',
        country: ''
    });
    const navigation = useNavigation();
    const dispatch = useDispatch()
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
        if (!userData.address) {
            newErrorMessages.address = 'Address is required';
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
            // const requestData = {
            //     name: userData?.name,
            //     email: userData?.email,
            //     cardNumber: userData?.cardNo,
            //     expiryDate: userData?.expDate,
            //     transactionId: "2564",
            //     planPrice: route?.params?.amount || ''
            // }

            // navigation.navigate('SuccessScreen')

            const requestData =
            {
                name: "webpaint",
                email: userData?.email,
                cardNumber: "123456789",
                expiryDate: "03-04-2024",
                transactionId: "2564",
                planPrice: "256"
                // add other fields i.e address, city, state, country
            }
            setIsLoading(true)

            dispatch(RegisterAdminAction(requestData, navigation, setIsLoading))
        }
    }

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
            <Status isLight />
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
                        <ErrorMessageCheckout errorMessageText={errorMessages.cardNo} styleMsg={{ marginLeft: 0 }} />
                        <View style={styles.fileds}>
                            <View >
                                <Text style={styles.titleText}>
                                    Exp date
                                </Text>
                                <TextInput
                                    // value={userData?.expDate}
                                    style={styles.inputSmall}
                                    placeholder="DD/MM"
                                    placeholderTextColor={colors.light_grey}
                                    onChangeText={(text) => handleInputChange('expDate', text)}
                                    keyboardType="numeric"
                                />
                                <ErrorMessageCheckout errorMessageText={errorMessages.expDate} />
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
                                <ErrorMessageCheckout errorMessageText={errorMessages.cvv} />
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
        width: 180
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
});

export default CheckoutScreen;


