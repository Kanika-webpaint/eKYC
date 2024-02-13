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
    Image,
    Text,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
} from 'react-native';
import colors from '../../common/colors';
import { back, checked, plan_select, unchecked } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import { items } from '../../common/PlansList';
import { fonts } from '../../common/fonts';
import Status from '../../components/Status';

function ChoosePlan() {
    const [selectedItem, setSelectedItem] = useState(items[0]);
    const navigation = useNavigation();
    const [selectedEnterprise, setSelectEnterprise] = useState(false)

    const showAlert = (message) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            AlertIOS.alert(message);
        }
    };

    const handleSelection = (item) => {
        setSelectEnterprise(false)
        setSelectedItem(item?.id === selectedItem?.id ? null : item);
        if (item?.id === 1) {
            navigation.navigate('PlanDetails', { plan: 'Basic', amount: 'N1500' })
        } else {
            navigation.navigate('PlanDetails', { plan: 'Premium', amount: 'N1000' })
        }
    };

    const selectEnterprise = () => {
        setSelectEnterprise(true)
        setSelectedItem('')
        showAlert('We have recieved your request.Kindly check your mail.')
        // call API here
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Status isLight />
            <ScrollView>
                <View style={styles.containerHeader}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={back} style={styles.backArrow} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Choose Your Plan</Text>
                    </View>
                </View>
                <View style={styles.mainView}>
                    <Text style={styles.midTitle}>Select a subscription plan to unlock the{'\n'}functionality of the application.</Text>
                    <Image source={plan_select} style={styles.imagePlanSelect} />
                    <View style={{ marginTop: 35 }}>
                        {items?.map((item) => (
                            <View style={styles.itemsView}>
                                <TouchableOpacity
                                    key={item?.id}
                                    style={styles.radioButton}
                                    onPress={() => handleSelection(item)}
                                >
                                    {selectedItem?.id === item?.id ? <Image style={styles.selectedImg} source={checked} /> : <Image style={styles.selectedImg} source={unchecked} />}
                                    <View style={{ flexDirection: 'column', marginTop: -8 }}>
                                        <Text style={styles.itemsLabel}>{item?.label}</Text>
                                        <Text style={styles.itemsDescription}>{item?.description}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <View style={styles.itemsView}>
                            <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => selectEnterprise()}
                            >
                                {selectedEnterprise ? <Image style={styles.selectedImg} source={checked} /> : <Image style={styles.selectedImg} source={unchecked} />}
                                <View style={{ flexDirection: 'column', marginTop: -8 }}>
                                    <Text style={styles.itemsLabel}>{'Enterprise'}</Text>
                                    <Text style={styles.itemsDescription}>{'200+ contact us'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        marginTop: 30,
    },
    radioButton: {
        flexDirection: 'row',
        padding: 15
    },
    containerHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.light_purple,
        padding: 20,
        alignItems: 'center', // Vertical alignment
        width: '100%', // Take full width of the screen
    },
    backArrow: {
        height: 25,
        width: 25,
        marginRight: 10, // Add some space between back arrow and text
    },
    title: {
        flex: 1, // Allow text to take remaining space
        textAlign: 'center', // Center the text horizontally
        fontSize: 20,
        color: 'black', // Assuming text color
        fontFamily: fonts.bold
    },
    imagePlanSelect: {
        height: 150,
        width: 150,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    itemsView: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: colors.white,
        width: 350,
        borderRadius: 5,
        height: 100,
        marginBottom: 20,
        justifyContent: 'center',
    },
    midTitle: {
        color: colors.grey,
        fontSize: 17,
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: fonts.regular
    },
    itemsDescription: {
        color: colors.grey,
        fontSize: 14,
        marginLeft: 10,
        fontFamily: fonts.medium
    },
    itemsLabel: {
        fontSize: 16,
        color: colors.black,
        marginLeft: 10,
        fontFamily: fonts.bold
    },
    selectedImg: {
        resizeMode: 'contain',
        height: 25,
        width: 25,
        marginRight: 10
    },
    mainView: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.light_purple,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }
});

export default ChoosePlan;


