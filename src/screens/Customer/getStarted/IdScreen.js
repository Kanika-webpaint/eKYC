// import React, {useEffect, useState, useCallback} from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   ScrollView,
//   Dimensions,
//   KeyboardAvoidingView,
//   Image,
//   Platform,
//   Alert,
//   NativeEventEmitter,
//   Button,
//   Modal,
//   TouchableOpacity,
// } from 'react-native';
// import RedButton from '../../../components/RedButton';
// import {useNavigation} from '@react-navigation/native';
// import Status from '../../../components/Status';
// import Loader from '../../../components/ActivityIndicator';
// import {TEMPLATE_ID} from '@env';
// import showAlert from '../../../components/showAlert';
// import {styles} from './styles';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useDispatch, useSelector} from 'react-redux';
// import {verifyCodeslice} from '../../../redux/slices/user/userSlice';
// import {
//   checkverifiedUser,
//   verifedCustomerDataAction,
// } from '../../../redux/actions/user/UserAction';
// import {logoValidyfy} from '../../../common/images';
// import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
// import RNFS from 'react-native-fs';
// import DocumentReader, {
//   Enum,
//   DocumentReaderCompletion,
//   DocumentReaderScenario,
//   RNRegulaDocumentReader,
//   DocumentReaderResults,
//   DocumentReaderNotification,
//   ScannerConfig,
//   ScenarioIdentifier,
//   RecognizeConfig,
//   DocReaderConfig,
//   Functionality,
//   getProcessParams,
//   setProcessParams,
// } from '@regulaforensics/react-native-document-reader-api';
// import DocumentPicker from 'react-native-document-picker';
// import {launchImageLibrary} from 'react-native-image-picker';
// import Progress from 'react-native-progress';
// import CheckBox from '@react-native-community/checkbox';
// import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';

// function IdScreen() {
//   const navigation = useNavigation();
//   const [isLoading, setIsLoading] = useState(false);
//   const {height: screenHeight} = Dimensions.get('window');
//   const dispatch = useDispatch();
//   const [userToken, setTokenUser] = useState('');
//   const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
//   const isCheckStatus = useSelector(state => state.user.verified);
//   const [selectedScenario, setSelectedScenario] = useState('');
//   const [isReadingRfidCustomUi, setIsReadingRfidCustomUi] = useState(false);
//   const [rfidUIHeader, setRfidUIHeader] = useState('Reading RFID');
//   const [rfidUIHeaderColor, setRfidUIHeaderColor] = useState('black');
//   const [rfidDescription, setRfidDescription] = useState('');
//   const [rfidProgress, setRfidProgress] = useState(-1);
//   const [doRfid, setDoRfid] = useState(false);
//   const [isReadingRfid, setIsReadingRfid] = useState(false);
//   const [fullName, setFullName] = useState('');
//   const [docFront, setDocFront] = useState(null);
//   const [isPotrait, setIsPortrait] = useState(true);
//   const [radioButtons, setRadioButtons] = useState([]);
//   const [canRfid, setCanRfid] = useState(false); // Assuming you have a state for canRfid
//   const [canRfidTitle, setCanRfidTitle] = useState(''); // Assuming you have a state for canRfidTitle
//   const [documentType, setDocumentType] = useState([]);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [fields, setFields] = useState({
//     documentNumberField: '',
//     documentNumberFieldSourceTypeBarcode: '',
//     documentNumberFieldSourceTypeVisual: '',
//     dob: '',
//     dobBarcode: '',
//     dobVisual: '',
//     name: '',
//     nameBarcode: '',
//     nameVisual: '',
//     country: '',
//     countryBarcode: '',
//     countryVisual: '',
//     state: '',
//     stateBarcode: '',
//     stateVisual: '',
//     fatherName: '',
//     fatherNameBarcode: '',
//     fatherNameVisual: '',
//     bloodgroup: '',
//     bloodgroupBarcode: '',
//     bloodgroupVisual: '',
//     age: '',
//     ageBarcode: '',
//     ageVisual: '',
//     issuedate: '',
//     issuedateBarcode: '',
//     issuedateVisual: '',
//     validto: '',
//     validtoBarcode: '',
//     validtoVisual: '',
//     sex: '',
//     sexBarcode: '',
//     sexVisual: '',
//     imageFront: '',
//     imageFrontBarcode: '',
//     imageFrontVisual: '',
//     imagePortrait: '',
//     imagePortraitVisual: '',
//     imagePortraitBarcode: '',
//     signature: '',
//     signatureBarcode: '',
//     signatureVisual: '',
//     barCode: '',
//     barCodeBarcode: '',
//     barCodeVisual: '',
//     dCountryName: '',
//     dCountryNameBarcode: '',
//     dCountryNameVisual: '',
//     documentName: '',
//     documentNameBarcode: '',
//     documentNameVisual: '',
//     issueStateCode: '',
//     issueStateCodeBarcode: '',
//     issueStateCodeVisual: '',
//     surName: '',
//     surNameBarcode: '',
//     surNameVisual: '',
//   });
//   const [testData, setTestData] = useState('');

