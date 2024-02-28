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
import Loader from '../../components/ActivityIndicator';
import Status from '../../components/Status';

function PlanDetails({ route }) {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

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
                    <Text style={styles.amount}>{'Pay ' + route?.params?.amount || ''}</Text>
                    <FlatList scrollEnabled={false} data={route?.params?.plan === 'Basic' ?
                        BasicPlanData : route?.params?.plan === 'Premium' ?
                            PreminumPlanData : EnterprisePlanData}
                        renderItem={(item) => renderPlanItem(item)}
                    />
                    <RedButton buttonContainerStyle={styles.buttonContainer} ButtonContent={isLoading ? <Loader /> : 'CHECKOUT'} contentStyle={styles.buttonText} onPress={() => NavigateToCheckout()} />
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
        fontSize: 22, // Adjusted font size
        fontFamily: fonts.bold,
        marginTop: '10%',
        marginBottom: '5%'
    },
    containerHeader: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.light_purple,
        paddingVertical: 20, // Adjusted padding
        paddingHorizontal: 10, // Adjusted padding
        alignItems: 'center',
        width: '100%',
    },
    backArrow: {
        height: 25,
        width: 25,
        marginRight: 10,
        marginLeft:10
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
        fontFamily: fonts.bold
    },
    imagePlanSelect: {
        height: 200, // Adjusted height
        width: 200, // Adjusted width
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    buttonContainer: {
        marginTop: '15%',
        marginBottom: '3%',
        backgroundColor: colors.app_red,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 30,
        width:'85%'
    },
    buttonText: {
        color: colors.white,
        fontSize: 18, // Adjusted font size
        alignSelf: 'center',
        fontFamily: fonts.bold
    },
    itemText: {
        color: colors.black,
        fontSize: 16, // Adjusted font size
        alignSelf: 'center',
        fontFamily: fonts.regular
    },
    itemImage: {
        height: 24, // Adjusted height
        width: 24, // Adjusted width
        resizeMode: 'contain',
        alignSelf: 'center',
        marginRight: 20
    },
    mainView: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.light_purple,
    }
});

export default PlanDetails;
