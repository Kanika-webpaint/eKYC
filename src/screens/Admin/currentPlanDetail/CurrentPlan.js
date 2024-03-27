/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, View, Text, ScrollView, KeyboardAvoidingView } from 'react-native';
import colors from '../../../common/colors';
import { useSelector } from 'react-redux';
import { fonts } from '../../../common/fonts';
import Status from '../../../components/Status';
import { styles } from './styles';
import PlanItem from '../../../components/PlanItem';
import Header from '../../../components/Header';

function CurrentPlan() {
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
    const planDetailsList = useSelector((state) => state?.login?.orgDetails)

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={keyboardVerticalOffset}>
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <Status isLight />
                    <Header title={'My Plan'} />
                    <View style={{ borderWidth: 0.3, borderColor: colors.light_grey }}></View>
                    <View style={{ backgroundColor: colors.purple_dim, margin: 20 }}>
                        <Text style={{ fontSize: 20, fontFamily: fonts.bold, color: colors.black, padding: 10 }}>Plan Details</Text>
                        <PlanItem title={'Current Plan'} value={planDetailsList?.organization?.amount === 1499900 ? 'Basic' : 'Premium'} />
                        <PlanItem title={'Billing Email'} value={planDetailsList?.organization?.email} />
                        <PlanItem title={'Status'} value={planDetailsList?.organization?.status || 'Active'} styleText={{ backgroundColor: 'green', borderRadius: 10, padding: 3, color: colors.white }} />
                        <PlanItem title={'Currency'} value={planDetailsList?.organization?.currency} />
                        <PlanItem title={'Price'} value={planDetailsList?.organization?.amount.toString().slice(0, -2) + '.' + planDetailsList?.organization?.amount?.toString().slice(-2).padEnd(2, '0')} />
                        <PlanItem title={'Billing period'} value={planDetailsList?.organization?.planInterval} />
                        <PlanItem title={'Description'} value={planDetailsList?.organization?.planDescription} />
                    </View>
                    <View style={{ backgroundColor: colors.purple_dim, margin: 20 }}>
                        <Text style={{ fontSize: 20, fontFamily: fonts.bold, color: colors.black, padding: 10 }}>Personal Details</Text>
                        <PlanItem title={'Name'} value={planDetailsList?.organization?.name} />
                        <PlanItem title={'Address'} value={planDetailsList?.organization?.address} />
                        <PlanItem title={'City'} value={planDetailsList?.organization?.city} />
                        <PlanItem title={'Country'} value={planDetailsList?.organization?.country} />
                        <PlanItem title={'State'} value={planDetailsList?.organization?.state} />
                        <PlanItem title={'Postal code'} value={planDetailsList?.organization?.zip} />
                        <PlanItem title={'quantity'} value={planDetailsList?.organization?.quantity} />
                    </View>
                    <View style={{ backgroundColor: colors.purple_dim, margin: 20 }}>
                        <Text style={{ fontSize: 20, fontFamily: fonts.bold, color: colors.black, padding: 10 }}>Features</Text>
                        <PlanItem title={'Users'} value={planDetailsList?.organization?.amount === 1499900 ? '1-50' : '51-200'} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default CurrentPlan


