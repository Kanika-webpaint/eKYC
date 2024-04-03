import { StyleSheet } from "react-native";
import { fonts } from "../../../common/fonts";
import colors from "../../../common/colors";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor:colors.white
        
    },
    amount: {
        color: colors.app_red,
        fontSize: 22, // Adjusted font size
        fontFamily: fonts.bold,
        marginTop: '10%',
        marginBottom: '5%'
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        paddingVertical: 20, // Adjusted padding
        paddingHorizontal: 10, // Adjusted padding
        alignItems: 'center',
        width: '100%',
    },
    imagePlanSelect: {
        height: 100, // Adjusted height
        width: 100, // Adjusted width
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
        fontSize: 16, // Adjusted font size
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
        height: 20, // Adjusted height
        width: 20, // Adjusted width
        resizeMode: 'contain',
        alignSelf: 'center',
        marginRight: 10,
        resizeMode:'contain'
    },
    mainView: {
        marginTop: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
});