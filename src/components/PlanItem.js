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
    View
} from 'react-native';
import colors from '../common/colors';
import { fonts } from '../common/fonts';

function PlanItem({ title, value, styleText }) {
    return (
        <>
            <View style={styles.containerView}>
                <Text style={styles.titleStyle}>
                    {title}
                </Text>
                <Text style={[styles.valueStyle, styleText]}>
                    {value}
                </Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    containerView: { flexDirection: 'row', justifyContent: 'space-between', margin: 10 },
    titleStyle: { fontSize: 16, color: colors.black, fontFamily: fonts.regular, flex: 0.4, marginRight: 20 },
    valueStyle: { fontSize: 16, color: colors.black, fontFamily: fonts.regular, flex: 0.6 }
});

export default PlanItem;
