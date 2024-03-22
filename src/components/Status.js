/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    StatusBar
} from 'react-native';
import colors from '../common/colors';


function Status({ isLight, lightContent }) {
    return (
        <>
            <StatusBar backgroundColor={isLight ? colors.white : colors.app_blue} barStyle={lightContent ? "light-content" : "dark-content"} />

        </>
    );
}

export default Status;
