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


function Logo({ fingerPrintStyle, logoStyle }) {
    return (
        <>
            <View style={styles.imageContainer}>
                <Image source={finger_print} style={[styles.backgroundImage, fingerPrintStyle]} />
                <Image source={validifyX} style={[styles.logo, logoStyle]} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        marginLeft: 20,
        marginTop: '30%',
        justifyContent: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        height: 80,
        width: 80,
    },
    logo: {
        height: 50,
        marginLeft: 25,
        width: '80%',
    },
});

export default Logo;
