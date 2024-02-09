/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import colors from '../../common/colors';
import { plan_select, plus, team } from '../../common/images';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { getOrgDetailsAction } from '../../redux/actions/user';
import Loader from '../../components/ActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fonts } from '../../common/fonts';

function DashboardAdmin() {
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const OrganizationHomeList = useSelector((state) => state?.login?.orgDetails)

    useEffect(() => {
        AsyncStorage.getItem("authToken").then((value) => {
            if (value) {
                dispatch(getOrgDetailsAction(value, setIsLoading))
            }
        })
            .then(res => {
                //do something else
            });
    }, [dispatch]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.mainView}>
                    <View >
                        <Text style={styles.org}>{OrganizationHomeList?.organization?.name.replace(/[""]/g, '') || 'Organization'}</Text>
                        <Text style={styles.detailText}>Details</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('CreateUser')} style={styles.addView}>
                        <Image source={plus} style={styles.plusIcon} />
                    </TouchableOpacity>
                </View>
                {isLoading ? <Loader /> :
                    <View style={styles.midView}>
                        <TouchableOpacity style={styles.dashboardItem} onPress={() => { navigation.navigate('UsersList') }}>
                            <Image source={team} style={styles.imagePlanSelect} />
                            <Text style={styles.itemText}>Users</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dashboardItem}>
                            <Image source={plan_select} style={styles.imagePlanSelect} />
                            <Text style={styles.itemText}>Plans</Text>
                        </TouchableOpacity>
                    </View>}
                <View style={styles.midView}>
                    <TouchableOpacity style={styles.dashboardItem} onPress={() => { navigation.navigate('UsersList') }}>
                        <Image source={team} style={styles.imagePlanSelect} />
                        <Text style={styles.itemText}>Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dashboardItem}>
                        <Image source={plan_select} style={styles.imagePlanSelect} />
                        <Text style={styles.itemText}>Plans</Text>
                    </TouchableOpacity>
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
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0.4,
        elevation: 3,
        borderColor: colors.app_red,
        height: 120,
        width: 120,
        borderRadius: 10,
        borderWidth: 0.8,
    },
    itemText: {
        fontSize: 16,
        color: colors.grey,
        alignSelf: 'center',
        fontFamily: fonts.medium
    },
    midView: {
        margin: 5,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    imagePlanSelect: {
        height: 80,
        width: 80,
        alignSelf: 'center',
        resizeMode: 'contain'
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
    }
});

export default DashboardAdmin;


