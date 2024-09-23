import {StyleSheet} from 'react-native';
import colors from '../../../../common/colors';
import {fonts} from '../../../../common/fonts';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.app_blue,
    // justifyContent: 'center',
  },
  welcome: {
    color: 'white',
    fontSize: 35,
    marginLeft: '5%',
    marginTop: '10%',
    fontFamily: fonts.bold,
  },
  descText: {
    color: 'white',
    fontSize: 20,
    marginLeft: '5%',
    marginTop: '80%',
    fontFamily: fonts.regular,
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
});
