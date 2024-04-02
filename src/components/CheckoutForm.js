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
    Text,
    TextInput
} from 'react-native';
import colors from '../common/colors';
import { fonts } from '../common/fonts';


function CheckoutForm({value, placeholder, onChangeText,title,keyboardType,editable}) {
    return (
        <>
            <View>
                <Text style={styles.titleText}>{title}</Text>
                <TextInput
                    value={value}
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={colors.light_grey}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    editable={editable}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    titleText: {
        marginVertical: 2,
        color: colors.grey,
        fontFamily: fonts.regular,
    },
    input: {
        height: 50,
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 5,
        color: colors.black,
        borderColor: colors.white,
        backgroundColor: colors.purple_dim,
        fontFamily: fonts.regular,
        fontSize: 16,
        width: '100%', 
    },
});

export default CheckoutForm;
