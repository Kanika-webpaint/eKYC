import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, Platform, } from 'react-native';
import colors from '../../common/colors';
import { back, checked, plan_select, unchecked } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import { items } from '../../common/PlansList';
import { fonts } from '../../common/fonts';
import Status from '../../components/Status';


function ChoosePlan() {
    const [selectedItem, setSelectedItem] = useState();
    const [selectedEnterprise, setSelectEnterprise] = useState(false)
    const navigation = useNavigation();

    const handleSelection = (item) => {
        setSelectEnterprise(false)
        setSelectedItem(prevItem => prevItem?.id === item?.id ? null : item);
        if (item?.id === 1) {
            navigation.navigate('PlanDetails', { plan: 'Basic', amount: 'N4999' })
        } else {
            navigation.navigate('PlanDetails', { plan: 'Premium', amount: 'N4499' })
        }
    };

    const selectEnterprise = () => {
        setSelectEnterprise(true)
        setSelectedItem('')
        navigation.navigate('ContactUs')
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Status isLight />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.containerHeader}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={back} style={styles.backArrow} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Choose a Subscription Plan</Text>
                    </View>
                </View>
                <View style={styles.mainView}>
                    <Text style={styles.midTitle}>Choose a subscription plan to unlock full access to the application's features.</Text>
                    <Image source={plan_select} style={styles.imagePlanSelect} />
                    <View style={styles.itemsContainer}>
                        {items?.map((item) => (
                            <TouchableOpacity
                                key={item?.id}
                                style={[styles.radioButton, selectedItem?.id === item?.id && styles.selectedItem]}
                                onPress={() => handleSelection(item)}
                            >
                                <Image style={styles.selectedImg} source={selectedItem?.id === item?.id ? checked : unchecked} />
                                <View style={styles.itemTextContainer}>
                                    <Text style={styles.itemsLabel}>{item?.label}</Text>
                                    <Text style={styles.itemsDescription}>{item?.description}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[styles.radioButton, selectedEnterprise && styles.selectedItem]}
                            onPress={() => selectEnterprise()}
                        >
                            <Image style={styles.selectedImg} source={selectedEnterprise ? checked : unchecked} />
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemsLabel}>Enterprise</Text>
                                <Text style={styles.itemsDescription}>Contact us for (200+) users</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.light_purple
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    containerHeader: {
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.light_purple,
        padding: 20,
        alignItems: 'center',
    },
    backArrow: {
        height: 25,
        width: 25,
        marginRight: 10,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
        fontFamily: fonts.bold
    },
    mainView: {
        flex: 1,
        padding: 10,
        marginVertical: 30,
        alignItems: 'center',
        backgroundColor: colors.light_purple,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    midTitle: {
        color: colors.grey,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 0, // Adjusted marginTop to 0
        fontFamily: fonts.regular
    },
    imagePlanSelect: {
        height: 150,
        width: 150,
        alignSelf: 'center',
        resizeMode: 'contain',
        marginBottom: 25,
    },
    itemsContainer: {
        width: '100%',
        alignItems: 'center',
    },
    radioButton: {
        flexDirection: 'row',
        padding: 15,
        width: '95%',
        backgroundColor: colors.white,
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    selectedItem: {
        backgroundColor: colors.white, // Changed background color for selected item
        opacity: 0.8, // Added opacity
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    selectedImg: {
        resizeMode: 'contain',
        height: 25,
        width: 25,
        marginRight: 10
    },
    itemTextContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    itemsLabel: {
        fontSize: 16,
        color: colors.black,
        fontFamily: fonts.bold,
    },
    itemsDescription: {
        fontSize: 14,
        color: colors.grey,
        fontFamily: fonts.medium,
        marginTop: 5,
    },
});

export default ChoosePlan;
