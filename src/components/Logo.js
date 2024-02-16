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
    Image
} from 'react-native';
import { finger_print, validifyX } from '../common/images';


function Logo({ fingerPrintStyle, logoStyle ,styleContainer}) {
    return (
        <>
            <View style={[styles.imageContainer, styleContainer]}>
                <Image source={finger_print} style={[styles.backgroundImage, fingerPrintStyle]} />
                <Image source={validifyX} style={[styles.logo, logoStyle]} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        marginLeft: '10%',
        marginTop: '30%',
        justifyContent: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        height: 70,
        width: 70,
    },
    logo: {
        height: 50,
        marginLeft: 18,
        width: '85%',
    },
});

export default Logo;
