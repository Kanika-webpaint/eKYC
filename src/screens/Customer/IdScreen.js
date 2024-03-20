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
    Text,
    ScrollView,
    Dimensions,
    Alert
} from 'react-native';
import colors from '../../common/colors';
import RedButton from '../../components/RedButton';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../components/Logo';
import { fonts } from '../../common/fonts';
import Status from '../../components/Status';
import { Inquiry, Environment } from 'react-native-persona';
import Loader from '../../components/ActivityIndicator';

function IdScreen({ route }) {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const { height: screenHeight } = Dimensions.get('window');


    const onPressStarted = () => {
        setIsLoading(true)
        // navigation.navigate('HomeUser')
        setTimeout(() => onPressGo(), 1000)
    }

    const onPressGo = () => {
        setIsLoading(false)
        Inquiry.fromTemplate('itmpl_aVn4hm3cuJMR1HeY6rHUXUbdvJrD')
            .environment(Environment.SANDBOX)
            .onComplete((inquiryId, status, fields) =>
                Alert.alert(
                    'Complete',
                    `Inquiry ${inquiryId} completed with status "${status}."`,
                ),
            )
            .onCanceled((inquiryId, sessionToken) =>
                Alert.alert('Canceled', `Inquiry ${inquiryId} was cancelled`),
            )
            .onError(error => Alert.alert('Error', error.message))
            .build()
            .start();
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Status lightContent />
            <ScrollView keyboardShouldPersistTaps='handled'>
                <Logo styleContainer={{ marginTop: 50 }} fingerPrintStyle={styles.fingerPrint}
                    logoStyle={styles.logo} />
                <View style={[styles.mainView, { height: screenHeight * 0.5 }]}>
                    <Text style={styles.textVerify}>Identity {'\n'}Verification Made {'\n'}Simple</Text>
                    <Text style={styles.middleText}>Validyfy offers digital verification,{'\n'}services, enabling businesses{'\n'}to transact with customers in a{'\n'}convient and secure way.</Text>
                </View>
                <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : "Let's get started ->"} contentStyle={styles.buttonText} onPress={() => onPressStarted()} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.app_blue
    },
    mainView: {
        backgroundColor: colors.light_purple,
        margin: 30,
        marginTop: '10%',
        justifyContent: 'center',
        padding: 30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    middleText: {
        marginTop: 30,
        fontSize: 15,
        fontFamily: fonts.regular,
        color: colors.grey
    },
    textVerify: {
        marginTop: 30,
        fontSize: 30,
        fontFamily: fonts.bold,
        color: colors.black
    },
    buttonContainer: {
        marginTop: '5%',
        backgroundColor: colors.app_red,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 30,
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        alignSelf: 'center',
        fontFamily: fonts.medium
    },
    logo: {
        height: 40,
        width: '50%',
        marginLeft: '22%'
    },
    fingerPrint: {
        position: 'absolute',
        height: 50,
        width: 50,
        marginLeft: 60
    }
});

export default IdScreen;

