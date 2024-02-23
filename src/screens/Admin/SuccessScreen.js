import React, { useEffect, useState } from 'react';
import { View, TextInput, PermissionsAndroid, FlatList, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Button, Linking, Modal, ToastAndroid, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { back, close, download, profile, success } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import { getUsersListAction } from '../../redux/actions/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { fonts } from '../../common/fonts';
import { collection } from 'firebase/firestore';
import colors from '../../common/colors';
import RedButton from '../../components/RedButton';
import Status from '../../components/Status';
import RNFS from 'react-native-fs';
import Loader from '../../components/ActivityIndicator';

const SuccessScreen = ({ route }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [invoiceShow, showInvoiceDetail] = useState(false);
    const dispatch = useDispatch()
    const [spinValue] = useState(new Animated.Value(0));

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

    const onPressInvoice = () => {
        showInvoiceDetail(true)
    }
    const showAlert = (message) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            AlertIOS.alert(message);
        }
    };


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
            <Status isLight />
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.mainView}>
                    <Animated.View
                        style={{
                            transform: [{ rotate: spin }]
                        }}
                    >
                        <Image
                            source={success} // Specify your image path here
                            style={styles.succesImg} // Set width and height as per your image size
                        />
                    </Animated.View>
                    {/* <Image source={success} style={styles.succesImg} /> */}
                    <Text style={styles.pay}>Payment Successful!</Text>
                    <Text style={styles.confirmText}>The payment of N1000 has successfully been done.</Text>
                    {/* make the amount dynamic later */}
                    <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'CONTINUE'} contentStyle={styles.buttonText} onPress={() => onPressContinue()} />
                    {/* <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'INVOICE'} contentStyle={styles.buttonText} onPress={() => onPressInvoice()} /> */}
                </View>
            
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.light_purple,
        justifyContent: 'center',
    },
    pay: {
        alignSelf: 'center',
        margin: 10,
        fontFamily: fonts.bold,
        fontSize: 25,
        color: colors.black
    },
    succesImg: {
        height: 150,
        width: 150,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    pay: {
        fontSize: 25,
        fontFamily: fonts.bold,
        alignSelf: 'center',
        color: colors.black,
        marginTop: 30
    },
    confirmText: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: colors.grey,
        marginTop: 20
    },
    buttonContainer: {
        marginTop: 50,
        backgroundColor: colors.app_red,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: '70%',
    },
    buttonContain: {
        marginTop: '10%',
        flexDirection: 'row',
        backgroundColor: colors.app_red,
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        alignSelf: 'center',
        fontFamily: fonts.bold
    },
    mainView: {
        margin: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '30%'
    },
    container: {
        flex: 1,
    },
});

export default SuccessScreen;