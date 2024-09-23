import {StyleSheet} from 'react-native';
import colors from '../../../../common/colors';
import {fonts} from '../../../../common/fonts';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.app_blue,
    // justifyContent: 'center',
  },
  start: {
    color: 'white',
    fontSize: 18,
    marginLeft: '5%',
    marginTop: '8%',
    fontFamily: fonts.regular,
  },
  uniqueView: {
    marginTop: '12%',
  },
  unique: {
    color: 'white',
    fontSize: 35,
    marginLeft: '5%',
    // marginTop: '10%',
    fontFamily: fonts.bold,
    marginBottom: 50,
  },
  uniqReg: {
    color: 'grey',
    fontSize: 16,
    marginLeft: '5%',
    marginTop: '5%',
    fontFamily: fonts.medium,
  },
  textIn: {
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderColor: 'pink',
    marginBottom: '10%',
    marginTop: '5%',
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: colors.white,
    borderBottomWidth: 1,
    marginHorizontal: 30,
    marginTop: '8%',
  },
  input: {
    flex: 1,
    borderWidth: 0,
    fontSize: 18,
    color: colors.white,
    fontFamily: fonts.regular,
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: '10%',
    marginBottom: '3%',
    backgroundColor: colors.app_red,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: '3%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  bottomView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '8%',
  },
  codeView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2%',
  },
  codeText: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.light_grey,
  },
  contactText: {
    marginTop: '5%',
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.light_grey,
    alignSelf: 'center',
    textAlign: 'center',
  },
  root: {
    flex: 1,
    padding: 20,
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 35,
    fontSize: 24,
    color: colors.white,
    textAlign: 'center',
  },
  focusCell: {
    color: colors.white,
    borderColor: colors.white,
    alignSelf: 'center',
  },
  codeSection: {
    marginHorizontal: 30,
    marginTop: '5%',
  },
  adminText: {
    fontSize: 16,
    color: colors.white,
    textDecorationLine: 'underline',
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
});
