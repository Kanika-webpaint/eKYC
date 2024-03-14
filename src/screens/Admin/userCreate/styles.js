import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
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
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation:2
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        alignSelf: 'center',
        fontFamily: fonts.bold
    },
    containerHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center', // Vertical alignment
        width: '100%', // Take full width of the screen
    },
    backArrow: {
        height: 25,
        width: 25,
        marginRight: 10, // Add some space between back arrow and text
    },
    title: {
        flex: 1, // Allow text to take remaining space
        textAlign: 'center', // Center the text horizontally
        fontSize: 20,
        fontFamily: fonts.bold,
        color: 'black', // Assuming text color
    },
    userNameText: {
        margin: 5,
        color: colors.grey_text,
        fontFamily: fonts.medium
    }
});