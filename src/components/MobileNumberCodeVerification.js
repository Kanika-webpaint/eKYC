/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text
} from 'react-native';
import { fonts } from '../common/fonts';
import colors from '../common/colors';


function MobileNumberCodeVerification({ verificationImageSource, textFirst, textMiddle, textLast }) {
    return (
        <>
            <View>
                <Image source={verificationImageSource} style={styles.verify} />
            </View>
            <View style={styles.numberView}>
                <Text style={styles.textEnter}>{textFirst}</Text>
                <Text style={styles.textMobile}>{textMiddle}</Text>
                <Text style={styles.textOTP}>{textLast}</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    verify: {
        marginTop: 50,
        width: '80%',
        height: 40,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    numberView: {
        margin: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textEnter: {
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'center',
        color: colors.white,
        fontFamily:fonts.bold
    },
    textMobile: {
        fontSize: 20,
        alignSelf: 'center',
        textAlign: 'center',
        color: colors.white,
        fontWeight: '500',
        fontFamily:fonts.bold
    },
    textOTP: {
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'center',
        color: colors.white,
        fontFamily:fonts.medium
    },

});

export default MobileNumberCodeVerification;
