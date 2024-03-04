import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.light_purple,
    },
    containerHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.light_purple,
        paddingVertical: 10,
        alignItems: 'center',
        width: '100%',
    },
    backArrow: {
        height: 25,
        width: 25,
        marginRight: 10,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
        fontFamily: fonts.bold,
    },
    imagePlanSelect: {
        marginVertical: 20,
        height: 100,
        width: 100,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    midTitle: {
        color: colors.grey,
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 10,
        fontFamily: fonts.regular,
    },
    mainView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        marginTop: 20,
        backgroundColor: colors.app_red,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.bold,
    },
    input: {
        borderWidth: 0.8,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    text: {
        fontFamily: fonts.regular,
        fontSize: 16,
    },
    err: {
        marginLeft: 0,
        marginTop: -5,
        marginBottom: 5,
        fontFamily: fonts.regular,
        color: 'red',
    },
});