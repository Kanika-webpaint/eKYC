import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white
    },
    input: {
        height: 50,
        borderWidth: 1,
        paddingLeft: 12,
        borderRadius: 5,
        color: colors.black,
        borderWidth: 1,
        width: '100%',
        fontSize: 16,
        borderColor: colors.white,
        backgroundColor: colors.purple_dim,
        fontFamily: fonts.regular,
        marginBottom: 20
    },
    imageView: { backgroundColor: colors.purple_dim, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginLeft: '8%', height: 70, width: 70, alignSelf: 'center', borderRadius: 40, borderColor: colors.app_red, elevation: 2, marginTop: 20 },
    img: { height: 30, width: 30, resizeMode: 'contain', alignSelf: 'center' },
    verifyImg: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        position: 'absolute',
        left: 45,
        bottom: 40
    },
    verifiedStatus: {
        color: colors.white,
        fontSize: 16,
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: fonts.regular,
        backgroundColor: 'green',
        maxWidth: '32%',
        borderRadius: 5
    },
    verifyView: {
        backgroundColor: colors.purple_dim,
        height: 50,
        paddingLeft: 12,
        borderRadius: 5,
        justifyContent: 'center',
    },
    buttonContainer: {
        backgroundColor: colors.app_red,
        width: '90%',
        height: 45,
        borderRadius: 8,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.bold,
    },
});