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
        alignItems: 'center', // Align items in the center horizontally
        marginTop: '20%',
        position: 'relative', // Necessary for absolute positioning inside
    },
    backgroundImage: {
        left: 60, // Position 60 units to the left
        top: 0, // Adjust the top position as needed
        position: 'absolute', // Position the fingerprint image absolutely
        height: 70,
        width: 70,
    },
    logo: {
        height: 70,
        width: '80%', // Reduce the width slightly to cover the fingerprint image
        resizeMode: 'contain'
    },
});

export default Logo;
