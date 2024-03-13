import { SafeAreaView, StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import colors from '../../../common/colors';
import { logout, plan_select, plus, team } from '../../../common/images';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getOrgDetailsAction, getUsersListAction } from '../../../redux/actions/user';
import Loader from '../../../components/ActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fonts } from '../../../common/fonts';
import Status from '../../../components/Status';
import { loginAdminslice } from '../../../redux/slices/user';
import showAlert from '../../../components/showAlert';
import { styles } from './styles';

function DashboardAdmin() {
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const OrganizationHomeList = useSelector((state) => state?.login?.orgDetails);
    const usersListing = useSelector((state) => state?.login?.getUsersList)

    const DashboardItemsData = [
        {
            id: 0,
            image: team,
            title: 'Users'
        },
        {
            id: 1,
            image: plan_select,
            title: 'Plans'
        },
        {
            id: 3,
            image: team,
            title: 'Verified Users'
        },
        {
            id: 4,
            image: team,
            title: 'Un-verified Users'
        },
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
        getOrgDetails()
    }, []);
    
    const getOrgDetails = useCallback(async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            console.log(storedToken, "token in dashboard ")
            if (storedToken) {
                dispatch(getOrgDetailsAction(storedToken, setIsLoading));
            } else {
                // Handle case where token is not found
            }
        } catch (error) {
            console.error('Error retrieving token from AsyncStorage:', error);
            // Handle error
        }
    }, [dispatch, setIsLoading]);

    const onPressItem = (selectedItem) => {
        if (selectedItem?.item?.id === 0) {
            navigation.navigate('UsersList');
        } else {
            // navigation.navigate('UsersList') //navigate to plan detail
        }
    };

    const logoutAccount = useCallback(async () => {
        await AsyncStorage.clear();
        dispatch(loginAdminslice(false));
        showAlert('Logout successfully!');
    }, [dispatch]);

    const renderCount = (item) => {
        if (item?.item?.title === 'Users') {
            return ` (${usersListing?.length})`;
        } else {
            return '';
        }
    }

    const renderItem = (item) => (
        <TouchableOpacity style={styles.itemsView} onPress={() => onPressItem(item)}>
            <Image style={styles.imgItem} source={item?.item?.image} />
            <Text style={styles.titleItem}>{item.item.title +  renderCount(item)}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <Status isLight />
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.mainView}>
                    <View>
                        <Text style={styles.org}>{'Welcome' + ' ' + OrganizationHomeList?.organization?.name.replace(/[""]/g, '') || 'Organization'}</Text>
                        <Text style={styles.detailText}>Organization</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => logoutAccount()} style={styles.addView}>
                            <Image source={logout} style={styles.plusIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                {isLoading ? <Loader /> :
                    <FlatList
                        nestedScrollEnabled
                        numColumns={2}
                        data={DashboardItemsData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item?.id}
                    />
                }
            </ScrollView>
        </SafeAreaView>
    );
}


export default DashboardAdmin;
