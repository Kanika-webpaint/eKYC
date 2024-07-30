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
    const planDetailsList = useSelector((state) => state?.org?.orgDetails)

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={keyboardVerticalOffset}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <Status isLight />
                    <Header title={'My Plan'} />
                    <View style={{ borderWidth: 0.3, borderColor: colors.light_grey }}></View>
                    <View style={{ backgroundColor: colors.purple_dim, margin: 20 }}>
                        <Text style={{ fontSize: 20, fontFamily: fonts.bold, color: colors.black, padding: 10 }}>Plan Details</Text>
                        <PlanItem title={'Current Plan'} value={planDetailsList?.organization?.amount === 1499900 ? 'Basic' : 'Premium'} />
                        <PlanItem title={'Billing Email'} value={planDetailsList?.organization?.email} />
                        <PlanItem title={'Plan Status'} value={planDetailsList?.organization?.planStatus == 1 ? 'Active' : 'Inactive'} styleText={{ backgroundColor: planDetailsList?.organization?.planStatus == 1 ? colors.green : 'red', borderRadius: 10, overflow: 'hidden',paddingLeft: 6,padding:4, color: colors.white }} />
                        <PlanItem title={'Currency'} value={planDetailsList?.organization?.currency} />
                        <PlanItem title={'Price'} value={planDetailsList?.organization?.amount.toString().slice(0, -2) + '.' + planDetailsList?.organization?.amount?.toString().slice(-2).padEnd(2, '0')} />
                        <PlanItem title={'Billing period'} value={planDetailsList?.organization?.planInterval} />
                        <PlanItem title={'Description'} value={planDetailsList?.organization?.planDescription} />
                        <PlanItem title={'Users'} value={planDetailsList?.organization?.amount === 1499900 ? '1-50' : '51-200'} />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default CurrentPlan