//   // console.log(DocumentReader, 'documenttype--------');

//   // useEffect(() => {
//   //   // Check and set screen orientation
//   //   const handleOrientationChange = () => {
//   //     const {height, width} = Dimensions.get('window');
//   //     setIsPortrait(height > width);
//   //   };

//   //   Dimensions.addEventListener('change', handleOrientationChange);
//   //   return () => {
//   //     Dimensions.removeEventListener('change', handleOrientationChange);
//   //   };
//   // }, []);

//   // useEffect(() => {
//   //   prepareDatabase();
//   // }, [navigation]);

//   const actionSuccess = action => {
//     return (
//       action === Enum.DocReaderAction.COMPLETE ||
//       action === Enum.DocReaderAction.TIMEOUT
//     );
//   };

//   const actionError = action => {
//     return (
//       action === Enum.DocReaderAction.CANCEL ||
//       action === Enum.DocReaderAction.ERROR
//     );
//   };

//   const prepareDatabase = async () => {
//     await DocumentReader.prepareDatabase(
//       'Full',
//       respond => {
//         console.log(respond, 'Database preparation complete');

//         initialize();
//       },
//       error => {
//         console.log(error, 'Database preparation error');
//         setIsLoading(false);
//       },
//     );
//   };

//   const initialize = async () => {
//     console.log('Initializing...');
//     const licPath =
//       Platform.OS === 'ios'
//         ? `${RNFS.MainBundlePath}/regula.license`
//         : 'regula.license';
//     const readFile =
//       Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets;
//     const res = await readFile(licPath, 'base64');
//     await DocumentReader.initializeReader(
//       {
//         license: res,
//       },
//       respond => {
//         console.log(respond, 'Initialization successful');
//         setIsInitialized(true);
//         process();
//       },
//       error => {
//         console.log(error, 'Initialization error');
//         setIsInitialized(false);
//         setIsLoading(false);
//         Alert.alert('Initialization error');
//       },
//     );
//   };

//   const process = async () => {
//     if (!isInitialized) {
//       Alert.alert('Initialization Error', 'Checking again.');
//       // initialize();
//     }
//     const eventManager = new NativeEventEmitter(RNRegulaDocumentReader);

//     const config = new ScannerConfig();
//     config.scenario = ScenarioIdentifier.SCENARIO_FULL_PROCESS;
//     // config.respectImageQuality = true;
//     DocumentReader.scan(
//       config,
//       _ => {},
//       e => console.log(e),
//     );
//     eventManager.addListener('completion', e =>
//       handleCompletion(DocumentReaderCompletion.fromJson(JSON.parse(e['msg']))),
//     );
//   };

//   const handleCompletion = completion => {
//     // console.log(completion, 'handleCompletion');

//     if (isReadingRfidCustomUi) {
//       // console.log('zzzzzzzzzz');
//       if (completion.action == Enum.DocReaderAction.ERROR)
//         DocumentReader.deinitializeReader(
//           s => {},
//           e => {},
//         );
//       // console.log('xxxxxxxxxxxx');
//       // restartRfidUI();
//       if (actionSuccess(completion.action) || actionError(completion.action)) {
//         // console.log('a');
//         hideRfidUI();
//         displayResults(completion.results);
//       }
//     } else if (
//       actionSuccess(completion.action) ||
//       actionError(completion.action)
//     ) {
//       // console.log('b');

//       handleResults(completion.results);
//     }
//   };

//   const showRfidUI = () => {
//     // show animation
//     setIsReadingRfidCustomUi(true);
//   };

//   const hideRfidUI = () => {
//     // show animation
//     DocumentReader.stopRFIDReader(
//       () => {},
//       () => {},
//     );
//     restartRfidUI();
//     setIsReadingRfidCustomUi(false);
//     setRfidUIHeader('Reading RFID');
//     setRfidUIHeaderColor('black');
//   };

