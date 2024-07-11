/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {fonts} from '../common/fonts';
function ErrorMessageCheckout({errorMessageText, style}) {
  return (
    <>
      <Text style={styles.errorMessage}>{errorMessageText}</Text>
    </>
  );
}
const styles = StyleSheet.create({
  errorMessage: {
    color: colors.app_red,
    marginLeft: 5,
    fontFamily: fonts.regular,
  },
});
export default ErrorMessageCheckout;
