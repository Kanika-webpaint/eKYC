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


function Logo({ fingerPrintStyle, logoStyle, styleContainer }) {
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
        width: '100%',
        marginLeft: '16%',
        marginTop: '20%',
        justifyContent: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        height: 70,
        width: 70,
    },
    logo: {
        height: 70,
        marginLeft: -10,
        width: '80%',
        resizeMode: 'contain'
    },
});

export default Logo;
