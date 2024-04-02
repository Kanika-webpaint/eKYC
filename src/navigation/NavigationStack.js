import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { routeNames } from '../common/routenames';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdminslice } from '../redux/slices/organization/organizationSlice';
import {  verifyCodeslice } from '../redux/slices/user/userSlice';


const NavigationStack = () => {
    const isLogged = useSelector(state => state.org.isLogged);
    const isLoggedUser = useSelector(state => state.user.isLoggedUser);
    const dispatch = useDispatch()
    const Stack = createStackNavigator();

    useEffect(() => {
        const checkAuthentication = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            const storedRole = await AsyncStorage.getItem('role');
            if (storedRole && storedToken) {
                dispatch(loginAdminslice(true));
            }
        };
        checkAuthentication();
    }, [dispatch, isLogged]);

    // useEffect(() => {
    //     const checkAuthenticationUser = async () => {
    //         const storedToken = await AsyncStorage.getItem('token_user');
    //         const storedRoleUser = await AsyncStorage.getItem('role_user');
    //         if (storedToken && storedRoleUser) {
    //             dispatch(verifyCodeslice(true));
    //         }
    //     };
    //     checkAuthenticationUser();
    // }, [dispatch, isLoggedUser]);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isLogged ? (
                    <>
                        <Stack.Screen options={{ headerShown: false }} name="DashboardAdmin" component={routeNames.DashboardAdmin} />
                        <Stack.Screen options={{ headerShown: false }} name="CreateUser" component={routeNames.CreateUser} />
                        <Stack.Screen options={{ headerShown: false }} name="UsersList" component={routeNames.UserList} />
                        <Stack.Screen options={{ headerShown: false }} name="UserProfile" component={routeNames.UserProfile} />
                        <Stack.Screen options={{ headerShown: false }} name="CurrentPlan" component={routeNames.CurrentPlan} />
                        <Stack.Screen options={{ headerShown: false }} name="Settings" component={routeNames.Settings} />
                        <Stack.Screen options={{ headerShown: false }} name="AdminProfile" component={routeNames.AdminProfile} />
                        <Stack.Screen options={{ headerShown: false }} name="ChangePassword" component={routeNames.ChangePassword} />
                    </>
                ) : isLoggedUser ? (
                    <>
                        <Stack.Screen options={{ headerShown: false }} name="IdScreen" component={routeNames.IdScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen options={{ headerShown: false }} name="MobileVerification" component={routeNames.MobileVerification} />
                        <Stack.Screen options={{ headerShown: false }} name="LoginAdmin" component={routeNames.LoginAdmin} />
                        <Stack.Screen options={{ headerShown: false }} name="Plan" component={routeNames.Plan} />
                        <Stack.Screen options={{ headerShown: false }} name="Checkout" component={routeNames.Checkout} />
                        <Stack.Screen options={{ headerShown: false }} name="PlanDetails" component={routeNames.PlanDetails} />
                        <Stack.Screen options={{ headerShown: false }} name="SuccessScreen" component={routeNames.SuccessScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default NavigationStack;
