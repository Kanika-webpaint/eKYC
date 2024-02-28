/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    TextInput,
    Image,
    Text,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import colors from '../../common/colors';
import RedButton from '../../components/RedButton';
import { back, background_image, finger_print, profile, validifyX } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { LoginAction, LoginAdminAction, getUserByIdAction } from '../../redux/actions/user';
import Loader from '../../components/ActivityIndicator';
import Logo from '../../components/Logo';
import ErrorMessage from '../../components/ErrorMsg';
import SignInUp from '../../components/SignInUp';
import { fonts } from '../../common/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Status from '../../components/Status';

function UserProfile({ route }) {
    const navigation = useNavigation();
    const userDetail = useSelector((state) => state?.login?.getUser)
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        AsyncStorage.getItem("token").then((value) => {
            if (value) {
                dispatch(getUserByIdAction(route?.params?.id, value, setIsLoading))
            }
        })
            .then(res => {
                //do something else
            });
    }, [dispatch]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Status isLight />
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={{ margin: 20, justifyContent: 'center' }}>
                    <View style={styles.containerHeader}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.navigate('UsersList')} hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}>
                                <Image source={back} style={styles.backArrow} />
                            </TouchableOpacity>
                            <Text style={styles.title}>Profile</Text>
                        </View>
                    </View>
                    <Image source={profile} style={{ marginTop: 20, height: 100, width: 100, resizeMode: 'contain', alignSelf: 'center' }} />
                </View>
                <View style={{ margin: 20 }}>
                    <TextInput
                        editable={false}
                        value={userDetail?.username || ''}
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={colors.grey}
                        onChangeText={(text) => handleInputChange('email', text)}
                        keyboardType="email-address"
                    />
                    <TextInput
                        editable={false}
                        value={userDetail?.phoneNumber}
                        style={styles.input}
                        placeholder="Phone number"
                        placeholderTextColor={colors.grey}
                        onChangeText={(text) => handleInputChange('phNo', text)}
                    />
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
    title: {
        flex: 1, // Allow text to take remaining space
        textAlign: 'center', // Center the text horizontally
        fontSize: 20,
        marginLeft: -30,
        fontFamily: fonts.bold,
        color: 'black', // Assuming text color
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
        fontFamily: fonts.regular,
        marginBottom: 20
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


});

export default UserProfile;


