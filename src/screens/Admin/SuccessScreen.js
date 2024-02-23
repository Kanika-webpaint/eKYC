import React, { useEffect, useState } from 'react';
import { View, TextInput, PermissionsAndroid, FlatList, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Button, Linking, Modal, ToastAndroid } from 'react-native';
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


    const onPressContinue = () => {
        navigation.navigate('LoginAdmin', { isOrgReg: true })
    }


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
                    <Image source={success} style={styles.succesImg} />
                    <Text style={styles.pay}>Payment Successful!</Text>
                    <Text style={styles.confirmText}>The payment of N1000 has successfully been done.</Text> 
                    {/* make the amount dynamic later */}
                    <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'CONTINUE'} contentStyle={styles.buttonText} onPress={() => onPressContinue()} />
                    {/* <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'INVOICE'} contentStyle={styles.buttonText} onPress={() => onPressInvoice()} /> */}
                </View>
                <View style={styles.container}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={invoiceShow}
                        onRequestClose={() => {
                            showInvoiceDetail(false);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.titleHead}>
                                    Invoice Detail
                                </Text>
                                <TouchableOpacity style={styles.closeImg} onPress={() => showInvoiceDetail(false)}>
                                    <Image style={{ height: 20, width: 20 }} source={close} />
                                </TouchableOpacity>
                                <View style={styles.viewMain}>
                                    <Text style={styles.amountPaid}>Amount</Text>
                                    <Text style={styles.pay}>{route?.params?.invoiceDetail?.planPrice || ''}</Text>
                                    <View style={styles.itemView}>
                                        <View style={{ flex: 0.5 }}>
                                            <Text>Name</Text>
                                            <Text>{route?.params?.invoiceDetail?.name || ''}</Text>
                                        </View>
                                        <View style={styles.viewItem}>
                                            <Text>email</Text>
                                            <Text>{route?.params?.invoiceDetail?.email || ''}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.midView}>
                                        <View style={{ flex: 0.5 }}>
                                            <Text>Card Number</Text>
                                            <Text>{route?.params?.invoiceDetail?.cardNumber || ''}</Text>
                                        </View>
                                        <View style={styles.viewItem}>
                                            <Text>Expiry Date</Text>
                                            <Text>{route?.params?.invoiceDetail?.expiryDate || ''}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.midView}>
                                        <View style={{ flex: 0.5 }}>
                                            <Text>Address</Text>
                                            <Text>{route?.params?.invoiceDetail?.address || ''}</Text>
                                        </View>
                                        <View style={styles.viewItem}>
                                            <Text>Country</Text>
                                            <Text>{route?.params?.invoiceDetail?.country || ''}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.midView}>
                                        <View style={{ flex: 0.5 }}>
                                            <Text>State</Text>
                                            <Text>{route?.params?.invoiceDetail?.state || ''}</Text>
                                        </View>
                                        <View style={styles.viewItem}>
                                            <Text>City</Text>
                                            <Text>{route?.params?.invoiceDetail?.city || ''}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.buttonContain} onPress={() => downloadInvoice()}>
                                        {isLoading ? <Loader /> :
                                            <>
                                                <Image source={download} style={{ height: 20, width: 20, marginRight: 10 }}></Image>
                                                <Text style={styles.buttonText}>{'INVOICE'}</Text>
                                            </>}

                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
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
    titleHead: {
        fontFamily: fonts.bold,
        color: colors.grey,
        fontSize: 20,
        marginTop: 20,
        marginLeft: 20
    },
    closeImg: {
        position: 'absolute',
        top: 20,
        right: 20
    },
    viewMain: {
        backgroundColor: colors.light_purple,
        height: 100,
        margin: 10,
        marginTop: 30
    },
    amountPaid: {
        alignSelf: 'center',
        margin: 5,
        fontFamily: fonts.bold,
        fontSize: 18
    },
    pay: {
        alignSelf: 'center',
        margin: 10,
        fontFamily: fonts.bold,
        fontSize: 25,
        color: colors.black
    },
    itemView: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    midView: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    viewItem: {
        marginLeft: 20,
        flex: 0.5
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        height: '80%',
        width: '90%',
        borderRadius: 10,
        elevation: 5,
    },
    container: {
        flex: 1,
    },
});

export default SuccessScreen;