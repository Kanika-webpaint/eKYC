import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Animated, Easing, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { success } from '../../common/images';
import { fonts } from '../../common/fonts';
import colors from '../../common/colors';
import RedButton from '../../components/RedButton';
import Loader from '../../components/ActivityIndicator';


const SuccessScreen = ({ route }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [isPotrait, setIsPortrait] = useState(true)
    const [spinValue] = useState(new Animated.Value(0));
 

    const onPressContinue = () => {
        setIsLoading(true)
        setTimeout(() => {
            navigation.navigate('LoginAdmin', { isOrgReg: true })
            setIsLoading(false)
        }, 500);
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

    useEffect(() => {
        const updateOrientation = () => {
            const { height, width } = Dimensions.get('window');
            setIsPortrait(height > width);
        };
        Dimensions.addEventListener('change', updateOrientation);
        // Return a cleanup function
        // return () => {
        //     Dimensions?.removeEventListener('change', updateOrientation);
        // };
    }, []);

    useEffect(() => {
        const updateOrientation = () => {
            const { height, width } = Dimensions.get('window');
            setIsPortrait(height > width);
        };
        // Add event listener when the screen focuses
        const unsubscribeFocus = navigation.addListener('focus', updateOrientation);
        // Remove event listener when the screen unfocuses
        return unsubscribeFocus;
    }, [navigation]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={[styles.mainView, { marginTop: isPotrait ? '30%' : '5%' }]}>
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
                    <RedButton buttonContainerStyle={[styles.buttonContainer, { marginBottom: isPotrait ? 0 : 20 }]} ButtonContent={isLoading ? <Loader /> : 'CONTINUE'} contentStyle={styles.buttonText} onPress={() => onPressContinue()} />
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
