/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    ToastAndroid,
} from 'react-native';
import colors from '../../common/colors';
import { logout, plan_select, plus, team } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { getOrgDetailsAction } from '../../redux/actions/user';
import Loader from '../../components/ActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fonts } from '../../common/fonts';
import Status from '../../components/Status';
import { CommonActions } from "@react-navigation/native";
import { loginAdminslice } from '../../redux/slices/user';


function DashboardAdmin() {
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const OrganizationHomeList = useSelector((state) => state?.login?.orgDetails)
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

    ]

    useEffect(() => {
        AsyncStorage.getItem("token").then((value) => {
            if (value) {
                dispatch(getOrgDetailsAction(value, setIsLoading))
            }
        })
            .then(res => {
                //do something else
            });
    }, [dispatch]);


    const onPressItem = (selectedItem) => {
        if (selectedItem?.item?.id === 0) {
            navigation.navigate('UsersList')
        } else {
            // navigation.navigate('UsersList') //navigate to plan detail
        }

    }


    const logoutAccount = useCallback(async () => {
        await AsyncStorage.clear();
        dispatch(loginAdminslice(false));
        showAlert('Logout successfully!');
    }, [dispatch]);
    
    const showAlert = (message) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            AlertIOS.alert(message);
        }
    };


    const renderItem = (item) => (
        <TouchableOpacity style={styles.itemsView} onPress={() => onPressItem(item)}>
            <Image style={styles.imgItem} source={item?.item?.image}></Image>
            <Text style={styles.titleItem}>{item.item.title}</Text>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={styles.safeArea}>
            <Status isLight />
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.mainView}>
                    <View >
                        <Text style={styles.org}>{OrganizationHomeList?.organization?.name.replace(/[""]/g, '') || 'Organization'}</Text>
                        <Text style={styles.detailText}>Details</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => navigation.navigate('CreateUser')} style={styles.addView}>
                            <Image source={plus} style={styles.plusIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => logoutAccount()} style={styles.addView}>
                            <Image source={logout} style={styles.plusIcon} />
                        </TouchableOpacity>
                    </View>

                </View>
                {isLoading ? <Loader /> :
                    <FlatList
                        nestedScrollEnabled
                        numColumns={'2'}
                        data={DashboardItemsData}
                        renderItem={renderItem}
                    />
                }
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.light_purple
    },
    mainView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    detailText: {
        fontSize: 16,
        color: colors.grey,
        fontFamily: fonts.medium
    },
    org: {
        fontSize: 25,
        color: colors.black,
        fontFamily: fonts.bold
    },
    dashboardItem: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: colors.white,
        height: 120,
        width: 120,
        borderRadius: 10,
    },
    addView: {
        height: 45,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0.4,
        elevation: 3,
    },
    plusIcon: {
        height: 35,
        width: 35,
        resizeMode: 'contain'
    },
    itemsView: {
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: colors.white,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderRadius: 5
    },
    imgItem: {
        height: 80,
        width: 80,
        alignSelf: 'center'
    },
    titleItem: {
        fontFamily: fonts.bold,
        fontSize: 18,
        color: colors.black
    }
});

export default DashboardAdmin;


