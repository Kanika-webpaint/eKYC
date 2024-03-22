/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, TextInput, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../../../common/colors';
import { back, profile, userRed } from '../../../common/images';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { getUserByIdAction } from '../../../redux/actions/user';
import { fonts } from '../../../common/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Status from '../../../components/Status';
import { styles } from './styles';
import Header from '../../../components/Header';


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
                <View style={{ justifyContent: 'center' }}>
                    <Header title={'Profile'} />
                    <View style={{ backgroundColor: colors.purple_dim, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginLeft: '8%', height: 70, width: 70, alignSelf: 'center', borderRadius: 40, borderColor: colors.app_red, elevation: 2, marginTop: 20 }}>
                        <Image source={userRed} style={{ height: 30, width: 30, resizeMode: 'contain', alignSelf: 'center' }} />
                    </View>
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



export default UserProfile;


