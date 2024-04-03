import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.app_blue,
      justifyContent:'center',
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: colors.white,
      borderBottomWidth: 1,
      marginHorizontal: 30,
      marginTop: '8%',
    },
    input: {
      flex: 1,
      borderWidth: 0,
      fontSize: 18,
      color: colors.white,
      fontFamily: fonts.regular,
      marginLeft: 10,
    },
    buttonContainer: {
      marginTop: '10%',
      marginBottom: '3%',
      backgroundColor: colors.app_red,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 30,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontFamily: fonts.bold,
    },
    bottomView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '8%',
    },
    codeView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '2%',
    },
    codeText: {
      fontSize: 18,
      fontFamily: fonts.medium,
      color: colors.light_grey,
    },
    contactText: {
      marginTop: '5%',
      fontSize: 14,
      fontFamily: fonts.medium,
      color: colors.light_grey,
      alignSelf: 'center',
      textAlign: 'center',
    },
    root: {
      flex: 1,
      padding: 20,
    },
    cell: {
      width: 40,
      height: 40,
      lineHeight: 35,
      fontSize: 24,
      borderRadius: 5,
      borderBottomColor: colors.white,
      borderBottomWidth: 1,
      color: colors.white,
      textAlign: 'center',
    },
    focusCell: {
      borderColor: colors.white,
      alignSelf: 'center',
    },
    codeSection: {
      marginHorizontal: 30,
      marginTop: '5%',
    },
    adminText: {
      fontSize: 16,
      color: colors.white,
      textDecorationLine: 'underline',
      fontFamily: fonts.regular,
      textAlign: 'center',
    },
  });