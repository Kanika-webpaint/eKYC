import {StyleSheet} from 'react-native';
import colors from '../../../common/colors';
import {fonts} from '../../../common/fonts';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
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
    marginBottom: 20,
  },
  inputLower: {
    height: 'auto',
    borderWidth: 1,
    paddingLeft: 12,
    borderRadius: 5,
    color: colors.black,
    borderWidth: 1,
    // width: '100%',
    fontSize: 16,
    borderColor: colors.white,
    backgroundColor: colors.purple_dim,
    fontFamily: fonts.regular,
    // marginBottom: 20,
    marginHorizontal: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    marginVertical: 10,
  },
  inputLowerLeft: {
    width: '30%',
    flexDirection: 'row',
    paddingLeft: 20,
  },
  inputLowerRight: {
    width: '70%',
    flexDirection: 'row',
    marginRight: 20,
    justifyContent: 'flex-end',
  },
  text: {
    color: 'black',
  },
  imageView: {
    backgroundColor: colors.purple_dim,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '8%',
    height: 70,
    width: 70,
    alignSelf: 'center',
    borderRadius: 40,
    borderColor: colors.app_red,
    elevation: 2,
    marginTop: 20,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 35,
  },
  img: {height: 30, width: 30, resizeMode: 'contain', alignSelf: 'center'},
  verifyImg: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    position: 'absolute',
    left: 45,
    bottom: 40,
  },
  userDetailsView: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  verifiedStatus: {
    color: colors.white,
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: fonts.regular,
    backgroundColor: colors.green,
    maxWidth: '35%',
    textAlign: 'center',
    borderRadius: 10,
    padding: 3,
    overflow: 'hidden',
  },
  verifyView: {
    backgroundColor: colors.purple_dim,
    height: 50,
    paddingLeft: 12,
    borderRadius: 5,
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
});
