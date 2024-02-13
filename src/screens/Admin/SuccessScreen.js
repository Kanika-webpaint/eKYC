import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Button, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { back, close, profile, success } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import { getUsersListAction } from '../../redux/actions/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { fonts } from '../../common/fonts';
import { collection } from 'firebase/firestore';
import colors from '../../common/colors';
import RedButton from '../../components/RedButton';
import Status from '../../components/Status';
const SuccessScreen = () => {

    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()


    const onPressContinue = () => {
        navigation.navigate('LoginAdmin', { isOrgReg: true })
    }



    return (
        <SafeAreaView style={styles.safeArea}>
            <Status isLight />
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.mainView}>
                    <Image source={success} style={styles.succesImg} />
                    <Text style={styles.pay}>Payment Successful!</Text>
                    <Text style={styles.confirmText}>The payment of N1000 has successfully been done.</Text>
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
        justifyContent: 'center',
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
    }
});

export default SuccessScreen;