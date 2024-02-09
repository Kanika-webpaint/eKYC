/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    Text,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import colors from '../../common/colors';
import { back, check, phone, plan_select } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import { BasicPlanData, EnterprisePlanData, PreminumPlanData } from '../../common/PlansList';
import RedButton from '../../components/RedButton';
import { fonts } from '../../common/fonts';

function PlanDetails({ route }) {
    const navigation = useNavigation();
    const renderPlanItem = (item) => {
        return (
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Image source={check} style={styles.itemImage} />
                <Text style={styles.itemText}>{item?.item?.listItem}</Text>
            </View>
        )
    }

    const NavigateToCheckout = () => {
        navigation.navigate('Checkout', { amount: route?.params?.amount || '' })
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={{ backgroundColor: colors.light_purple }}>
                <View style={styles.containerHeader}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={back} style={styles.backArrow} />
                        </TouchableOpacity>
                        {route?.params?.plan === 'Basic' ?
                            <Text style={styles.title}>Basic Plan details</Text>
                            : route?.params?.plan === 'Premium' ?
                                <Text style={styles.title}>Premium Plan details</Text>
                                :
                                <Text style={styles.title}>Enterprise Plan details</Text>
                        }
                    </View>
                </View>
                <View style={styles.mainView}>
                    <Image source={plan_select} style={styles.imagePlanSelect} />
                    <Text style={styles.amount}>{route?.params?.amount + " / " + 'verification' || ''}</Text>
                    <FlatList data={route?.params?.plan === 'Basic' ?
                        BasicPlanData : route?.params?.plan === 'Premium' ?
                            PreminumPlanData : EnterprisePlanData}
                        renderItem={(item) => renderPlanItem(item)}
                    />
                    <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={'CHECKOUT'} contentStyle={styles.buttonText} onPress={() => NavigateToCheckout()} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    amount: {
        color: colors.app_red,
        fontSize: 25,
        fontFamily:fonts.bold,
        marginTop: '20%',
        marginBottom: '5%'
    },
    containerHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.light_purple,
        padding: 20,
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
        color: 'black', // Assuming text color
        fontFamily:fonts.bold
    },
    imagePlanSelect: {
        height: 150,
        width: 150,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    buttonContainer: {
        marginTop: '30%',
        backgroundColor: colors.app_red,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        width: '80%',
        height: 50
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        alignSelf: 'center',
        fontFamily:fonts.bold
    },
    itemText: {
        color: colors.black,
        fontSize: 18,
        alignSelf: 'center',
        fontFamily:fonts.regular
    },
    itemImage: {
        height: 22,
        width: 22,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginRight: 20
    },
    mainView: {
        flex: 1,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.light_purple,
    }
});

export default PlanDetails;


