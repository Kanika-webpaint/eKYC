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
        paddingLeft: 12,
        borderRadius: 5,
        backgroundColor: colors.purple_dim,
        marginBottom: 20,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    imageView: { backgroundColor: colors.purple_dim, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginLeft: '8%', height: 70, width: 70, alignSelf: 'center', borderRadius: 40, borderColor: colors.app_red, elevation: 2, marginTop: 20 },
    img: { height: 30, width: 30, resizeMode: 'contain', alignSelf: 'center' },
    verifyImg: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        position: 'absolute',
        left: 45,
        bottom: 40
    },
    verifiedStatus: {
        color: colors.white,
        fontSize: 16,
        paddingLeft: 10,
        paddingRight:10,
        fontFamily: fonts.regular,
        backgroundColor: 'green',
        maxWidth: '32%',
        borderRadius: 5
    },
    verifyView: {
        backgroundColor: colors.purple_dim,
        height: 50,
        paddingLeft: 12,
        borderRadius: 5,
        justifyContent: 'center',
    },
    itemSetting:{
        fontFamily:fonts.regular,
        color:colors.black,
        fontSize:16   ,
        alignSelf:'center',
        marginLeft:10
    },

});