//   const restartRfidUI = () => {
//     setRfidUIHeaderColor('red');
//     setRfidUIHeader('Failed!');
//     setRfidDescription('Place your phone on top of the NFC tag');
//     setRfidProgress(-1);
//   };

//   const updateRfidUI = notification => {
//     if (
//       notification.notificationCode ===
//       Enum.eRFID_NotificationCodes.RFID_NOTIFICATION_PCSC_READING_DATAGROUP
//     ) {
//       setRfidDescription('ERFIDDataFileType: ' + notification.dataFileType);
//     }
//     setRfidUIHeader('Reading RFID');
//     setRfidUIHeaderColor('black');
//     if (notification.progress != null) {
//       setRfidProgress(notification.progress / 100);
//     }
//     if (Platform.OS === 'ios') {
//       DocumentReader.setRfidSessionStatus(
//         `${rfidDescription}\n${notification.progress}%`,
//         () => {},
//         () => {},
//       );
//     }
//   };

//   const handleResults = results => {
//     // console.log('handleresults-------------', results);
//     if (!isReadingRfid && results?.chipPage !== 0) {
//       usualRFID();
//     } else {
//       setIsReadingRfid(false);
//       displayResults(results);
//     }
//   };

//   const usualRFID = () => {
//     // console.log('usualrfid-------------');

//     setIsReadingRfid(true);
//     initialize();
//     // DocumentReader.startRFIDReader(
//     //   false,
//     //   false,
//     //   false,
//     //   _ => {},
//     //   _ => {},
//     // );
//   };

//   const displayResults = results => {
//     setTestData(results);
//     setIsLoading(false);
//     // console.log(
//     //   results?.textResult?.fields?.values,
//     //   '------------------------------------------------------',
//     // );
//     // console.log(
//     //   results?.graphicResult?.fields,
//     //   '9999999999999999999999999999999999999999999',
//     // );
//     console.log(
//       results?.textResult?.availableSourceList,
//       'displayresults-------------',
//     );

//     if (results?.textResult?.fields == null || undefined) {
//       Alert.alert('Error Please check again');
//       setIsLoading(false);
//     }

//     // if (results?.documentType.length > 0) {
//     //   console.log(
//     //     results?.documentType[0],
//     //     '---------------------------------------------------------------',
//     //   );
//     // }

//     const imageFront = results?.graphicResult?.fields.find(
//       item => item.fieldName === 'Document image',
//     );

//     const imagePortrait = results?.graphicResult?.fields.find(
//       item => item.fieldName === 'Portrait',
//     );

//     const signature = results?.graphicResult?.fields.find(
//       item => item.fieldName === 'Signature',
//     );

//     const barCode = results?.graphicResult?.fields.find(
//       item => item.fieldName === 'Barcode',
//     );

//     const dCountryName = results?.documentType[0]?.dCountryName;
//     console.log(dCountryName, 'country name');

//     const documentName = results?.documentType[0]?.name;

//     if (results?.textResult?.fields) {
//       setDocumentType(results?.textResult?.fields);

//       const documentNumberField = results?.textResult?.fields.find(
//         item => item.fieldName === 'Document number',
//       );

//       const documentNumberFieldSourceTypeBarcode =
//         documentNumberField?.values.find(item => item.sourceType === 18);
//       const documentNumberFieldSourceTypeVisual =
//         documentNumberField?.values.find(item => item.sourceType === 17);

//       const issueStateCode = results?.textResult?.fields.find(
//         item => item.fieldName === 'Issuing state code',
//       );
//       console.log(issueStateCode, '00000000000000000000000');
//       const issueStateCodeBarcode = issueStateCode?.values.find(
//         item => item.sourceType === 18,
//       );
//       console.log(issueStateCodeBarcode, '111111111111111111');

//       const issueStateCodeVisual = issueStateCode?.values.find(
//         item => item.sourceType === 17,
//       );
//       console.log(issueStateCodeVisual, '222222222222222222');

//       const surName = results?.textResult?.fields.find(
//         item => item.fieldName === 'Surname and given names',
//       );

//       const surNameBarcode = surName?.values.find(
//         item => item.sourceType === 18,
//       );
//       const surNameVisual = surName?.values.find(
//         item => item.sourceType === 17,
//       );

//       const dob = results?.textResult?.fields.find(
//         item => item.fieldName === 'Date of birth',
//       );

//       const dobBarcode = documentNumberField?.values.find(
//         item => item.sourceType === 18,
//       );
//       const dobVisual = documentNumberField?.values.find(
//         item => item.sourceType === 17,
//       );

