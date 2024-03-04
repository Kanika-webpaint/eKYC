import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.light_purple
    },
    itemContainer: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    userInfoContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
    userName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    phoneNumber: {
      fontSize: 14,
      color: '#555',
    },
    searchInput: {
      padding: 10,
    },
    containerHeader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      backgroundColor: colors.light_purple,
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
      fontWeight: fonts.bold,
      color: 'black', // Assuming text color
    },
  });
  