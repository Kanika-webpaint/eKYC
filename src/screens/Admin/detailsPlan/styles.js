import { StyleSheet } from "react-native";
import { fonts } from "../../../common/fonts";
import colors from "../../../common/colors";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    amount: {
        color: colors.app_red,
        fontSize: 22, // Adjusted font size
        fontFamily: fonts.bold,
        marginTop: '10%',
        marginBottom: '5%'
    },
    containerHeader: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.light_purple,
        paddingVertical: 20, // Adjusted padding
        paddingHorizontal: 10, // Adjusted padding
        alignItems: 'center',
        width: '100%',
    },
    backArrow: {
        height: 25,
        width: 25,
        marginRight: 10,
        marginLeft: 10
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
        fontFamily: fonts.bold
    },
    imagePlanSelect: {
        height: 200, // Adjusted height
        width: 200, // Adjusted width
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    buttonContainer: {
        marginTop: '15%',
        backgroundColor: colors.app_red,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 30,
        width: '85%'
    },
    buttonText: {
        color: colors.white,
        fontSize: 18, // Adjusted font size
        alignSelf: 'center',
        fontFamily: fonts.bold
    },
    itemText: {
        color: colors.black,
        fontSize: 16, // Adjusted font size
        alignSelf: 'center',
        fontFamily: fonts.regular
    },
    itemImage: {
        height: 24, // Adjusted height
        width: 24, // Adjusted width
        resizeMode: 'contain',
        alignSelf: 'center',
        marginRight: 20
    },
    mainView: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.light_purple,
    }
});