//       const name = results?.textResult?.fields.find(
//         item => item.fieldName === 'Surname and given names',
//       );

//       const nameBarcode = documentNumberField?.values.find(
//         item => item.sourceType === 18,
//       );
//       const nameVisual = documentNumberField?.values.find(
//         item => item.sourceType === 17,
//       );

//       const country = results?.textResult?.fields.find(
//         item => item.fieldName === 'Issuing state',
//       );

//       const countryBarcode = documentNumberField?.values.find(
//         item => item.sourceType === 18,
//       );
//       const countryVisual = documentNumberField?.values.find(
//         item => item.sourceType === 17,
//       );

//       const state = results?.textResult?.fields.find(
//         item => item.fieldName === 'State',
//       );

//       const stateBarcode = documentNumberField?.values.find(
//         item => item.sourceType === 18,
//       );
//       const stateVisual = documentNumberField?.values.find(
//         item => item.sourceType === 17,
//       );

//       const fathername = results?.textResult?.fields.find(
//         item => item.fieldName === "Father's name",
//       );

//       const fatherNameBarcode = documentNumberField?.values.find(
//         item => item.sourceType === 18,
//       );
//       const fatherNameVisual = documentNumberField?.values.find(
//         item => item.sourceType === 17,
//       );

//       const bloodgroup = results?.textResult?.fields.find(
//         item => item.fieldName === 'Blood group',
//       );

//       const bloodgroupBarcode = documentNumberField?.values.find(
//         item => item.sourceType === 18,
//       );
//       const bloodgroupVisual = documentNumberField?.values.find(
//         item => item.sourceType === 17,
//       );

//       const age = results?.textResult?.fields.find(
//         item => item.fieldName === 'Age',
//       );

//       const ageBarcode = documentNumberField?.values.find(
//         item => item.sourceType === 18,
//       );
//       const ageVisual = documentNumberField?.values.find(
//         item => item.sourceType === 17,
//       );

//       const issuedate = results?.textResult?.fields.find(
//         item => item.fieldName === 'First issue date',
//       );

//       const issuedateBarcode = documentNumberField?.values.find(
//         item => item.sourceType === 18,
//       );
//       const issuedateVisual = documentNumberField?.values.find(
//         item => item.sourceType === 17,
//       );

//       const validto = results?.textResult?.fields.find(
//         item => item.fieldName === 'DL category NT valid to',
//       );

//       const validtoBarcode = documentNumberField?.values.find(
//         item => item.sourceType === 18,
//       );
//       const validtoVisual = documentNumberField?.values.find(
//         item => item.sourceType === 17,
//       );

//       const sex = results?.textResult?.fields.find(
//         item => item.fieldName === 'Sex',
//       );
//       const sexBarcode = documentNumberField?.values.find(
//         item => item.sourceType === 18,
//       );
//       const sexVisual = documentNumberField?.values.find(
//         item => item.sourceType === 17,
//       );

