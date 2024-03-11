import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Image,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from 'react-native';
import colors from '../../../common/colors';
import { back, check, phone, plan_select } from '../../../common/images';
import { useNavigation } from '@react-navigation/native';
import { BasicPlanData, EnterprisePlanData, PreminumPlanData } from '../../../common/PlansList';
import RedButton from '../../../components/RedButton';
import Loader from '../../../components/ActivityIndicator';
import Status from '../../../components/Status';
import { styles } from './styles';

function PlanDetails({ route }) {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [isPotrait, setIsPortrait] = useState(true)

    const renderPlanItem = (item) => {
        return (
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Image source={check} style={styles.itemImage} />
                <Text style={styles.itemText}>{item?.item?.listItem}</Text>
            </View>
        )
    }

    const NavigateToCheckout = () => {
        setIsLoading(true)
        setTimeout(() => {
            navigation.navigate('Checkout', { amount: route?.params?.amount || '' })
            setIsLoading(false)
        }, 1000)

    }


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

    return (
        <SafeAreaView style={styles.safeArea}>
            <Status isLight />
            <ScrollView style={{ backgroundColor: colors.light_purple }}>
                <View style={styles.containerHeader}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={back} style={styles.backArrow} />
                        </TouchableOpacity>
                        {route?.params?.plan === 'Basic' ?
                            <Text style={styles.title}>Basic Plan Details</Text>
                            : route?.params?.plan === 'Premium' ?
                                <Text style={styles.title}>Premium Plan Details</Text>
                                :
                                <Text style={styles.title}>Enterprise Plan Details</Text>
                        }
                    </View>
                </View>
                <View style={styles.mainView}>
                    <Image source={plan_select} style={styles.imagePlanSelect} />
                    <Text style={styles.amount}>{'Pay ' + route?.params?.amount === 'N14999' ? 'N14,999' : 'N13,499'}</Text>
                    <FlatList scrollEnabled={false} data={route?.params?.plan === 'Basic' ?
                        BasicPlanData : route?.params?.plan === 'Premium' ?
                            PreminumPlanData : EnterprisePlanData}
                        renderItem={(item) => renderPlanItem(item)}
                    />
                    <RedButton buttonContainerStyle={[styles.buttonContainer, { marginBottom: isPotrait ? '3%' : '5%' }]} ButtonContent={isLoading ? <Loader /> : 'CHECKOUT'} contentStyle={styles.buttonText} onPress={() => NavigateToCheckout()} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}



export default PlanDetails;
