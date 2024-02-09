/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    StyleSheet,
    Text
} from 'react-native';
import { fonts } from '../common/fonts';

function ErrorMessage({ errorMessageText }) {
    return (
        <>
            <Text style={styles.errorMessage}>{errorMessageText}</Text>
        </>
    );
}

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
        marginLeft: 5,
        marginBottom: 5,
        fontFamily:fonts.regular
    },
});

export default ErrorMessage;
