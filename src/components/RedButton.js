/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {whiteArrow} from '../common/images';

function RedButton({
  buttonContainerStyle,
  ButtonContent,
  contentStyle,
  onPress,
  disabled,
  image,
}) {
  return (
    <>
      <TouchableOpacity
        style={buttonContainerStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={1}>
        <Text style={[styles.buttonText, contentStyle]}>{ButtonContent}</Text>
        {image && <Image source={whiteArrow} style={{height: 15, width: 15}} />}
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
