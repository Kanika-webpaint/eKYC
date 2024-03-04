import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.light_purple,
    },
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    successImg: {
        height: 150,
        width: 150,
        resizeMode: 'contain',
    },
    pay: {
        fontSize: 25,
        fontFamily: fonts.bold,
        color: colors.black,
        marginTop: 30,
        textAlign: 'center',
    },
    confirmText: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: colors.grey,
        marginTop: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 50,
        backgroundColor: colors.app_red,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: '70%',
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.bold,
    },
});
