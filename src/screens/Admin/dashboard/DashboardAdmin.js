import { SafeAreaView, View, Image, Text, ScrollView, TouchableOpacity, FlatList, KeyboardAvoidingView } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import colors from '../../../common/colors';
import { iconPlanGrey, iconPlanWhite, iconUsersGrey, iconUsersWhite, logoValidyfy, logout, planIcon, profileGrey, usersIcon, } from '../../../common/images';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getOrgDetailsAction, getUsersListAction, getVerifiedUserAction } from '../../../redux/actions/user';
import Loader from '../../../components/ActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fonts } from '../../../common/fonts';
import Status from '../../../components/Status';
import { loginAdminslice } from '../../../redux/slices/user';
import showAlert from '../../../components/showAlert';
import { styles } from './styles';
import { items } from '../../../common/PlansList';

function DashboardAdmin() {
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const OrganizationHomeList = useSelector((state) => state?.login?.orgDetails);
    const usersListing = useSelector((state) => state?.login?.getUsersList)
    const [activeTab, setActiveTab] = useState(1);
    const [activeBottomTab, setActiveBottomTab] = useState(1);
    const [orgDetails, setOrgDetails] = useState(null);
    const [currentDate, setCurrentDateAndDay] = useState(null);
    const [verifiedUsers, setVerifiedUsers] = useState(null);
    const verifiedUsersList = useSelector((state) => state?.login?.verifiedDataListDashboard)
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

    const dataForTab2 = [
        { id: 1, title: 'Abrahim', status: 'completed' },
        { id: 2, title: 'Major', status: 'completed' },
        { id: 3, title: 'Shivani', status: 'incomplete' },
        { id: 4, title: 'Kanika', status: 'incomplete' },
        { id: 5, title: 'Tanvi', status: 'incomplete' },
        { id: 6, title: 'Narvinder', status: 'completed' },
    ];


    useEffect(() => {
        AsyncStorage.getItem("token").then((value) => {
            if (value) {
                dispatch(getUsersListAction(value, setIsLoading))
            }
        })
            .then(res => {
                //do something else
            });
    }, [dispatch]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const orgDetailsData = await getOrgDetails();
                setOrgDetails(orgDetailsData);

                const currentDateAndDayData = await getCurrentDateAndDay();
                setCurrentDateAndDay(currentDateAndDayData);

                const verifiedUsersData = await getVerifiedUsers();
                setVerifiedUsers(verifiedUsersData);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error appropriately, e.g., set state to indicate error
            }
        };

        fetchData();
    }, []);



    useEffect(() => {
        AsyncStorage.getItem("token").then((value) => {
            if (value) {
                dispatch(getUsersListAction(value, setIsLoading))   // TO GET USERS LIST COUNT
            }
        })
            .then(res => {
                //do something else
            });
    }, [dispatch]);


    const getOrgDetails = useCallback(async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                dispatch(getOrgDetailsAction(storedToken, setIsLoading));   // TO GET ORGANIZATION NAME
            } else {
                // Handle case where token is not found
            }
        } catch (error) {
            console.error('Error retrieving token from AsyncStorage:', error);
            // Handle error
        }
    }, [dispatch, setIsLoading]);

    const getVerifiedUsers = useCallback(async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                dispatch(getVerifiedUserAction(storedToken, setIsLoading));   // TO GET ORGANIZATION NAME
            } else {
                // Handle case where token is not found
            }
        } catch (error) {
            console.error('Error retrieving token from AsyncStorage:', error);
            // Handle error
        }
    }, [dispatch, setIsLoading]);


    const getCurrentDateAndDay = () => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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



    const renderItemmUnVerified = (item) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: 10 }}>
                <Image
                    source={profileGrey}
                    style={styles.image}
                />
                <Text style={{ color: colors.black, fontSize: 15, fontFamily: fonts.regular }}>{item?.item?.username}</Text>
            </View>
        );
    };


    // const renderItemm = ({ item }) => (
    //     console.log(item,"item heereeee")
    //     <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: 10 }}>
    //         <Image
    //             source={profileGrey}
    //             style={styles.image}
    //         />
    //         <Text style={{ color: colors.black, fontSize: 15, fontFamily: fonts.regular }}>{item.title}</Text>
    //     </View>
    // );



    const renderItemmVerified = (item) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: 10 }}>
                <Image
                    source={profileGrey}
                    style={styles.image}
                />
                <Text style={{ color: colors.black, fontSize: 15, fontFamily: fonts.regular }}>{item?.item?.nameFirst + item?.item?.nameLast}</Text>
            </View>
        );
    };


    const currentDateAndDay = getCurrentDateAndDay();
    const handleTabPressOnBottomTab = (tabNumber) => {
        setActiveBottomTab(tabNumber);
        if (tabNumber === 1) {
            navigation.navigate('UsersList')
        } else {
            navigation.navigate('CurrentPlan')
        }
    };

    // const filtertedData = usersListing?.filter(item => item.status === 'completed')
    // console.log(filtertedData, "filtered dataaa")

    const completedData = dataForTab2.filter(item => item.status === 'completed');

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={keyboardVerticalOffset}>
                {/* <ScrollView keyboardShouldPersistTaps='handled'> */}
                <Status />
                <View style={styles.insideView}>
                    <Image source={logoValidyfy} style={styles.logo}></Image>
                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={styles.org}>{"Hi," + " " + OrganizationHomeList?.organization?.name.replace(/[""]/g, '')}</Text>
                            <Text style={styles.detailText}>Have A Nice Day</Text>
                            <Text style={styles.dateStyle}>{currentDateAndDay}</Text>
                        </View>
                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => logoutAccount()}>
                            <Image source={logout} style={{ height: 25, width: 25, alignSelf: 'center' }}></Image>
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
                            <Text style={styles.count}>Basic </Text>
                            <Text style={styles.textItemUserPlan}>Current Plan</Text>
                        </View>
                    </View>
                    <View style={styles.middleView}>
                        <TouchableOpacity
                            style={{ flex: 0.5, alignSelf: 'center', borderBottomWidth: 1, borderBottomColor: activeTab === 1 ? colors.app_red : colors.grey, borderRadius: 5, height: 40, justifyContent: 'space-evenly', alignItems: 'center', marginRight: 20 }}
                            onPress={() => setActiveTab(1)}
                        >
                            <Text style={styles.verifyText}>Verified users ({verifiedUsersList?.documentUsers?.length})</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 0.5, alignSelf: 'center', borderBottomWidth: 1, borderBottomColor: activeTab === 2 ? colors.app_red : colors.grey, borderRadius: 5, height: 40, justifyContent: 'space-evenly', alignItems: 'center' }}
                            onPress={() => setActiveTab(2)}
                        >
                            <Text style={styles.verifyText}>Unverified users</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        {activeTab === 1 && verifiedUsersList && verifiedUsersList?.documentUsers?.length === 0 && (
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <Text style={{ alignSelf: 'center' }}>No users found</Text>
                            </View>
                        )}
                        {activeTab === 2 && usersListing && usersListing?.length === 0 && (
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <Text style={{ alignSelf: 'center' }}>No users found</Text>
                            </View>
                        )}

                        {/* {activeTab === 2 && filtertedData && filtertedData.length === 0 && (
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Text style={{ alignSelf: 'center' }}>No users found</Text>
                        </View>
                    )} */}

                        {activeTab === 1 && verifiedUsersList && verifiedUsersList?.documentUsers?.length > 0 && (
                            <FlatList
                                style={{ width: '100%' }}
                                nestedScrollEnabled
                                data={verifiedUsersList?.documentUsers}
                                renderItem={(item) => renderItemmVerified(item)}
                                keyExtractor={(item) => item.id.toString()}
                                getItemLayout={(data, index) => (
                                    { length: 50, offset: 50 * index, index }
                                )}
                            />
                        )}
                        {activeTab === 2 && usersListing && usersListing?.length > 0 && (
                            <FlatList
                                style={{ width: '100%' }}
                                nestedScrollEnabled
                                data={usersListing}  // convert it into filtered data
                                renderItem={renderItemmUnVerified}
                                keyExtractor={(item) => item.id.toString()}
                                getItemLayout={(data, index) => (
                                    { length: 50, offset: 50 * index, index }
                                )}
                            />
                        )}

                        {/* {activeTab === 2 && filtertedData && filtertedData.length > 0 && (
                        <FlatList
                            style={{ width: '100%' }}
                            nestedScrollEnabled
                            data={filtertedData}
                            renderItem={renderItemm}
                            keyExtractor={(item) => item.id.toString()}
                            getItemLayout={(data, index) => (
                                { length: 50, offset: 50 * index, index }
                            )}
                        />
                    )} */}

                    </View>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={styles.tabButton}
                            onPress={() => handleTabPressOnBottomTab(1)}
                        >
                            {activeBottomTab === 1 ? <Image source={iconUsersWhite} style={styles.bottomTabImg} /> : <Image source={iconUsersGrey} style={styles.bottomTabImg} />}
                            <Text style={styles.bottomTabText}>Users</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.tabButton}
                            onPress={() => handleTabPressOnBottomTab(2)}
                        >
                            {activeBottomTab === 2 ? <Image source={iconPlanWhite} style={styles.bottomTabImg} /> : <Image source={iconPlanGrey} style={styles.bottomTabImg} />}
                            <Text style={styles.bottomTabText}>My plan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* </ScrollView> */}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


export default DashboardAdmin;
