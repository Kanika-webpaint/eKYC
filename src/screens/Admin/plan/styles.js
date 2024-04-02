import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white
    },
    mainView: {
        flex: 1,
        padding: 10,
        marginVertical: 30,
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    midTitle: {
        color: colors.grey,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 0,
        fontFamily: fonts.regular
    },
    imagePlanSelect: {
        height: 150,
        width: 150,
        alignSelf: 'center',
        resizeMode: 'contain',
        marginBottom: 25,
    },
    itemsContainer: {
        width: '100%',
        alignItems: 'center',
    },
    radioButton: {
        flexDirection: 'row',
        padding: 15,
        width: '95%',
        backgroundColor: colors.purple_dim,
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    selectedItem: {
        backgroundColor: colors.purple_dim,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    selectedImg: {
        resizeMode: 'contain',
        height: 25,
        width: 25,
        marginRight: 10
    },
    itemTextContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    itemsLabel: {
        fontSize: 16,
        color: colors.black,
        fontFamily: fonts.bold,
    },
    itemsDescription: {
        fontSize: 14,
        color: colors.grey,
        fontFamily: fonts.medium,
        marginTop: 5,
    },
});