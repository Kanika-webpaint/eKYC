import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white
    },
    title: {
        flex: 1,
        textAlign: 'center', 
        fontSize: 20,
        marginLeft: -30,
        fontFamily: fonts.bold,
        color: 'black', 
    },
});