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
        flexDirection: 'row',
        borderRadius: 5,
        color: colors.black,
        borderWidth: 1,
        width: '100%',
        fontSize: 16,
        borderColor: colors.white,
        backgroundColor: colors.purple_dim,
        elevation: 2,
        fontFamily: fonts.regular
    },
    usernameinput: {
        elevation: 2,
        height: 50,
        borderWidth: 1,
        flexDirection: 'row',
        borderRadius: 5,
        color: colors.black,
        borderWidth: 1,
        width: '100%',
        borderColor: colors.white,
        backgroundColor: colors.purple_dim,
        paddingLeft: 15,
    },
    buttonContainer: {
        backgroundColor: colors.app_red,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        alignSelf: 'center',
        fontFamily: fonts.bold
    },
    header: {
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center', // Vertical alignment
        width: '100%', // Take full width of the screen
    },
    userNameText: {
        margin: 5,
        color: colors.grey_text,
        fontFamily: fonts.medium
    },
    addButton: { height: 150, width: 150, alignSelf: 'center', marginBottom: 20 },
    userRed: { height: 20, width: 20, alignSelf: 'center', resizeMode: 'contain' },
    emailAddress: { fontSize: 16, fontFamily: fonts.regular, width: '90%', marginLeft: 10, color: colors.black },
    phoneText: { margin: 5, color: colors.grey_text },
    imagePhone: { height: 20, width: 20, alignSelf: 'center', marginLeft: 12, resizeMode: 'contain' },
    code: { height: 30, width: 50, marginRight: 10, marginTop: 10, justifyContent: 'center', alignItems: 'center' },
    number: { fontSize: 16, fontFamily: fonts.regular, width: '70%', color: colors.black },
    textCountryCode: { color: colors.black, alignSelf: 'center', fontSize: 14, fontFamily: fonts.regular }
});