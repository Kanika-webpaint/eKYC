import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white
    },
    textInputField: {
        height: 50,
        paddingLeft: 12,
        borderRadius: 5,
        backgroundColor: colors.purple_dim,
        marginBottom: 20,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingRight:12
    },
    textUpper:{
        fontSize:15,
        fontFamily:fonts.regular,
        color:colors.black
    },
    buttonContainer: {
        backgroundColor: colors.app_red,
        width: '100%',
        height: 45,
        marginTop:20,
        borderRadius: 8,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.bold,
    },
    icon: {
        height: 20,
        width: 20,
        alignSelf:'center'
    
    },

});