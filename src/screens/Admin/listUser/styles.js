import { StyleSheet } from "react-native";
import colors from "../../../common/colors";
import { fonts } from "../../../common/fonts";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white
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
    color: colors.grey_text
  },
  phoneNumber: {
    fontSize: 14,
    color: colors.grey_text
  },
  searchInput: {
    padding: 10,
    width: '100%',
  },
  containerHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: colors.white,
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
  plusIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  addView: {
    height: 40,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginLeft: 8
  },
  filterIcon: {
    height: 20,
    width: 20,
    alignSelf: 'center', marginLeft: 10
  },
  close: { height: 15, width: 20, alignSelf: 'center', marginRight: 10 }
});
