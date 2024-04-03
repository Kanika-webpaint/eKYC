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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    flex: 1,
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
    width: '100%',
    height: 40,
    marginLeft: 10,
    color: colors.black
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
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    marginLeft: 8
  },
  filterIcon: {
    height: 20,
    width: 20,
    alignSelf: 'center', marginLeft: 10
  },
  close: { height: 15, width: 20, alignSelf: 'center', marginRight: 10 },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rightActions: {
    height:60,
    width: 70,
    alignItems: 'center',
  },
  imageRightAction: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  },
  rightItem: {
    backgroundColor: colors.app_red, height: 60,
    width: 60, justifyContent: 'center', alignItems: 'center'
  }
});
