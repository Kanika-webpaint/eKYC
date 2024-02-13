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
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native';
import colors from '../../common/colors';
import RedButton from '../../components/RedButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ErrorMessage from '../../components/ErrorMsg';
import { CreateUserAction } from '../../redux/actions/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/ActivityIndicator';
import { back } from '../../common/images';
import { fonts } from '../../common/fonts';
import Status from '../../components/Status';


function CreateUser() {
    const [userData, setFormData] = useState({
        username: '',
        phoneNo: '',
    });
    const [errorMessages, setErrorMessages] = useState({
        username: '',
        phoneNo: '',
    });
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [token, setAuthToken] = useState('')
    const dispatch = useDispatch()
    const OrganizationHomeList = useSelector((state) => state?.login?.orgDetails)

    const handleInputChange = (field, value) => {
        setFormData({ ...userData, [field]: value });
        setErrorMessages({ ...errorMessages, [field]: '' });
    };

    useEffect(() => {
        AsyncStorage.getItem("authToken").then((value) => {
            if (value) {
                setAuthToken(value)
            }
        })
            .then(res => {
                //do something else
            });
    }, [token]);


    const handleCreateUser = () => {
        // Basic validation
        const newErrorMessages = {};

        if (!userData.username) {
            newErrorMessages.username = 'Username is required';
        }

        if (!userData.phoneNo) {
            newErrorMessages.phoneNo = 'Phone Number is required';
        }

        if (Object.keys(newErrorMessages).length > 0) {
            setErrorMessages(newErrorMessages);
            return;
        } else {
            setIsLoading(true)
            const requestData =
            {
                username: userData?.username,
                phoneNumber: userData?.phoneNo,
                organizationId: OrganizationHomeList?.organization?.id || ''
            }
            dispatch(CreateUserAction(requestData, token, navigation, setIsLoading))
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Status isLight />
            <ScrollView style={styles.safeArea} keyboardShouldPersistTaps='handled'>
                <View style={{ margin: 20 }}>
                    <View style={styles.containerHeader}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Image source={back} style={styles.backArrow} />
                            </TouchableOpacity>
                            <Text style={styles.title}>Create user</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Text style={styles.userNameText}>
                            Username
                        </Text>
                        <TextInput
                            value={userData?.username}
                            style={styles.input}
                            placeholder=" Enter username here"
                            placeholderTextColor={colors.light_grey}
                            onChangeText={(text) => handleInputChange('username', text)}
                            keyboardType="email-address"
                        />
                        <ErrorMessage errorMessageText={errorMessages.username} />
                        <Text style={{ margin: 5, color: colors.grey }}>
                            Phone number
                        </Text>
                        <TextInput
                            value={userData?.phoneNo}
                            style={styles.input}
                            placeholder=" Enter phone number here"
                            placeholderTextColor={colors.light_grey}
                            onChangeText={(text) => handleInputChange('phoneNo', text)}
                            keyboardType="email-address"
                        />
                        <ErrorMessage errorMessageText={errorMessages.phoneNo} />
                    </View>
                    <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'CREATE USER'} contentStyle={styles.buttonText} onPress={() => handleCreateUser()} />
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
        fontSize: 16,
        borderColor: colors.white,
        backgroundColor: colors.white,
        fontFamily: fonts.regular
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
    userNameText: {
        margin: 5,
        color: colors.grey,
        fontFamily: fonts.medium
    }
});

export default CreateUser;


