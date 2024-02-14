/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { fonts } from '../common/fonts';
import colors from '../common/colors';

function ErrorMessage({ errorMessageText,style }) {
    return (
        <View>
            <Text style={[styles.errorMessage, style]}>{errorMessageText}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    errorMessage: {
        color: colors.app_red,
        marginLeft: '8%',
        marginTop: 5,
        fontFamily: fonts.regular
    },
});

export default ErrorMessage;
