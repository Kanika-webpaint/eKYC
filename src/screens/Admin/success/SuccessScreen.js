import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Animated, Easing, Dimensions, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { success } from '../../../common/images';
import RedButton from '../../../components/RedButton';
import Loader from '../../../components/ActivityIndicator';
import { styles } from './styles';
import showAlert from '../../../components/showAlert';


const SuccessScreen = ({ route }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [isPotrait, setIsPortrait] = useState(true)
    const [spinValue] = useState(new Animated.Value(0));

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => {
            backHandler.remove()
        }
    }, [])

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
                    <Text style={styles.pay}>Payment Successfully Processed!!</Text>
                    <Text style={styles.confirmText}>We appreciate your payment. Your transaction has been completed successfully.</Text>
                    <Text style={styles.confirmText}>Kindly proceed to sign in to access your account.</Text>
                    <RedButton buttonContainerStyle={[styles.buttonContainer, { marginBottom: isPotrait ? 0 : 20 }]} ButtonContent={isLoading ? <Loader /> : 'CONTINUE'} contentStyle={styles.buttonText} onPress={() => onPressContinue()} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


export default SuccessScreen;
