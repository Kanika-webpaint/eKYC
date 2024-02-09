/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { CountryPicker } from "react-native-country-codes-picker";

function CountryPick({ show, onBackdropPress, pickerButtonOnPress }) {
    return (
        <>
            <CountryPicker
                show={show}
                lang={'en'}
                style={{
                    // Styles for whole modal [View]
                    modal: {
                        height: 500,
                    },
                    itemsList: {
                        color: colors.black,
                    },
                    // Styles for input [TextInput]
                    textInput: {
                        height: 80,
                        borderRadius: 0,
                        color: colors.black,
                        padding: 20
                    },
                    countryName: {
                        color: colors.grey,
                    },
                    // Styles for country button [TouchableOpacity]
                    countryButtonStyles: {
                        height: 80,
                        color: colors.black
                    },
                }}
                onBackdropPress={onBackdropPress}
                pickerButtonOnPress={pickerButtonOnPress}
            />
        </>
    );
}
export default CountryPick;