//       const updatedFields = {
//         documentNumberField: documentNumberField?.getValue?.originalValue || '',
//         documentNumberFieldSourceTypeBarcode:
//           documentNumberFieldSourceTypeBarcode?.originalValue,
//         documentNumberFieldSourceTypeVisual:
//           documentNumberFieldSourceTypeVisual?.originalValue,
//         dob: dob?.getValue?.originalValue || '',
//         dobBarcode: dobBarcode?.originalValue,
//         dobVisual: dobVisual?.originalValue,
//         name: name?.getValue?.originalValue || '',
//         nameBarcode: nameBarcode?.originalValue,
//         nameVisual: nameVisual?.originalValue,
//         country: country?.getValue?.value || '',
//         countryBarcode: countryBarcode?.originalValue,
//         countryVisual: countryVisual?.originalValue,
//         state: state?.getValue?.value || '',
//         stateBarcode: stateBarcode?.originalValue,
//         stateVisual: stateVisual?.originalValue,
//         fatherName: fathername?.getValue?.value || '',
//         fatherNameBarcode: fatherNameBarcode?.originalValue,
//         fatherNameVisual: fatherNameVisual?.originalValue,
//         bloodgroup: bloodgroup?.getValue?.originalValue || '',
//         bloodgroupBarcode: bloodgroupBarcode?.originalValue,
//         bloodgroupVisual: bloodgroupVisual?.originalValue,
//         age: age?.getValue?.value || '',
//         ageBarcode: ageBarcode?.originalValue,
//         ageVisual: ageVisual?.originalValue,
//         issuedate: issuedate?.getValue?.originalValue || '',
//         issuedateBarcode: issuedateBarcode?.originalValue,
//         issuedateVisual: issuedateVisual?.originalValue,
//         validto: validto?.getValue?.originalValue || '',
//         validtoBarcode: validtoBarcode?.originalValue,
//         validtoVisual: validtoVisual?.originalValue,
//         sex: sex?.getValue?.originalValue || '',
//         sexBarcode: sexBarcode?.originalValue,
//         sexVisual: sexVisual?.originalValue,
//         imageFront: imageFront?.value || '',
//         // imageFrontBarcode: imageFrontBarcode?.originalValue,
//         // imageFrontVisual: imageFrontVisual?.originalValue,
//         imagePortrait: imagePortrait?.value,
//         // imagePortraitBarcode: imagePortraitBarcode?.originalValue,
//         // imagePortraitVisual: imagePortraitVisual?.originalValue,
//         signature: signature?.value,
//         // signatureBarcode: signatureBarcode?.originalValue,
//         // signatureVisual: signatureVisual?.originalValue,
//         barCode: barCode?.value,
//         // barCodeBarcode: barCodeBarcode?.originalValue,
//         // barCodeVisual: barCodeVisual?.originalValue,
//         dCountryName: dCountryName,
//         // dCountryNameBarcode: dCountryNameBarcode?.originalValue,
//         // dCountryNameVisual: dCountryNameVisual?.originalValue,
//         documentName: documentName,
//         // documentNameBarcode: documentNameBarcode?.originalValue,
//         // documentNameVisual: documentNameVisual?.originalValue,
//         issueStateCode: issueStateCode?.value,
//         issueStateCodeBarcode: issueStateCodeBarcode?.value,
//         issueStateCodeVisual: issueStateCodeVisual?.value,
//       };

//       setFields(updatedFields); // Set the updated fields state

//       setModalVisible(true);
//       DocumentReader.setProcessParams(
//         {
//           authenticityParams: {
//             livenessParams: {
//               checkED: true,
//             },
//           },
//         },
//         () => {
//           console.log('Process parameters set successfully');
//         },
//         error => {
//           console.error('Error setting process parameters:', error);
//         },
//       );

//       // DocumentReader.deinitializeReader(
//       //   s => {},
//       //   e => {},
//       // );
//     } else {
//       // If no fields are available, reset the fields to default values
//       setFields({
//         documentNumberField: '',
//         documentNumberFieldSourceTypeBarcode: '',
//         documentNumberFieldSourceTypeVisual: '',
//         dob: '',
//         name: '',
//         country: '',
//         state: '',
//         fatherName: '',
//         bloodgroup: '',
//         age: '',
//         issuedate: '',
//         validto: '',
//         sex: '',
//         imageFront: '',
//         imagePortrait: '',
//         signature: '',
//         barCode: '',
//         dCountryName: '',
//         documentName: '',
//         issueStateCode: '',
//       });
//     }
//   };

//   // const recognize = async () => {
//   //   if (!isInitialized) {
//   //     Alert.alert('Initialization Error', 'Checking again.');
//   //     initialize();
//   //   }
//   //   await handlePermissions();
//   //   launchImageLibrary(
//   //     {
//   //       mediaType: 'mixed',
//   //       includeBase64: true,
//   //       selectionLimit: 1,
//   //     },
//   //     response => {
//   //       if (response.errorCode != null) {
//   //         console.log('Error code: ' + response.errorCode);
//   //         console.log('Error message: ' + response.errorMessage);
//   //         return;
//   //       }
//   //       if (response.didCancel) return;

//   //       const response1 = response.assets;
//   //       // console.log(response1, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
//   //       if (response1 && response1.length > 0) {
//   //         const images = response1[0].base64;
//   //         // console.log(images, 'zzzzzzzzzzzzzzzz');

//   //         const eventManager = new NativeEventEmitter(RNRegulaDocumentReader);
//   //         const config = new RecognizeConfig();
//   //         config.scenario = ScenarioIdentifier.SCENARIO_FULL_PROCESS;
//   //         config.images = [images];
//   //         DocumentReader.recognize(
//   //           config,
//   //           _ => {},
//   //           e => console.log(e, '3444444444555555'),
//   //         );
//   //         eventManager.addListener('completion', e =>
//   //           handleCompletion(
//   //             DocumentReaderCompletion.fromJson(JSON.parse(e['msg'])),
//   //           ),
//   //         );

//   //         eventManager.addListener('rfidOnProgressCompletion', e =>
//   //           updateRfidUI(
//   //             DocumentReaderNotification.fromJson(JSON.parse(e['msg'])),
//   //           ),
//   //         );
//   //       }
//   //     },
//   //   );
//   // };

