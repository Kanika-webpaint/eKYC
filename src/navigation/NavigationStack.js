import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { routeNames } from '../common/routenames';
import AsyncStorage from '@react-native-async-storage/async-storage';


// App component
const NavigationStack = () => {
    const [tokenExists, setTokenExists] = useState(false);
    // Main stack for selecting roles
    const MainStack = createStackNavigator();
    const OrganizationStack = createStackNavigator();
    const UserStack = createStackNavigator();


    useEffect(() => {
        AsyncStorage.getItem("authToken").then((value) => {
            console.log(value)
            if (value) {
                setTokenExists(true);
            }
        })
            .then(res => {
                //do something else
            });
    }, [tokenExists])


    const OrganizationStackScreen = () => {
        return (
            tokenExists ? <OrganizationHomeStack /> : <OrganizationLoginStack />
        );
    };

    const OrganizationLoginStack = () => {
        return (
            <OrganizationStack.Navigator headerMode="false">
                <OrganizationStack.Screen name="MobileVerification" component={routeNames.MobileVerification} />
                <OrganizationStack.Screen name="LoginAdmin" component={routeNames.LoginAdmin} />
                <OrganizationStack.Screen name="Plan" component={routeNames.Plan} />
                <OrganizationStack.Screen name="Checkout" component={routeNames.Checkout} />
                <OrganizationStack.Screen name="PlanDetails" component={routeNames.PlanDetails} />
                <OrganizationStack.Screen name="OrganizationHomeStack" component={OrganizationHomeStack} />
                {/* Add more screens related to organization role */}
            </OrganizationStack.Navigator>
        );
    };

    const OrganizationHomeStack = () => {
        return (
            <OrganizationStack.Navigator initialRouteName="DashboardAdmin" headerMode="false">
                <OrganizationStack.Screen name="DashboardAdmin" component={routeNames.DashboardAdmin} />
                <OrganizationStack.Screen name="CreateUser" component={routeNames.CreateUser} />
                <OrganizationStack.Screen name="UsersList" component={routeNames.UserList} />
                {/* Add more screens related to organization role */}
            </OrganizationStack.Navigator>
        );
    };


    const UserStackScreen = () => {
        return (
            <UserHomeStack />
            // tokenExists && role === 'user' ? <UserHomeStack /> : <UserLoginStack />
        );
    };

    const UserHomeStack = () => {
        return (
            <UserStack.Navigator initialRouteName="Home" headerMode="false">
                <UserStack.Screen name="HomeUser" component={routeNames.HomeUser} />
                {/* Add more screens related to user role */}
            </UserStack.Navigator>
        );
    };



    const MainStackScreen = () => {
        return (
            <MainStack.Navigator headerMode="false">
                <MainStack.Screen name="OrganizationStack" component={OrganizationStackScreen} />
                <MainStack.Screen name="UserStackScreen" component={UserStackScreen} />
            </MainStack.Navigator>
        );
    };

    return (
        <NavigationContainer>
            <MainStackScreen />
        </NavigationContainer>
    );
};

export default NavigationStack;;