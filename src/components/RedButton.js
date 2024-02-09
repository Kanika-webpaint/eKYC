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


function RedButton({ buttonContainerStyle, ButtonContent, contentStyle ,onPress}) {
    return (
        <>
            <TouchableOpacity style={buttonContainerStyle} onPress={onPress}>
                <Text style={[styles.buttonText, contentStyle]}>{ButtonContent}</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 25,
        backgroundColor: colors.app_red,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 30,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },

});

export default RedButton;