//   const handlePermissionCheck = async permission => {
//     return await check(permission);
//   };

//   const handlePermissionRequest = async permission => {
//     return await request(permission);
//   };

//   const handlePermissions = async () => {
//     // console.log('1111111');
//     const permission =
//       Platform.OS === 'ios'
//         ? PERMISSIONS.IOS.CAMERA
//         : PERMISSIONS.ANDROID.CAMERA;
//     const result = await handlePermissionCheck(permission);
//     // console.log('2222222', result);

//     switch (result) {
//       case RESULTS.UNAVAILABLE:
//         Alert.alert(
//           'Permission Unavailable',
//           'This feature is not available on this device.',
//         );
//         break;
//       case RESULTS.DENIED:
//         const requestResult = await handlePermissionRequest(permission);
//         if (requestResult === RESULTS.GRANTED) {
//           Alert.alert(
//             'Permission Approved',
//             'Camera permissions are approved.',
//           );
//           proceedWithDocumentReading();
//         } else {
//           Alert.alert(
//             'Permission Denied',
//             'Camera permissions are required for this feature.',
//           );
//         }
//         break;
//       case RESULTS.LIMITED:
//         Alert.alert(
//           'Permission Limited',
//           'The permission is limited: some actions are possible.',
//         );
//         break;
//       case RESULTS.GRANTED:
//         proceedWithDocumentReading();
//         break;
//       case RESULTS.BLOCKED:
//         Alert.alert(
//           'Permission Blocked',
//           'The permission is denied and not requestable anymore.',
//         );
//         break;
//     }
//   };

//   const proceedWithDocumentReading = async () => {
//     console.log('---------------');
//     // await DocumentReader.deinitializeReader(
//     //   s => {},
//     //   e => {},
//     // );
//     setIsLoading(true);
//     await prepareDatabase();
//     // setIsLoading(false);
//   };

//   const handleCrossButtonClick = () => {
//     console.log('hhhh');
//     setModalVisible(false);
//     navigation.navigate('Liveness', {detail: 'cancel', data: {testData}});
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={keyboardVerticalOffset}>
//         <ScrollView
//           style={{marginBottom: '10%'}}
//           keyboardShouldPersistTaps="handled">
//           <Status lightContent />
//           <Image
//             source={logoValidyfy}
//             style={{
//               marginTop: isPotrait ? '20%' : '5%',
//               alignSelf: 'center',
//               resizeMode: 'contain',
//               height: 80,
//               width: '60%',
//             }}
//           />
//           <View style={[styles.mainView, {height: screenHeight * 0.5}]}>
//             <Text style={styles.textVerify}>
//               Simplify Identity Verification
//             </Text>
//             <Text style={styles.middleText}>
//               Validifyx provides seamless digital verification solutions,
//               empowering businesses to securely and conveniently interact with
//               their customers.
//             </Text>
//           </View>
//           <RedButton
//             buttonContainerStyle={[
//               styles.buttonContainer,
//               {marginBottom: isPotrait ? 0 : 20},
//             ]}
//             ButtonContent={isLoading ? <Loader /> : "Let's get started"}
//             image
//             contentStyle={styles.buttonText}
//             onPress={() => handlePermissions()}
//           />
//         </ScrollView>
//       </KeyboardAvoidingView>

