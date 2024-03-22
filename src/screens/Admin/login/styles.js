import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.app_blue,
    },
    container: {
        flex: 1,
        backgroundColor: colors.app_blue,
        margin:20,
        justifyContent:'center'
    },
    backArrow: {
        height: 25,
        width: 25,
        resizeMode:'contain'
    },
    bottomSignUpView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    content: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    title: {
        fontSize: 17,
        color: colors.white,
        fontFamily: fonts.regular,
        marginTop: 20,
        marginBottom: 50,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.white,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.white,
        fontFamily: fonts.regular,
        width: '100%',
        marginLeft: 10,
    },
    icon: {
        height: 20,
        width: 20,
        tintColor: colors.white,
    },
    buttonContainer: {
        marginTop: '10%',
        marginBottom: '3%',
        backgroundColor: colors.app_red,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',

    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.bold,
    },
});
