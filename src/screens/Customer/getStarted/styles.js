import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.app_blue,
    },
    mainView: {
      backgroundColor: colors.light_purple,
      margin: 30,
      marginTop: '10%',
      justifyContent: 'center',
      padding: 30,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    middleText: {
      marginTop: 30,
      fontSize: 16, 
      fontFamily: fonts.regular,
      color: colors.grey,
      lineHeight: 22, 
    },
    textVerify: {
      fontSize: 32, 
      fontFamily: fonts.bold,
      color: colors.black,
      marginBottom: 10, 
    },
    buttonContainer: {
      marginTop: '5%',
      backgroundColor: colors.app_red,
      paddingVertical: 10,
      borderRadius: 20,
      alignItems: 'center',
      marginHorizontal: 30,
    },
    buttonText: {
      color: colors.white,
      fontSize: 18,
      alignSelf: 'center',
      fontFamily: fonts.medium,
      marginRight: 5,
    },
    logo: {
      width: '60%',
      alignSelf: 'center',
      resizeMode: 'contain'
    },
    fingerPrint: {
      alignSelf: 'center',
      position: 'absolute',
      resizeMode: 'contain',
    },
  });