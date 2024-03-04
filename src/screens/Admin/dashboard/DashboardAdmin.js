import { SafeAreaView, StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import colors from '../../../common/colors';
import { logout, plan_select, plus, team } from '../../../common/images';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getOrgDetailsAction } from '../../../redux/actions/user';
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
    ];

    useEffect(() => {
        AsyncStorage.getItem("token").then((value) => {
            if (value) {
                dispatch(getOrgDetailsAction(value, setIsLoading));
            }
        })
        .then(res => {
            // do something else
        });
    }, [dispatch]);

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
    
    const renderItem = (item) => (
        <TouchableOpacity style={styles.itemsView} onPress={() => onPressItem(item)}>
            <Image style={styles.imgItem} source={item?.item?.image} />
            <Text style={styles.titleItem}>{item.item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <Status isLight />
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.mainView}>
                    <View>
                        <Text style={styles.org}>{OrganizationHomeList?.organization?.name.replace(/[""]/g, '') || 'Organization'}</Text>
                        <Text style={styles.detailText}>Details</Text>
                    </View>
                    <View style={styles.buttonContainer}>
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
