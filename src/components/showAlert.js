import React from 'react';
import { Platform, ToastAndroid, Alert } from 'react-native';

const showAlert = ( message ) => {
    const alert = () => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert(message);
        }
    };

    return (
        <>
            {alert()}
        </>
    );
};

export default showAlert;
