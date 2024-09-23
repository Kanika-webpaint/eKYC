import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {check, planIcon} from '../../../common/images';
import {useNavigation} from '@react-navigation/native';
import {BasicPlanData, PreminumPlanData} from '../../../common/PlansList';
import RedButton from '../../../components/RedButton';
import Loader from '../../../components/ActivityIndicator';
import Status from '../../../components/Status';
import {styles} from './styles';
import Header from '../../../components/Header';

function PlanDetails({route}) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isPotrait, setIsPortrait] = useState(true);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

  useEffect(() => {
    const updateOrientation = () => {
      const {height, width} = Dimensions.get('window');
      setIsPortrait(height > width);
    };
    Dimensions.addEventListener('change', updateOrientation);
  }, []);

  useEffect(() => {
    const updateOrientation = () => {
      const {height, width} = Dimensions.get('window');
      setIsPortrait(height > width);
    };
    const unsubscribeFocus = navigation.addListener('focus', updateOrientation);
    return unsubscribeFocus;
  }, [navigation]);

  const renderPlanItem = item => {
    return (
      <View style={{flexDirection: 'row', marginTop: 20}}>
        <Image source={check} style={styles.itemImage} />
        <Text style={styles.itemText}>{item?.item?.listItem}</Text>
      </View>
    );
  };

  const NavigateToCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigation.navigate('Checkout', {
        amount: route?.params?.amount || '',
        planId: route?.params?.planId || '',
        priceId: route?.params?.priceId || '',
      });
      setIsLoading(false);
    }, 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <ScrollView
          style={{marginBottom: '10%'}}
          keyboardShouldPersistTaps="handled">
          <Status isLight />
          <Header
            title={
              route?.params?.plan === 'Basic'
                ? 'Basic Plan Details'
                : 'Premium Plan Details'
            }
          />
          <View style={styles.mainView}>
            <Image source={planIcon} style={styles.imagePlanSelect} />
            <Text style={styles.amount}>
              {route?.params?.amount}
              {/* {route?.params?.amount === 'N14999' ? 'N14,999' : 'N13,499'} */}
            </Text>
            <FlatList
              scrollEnabled={false}
              data={
                route?.params?.plan === 'Basic'
                  ? BasicPlanData
                  : PreminumPlanData
              }
              renderItem={item => renderPlanItem(item)}
            />
            <RedButton
              buttonContainerStyle={[
                styles.buttonContainer,
                {marginBottom: isPotrait ? '3%' : '5%'},
              ]}
              ButtonContent={isLoading ? <Loader /> : 'CHECKOUT'}
              contentStyle={styles.buttonText}
              onPress={() => NavigateToCheckout()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default PlanDetails;
