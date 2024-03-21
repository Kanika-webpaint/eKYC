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
        paddingVertical: 10, // Adjusted for spacing
        borderRadius: 8,
        alignSelf: 'center',
        alignItems: 'center',
        width: '100%', // Adjusted for better responsiveness
        marginBottom: 20, // Adjusted for spacing
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.bold,
    },
    containerHeader: {
        alignItems: 'center', // Centering horizontally
    },
    header: {
        flexDirection: 'row',
        // backgroundColor: colors.light_purple,
        paddingVertical: 10, // Adjusted for better spacing
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
        fontFamily: fonts.bold,
        color: colors.black,
    },
    container: {
        flex: 1,
        padding: 16,
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
        width: '100%', // Adjusted for full width
    },
    inputCount: {
        flex: 1, // Adjusted to fill available space
        color: colors.black,
        fontSize: 16,
        fontFamily: fonts.regular,
    },
    titleText: {
        marginVertical: 2, // Adjusted for spacing
        color: colors.grey,
        fontFamily: fonts.regular,
        // marginBottom:10
    },
    addressField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%', // Adjusted for full width
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
        width: '100%', // Adjusted for full width
    },
    coupanCodeView: { borderRadius: 5, flexDirection: 'row', backgroundColor: colors.white, height: 50, width: '70%' },
    applyText: { alignSelf: 'center', fontFamily: fonts.bold, fontSize: 16, color: colors.grey },
    summaryView: { borderTopWidth: 1, marginTop: 10, borderColor: colors.light_grey },
    ordersummaryText: { fontSize: 20, fontFamily: fonts.bold, color: colors.black, marginTop: 10 },
    viewAll: { flexDirection: 'row', justifyContent: 'space-between' },
    subTotal: { fontSize: 16, fontFamily: fonts.regular },
    imgCoupan: { height: 15, width: 15, marginRight: 10 },
    coupanView: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }
});