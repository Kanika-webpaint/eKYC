/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View
} from 'react-native';
import colors from '../common/colors';


function Loader() {
    return (
        <>
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color={colors.white} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default Loader;
