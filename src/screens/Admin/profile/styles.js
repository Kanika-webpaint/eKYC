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
    img: { height: 30, width: 30, resizeMode: 'contain', alignSelf: 'center' }
});