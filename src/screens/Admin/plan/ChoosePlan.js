import React, { useState } from 'react';
import { SafeAreaView, View, Image, Text, ScrollView, TouchableOpacity, Linking, KeyboardAvoidingView } from 'react-native';
import { checked, planIcon, unchecked } from '../../../common/images';
import { useNavigation } from '@react-navigation/native';
import { items } from '../../../common/PlansList';
import Status from '../../../components/Status';
import { styles } from './styles';
import Header from '../../../components/Header';

function ChoosePlan() {
    const [selectedItem, setSelectedItem] = useState();
    const [selectedEnterprise, setSelectEnterprise] = useState(false)
    const navigation = useNavigation();
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

    const handleSelection = (item) => {
        if (selectedItem?.id === item?.id) {
            if (item?.id === 1) {
                navigation.navigate('PlanDetails', { plan: 'Basic', amount: 'N14999' });
            } else {
                navigation.navigate('PlanDetails', { plan: 'Premium', amount: 'N13499' });
            }
        } else {
            if (item?.id === 1) {
                navigation.navigate('PlanDetails', { plan: 'Basic', amount: 'N14999' });
            } else {
                navigation.navigate('PlanDetails', { plan: 'Premium', amount: 'N13499' });
            }
        }
        setSelectedItem(item);
        if (item?.id === 1) {
            navigation.navigate('PlanDetails', { plan: 'Basic', amount: 'N14999' });
        } else {
            navigation.navigate('PlanDetails', { plan: 'Premium', amount: 'N13499' });
        }
    };


    const selectEnterprise = () => {
        Linking.openURL(`tel:+2348178888842`)
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={keyboardVerticalOffset}>
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <Status isLight />
                    <Header title={'Choose a Subscription Plan'} />
                    <View style={styles.mainView}>
                        <Text style={styles.midTitle}>Choose a subscription plan to unlock full access to the application's features.</Text>
                        <Image source={planIcon} style={styles.imagePlanSelect} />
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default ChoosePlan;
