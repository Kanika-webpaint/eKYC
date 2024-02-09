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
        color: colors.light_grey,
        fontFamily:fonts.medium
    },
    textMobile: {
        fontSize: 20,
        alignSelf: 'center',
        textAlign: 'center',
        color: colors.light_grey,
        fontWeight: '500',
        fontFamily:fonts.medium
    },
    textOTP: {
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'center',
        color: colors.light_grey,
        fontFamily:fonts.medium
    },

});

export default MobileNumberCodeVerification;
