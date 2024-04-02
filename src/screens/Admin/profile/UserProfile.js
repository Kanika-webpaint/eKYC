/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TextInput, Image, ScrollView, Text, ActivityIndicator } from 'react-native';
import colors from '../../../common/colors';
import { userRed, verifiedUser } from '../../../common/images';
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Status from '../../../components/Status';
import { styles } from './styles';
import Header from '../../../components/Header';
import { getUserByIdAction } from '../../../redux/actions/Organization/organizationActions';

function UserProfile({ route }) {
    const userDetail = useSelector((state) => state?.org?.getUser)
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
                        {userDetail?.isVerified && <Image source={verifiedUser} style={styles.verifyImg} />}
                    </View>
                </View>
                {userDetail ?
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
                        <View style={styles.verifyView}>
                            <Text style={styles.verifiedStatus}>{userDetail?.isVerified == 1 ? 'Verified' : 'Not Verified'}</Text>
                        </View>
                    </View>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '40%' }}>
                        <ActivityIndicator color={colors.app_red} style={{ alignSelf: 'center' }} size={30} />
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    );
}

export default UserProfile;


