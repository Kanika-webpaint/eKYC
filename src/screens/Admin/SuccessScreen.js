import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Animated, Easing, Platform, Alert, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { success } from '../../common/images';
import { fonts } from '../../common/fonts';
import colors from '../../common/colors';
import RedButton from '../../components/RedButton';
import Loader from '../../components/ActivityIndicator';
import RNFS from 'react-native-fs';
import showAlert from '../../components/showAlert';

const SuccessScreen = ({ route }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [spinValue] = useState(new Animated.Value(0));
    const [invoiceShow, showInvoiceDetail] = useState(false);
    const onPressContinue = () => {
        navigation.navigate('LoginAdmin', { isOrgReg: true })
    }

    useEffect(() => {
        const animateSpin = Animated.timing(
            spinValue,
            {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        );

        animateSpin.start();

        return () => {
            // Clean up animation on unmount if necessary
            animateSpin.stop();
        };
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const downloadInvoice = async () => {
        setIsLoading(true);
        const invoiceContent = {
            planPrice: route?.params?.invoiceDetail?.planPrice,
            cardNumber: route?.params?.invoiceDetail?.cardNumber || '',
            email: route?.params?.invoiceDetail?.email,
            name: route?.params?.invoiceDetail?.name,
            address: route?.params?.invoiceDetail?.address,
            city: route?.params?.invoiceDetail?.city,
            state: route?.params?.invoiceDetail?.state
        };

        const csvContent = Object.keys(invoiceContent).map(key => `${key},${invoiceContent[key]}`).join('\n');
        const path = RNFS.DownloadDirectoryPath + '/invoiceee.txt';
        await RNFS.writeFile(path, csvContent, 'utf8');
        showAlert('Invoice Downloaded successfully!!');
        setTimeout(() => {
            setIsLoading(false);
            showInvoiceDetail(false);
        }, 1000)
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.mainView}>
                    <Animated.View
                        style={{
                            transform: [{ rotate: spin }]
                        }}
                    >
                        <Image
                            source={success} // Specify your image path here
                            style={styles.successImg} // Set width and height as per your image size
                        />
                    </Animated.View>
                    <Text style={styles.pay}>Payment Successful!</Text>
                    <Text style={styles.confirmText}>Thank you for your payment of N{route?.params?.purchasedPlanAmount}. Your transaction has been successfully processed.</Text>
                    <Text style={styles.confirmText}>Please proceed to sign in to access your account.</Text>
                    <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'CONTINUE'} contentStyle={styles.buttonText} onPress={() => onPressContinue()} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.light_purple,
    },
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '30%',
        paddingHorizontal: 20,
    },
    successImg: {
        height: 150,
        width: 150,
        resizeMode: 'contain',
    },
    pay: {
        fontSize: 25,
        fontFamily: fonts.bold,
        color: colors.black,
        marginTop: 30,
        textAlign: 'center',
    },
    confirmText: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: colors.grey,
        marginTop: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 50,
        backgroundColor: colors.app_red,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: '70%',
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.bold,
    },
});

export default SuccessScreen;