//       <Modal transparent={true} visible={modalVisible} animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             {/* <Text style={styles.modalText}>Modal is now visible!</Text> */}
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => {
//                 handleCrossButtonClick();
//               }}>
//               <Text style={styles.closeButtonText}>×</Text>
//             </TouchableOpacity>
//             <View
//               style={{
//                 backgroundColor: 'white',
//                 height: 500,
//                 marginTop: 100,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//               <Text style={{fontSize: 30, color: 'black'}}>Selfie Time!</Text>

//               <Text style={{fontSize: 25, color: 'black', marginTop: 30}}>
//                 Get Ready
//               </Text>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   // justifyContent: 'center',
//                   alignItems: 'center',
//                   backgroundColor: 'white',
//                   marginTop: 15,
//                   width: '90%',
//                 }}>
//                 <View style={{width: '20%', backgroundColor: 'white'}}>
//                   <Image
//                     source={require('../../../common/assets/back.png')}
//                     style={{height: 20, width: 20}}
//                   />
//                 </View>

//                 <Text style={{fontSize: 22, color: 'black'}}>
//                   Good illumination
//                 </Text>
//               </View>

//               <View
//                 style={{
//                   flexDirection: 'row',
//                   // justifyContent: 'center',
//                   alignItems: 'center',
//                   backgroundColor: 'white',
//                   marginTop: 15,
//                   width: '90%',
//                 }}>
//                 <View style={{width: '20%', backgroundColor: 'white'}}>
//                   <Image
//                     source={require('../../../common/assets/back.png')}
//                     style={{height: 20, width: 20}}
//                   />
//                 </View>
//                 <View style={{width: '80%', backgroundColor: 'white'}}>
//                   <Text style={{fontSize: 22, color: 'black'}}>
//                     No accessories:
//                   </Text>
//                   <Text style={{fontSize: 22, color: 'black'}}>
//                     glasses,mask, hat etc.
//                   </Text>
//                 </View>
//               </View>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   // justifyContent: 'center',
//                   alignItems: 'center',
//                   backgroundColor: 'white',
//                   marginTop: 15,
//                   width: '90%',
//                 }}>
//                 <View style={{width: '20%', backgroundColor: 'white'}}>
//                   <Image
//                     source={require('../../../common/assets/back.png')}
//                     style={{height: 20, width: 20}}
//                   />
//                 </View>

//                 <Text style={{fontSize: 22, color: 'black'}}>
//                   Camera at eye level
//                 </Text>
//               </View>

//               <RedButton
//                 buttonContainerStyle={[
//                   styles.buttonContainer,
//                   {
//                     marginBottom: isPotrait ? 0 : 20,
//                     height: 60,
//                     width: '90%',
//                     marginTop: 40,
//                   },
//                 ]}
//                 ButtonContent={isLoading ? <Loader /> : 'Go'}
//                 image
//                 contentStyle={styles.buttonText}
//                 onPress={() => {
//                   setModalVisible(false);
//                   navigation.navigate('Liveness', {
//                     detail: 'ok',
//                     data: {testData},
//                   });
//                 }}
//               />
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// export default IdScreen;

// //   return (
// //     <SafeAreaView style={{flex: 1}}>
// //       {!isReadingRfidCustomUi && (
// //         <View style={styles.container}>
// //           <ScrollView
// //             style={{padding: 5, alignSelf: 'center'}}
// //             showsVerticalScrollIndicator={false}>
// //             <RadioGroup
// //               containerStyle={{alignItems: 'flex-start'}}
// //               radioButtons={radioButtons}
// //               onPress={selectedID => setSelectedScenario(selectedID)}
// //               selectedId={selectedScenario}
// //             />
// //           </ScrollView>

// //           <View style={{flexDirection: 'row', padding: 5}}>
// //             {/* <CheckBox
// //               containerStyle={{backgroundColor: '#F5FCFF'}}
// //               checked={doRfid}
// //               title={'Process RFID reading' + canRfidTitle}
// //               onPress={() => {
// //                 if (canRfid) {
// //                   setDoRfid(!doRfid);
// //                 }
// //               }}
// //             /> */}
// //           </View>

// //           <View style={{flexDirection: 'row'}}>
// //             <Button color="#4285F4" title="Scan document" onPress={process} />
// //             <Text style={{padding: 5}}></Text>
// //             <Button color="#4285F4" title="Scan image" onPress={recognize} />
// //           </View>
// //         </View>
// //       )}

// //       {isReadingRfidCustomUi && (
// //         <View style={styles.container}>
// //           <Text
// //             style={{paddingBottom: 30, fontSize: 23, color: rfidUIHeaderColor}}>
// //             {rfidUIHeader}
// //           </Text>
// //           <Text style={{paddingBottom: 50, fontSize: 20}}>
// //             {rfidDescription}
// //           </Text>
// //           <Progress.Bar
// //             style={{marginBottom: 30}}
// //             width={200}
// //             useNativeDriver={true}
// //             color="#4285F4"
// //             progress={rfidProgress}
// //           />
// //           <TouchableOpacity style={styles.cancelButton} onPress={hideRfidUI}>
// //             <Text style={{fontSize: 20}}>X</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}
// //       {/* <KeyboardAvoidingView
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //         keyboardVerticalOffset={keyboardVerticalOffset}>
// //         <ScrollView
// //           style={{marginBottom: '10%'}}
// //           keyboardShouldPersistTaps="handled">
// //           <Status lightContent />
// //           <Image
// //             source={logoValidyfy}
// //             style={{
// //               marginTop: isPortrait ? '20%' : '5%',
// //               alignSelf: 'center',
// //               resizeMode: 'contain',
// //               height: 80,
// //               width: '60%',
// //             }}
// //           />
// //           <View style={[styles.mainView, {height: screenHeight * 0.5}]}>
// //             <Text style={styles.textVerify}>
// //               Simplify Identity Verification
// //             </Text>
// //             <Text style={styles.middleText}>
// //               Validifyx provides seamless digital verification solutions,
// //               empowering businesses to securely and conveniently interact with
// //               their customers.
// //             </Text>
// //           </View>
// //           <RedButton
// //             buttonContainerStyle={[
// //               styles.buttonContainer,
// //               {marginBottom: isPortrait ? 0 : 20},
// //             ]}
// //             ButtonContent={isLoading ? <Loader /> : "Let's get started"}
// //             image
// //             contentStyle={styles.buttonText}
// //             onPress={handlePermissions}
// //           />
// //         </ScrollView>
// //       </KeyboardAvoidingView> */}

// //       {documentType.length > 0 ? (
// //         <View>
// //           {fields.imageFront && (
// //             <Image
// //               style={{height: 150, width: 200}}
// //               source={{uri: `data:image/png;base64,${fields?.imageFront}`}}
// //               resizeMode="contain"
// //             />
// //           )}
// //           {fields.imagePortrait && (
// //             <Image
// //               style={{height: 150, width: 200}}
// //               source={{uri: `data:image/png;base64,${fields?.imagePortrait}`}}
// //               resizeMode="contain"
// //             />
// //           )}
// //           {fields.name && <Text>Name: {fields.name}</Text>}
// //           {fields.dob && <Text>Date of Birth: {fields.dob}</Text>}
// //           {fields.documentNumberField && (
// //             <Text>Document Number: {fields.documentNumberField}</Text>
// //           )}
// //           {fields.country && <Text>Country: {fields.country}</Text>}
// //           {fields.state && <Text>State: {fields.state}</Text>}
// //           {fields.fatherName && <Text>Father's Name: {fields.fatherName}</Text>}

// //           {fields.bloodgroup && <Text>Blood Group: {fields.bloodgroup}</Text>}
// //           {fields.age && <Text>Age: {fields.age}</Text>}
// //           {fields.issuedate && <Text>Issued Date: {fields.issuedate}</Text>}
// //           {fields.validto && <Text>Valid to: {fields.validto}</Text>}
// //           {fields.sex && <Text>Sex: {fields.sex}</Text>}
// //           <TouchableOpacity
// //             onPress={() => {
// //               navigation.navigate('Liveness');
// //             }}>
// //             <Text>Next</Text>
// //           </TouchableOpacity>
// //         </View>
// //       ) : (
// //         <View>
// //           <Text>No document type information available.</Text>
// //         </View>
// //       )}
// //     </SafeAreaView>
// //   );
// // }

// // export default IdScreen;

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
import Status from '../../../components/Status';
import {logoValidyfy} from '../../../common/images';
import RedButton from '../../../components/RedButton';
import {styles} from './styles';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import Loader from '../../../components/ActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

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

    // const licPath =
    //   Platform.OS === 'ios'
    //     ? RNFS.MainBundlePath + '/regula.license'
    //     : 'regula.license';
    // const readFile =
    //   Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets;

    // readFile(licPath, 'base64').then(res => {
    //   setFullName('Initializing...');
    //   const config = new DocReaderConfig();
    //   config.license = res;
    //   config.delayedNNLoad = true;
    //   DocumentReader.initializeReader(
    //     config,
    //     response => {
    //       if (!JSON.parse(response)['success']) {
    //         console.log(response);
    //         return;
    //       }
    //       console.log('Init complete');
    //       onInitialized();
    //     },
    //     error => console.log(error),
    //   );
    // });
  }, []);

  const handlePermissions = async () => {
    console.log('1111111');
    if (isCheckStatus?.isVerified == 1) {
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
      // console.log('2222222', result);

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
    const licPath =
      Platform.OS === 'ios'
        ? `${RNFS.MainBundlePath}/regula.license`
        : 'regula.license';
    const readFile =
      Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets;
    const res = await readFile(licPath, 'base64');
    await DocumentReader.initializeReader(
      {
        license: res,
      },
      respond => {
        console.log(respond, 'Initialization successful');
        setIsLoading(false);
        onInitialized();
      },
      error => {
        console.log(error, 'Initialization error');
        // setIsInitialized(false);
        setIsLoading(false);
        Alert.alert('Initialization error');
      },
    );
  };

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
