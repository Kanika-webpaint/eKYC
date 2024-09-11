import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import colors from '../../../common/colors';
import {
  iconPlanGrey,
  iconPlanWhite,
  iconUsersGrey,
  iconUsersWhite,
  logoValidyfy,
  logout,
  planIcon,
  profileGrey,
  userRed,
  usersIcon,
} from '../../../common/images';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fonts} from '../../../common/fonts';
import Status from '../../../components/Status';
import showAlert from '../../../components/showAlert';
import {styles} from './styles';
import {
  getOrgDetailsAction,
  getUsersListAction,
} from '../../../redux/actions/Organization/organizationActions';
import {loginAdminslice} from '../../../redux/slices/organization/organizationSlice';

function DashboardAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const OrganizationHomeList = useSelector(state => state?.org?.orgDetails);
  const usersListing = useSelector(state => state?.org?.getUsersList);
  const [activeTab, setActiveTab] = useState(1);
  const [activeBottomTab, setActiveBottomTab] = useState(1);
  const [orgDetails, setOrgDetails] = useState(null);
  const [currentDate, setCurrentDateAndDay] = useState(null);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
  const usersList = useSelector(state => state?.org?.getUsersList);
  const [enableScrollViewScroll, setEnableScrollViewScroll] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgDetailsData = await getOrgDetails();
        setOrgDetails(orgDetailsData);
        console.log(orgDetailsData, '==========');
        const currentDateAndDayData = await getCurrentDateAndDay();
        setCurrentDateAndDay(currentDateAndDayData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then(value => {
        if (value) {
          console.log(value, '89898989');
          dispatch(getUsersListAction(value, setIsLoading));
        }
      })
      .then(res => {
        console.log(res, '99999999999999');
      });
  }, [dispatch, setIsLoading]);

  const getOrgDetails = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        dispatch(getOrgDetailsAction(storedToken, setIsLoading));
      } else {
        // Handle case where token is not found
      }
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
    }
  }, [dispatch, setIsLoading]);

  const getCurrentDateAndDay = () => {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const currentDate = new Date();
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const month = months[currentDate.getMonth()];
    const dayOfMonth = currentDate.getDate();

    return `${dayOfWeek}, ${month} ${dayOfMonth}`;
  };

  const logoutAccount = useCallback(async () => {
    await AsyncStorage.clear();
    dispatch(loginAdminslice(false));
    showAlert('Logout successfully!');
  }, [dispatch]);

  const navigateToViewProfile = item => {
    navigation.navigate('UserProfile', {id: item?.id});
  };

  const renderItemmUnVerified = item => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 10,
          marginTop: 10,
        }}
        onPress={() => navigateToViewProfile(item)}>
        <Image source={profileGrey} style={styles.image} />
        <Text
          style={{
            color: colors.black,
            fontSize: 15,
            fontFamily: fonts.regular,
          }}>
          {item?.username}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItemmVerified = item => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 10,
          marginTop: 10,
        }}
        onPress={() => navigateToViewProfile(item)}>
        <Image source={profileGrey} style={styles.image} />
        <Text
          style={{
            color: colors.black,
            fontSize: 15,
            fontFamily: fonts.regular,
          }}>
          {item?.username}
        </Text>
      </TouchableOpacity>
    );
  };

  const currentDateAndDay = getCurrentDateAndDay();
  const handleTabPressOnBottomTab = tabNumber => {
    setActiveBottomTab(tabNumber);
    if (tabNumber === 1) {
      navigation.navigate('UsersList');
    } else {
      navigation.navigate('CurrentPlan');
    }
  };

  const verifiedData = usersList.filter(item => item?.isVerified == 1);
  const unverifiedData = usersList.filter(
    item => item?.isVerified === null || item?.isVerified == 0,
  );

  const renderItem = ({item}) => {
    if (item.isVerified) {
      return renderItemmVerified(item);
    } else {
      return renderItemmUnVerified(item);
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('Settings');
  };

  const onStartShouldSetResponderCapture = () => {
    setEnableScrollViewScroll(false);
    // Check conditions and update enableScrollViewScroll if needed
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <Status />
        <ScrollView scrollEnabled={enableScrollViewScroll}>
          <View style={styles.insideView}>
            <Image source={logoValidyfy} style={styles.logo}></Image>
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={styles.org}>
                  {'Hi,' +
                    ' ' +
                    OrganizationHomeList?.organization?.name.replace(
                      /[""]/g,
                      '',
                    )}
                </Text>
                <Text style={styles.detailText}>Have A Nice Day</Text>
                <Text style={styles.dateStyle}>{currentDateAndDay}</Text>
              </View>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.white,
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                }}
                onPress={() => navigateToProfile()}>
                <Image
                  source={userRed}
                  style={{
                    height: 22,
                    width: 22,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                  }}></Image>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.itemsUsersPlan}>
            <View style={styles.insideUserPlan}>
              <View style={styles.UserTabTop}>
                <Image source={usersIcon} style={styles.itemImageUserPlan} />
                <Text style={styles.count}>{usersListing?.length || 0}</Text>
                <Text style={styles.textItemUserPlan}>Total users</Text>
              </View>
              <View style={styles.UserTabTop}>
                <Image source={planIcon} style={styles.itemImageUserPlan} />
                <Text style={styles.count}>
                  {OrganizationHomeList?.organization?.amount === 1499900
                    ? 'Basic'
                    : 'Premium'}{' '}
                </Text>
                <Text style={styles.textItemUserPlan}>Current Plan</Text>
              </View>
            </View>
            <View style={styles.middleView}>
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  alignSelf: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor:
                    activeTab === 1 ? colors.app_red : colors.grey,
                  borderRadius: 5,
                  height: 40,
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  marginRight: 20,
                }}
                onPress={() => setActiveTab(1)}>
                <Text style={styles.verifyText}>
                  Verified users (
                  {verifiedData?.length > 0 ? verifiedData?.length : 0})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  alignSelf: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor:
                    activeTab === 2 ? colors.app_red : colors.grey,
                  borderRadius: 5,
                  height: 40,
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
                onPress={() => setActiveTab(2)}>
                <Text style={styles.verifyText}>
                  Unverified users (
                  {unverifiedData?.length > 0 ? unverifiedData?.length : 0})
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{flex: 1}}
              onStartShouldSetResponderCapture={
                onStartShouldSetResponderCapture
              }>
              {activeTab === 1 && (
                <>
                  {usersList &&
                  usersList?.length > 0 &&
                  verifiedData?.length > 0 ? (
                    <FlatList
                      maxHeight={250}
                      marginBottom={30}
                      nestedScrollEnabled
                      data={usersList.filter(item => item?.isVerified == 1)}
                      renderItem={renderItem}
                      keyExtractor={item => item.id.toString()}
                      getItemLayout={(data, index) => ({
                        length: 50,
                        offset: 50 * index,
                        index,
                      })}
                    />
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <Text style={{alignSelf: 'center'}}>No users found</Text>
                    </View>
                  )}
                </>
              )}

              {activeTab === 2 && (
                <>
                  {usersList &&
                  usersList.length > 0 &&
                  unverifiedData?.length > 0 ? (
                    <FlatList
                      maxHeight={250}
                      marginBottom={30}
                      nestedScrollEnabled
                      data={usersList.filter(
                        item =>
                          item?.isVerified == null || item?.isVerified == 0,
                      )}
                      renderItem={renderItem}
                      keyExtractor={item => item.id.toString()}
                      getItemLayout={(data, index) => ({
                        length: 50,
                        offset: 50 * index,
                        index,
                      })}
                    />
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <Text style={{alignSelf: 'center'}}>No users found</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </ScrollView>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleTabPressOnBottomTab(1)}>
            {activeBottomTab === 1 ? (
              <Image source={iconUsersWhite} style={styles.bottomTabImg} />
            ) : (
              <Image source={iconUsersGrey} style={styles.bottomTabImg} />
            )}
            <Text style={styles.bottomTabText}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleTabPressOnBottomTab(2)}>
            {activeBottomTab === 2 ? (
              <Image source={iconPlanWhite} style={styles.bottomTabImg} />
            ) : (
              <Image source={iconPlanGrey} style={styles.bottomTabImg} />
            )}
            <Text style={styles.bottomTabText}>My plan</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default DashboardAdmin;
