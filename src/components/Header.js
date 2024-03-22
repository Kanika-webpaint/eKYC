/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { fonts } from '../common/fonts';
import { back } from '../common/images';
import { useNavigation } from '@react-navigation/native';

function Header({ title }) {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 50, bottom: 50, right: 50, left: 50 }}>
                <Image source={back} style={styles.backArrow} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
        fontFamily: fonts.bold
    },
    backArrow: {
        height: 25,
        width: 25,
        marginRight: 10,
    },
});

export default Header;
