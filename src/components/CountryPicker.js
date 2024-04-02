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
                    modal: {
                        height: 500,
                    },
                    itemsList: {
                        color: colors.black,
                    },
                    textInput: {
                        height: 80,
                        borderRadius: 0,
                        color: colors.black,
                        padding: 20
                    },
                    countryName: {
                        color: colors.grey,
                    },
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
