import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white,
    },
    buttonContainer: {
        backgroundColor: colors.app_red,
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.bold,
    },
    input: {
        height: 50,
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 5,
        color: colors.black,
        borderColor: colors.white,
        backgroundColor: colors.purple_dim,
        fontFamily: fonts.regular,
        fontSize: 16,
        width: '100%',
    },
    inputCount: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontFamily: fonts.regular,
    },
    titleText: {
        marginVertical: 2, 
        color: colors.grey,
        fontFamily: fonts.regular,
    },
    addressField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 50,
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 5,
        color: colors.black,
        borderColor: colors.white,
        backgroundColor: colors.purple_dim,
        fontFamily: fonts.regular,
        fontSize: 16,
    },
    errorMessageStyle: {
        color: colors.app_red,
        fontFamily: fonts.regular,
        marginLeft: 5
    },
    errorText: {
        marginTop: 5,
        marginLeft: 5,
        color: colors.app_red,
        fontFamily: fonts.regular,
    },
    cardStyling: {
        backgroundColor: colors.purple_dim,
        textColor: '#000000',
        borderRadius: 5,
        fontFamily: fonts.regular,
        fontSize: 16
    },
    cardStripe: {
        marginTop: 2,
        height: 50,
        width: '100%',
    },
    flatlistStyle:{
        backgroundColor: colors.white,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 5,
        height: 200,
        flex: 1
    },
    dropdownStyle:{ width: 20, height: 20, resizeMode: 'contain' },
    itemm:{ fontSize: 18, paddingVertical: 10 }
});