import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  NativeEventEmitter,
  Platform,
  TouchableOpacity,
  Image,
  Button,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
} from 'react-native';
import DocumentReader, {
  Enum,
  DocumentReaderCompletion,
  DocumentReaderScenario,
  RNRegulaDocumentReader,
  DocumentReaderResults,
  DocumentReaderNotification,
  ScannerConfig,
  RecognizeConfig,
  DocReaderConfig,
  Functionality,
  ScenarioIdentifier,
} from '@regulaforensics/react-native-document-reader-api';
import * as RNFS from 'react-native-fs';
import RadioGroup from 'react-native-radio-buttons-group';
import {CheckBox} from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import {launchImageLibrary} from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import {useNavigation} from '@react-navigation/native';
import Status from '../../../components/Status';
import {logoValidyfy} from '../../../common/images';
import RedButton from '../../../components/RedButton';
import {styles} from './styles';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import Loader from '../../../components/ActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  checkverifiedUser,
  verifedCustomerDataAction,
} from '../../../redux/actions/user/UserAction';
import {verifyCodeslice} from '../../../redux/slices/user/userSlice';
import showAlert from '../../../components/showAlert';

const IdScreen = ({navigation}) => {
  const [fullName, setFullName] = useState('Please wait...');
  const [doRfid, setDoRfid] = useState(false);
  const [isReadingRfidCustomUi, setIsReadingRfidCustomUi] = useState(false);
  const [rfidUIHeader, setRfidUIHeader] = useState('');
  const [rfidUIHeaderColor, setRfidUIHeaderColor] = useState('black');
  const [rfidDescription, setRfidDescription] = useState('');
  const [rfidProgress, setRfidProgress] = useState(-1);
  const [canRfid, setCanRfid] = useState(false);
  const [canRfidTitle, setCanRfidTitle] = useState('(unavailable)');
  const [isPortrait, setIsPortrait] = useState(true);
  const {height: screenHeight} = Dimensions.get('window');
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [userToken, setTokenUser] = useState('');
  const isCheckStatus = useSelector(state => state.user.verified);
  console.log(isCheckStatus, 'hjjjjjjjjj');
  const [radioButtons, setRadioButtons] = useState([
    {label: 'Loading', id: '0'},
  ]);
  const [selectedScenario, setSelectedScenario] = useState('');
  const [portrait, setPortrait] = useState(
    require('../../../common/assets/back.png'),
  );
  const [docFront, setDocFront] = useState(
    require('../../../common/assets/back.png'),
  );
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

  useEffect(() => {
    AsyncStorage.getItem('token_user')
      .then(value => {
        if (value) {
          setTokenUser(value);
          dispatch(checkverifiedUser(navigation, userToken, setIsLoading));
        }
      })
      .then(res => {});
  }, [dispatch, userToken]);

  useEffect(() => {
    const updateOrientation = () => {
      const {height, width} = Dimensions.get('window');
      setIsPortrait(height > width);
    };
    Dimensions.addEventListener('change', updateOrientation);
  }, []);

  useEffect(() => {
    const updateOrientation = () => {
      const {height, width} = Dimensions.get('window');
      setIsPortrait(height > width);
    };
    const unsubscribeFocus = navigation.addListener('focus', updateOrientation);
    return unsubscribeFocus;
  }, [navigation]);

  useEffect(() => {
    Icon.loadFont();
    const eventManager = new NativeEventEmitter(RNRegulaDocumentReader);
    eventManager.addListener('completion', e =>
      handleCompletion(DocumentReaderCompletion.fromJson(JSON.parse(e['msg']))),
    );
    eventManager.addListener('rfidOnProgressCompletion', e =>
      updateRfidUI(DocumentReaderNotification.fromJson(JSON.parse(e['msg']))),
    );
  }, []);

  const handlePermissions = async () => {
    console.log('1111111');
    if (isCheckStatus?.isVerified == 2) {
      showAlert('You are already verified');
      setIsLoading(false);
      await AsyncStorage.clear();
      dispatch(verifyCodeslice(false));
    } else {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA;
      const result = await handlePermissionCheck(permission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert(
            'Permission Unavailable',
            'This feature is not available on this device.',
          );
          break;
        case RESULTS.DENIED:
          const requestResult = await handlePermissionRequest(permission);
          if (requestResult === RESULTS.GRANTED) {
            Alert.alert(
              'Permission Approved',
              'Camera permissions are approved.',
            );
            proceedWithDocumentReading();
          } else {
            Alert.alert(
              'Permission Denied',
              'Camera permissions are required for this feature.',
            );
          }
          break;
        case RESULTS.LIMITED:
          Alert.alert(
            'Permission Limited',
            'The permission is limited: some actions are possible.',
          );
          break;
        case RESULTS.GRANTED:
          proceedWithDocumentReading();
          break;
        case RESULTS.BLOCKED:
          Alert.alert(
            'Permission Blocked',
            'The permission is denied and not requestable anymore.',
          );
          break;
      }
    }
  };

  const handlePermissionCheck = async permission => {
    return await check(permission);
  };

  const handlePermissionRequest = async permission => {
    return await request(permission);
  };

  const proceedWithDocumentReading = async () => {
    console.log('---------------');
    // await DocumentReader.deinitializeReader(
    //   s => {},
    //   e => {},
    // );
    setIsLoading(true);
    await prepareDatabase();
    // setIsLoading(false);
  };

  const prepareDatabase = async () => {
    await DocumentReader.prepareDatabase(
      'Full',
      respond => {
        console.log(respond, 'Database preparation complete');

        initialize();
      },
      error => {
        console.log(error, 'Database preparation error');
        setIsLoading(false);
      },
    );
  };

  const initialize = async () => {
    console.log('Initializing...');
    const licPath = `${RNFS.MainBundlePath}/regula.license`;
    const readFile =
      Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets;

    try {
      // Verify file presence
      const fileExists = await RNFS.exists(licPath);
      if (!fileExists) {
        console.error(`File not found at ${licPath}`);
        Alert.alert('Error: License file not found');
        setIsLoading(false);
        return;
      }

      // Read the file
      const res = await readFile(licPath, 'base64');
      console.log('File read successfully');

      // Initialize the reader
      await DocumentReader.initializeReader(
        {license: res},
        respond => {
          console.log('Initialization successful', respond);
          setIsLoading(false);
          onInitialized();
        },
        error => {
          console.log('Initialization error', error);
          setIsLoading(false);
          Alert.alert('Initialization error');
        },
      );
    } catch (err) {
      console.error('Error during initialization:', err);
      Alert.alert('Error initializing reader');
      setIsLoading(false);
    }
  };

  // Call this function to ensure initialization
  initialize();

  // const initialize = async () => {
  //   console.log('Initializing...');
  //   const licPath =
  //     Platform.OS === 'ios'
  //       ? `${RNFS.MainBundlePath}/regula.license`
  //       : 'regula.license';
  //   const readFile =
  //     Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets;
  //   try {
  //     const res = await readFile(licPath, 'base64');
  //     // Proceed with initialization
  //   } catch (err) {
  //     console.error('Error reading file:', err);
  //     Alert.alert('Error reading license file');
  //     return;
  //   }

  //   // const res = await readFile(licPath, 'base64');
  //   // await DocumentReader.initializeReader(
  //   //   {
  //   //     license: res,
  //   //   },
  //   //   respond => {
  //   //     console.log(respond, 'Initialization successful');
  //   //     setIsLoading(false);
  //   //     onInitialized();
  //   //   },
  //   //   error => {
  //   //     console.log(error, 'Initialization error');
  //   //     // setIsInitialized(false);
  //   //     setIsLoading(false);
  //   //     Alert.alert('Initialization error');
  //   //   },
  //   // );
  // };

  const onInitialized = () => {
    // setFullName('Ready');
    const functionality = new Functionality();
    functionality.showCaptureButton = true;
    DocumentReader.setFunctionality(
      functionality,
      () => {},
      () => {},
    );
    scan();
  };

  const handleCrossButtonClick = () => {
    console.log('hhhh');
    setModalVisible(false);
    navigation.navigate('Liveness', {detail: 'cancel', data: {testData}});
  };

  const handleCompletion = completion => {
    if (isReadingRfidCustomUi) {
      if (completion.action === Enum.DocReaderAction.ERROR) restartRfidUI();
      if (actionSuccess(completion.action) || actionError(completion.action)) {
        hideRfidUI();
        displayResults(completion.results);
      }
    } else if (
      actionSuccess(completion.action) ||
      actionError(completion.action)
    ) {
      handleResults(completion.results);
    }
  };

  const actionSuccess = action => {
    return (
      action === Enum.DocReaderAction.COMPLETE ||
      action === Enum.DocReaderAction.TIMEOUT
    );
  };

  const actionError = action => {
    return (
      action === Enum.DocReaderAction.CANCEL ||
      action === Enum.DocReaderAction.ERROR
    );
  };

  const showRfidUI = () => {
    setIsReadingRfidCustomUi(true);
  };

  const hideRfidUI = () => {
    DocumentReader.stopRFIDReader(
      () => {},
      () => {},
    );
    restartRfidUI();
    setIsReadingRfidCustomUi(false);
    setRfidUIHeader('Reading RFID');
    setRfidUIHeaderColor('black');
  };

  const restartRfidUI = () => {
    setRfidUIHeaderColor('red');
    setRfidUIHeader('Failed!');
    setRfidDescription('Place your phone on top of the NFC tag');
    setRfidProgress(-1);
  };

  const updateRfidUI = notification => {
    if (
      notification.notificationCode ===
      Enum.eRFID_NotificationCodes.RFID_NOTIFICATION_PCSC_READING_DATAGROUP
    ) {
      setRfidDescription('ERFIDDataFileType: ' + notification.dataFileType);
    }
    setRfidUIHeader('Reading RFID');
    setRfidUIHeaderColor('black');
    if (notification.progress != null) {
      setRfidProgress(notification.progress / 100);
    }
    if (Platform.OS === 'ios') {
      DocumentReader.setRfidSessionStatus(
        rfidDescription + '\n' + notification.progress + '%',
        () => {},
        () => {},
      );
    }
  };

  const clearResults = () => {
    setFullName('Ready');
    // setDocFrontuseState(require('../../../common/assets/back.png'));
    // setPortraituseState(require('../../../common/assets/back.png'));
  };

  const scan = () => {
    clearResults();
    const config = new ScannerConfig();
    config.scenario = ScenarioIdentifier.SCENARIO_FULL_PROCESS;
    DocumentReader.scan(
      config,
      () => {},
      e => console.log(e),
    );
  };

  const displayResults = results => {
    if (!results) return;
    setTestData(results);
    setModalVisible(true);
  };

  const customRFID = () => {
    showRfidUI();
    DocumentReader.readRFID(
      false,
      false,
      false,
      () => {},
      () => {},
    );
  };

  const usualRFID = () => {
    isReadingRfid = true;
    DocumentReader.startRFIDReader(
      false,
      false,
      false,
      () => {},
      () => {},
    );
  };

  const handleResults = results => {
    if (doRfid && !isReadingRfid && results && results.chipPage !== 0) {
      // customRFID();
      usualRFID();
    } else {
      isReadingRfid = false;
      displayResults(results);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <ScrollView
          style={{marginBottom: '10%'}}
          keyboardShouldPersistTaps="handled">
          <Status lightContent />
          <Image
            source={logoValidyfy}
            style={{
              marginTop: isPortrait ? '20%' : '5%',
              alignSelf: 'center',
              resizeMode: 'contain',
              height: 80,
              width: '60%',
            }}
          />
          <View style={[styles.mainView, {height: screenHeight * 0.5}]}>
            <Text style={styles.textVerify}>
              Simplify Identity Verification
            </Text>
            <Text style={styles.middleText}>
              Validifyx provides seamless digital verification solutions,
              empowering businesses to securely and conveniently interact with
              their customers.
            </Text>
          </View>
          <RedButton
            buttonContainerStyle={[
              styles.buttonContainer,
              {marginBottom: isPortrait ? 0 : 20},
            ]}
            ButtonContent={isLoading ? <Loader /> : "Let's get started"}
            image
            contentStyle={styles.buttonText}
            onPress={handlePermissions}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                handleCrossButtonClick();
              }}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: 'white',
                height: 500,
                marginTop: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 30, color: 'black'}}>Selfie Time!</Text>

              <Text style={{fontSize: 25, color: 'black', marginTop: 30}}>
                Get Ready
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  // justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  marginTop: 15,
                  width: '90%',
                }}>
                <View style={{width: '20%', backgroundColor: 'white'}}>
                  <Image
                    source={require('../../../common/assets/back.png')}
                    style={{height: 20, width: 20}}
                  />
                </View>

                <Text style={{fontSize: 22, color: 'black'}}>
                  Good illumination
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  // justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  marginTop: 15,
                  width: '90%',
                }}>
                <View style={{width: '20%', backgroundColor: 'white'}}>
                  <Image
                    source={require('../../../common/assets/back.png')}
                    style={{height: 20, width: 20}}
                  />
                </View>
                <View style={{width: '80%', backgroundColor: 'white'}}>
                  <Text style={{fontSize: 22, color: 'black'}}>
                    No accessories:
                  </Text>
                  <Text style={{fontSize: 22, color: 'black'}}>
                    glasses,mask, hat etc.
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  // justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  marginTop: 15,
                  width: '90%',
                }}>
                <View style={{width: '20%', backgroundColor: 'white'}}>
                  <Image
                    source={require('../../../common/assets/back.png')}
                    style={{height: 20, width: 20}}
                  />
                </View>

                <Text style={{fontSize: 22, color: 'black'}}>
                  Camera at eye level
                </Text>
              </View>

              <RedButton
                buttonContainerStyle={[
                  styles.buttonContainer,
                  {
                    marginBottom: isPortrait ? 0 : 20,
                    height: 60,
                    width: '90%',
                    marginTop: 40,
                  },
                ]}
                ButtonContent={isLoading ? <Loader /> : 'Go'}
                image
                contentStyle={styles.buttonText}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('Liveness', {
                    detail: 'ok',
                    data: {testData},
                  });
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default IdScreen;
