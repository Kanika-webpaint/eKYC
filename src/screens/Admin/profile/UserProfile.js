/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TextInput, Image, ScrollView } from 'react-native';
import colors from '../../../common/colors';
import {  userRed } from '../../../common/images';
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Status from '../../../components/Status';
import { styles } from './styles';
import Header from '../../../components/Header';
import { getUserByIdAction } from '../../../redux/actions/Organization/organizationActions';

function UserProfile({ route }) {
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
            });
    }, [dispatch]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Status isLight />
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={{ justifyContent: 'center' }}>
                    <Header title={'Profile'} />
                    <View style={styles.imageView}>
                        <Image source={userRed} style={styles.img} />
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


