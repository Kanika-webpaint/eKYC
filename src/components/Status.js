/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    StyleSheet,
    StatusBar
} from 'react-native';
import colors from '../common/colors';


function Status({ isLight, lightContent }) {
    return (
        <>
            <StatusBar backgroundColor={isLight ? colors.light_purple : colors.app_blue} barStyle={lightContent ? "light-content" : "dark-content"} />

        </>
    );
}

const styles = StyleSheet.create({


});

export default Status;
