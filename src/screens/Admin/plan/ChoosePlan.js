import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {checked, planIcon, unchecked} from '../../../common/images';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Status from '../../../components/Status';
import {styles} from './styles';
import Header from '../../../components/Header';
import axios from 'axios';
import Loader from '../../../components/ActivityIndicator';

function ChoosePlan() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedEnterprise, setSelectEnterprise] = useState(false);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

  const handleSelection = item => {
    // Navigate to 'PlanDetails' with the item details
    navigation.navigate('PlanDetails', {
      plan: item?.planType === 'basic' ? 'Basic' : 'Premium',
      amount: `N${item.price}`,
      planId: item?.planId,
      priceId: item?.priceId,
    });

    // Update the selected item
    setSelectedItem(item);
  };

  const selectEnterprise = () => {
    Linking.openURL('tel:+2348178888842');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const url = 'https://validifyx.com/node/api/get-plan';
        const response = await axios.get(url);

        if (response.status === 200) {
          const {plans} = response.data;

          if (Array.isArray(plans)) {
            setPlans(plans);
          } else {
            console.error(
              'Expected response.data.plans to be an array but received:',
              plans,
            );
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset the selectedItem when the screen is focused
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Reset selected item when the screen loses focus
        setSelectedItem(null);
      };
    }, []),
  );

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     // Reset selected item when the screen is focused
  //     setSelectedItem(null);
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={keyboardVerticalOffset}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Status isLight />
            <Header title={'Choose a Subscription Plan'} />
            <View style={styles.mainView}>
              <Text style={styles.midTitle}>
                Choose a subscription plan to unlock full access to the
                application's features.
              </Text>
              <Image source={planIcon} style={styles.imagePlanSelect} />
              <View style={styles.itemsContainer}>
                {plans.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.radioButton,
                      selectedItem?.id === item.id && styles.selectedItem,
                    ]}
                    onPress={() => handleSelection(item)}>
                    <Image
                      style={styles.selectedImg}
                      source={
                        selectedItem?.id === item.id ? checked : unchecked
                      }
                    />
                    <View style={styles.itemTextContainer}>
                      <Text style={styles.itemsLabel}>
                        {item.planType.charAt(0).toUpperCase() +
                          item.planType.slice(1)}
                      </Text>
                      <Text style={styles.itemsDescription}>
                        {item.numberOfUsers} users - ${item.price}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    selectedEnterprise && styles.selectedItem,
                  ]}
                  onPress={selectEnterprise}>
                  <Image
                    style={styles.selectedImg}
                    source={selectedEnterprise ? checked : unchecked}
                  />
                  <View style={styles.itemTextContainer}>
                    <Text style={styles.itemsLabel}>Enterprise</Text>
                    <Text style={styles.itemsDescription}>
                      Contact us for (200+) users
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

export default ChoosePlan;
