import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white
    },
    title: {
        flex: 1, // Allow text to take remaining space
        textAlign: 'center', // Center the text horizontally
        fontSize: 20,
        marginLeft: -30,
        fontFamily: fonts.bold,
        color: 'black', // Assuming text color
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
    containerHeader: {
        flex: 1,
        margin:20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        padding: 5,
        margin:20,
        alignItems: 'center', // Vertical alignment
        width: '100%', // Take full width of the screen
    },
    backArrow: {
        height: 25,
        width: 25,
        marginRight: 10, // Add some space between back arrow and text
    },
});