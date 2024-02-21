import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { routeNames } from '../common/routenames';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginAdminAction } from '../redux/actions/user';
import { useDispatch, useSelector } from 'react-redux';
import LoginAdmin from '../screens/Admin/LoginAdmin';
import { loginAdminslice, verifyCodeslice } from '../redux/slices/user';

const NavigationStack = () => {
    const isLogged = useSelector(state => state.login.isLogged);
    const isLoggedUser = useSelector(state => state.login.isLoggedUser);
    const dispatch = useDispatch()
    console.log("isLogged", isLogged)
    console.log("isLoggedUser", isLoggedUser)


    useEffect(() => {
        // Check AsyncStorage for login status when component mounts
        const checkAuthentication = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            const storedRole = await AsyncStorage.getItem('role');

            if (storedRole && storedToken) {
                // Dispatch the loginAdminslice action with true to indicate user is logged in
                dispatch(loginAdminslice(true));
            }
        };

        checkAuthentication();
    }, [dispatch, isLogged]);

    useEffect(() => {
        // Check AsyncStorage for login status when component mounts
        const checkAuthenticationUser = async () => {
            // const storedTokenUser = await AsyncStorage.getItem('tokenUser');
            const storedRoleUser = await AsyncStorage.getItem('roleUser');

            if (storedRoleUser) {
                // Dispatch the loginAdminslice action with true to indicate user is logged in
                dispatch(verifyCodeslice(true));
            }
        };

        checkAuthenticationUser();
    }, [dispatch, isLoggedUser]);


    const Stack = createStackNavigator();


    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none">
               
                    {isLogged ? (
                        <>
                            <Stack.Screen name="DashboardAdmin" component={routeNames.DashboardAdmin} />
                            <Stack.Screen name="CreateUser" component={routeNames.CreateUser} />
                            <Stack.Screen name="UsersList" component={routeNames.UserList} />
                            <Stack.Screen name="UserProfile" component={routeNames.UserProfile} />
                        </>
                    ) : isLoggedUser ? (
                        <Stack.Screen name="IdScreen" component={routeNames.IdScreen} />
                    ) : (
                        <>
                            <Stack.Screen name="MobileVerification" component={routeNames.MobileVerification} />
                            <Stack.Screen name="LoginAdmin" component={routeNames.LoginAdmin} />
                            <Stack.Screen name="Plan" component={routeNames.Plan} />
                            <Stack.Screen name="Checkout" component={routeNames.Checkout} />
                            <Stack.Screen name="PlanDetails" component={routeNames.PlanDetails} />
                            <Stack.Screen name="SuccessScreen" component={routeNames.SuccessScreen} />
                            <Stack.Screen name="ContactUs" component={routeNames.ContactUs} />
                        </>
                    )}      
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default NavigationStack;
