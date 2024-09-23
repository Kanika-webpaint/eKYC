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
    paddingLeft: 12,
    borderRadius: 5,
    backgroundColor: colors.purple_dim,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  img: {height: 30, width: 30, resizeMode: 'contain', alignSelf: 'center'},
  itemSetting: {
    fontFamily: fonts.regular,
    color: colors.black,
    fontSize: 16,
    alignSelf: 'center',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
