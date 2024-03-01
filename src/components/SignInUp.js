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
    TouchableOpacity
} from 'react-native';
import { fonts } from '../common/fonts';


function SignInUp({ onPress, signupContent, signUpText ,viewBottomSignup}) {
    return (
        <>
            <TouchableOpacity style={[styles.bottomSignUpView, viewBottomSignup]} onPress={onPress}>
                <Text style={styles.bottomText}>{signupContent}</Text>
                <Text style={styles.signUpText}>{signUpText}</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    bottomSignUpView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10%'
    },
    bottomText: {
        color: colors.white,
        fontSize: 15,
        fontFamily: fonts.regular
    },
    signUpText: {
        color: colors.app_red,
        fontSize: 15,
        fontFamily: fonts.medium
    },
});

export default SignInUp;
