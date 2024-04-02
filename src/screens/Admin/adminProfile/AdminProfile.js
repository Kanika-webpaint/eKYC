/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, ScrollView, KeyboardAvoidingView, Image, TextInput } from 'react-native';
import colors from '../../../common/colors';
import { useDispatch, useSelector } from 'react-redux';
import Status from '../../../components/Status';
import { styles } from './styles';
import Header from '../../../components/Header';
import { userRed } from '../../../common/images';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AdminProfile() {
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
    const orgDetailsList = useSelector((state) => state?.org?.orgDetails)
    const [name, setName] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [state, setState] = useState('')
    const [zip, setPostalCode] = useState('')
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [token, setToken] = useState('')
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        AsyncStorage.getItem("token").then((value) => {
            if (value) {
                setToken(value)
            }
        })
            .then(res => {
            });
    }, [dispatch, token]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={keyboardVerticalOffset}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <Status isLight />
                    <View style={{ justifyContent: 'center' }}>
                        <Header title={'Profile'} />
                        <View style={{ borderWidth: 0.3, borderColor: colors.light_grey }}></View>
                        <View style={styles.imageView}>
                            <Image source={userRed} style={styles.img} />
                        </View>
                    </View>
                    <View style={{ margin: 20 }}>
                        <TextInput editable={false} value={name ? name : orgDetailsList?.organization?.name} style={styles.input} onChange={(text) => setName(text)} />
                        <TextInput editable={false} value={orgDetailsList?.organization?.email} style={styles.input} onChange={(text) => setEmail(text)} />
                        <TextInput editable={false} value={city ? city : orgDetailsList?.organization?.city} style={styles.input} onChange={(text) => setCity(text)} />
                        <TextInput editable={false} value={country ? country : orgDetailsList?.organization?.country} style={styles.input} onChange={(text) => setCountry(text)} />
                        <TextInput editable={false} value={state ? state : orgDetailsList?.organization?.state} style={styles.input} onChange={(text) => setState(text)} />
                        <TextInput editable={false} value={zip ? zip : orgDetailsList?.organization?.zip} style={styles.input} onChange={(text) => setPostalCode(text)} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default AdminProfile;


