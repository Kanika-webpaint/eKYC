import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.light_purple
    },
    mainView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    detailText: {
        fontSize: 16,
        color: colors.grey,
        fontFamily: fonts.medium
    },
    org: {
        fontSize: 25,
        color: colors.black,
        fontFamily: fonts.bold
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    addView: {
        height: 42,
        width: 42,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3,
        marginHorizontal: 5,
    },
    plusIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    itemsView: {
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: colors.white,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderRadius: 5
    },
    imgItem: {
        height: 80,
        width: 80,
        alignSelf: 'center'
    },
    titleItem: {
        fontFamily: fonts.bold,
        fontSize: 18,
        color: colors.black
    }
});
