import React, { useState } from 'react';
import { SafeAreaView,  View, Image, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { back, checked, plan_select, unchecked } from '../../../common/images';
import { useNavigation } from '@react-navigation/native';
import { items } from '../../../common/PlansList';
import Status from '../../../components/Status';
import { styles } from './styles';


function ChoosePlan() {
    const [selectedItem, setSelectedItem] = useState();
    const [selectedEnterprise, setSelectEnterprise] = useState(false)
    const navigation = useNavigation();

    const handleSelection = (item) => {
        setSelectEnterprise(false)
        setSelectedItem(prevItem => prevItem?.id === item?.id ? null : item);
        if (item?.id === 1) {
            navigation.navigate('PlanDetails', { plan: 'Basic', amount: 'N14999' })
        } else {
            navigation.navigate('PlanDetails', { plan: 'Premium', amount: 'N13499' })
        }
    };

    const selectEnterprise = () => {
     Linking.openURL(`tel:+2348178888842`) // changed number with client number
    //  Linking.openURL(`tel:+234999990000`)
        // setSelectEnterprise(true)
        // setSelectedItem('')
        // navigation.navigate('ContactUs')
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



export default ChoosePlan;
