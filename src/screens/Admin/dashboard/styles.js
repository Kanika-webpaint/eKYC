import { Platform, StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.app_blue
    },
    detailText: {
        fontSize: 28,
        color: colors.white,
        fontFamily: fonts.regular
    },
    org: {
        fontSize: 22,
        color: colors.white,
        fontFamily: fonts.bold
    },
    dateStyle: {
        fontSize: 16,
        marginTop: 10,
        fontFamily: fonts.thin,
        color: colors.light_grey
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 5,
        resizeMode: 'contain'
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 20,
        // paddingBottom: Platform.OS === 'ios' ? '20%' : '10%',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        backgroundColor: colors.app_blue,
        position:'absolute',bottom:0
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'blue',
    },
    tabText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    insideView: { height: 250, margin: 30 },
    logo: { alignSelf: 'center', height: '30%', resizeMode: 'contain', width: '60%' },
    itemsUsersPlan: { backgroundColor: colors.white, borderTopLeftRadius: 40, borderTopRightRadius: 40, height: 500 },
    insideUserPlan: { flexDirection: 'row', justifyContent: 'space-evenly' },
    UserTabTop: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3, backgroundColor: colors.purple_dim, height: 110, width: 150, marginTop: -30, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 20
    },
    itemImageUserPlan: { resizeMode: 'contain', height: 50, width: 50 },
    count: { color: colors.black, fontFamily: fonts.bold, fontSize: 20 },
    textItemUserPlan: { color: colors.black },
    middleView: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-evenly', alignItems: 'center', height: 40 },
    verifyText: { color: colors.black, fontSize: 16, fontFamily: fonts.bold, alignSelf: 'center' },
    bottomTabImg: { height: 30, width: 30, resizeMode: 'contain' },
    bottomTabText: { color: colors.light_grey, fontSize: 12 }
});
