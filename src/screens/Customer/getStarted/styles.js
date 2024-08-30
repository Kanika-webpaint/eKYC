import {StyleSheet} from 'react-native';
import colors from '../../../common/colors';
import {fonts} from '../../../common/fonts';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.app_blue,
  },
  mainView: {
    backgroundColor: colors.light_purple,
    margin: 30,
    marginTop: '10%',
    justifyContent: 'center',
    padding: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  middleText: {
    marginTop: 30,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grey,
    lineHeight: 22,
  },
  textVerify: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: '5%',
    backgroundColor: colors.app_red,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    alignSelf: 'center',
    fontFamily: fonts.medium,
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    padding: 20,
    backgroundColor: 'white',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
  },
  closeButtonText: {
    fontSize: 50,
    color: 'black',
  },
});
