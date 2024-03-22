/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView } from 'react-native';
import colors from '../../../common/colors';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/ActivityIndicator';
import { back } from '../../../common/images';
import { fonts } from '../../../common/fonts';
import Status from '../../../components/Status';
import { styles } from './styles';
import PlanItem from '../../../components/PlanItem';
import { getPlanDetailsAction } from '../../../redux/actions/user';
import Header from '../../../components/Header';


function CurrentPlan() {
    const [isPotrait, setIsPortrait] = useState(true)
    const [isLoading, setIsLoading] = useState(false);
    const [token, setAuthToken] = useState('')
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

    // const planDetailsList = useSelector((state) => state?.login?.planDetailList)
    // console.log(planDetailsList, "list plan detailss")
    // useEffect(() => {
    //     AsyncStorage.getItem("token").then((value) => {
    //         if (value) {
    //             dispatch(getPlanDetailsAction(value, setIsLoading))
    //         }
    //     })
    //         .then(res => {
    //             //do something else
    //         });
    // }, [dispatch]);


    useEffect(() => {
        AsyncStorage.getItem("token").then((value) => {
            if (value) {
                setAuthToken(value)
            }
        })
            .then(res => {
                //do something else
            });
    }, [token]);


    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={keyboardVerticalOffset}>
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <Status isLight />
                    <Header title={'My Plan'} />
                    <View style={{ borderWidth: 0.3, borderColor: colors.light_grey }}></View>
                    <View style={{ backgroundColor: colors.purple_dim, margin: 20 }}>
                        <Text style={{ fontSize: 20, fontFamily: fonts.bold, color: colors.black, padding: 10 }}>Details</Text>
                        <PlanItem title={'Current Plan'} value={'Basic'} />
                        <PlanItem title={'Billing Email'} value={'kanika.webpaint@gmail.com'} />
                        <PlanItem title={'Status'} value={'Active'} styleText={{ backgroundColor: 'green', overflow: 'hidden', borderRadius: 10, padding: 5, color: colors.white }} />
                        <PlanItem title={'Price'} value={'N14,999'} />
                        <PlanItem title={'Billing period'} value={'Yearly'} />
                        <PlanItem title={'Subscription renewal date'} value={'14-03-2025'} />

                        {/* <PlanItem title={'Current Plan'} value={planDetailsList?.data?.planName} />
                    <PlanItem title={'Billing Email'} value={planDetailsList?.data?.email} />
                    <PlanItem title={'Status'} value={planDetailsList?.data?.status} styleText={{ backgroundColor: 'green', borderRadius: 10, padding: 3, color: colors.white }} />
                    <PlanItem title={'Price'} value={planDetailsList?.data?.amount} />
                    <PlanItem title={'Billing period'} value={planDetailsList?.data?.billingPeriod} />
                    <PlanItem title={'Subscription renewal date'} value={planDetailsList?.data?.renewDate} /> */}

                    </View>
                    <View style={{ backgroundColor: colors.purple_dim, margin: 20 }}>
                        <Text style={{ fontSize: 20, fontFamily: fonts.bold, color: colors.black, padding: 10 }}>Features</Text>
                        <PlanItem title={'Users'} value={'1-50'} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


export default CurrentPlan


