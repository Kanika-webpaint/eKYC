import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Platform,
  NativeEventEmitter,
  Image,
  ScrollView,
  Dimensions,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import * as RNFS from 'react-native-fs';
import FaceSDK, {
  Enum,
  FaceCaptureResponse,
  LivenessResponse,
  InitConfig,
  InitResponse,
  LivenessSkipStep,
  LivenessNotification,
  RNFaceApi,
  MatchFacesResponse,
  MatchFacesRequest,
  MatchFacesImage,
  ComparedFacesSplit,
} from '@regulaforensics/react-native-face-api';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Svg, {Polygon} from 'react-native-svg';
import RedButton from '../../../../components/RedButton';
import {useDispatch, useSelector} from 'react-redux';
import {verifyCodeslice} from '../../../../redux/slices/user/userSlice';
import {
  checkverifiedUser,
  verifedCustomerDataAction,
} from '../../../../redux/actions/user/UserAction';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../../components/ActivityIndicator';
import axios from 'axios';
import {decode as base64Decode} from 'base64-js';
import {Buffer} from 'buffer';
global.Buffer = Buffer;

const DropdownContent = ({label, value, isMatch}) => (
  <View style={styles.dropDown}>
    <View style={styles.dropDownView}></View>
    <View
      style={{
        width: label === 'Barcode <=>' ? '25%' : '30%',
        backgroundColor: 'transparent',
        justifyContent: 'center',
      }}>
      <Text>{label}</Text>
    </View>
    <View
      style={{
        width: label === 'Barcode <=>' ? '40%' : '35%',
        backgroundColor: 'transparent',
        justifyContent: 'center',
      }}>
      <Text>{value}</Text>
    </View>
    <View
      style={{
        width: '15%',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {label === 'Barcode <=>' ? (
        isMatch ? (
          <Text style={styles.dropDownTick}>✓</Text>
        ) : (
          <Text style={styles.dropDownDash}>-</Text>
        )
      ) : (
        <Text style={styles.dropDownDash}>-</Text>
      )}
    </View>
  </View>
);
const FirstRoute = ({data}) => {
  const fields = data?.textResult?.fields || [];
  const dob = fields.find(item => item.fieldName === 'Date of birth');
  const dobBarcode =
    dob?.values.find(item => item.sourceType === 18)?.originalValue || '';
  const dobVisual =
    dob?.values.find(item => item.sourceType === 17)?.originalValue || '';
  const documentNumberField = fields.find(
    item => item.fieldName === 'Document number',
  );
  const documentNumberFieldBarcode =
    documentNumberField?.values.find(item => item.sourceType === 18)
      ?.originalValue || '';
  const documentNumberFieldVisual =
    documentNumberField?.values.find(item => item.sourceType === 17)
      ?.originalValue || '';
  const country = fields.find(item => item.fieldName === 'Issuing state');
  const countryBarcode =
    country?.values.find(item => item.sourceType === 18)?.value || '';
  const countryVisual =
    country?.values.find(item => item.sourceType === 17)?.value || '';
  const imageFront =
    data?.graphicResult?.fields.find(
      item => item.fieldName === 'Document image',
    )?.value || '';
  const dCountryName = data?.documentType[0]?.dCountryName || '';
  const documentName = data?.documentType[0]?.name || '';

  // Determine text colors
  const dobColor = dobBarcode === dobVisual ? 'green' : 'black';
  const documentNumberColor =
    documentNumberFieldBarcode === documentNumberFieldVisual
      ? 'green'
      : 'black';
  const countryColor = countryBarcode === countryVisual ? 'green' : 'black';

  const FieldRow = ({label, value, color}) => (
    <View style={{flexDirection: 'row', marginTop: 10}}>
      <View style={{width: '50%', paddingLeft: 10}}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={{width: '50%'}}>
        <Text style={[styles.value, {color}]}>{value || '-'}</Text>
      </View>
    </View>
  );
  return (
    <ScrollView style={styles.container}>
      <FieldRow label="Date of birth" value={dob?.value} color={dobColor} />
      <FieldRow
        label="Document Number"
        value={documentNumberField?.value}
        color={documentNumberColor}
      />
      <FieldRow
        label="Issuing State"
        value={country?.value}
        color={countryColor}
      />

      <Text style={styles.fieldText}>{documentName}</Text>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
          width: '100%',
          backgroundColor: 'white',
          marginTop: 10,
        }}>
        <Image
          style={{height: 200, width: '90%'}}
          source={{uri: `data:image/png;base64,${imageFront}`}}
          resizeMode="cover"
        />
      </View>
    </ScrollView>
  );
};

const SecondRoute = ({data}) => {
  const [dropdownVisibility, setDropdownVisibility] = useState({});

  const toggleDropdown = key => {
    setDropdownVisibility(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const renderRow = ({item}) => {
    const {fieldName, value, key, values, status} = item;
    const barcodeValues = values.filter(val => val.sourceType === 18);
    const visualValues = values.filter(val => val.sourceType === 17);

    const barcodeSet = new Set(barcodeValues.map(val => val.value));
    const visualSet = new Set(visualValues.map(val => val.value));
    return (
      <View>
        <View style={{flexDirection: 'row'}} key={key}>
          <View
            style={{
              width: '13%',
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => toggleDropdown(key)}>
              <Text style={{color: 'black', fontSize: 25}}>
                {dropdownVisibility[key] ? 'v' : '>'}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '32%',
              backgroundColor: 'white',
              paddingVertical: 10,
              justifyContent: 'center',
            }}>
            <Text style={{color: 'grey', paddingHorizontal: 10}}>
              {fieldName}
            </Text>
          </View>
          <View
            style={{
              width: '40%',
              backgroundColor: 'white',
              justifyContent: 'center',
            }}>
            <Text
              style={[
                {
                  color:
                    status === 1 ? 'green' : status === 2 ? 'black' : 'red',
                },
              ]}>
              {value}
            </Text>
          </View>
          <View
            style={{
              width: '15%',
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {status === 1 ? (
              <Text style={{color: 'green', fontSize: 20}}>✓</Text>
            ) : status === 2 ? (
              <Text style={{color: 'grey', fontSize: 40}}>-</Text>
            ) : (
              <Text style={{color: 'red', fontSize: 20}}>x</Text>
            )}
          </View>
        </View>
        {dropdownVisibility[key] && (
          <>
            {barcodeValues.map((subValue, index) => (
              <DropdownContent
                key={`barcode-${index}`}
                label="Barcode"
                value={subValue.value}
                // isMatch={false} // No need to check match here
              />
            ))}
            {visualValues.map((subValue, index) => (
              <DropdownContent
                key={`visual-${index}`}
                label="Visual Zone"
                value={subValue.value}
                // isMatch={false} // No need to check match here
              />
            ))}
            {status === 1 && (
              <DropdownContent
                label="Barcode <=>"
                value="Visual Zone"
                isMatch={status}
              />
            )}
          </>
        )}
      </View>
    );
  };

  const rows = data?.fields.map((field, index) => ({
    ...field,
    key: `field-${index}`,
  }));
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={rows}
        renderItem={renderRow}
        keyExtractor={item => item.key}
      />
    </ScrollView>
  );
};

const ThirdRoute = ({data}) => {
  const [imageDimensions, setImageDimensions] = useState({});
  const [loadingKeys, setLoadingKeys] = useState(new Set());

  const fetchImageSize = useCallback((uri, key) => {
    if (!key) {
      console.error('Invalid key provided:', key); // Debug log
      return;
    }
    // console.log(`Fetching size for ${key}`); // Debug log
    setLoadingKeys(prevKeys => new Set([...prevKeys, key]));
    Image.getSize(
      uri,
      (width, height) => {
        console
          .log
          // `Received size for ${key}: width=${width}, height=${height}`,
          (); // Debug log
        setImageDimensions(prevDimensions => ({
          ...prevDimensions,
          [key]: {width, height},
        }));
        setLoadingKeys(
          prevKeys => new Set([...prevKeys].filter(k => k !== key)),
        );
      },
      error => {
        console.error(`Failed to get image size for ${key}:`, error);
        setLoadingKeys(
          prevKeys => new Set([...prevKeys].filter(k => k !== key)),
        );
      },
    );
  }, []);

  useEffect(() => {
    if (data?.fields && Array.isArray(data?.fields)) {
      data?.fields.forEach((field, index) => {
        // Ensure value and key are present
        const {value, key} = field;
        if (value && key) {
          const uri = `data:image/png;base64,${value}`;
          console.log(`Processing field with key=${key}`); // Debug log
          fetchImageSize(uri, key);
        } else {
          // console.error('Missing value or key in field:', field); // Debug log
          // Optionally, provide a default key or skip processing
          if (value) {
            const defaultKey = `field-${index}`;
            fetchImageSize(`data:image/png;base64,${value}`, defaultKey);
          }
        }
      });
    } else {
      console.error('Invalid data structure:', data); // Debug log
    }
  }, [data?.fields, fetchImageSize]);

  const renderItem = ({item}) => {
    const {fieldName, value, key} = item;
    const dimensions = imageDimensions[key] || {width: 0, height: 0};
    const {width, height} = dimensions;
    const maximumWidth = '90%';
    const maximumHeight = 200;

    return (
      <View style={{}}>
        {loadingKeys.has(key) ? (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        ) : width > 0 && height > 0 ? (
          <View
            style={{
              width: width,
              maxWidth: '90%',
              height: height > maximumHeight ? maximumHeight : height,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              alignSelf: 'center',
              marginTop: '5%',
            }}>
            <Image
              style={{
                width: width > maximumWidth ? maximumWidth : width,
                height: height > maximumHeight ? maximumHeight : height,
              }}
              source={{uri: `data:image/png;base64,${value}`}}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text>Failed to load image</Text>
          </View>
        )}
        <Text style={{color: 'black', textAlign: 'center', marginTop: 10}}>
          {fieldName}
        </Text>
        <View style={styles.separator} />
      </View>
    );
  };

  const imageData = data?.fields.map((field, index) => ({
    ...field,
    key: `field-${index}`,
  }));

  return (
    <FlatList
      data={imageData}
      renderItem={renderItem}
      keyExtractor={item => item.key}
      style={styles.container}
    />
  );
};

const FourthRoute = ({data, img1, img2, similarity}) => {
  const [dropdownsVisible, setDropdownsVisible] = useState({
    barcode: false,
    portrait: false,
  });

  const imageFront =
    data?.graphicResult?.fields.find(
      item => item.fieldName === 'Document image',
    )?.value || '';

  const imagePortrait = data?.graphicResult?.fields.find(
    item => item.fieldName === 'Portrait',
  );

  const toggleDropdown = key => {
    setDropdownsVisible(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const renderDropdownItem = ({item}) => (
    <View
      style={{
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '10%',
      }}>
      <View style={{width: '80%'}}>
        <Text>{item?.elementTypeName}</Text>
        {item?.elementDiagnoseName !== 'No errors' && (
          <Text>{item?.elementDiagnoseName}</Text>
        )}
      </View>
      <View style={{marginLeft: 'auto'}}>
        <Text
          style={{color: item.status === 1 ? 'green' : 'grey', fontSize: 20}}>
          {item.status === 1 ? '✓' : '—'}
        </Text>
      </View>
    </View>
  );

  const renderImage = () => {
    if (imageFront) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
            width: '100%',
            backgroundColor: 'white',
            marginTop: 10,
          }}>
          <Image
            style={{height: 200, width: '90%'}}
            source={{uri: `data:image/png;base64,${imageFront}`}}
            resizeMode="cover"
          />
        </View>
      );
    }
    return null;
  };

  const renderSectionHeader = (title, dropdownKey, status) => (
    <View
      style={{
        backgroundColor: 'lightgrey',
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{width: '20%', alignItems: 'center'}}
        onPress={() => toggleDropdown(dropdownKey)}>
        <Text style={{fontSize: 30}}>
          {dropdownsVisible[dropdownKey] ? 'v' : '>'}
        </Text>
      </TouchableOpacity>
      <View style={{width: '60%'}}>
        <Text>{title}</Text>
      </View>
      <View style={{width: '20%', alignItems: 'center'}}>
        <Text style={{color: status === 1 ? 'green' : 'grey', fontSize: 20}}>
          {status === 1 ? '✓' : '-'}
        </Text>
      </View>
    </View>
  );

  const dataWithImage = data?.authenticityResult?.checks[0]?.elements || [];

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
      {renderSectionHeader(
        'Barcode format Check',
        'barcode',
        data?.authenticityResult?.checks[0]?.status,
      )}
      {dropdownsVisible.barcode && (
        <FlatList
          data={dataWithImage}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderDropdownItem}
          ListFooterComponent={renderImage}
          style={{backgroundColor: 'white', padding: 10}}
        />
      )}

      <View style={{borderColor: 'lightgrey', borderWidth: 1}} />

      {img1 &&
        renderSectionHeader(
          'Comparison of the Portraits',
          'portrait',
          similarity && parseFloat(similarity) >= 75 ? 1 : 0,
        )}
      {dropdownsVisible.portrait && (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <Text style={{textAlign: 'center', marginVertical: 10}}>
            Portrait vs Camera image
          </Text>
          <View
            style={{
              flexDirection: 'row',
              height: 200,
              marginHorizontal: 10,
            }}>
            <View
              style={{
                width: '30%',
                alignItems: 'center',
                backgroundColor: 'white',
              }}>
              <Image
                source={{
                  uri: `data:image/png;base64,${imagePortrait?.value}`,
                }}
                style={{width: '80%', height: '80%'}}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                width: '50%',
                alignItems: 'center',
                backgroundColor: 'white',
              }}>
              <Image
                source={{
                  uri: img1?.uri,
                }}
                style={{width: '80%', height: '80%'}}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                width: '20%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{textAlign: 'center', marginTop: 10}}>
                {similarity}%
              </Text>
              <Text style={{textAlign: 'center', marginTop: 1}}>match</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

<View style={{flex: 1, backgroundColor: 'white'}} />;

const FifthRoute = ({liveness, similarity, data}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          marginLeft: '5%',
          justifyContent: 'space-between',
          marginRight: '1%',
          marginTop: 10,
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            fontWeight: '800',
          }}>
          Biometric verification
        </Text>
      </View>

      <View
        style={{
          marginLeft: '5%',
          justifyContent: 'space-between',
          marginRight: '3%',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text>Face matching</Text>
        {similarity && similarity !== 'nil' && parseFloat(similarity) >= 75 ? (
          <Text style={{color: 'green', fontSize: 20}}>✓</Text>
        ) : (
          <Text style={{color: 'grey', fontSize: 40}}>-</Text>
        )}
      </View>

      <View
        style={{
          marginLeft: '5%',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginRight: '3%',
          flexDirection: 'row',
        }}>
        <Text>Liveness check</Text>
        {liveness && liveness == 'passed' ? (
          <Text style={{color: 'green', fontSize: 20}}>✓</Text>
        ) : (
          <Text style={{color: 'grey', fontSize: 40}}>-</Text>
        )}
      </View>

      <View
        style={{
          marginLeft: '5%',
          justifyContent: 'space-between',
          marginRight: '1%',
          marginTop: 10,
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            fontWeight: '800',
          }}>
          Document verification
        </Text>
      </View>
      <View
        style={{
          marginLeft: '5%',
          justifyContent: 'space-between',
          marginRight: '1%',
          marginTop: 10,
        }}>
        <Text>Optical</Text>
      </View>
      <View
        style={{
          marginLeft: '5%',
          justifyContent: 'space-between',
          marginRight: '1%',
          marginTop: 10,
        }}>
        <Text>Document type</Text>
      </View>
      <View
        style={{
          marginLeft: '5%',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginRight: '3%',
          marginTop: 10,
          flexDirection: 'row',
        }}>
        <Text>Text Fields</Text>
        {data && data?.textResult?.status == '0' ? (
          <Text style={{color: 'grey', fontSize: 40}}>-</Text>
        ) : (
          <Text style={{color: 'green', fontSize: 20}}>✓</Text>
        )}
      </View>
      <View
        style={{
          marginLeft: '5%',
          justifyContent: 'space-between',
          marginRight: '1%',
          marginTop: 10,
        }}>
        <Text>Image quality</Text>
      </View>
      <View
        style={{
          marginLeft: '5%',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginRight: '3%',
          marginTop: 10,
          flexDirection: 'row',
        }}>
        <Text>Authenticity</Text>
        {data && data?.authenticityResult?.status == '0' ? (
          <Text style={{color: 'grey', fontSize: 40}}>-</Text>
        ) : (
          <Text style={{color: 'green', fontSize: 20}}>✓</Text>
        )}
      </View>
    </ScrollView>
  );
};

const Liveness = ({route}) => {
  const data = route?.params?.data?.testData;
  const navigation = useNavigation();
  const {height: screenHeight} = Dimensions.get('window');
  const dispatch = useDispatch();
  const [userToken, setTokenUser] = useState('');
  const userId = useSelector(state => state.user.verified?.id);

  const a = data?.textResult;
  const [similarity, setSimilarity] = useState('nil');
  const [liveness, setLiveness] = useState('nil');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const image1 = useRef(new MatchFacesImage());
  const image2 = useRef(new MatchFacesImage());
  const [isPortrait, setIsPortrait] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFaceLoading, setIsFaceLoading] = useState(false);
  console.log(liveness, similarity, 'lllllljjjjjjjjj');
  const name = data?.textResult?.fields.find(
    item => item.fieldName === 'Surname and given names',
  );

  const imagePortrait =
    data?.graphicResult?.fields.find(item => item.fieldName === 'Portrait')
      ?.value || '';

  const signatureImage =
    data?.graphicResult?.fields.find(item => item.fieldName === 'Signature')
      ?.value || '';

  const documentImage =
    data?.graphicResult?.fields.find(
      item => item.fieldName === 'Document image',
    )?.value || '';

  const barcodeimage =
    data?.graphicResult?.fields.find(item => item.fieldName === 'Barcode')
      ?.value || '';
  const gender = data?.textResult?.fields.find(
    item => item.fieldName === 'Sex',
  );

  const documentClassCode =
    data?.textResult?.fields.find(
      item => item.fieldName === 'Document class code',
    )?.value || '';

  console.log(documentClassCode);

  const issuingStateCode =
    data?.textResult?.fields.find(
      item => item.fieldName === 'Issuing state code',
    )?.value || '';
  console.log(issuingStateCode);

  const documentNumber =
    data?.textResult?.fields.find(item => item.fieldName === 'Document number')
      ?.value || '';
  console.log(documentNumber);

  const dateofExpiry =
    data?.textResult?.fields.find(item => item.fieldName === 'Date of expiry')
      ?.value || '';
  console.log(dateofExpiry);

  const dateofIssue =
    data?.textResult?.fields.find(item => item.fieldName === 'Date of issue')
      ?.value || '';
  console.log(dateofIssue);

  const dateofBirth =
    data?.textResult?.fields.find(item => item.fieldName === 'Date of birth')
      ?.value || '';
  console.log(dateofBirth);

  const placeofBirth =
    data?.textResult?.fields.find(item => item.fieldName === 'Place of birth')
      ?.value || '';
  console.log(placeofBirth);

  const surname =
    data?.textResult?.fields.find(item => item.fieldName === 'Surname')
      ?.value || '';
  console.log(surname);

  const givenName =
    data?.textResult?.fields.find(item => item.fieldName === 'Given name')
      ?.value || '';
  console.log(givenName);

  const nationality =
    data?.textResult?.fields.find(item => item.fieldName === 'Nationality')
      ?.value || '';
  console.log(nationality);

  const sex =
    data?.textResult?.fields.find(item => item.fieldName === 'Sex')?.value ||
    '';
  console.log(sex);

  const issuingAuthority =
    data?.textResult?.fields.find(
      item => item.fieldName === 'Issuing authority',
    )?.value || '';
  console.log(issuingAuthority);

  const surnameandGivenNames =
    data?.textResult?.fields.find(
      item => item.fieldName === 'Surname and given names',
    )?.value || '';
  console.log(surnameandGivenNames);

  const nationalityCode =
    data?.textResult?.fields.find(item => item.fieldName === 'Nationality code')
      ?.value || '';
  console.log(nationalityCode);

  const issuingState =
    data?.textResult?.fields.find(item => item.fieldName === 'Issuing state')
      ?.value || '';
  console.log(issuingState);

  const middleName =
    data?.textResult?.fields.find(item => item.fieldName === 'Middle name')
      ?.value || '';
  console.log(middleName);

  const age =
    data?.textResult?.fields.find(item => item.fieldName === 'Age')?.value ||
    '';
  console.log(age);

  const monthsToExpire =
    data?.textResult?.fields.find(item => item.fieldName === 'Months to expire')
      ?.value || '';
  console.log(monthsToExpire);

  const ageAtIssue =
    data?.textResult?.fields.find(item => item.fieldName === 'Age at issue')
      ?.value || '';
  console.log(ageAtIssue);

  const yearsSinceIssue =
    data?.textResult?.fields.find(
      item => item.fieldName === 'Years since issue',
    )?.value || '';
  console.log(yearsSinceIssue);

  const passportNumber =
    data?.textResult?.fields.find(item => item.fieldName === 'Passport number')
      ?.value || '';
  console.log(passportNumber);

  const companyName =
    data?.textResult?.fields.find(item => item.fieldName === 'Company name')
      ?.value || '';
  console.log(companyName);

  const address =
    data?.textResult?.fields.find(item => item.fieldName === 'Address')
      ?.value || '';
  console.log(address);

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'OVERALL RESULT'},
    {key: 'second', title: 'TEXT DATA'},
    {key: 'third', title: 'IMAGES'},
    {key: 'fourth', title: 'AUTH'},
    {key: 'fifth', title: 'CHECKS'},
  ]);

  const renderScene = SceneMap({
    first: () => <FirstRoute data={data} />,
    second: () => <SecondRoute data={data?.textResult} />,
    third: () => <ThirdRoute data={data?.graphicResult} />,
    fourth: () => (
      <FourthRoute
        data={data}
        img1={img1}
        similarity={similarity}
        img2={img2}
      />
    ),
    fifth: () => (
      <FifthRoute liveness={liveness} similarity={similarity} data={data} />
    ),
  });

  const renderTabBar = props => {
    return (
      <TabBar
        {...props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style={styles.tabBar}
        renderLabel={({route, focused}) => (
          <View style={{backgroundColor: 'transparent', height: '100%'}}>
            <Text style={[styles.tabLabel, focused && styles.selectedTabLabel]}>
              {route.title}
            </Text>
          </View>
        )}
        tabStyle={{width: 'auto'}}
      />
    );
  };

  useEffect(() => {
    const eventManager = new NativeEventEmitter(RNFaceApi);
    eventManager.addListener(
      'livenessNotificationEvent',
      data => {
        const notification = LivenessNotification.fromJson(JSON.parse(data));
        if (notification) {
          // console.log('LivenessStatus: ' + notification.status);
        } else {
          // console.log('no liveness');
        }
      },
      [],
    );
  }, []);

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
    if (route?.params?.detail === 'cancel') {
      console.log('result page');
    } else {
      console.log('result page', '--------');
      initializeSDK();
    }
  }, []);

  const setImage = (first, base64, type) => {
    if (base64 == null) return;
    setSimilarity('null');
    if (first) {
      image1.current = new MatchFacesImage();
      image1.current.image = base64;
      image1.current.imageType = type;
      setImg1({uri: 'data:image/png;base64,' + base64});
    } else {
      image2.current = new MatchFacesImage();
      image2.current.image = base64;
      image2.current.imageType = type;
      setImg2({uri: 'data:image/png;base64,' + base64});
    }
  };

  const onInit = json => {
    const response = InitResponse.fromJson(JSON.parse(json));
    console.log(response, '----------------');
    if (response && response.success === false) {
      console.log('Init Error Code:', response.error?.code);
      console.log('Init Error Message:', response.error?.message);
    } else {
      console.log('Init complete');
      livenessCheck();
      setIsFaceLoading(false);
    }
  };

  const initializeSDK = async () => {
    setIsFaceLoading(true);
    console.log('Initializing SDK...');
    try {
      const licPath =
        Platform.OS === 'ios'
          ? RNFS.MainBundlePath + '/license/regula.license'
          : 'regula.license';
      const readFile =
        Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets;
      const license = await readFile(licPath, 'base64');
      const config = new InitConfig();
      console.log(config, 'config');
      config.license = license;
      config.online = true;
      FaceSDK.initialize(null, onInit, error => {
        console.log('Initialization callback error:', error);
      });
    } catch (error) {
      FaceSDK.initialize(null, onInit, _e => {});
      console.error('Error during SDK initialization:', error);
      setIsFaceLoading(false);
    }
  };

  const matchFaces = () => {
    // console.log(
    //   image1.current.image,
    //   '-------------------------',
    //   image2.current.image,
    //   '-----------------------------------------------------',
    // );
    if (!image1.current.image || !image2.current.image) return;
    // console.log('222');

    setSimilarity('Processing');
    // console.log(similarity, '333');
    const request = new MatchFacesRequest();
    request.images = [image1.current, image2.current];
    FaceSDK.matchFaces(
      request,
      null,
      json => {
        const response = MatchFacesResponse.fromJson(JSON.parse(json));
        FaceSDK.splitComparedFaces(
          response.results,
          0.75,
          str => {
            const split = ComparedFacesSplit.fromJson(JSON.parse(str));

            setSimilarity(
              split.matchedFaces.length > 0
                ? (split.matchedFaces[0].similarity * 100).toFixed(0)
                : 'error',
            );
          },
          e => {
            setSimilarity(e);
          },
        );
        setIsFaceLoading(false);
      },
      e => {
        setSimilarity(e);
      },
    );
    setIsFaceLoading(false);
  };

  const livenessCheck = () => {
    FaceSDK.startLiveness(
      {skipStep: [LivenessSkipStep.ONBOARDING_STEP]},
      json => {
        try {
          const response = LivenessResponse.fromJson(JSON.parse(json));
          if (response?.image) {
            setImage(true, response.image, Enum.ImageType.LIVE);
            setLiveness(
              response.liveness === Enum.LivenessStatus.PASSED
                ? 'passed'
                : 'unknown',
            );
            console.log(imagePortrait, 'hhhhhh');
            if (imagePortrait) {
              console.log('111');
              setImage(false, imagePortrait, Enum.ImageType.PRINTED);
              matchFaces();
            }
          }
        } catch (error) {
          console.error('Error parsing liveness response:', error);
        }
      },
      error => {
        console.error('Liveness check error:', error);
      },
    );
  };

  const generateUniqueFileName = fileName => {
    const timestamp = new Date().getTime();
    const randomSuffix = Math.floor(Math.random() * 10000); // Add a random number to further ensure uniqueness
    const fileExtension = fileName.split('.').pop();
    const baseName = fileName.replace(`.${fileExtension}`, '');
    return `${baseName}_${timestamp}_${randomSuffix}.${fileExtension}`;
  };

  // Function to save base64 data as a file
  const saveBase64ToFile = async (base64String, fileName) => {
    try {
      // Decode the base64 string and get the binary data
      const base64Data = base64String.replace(/^data:image\/jpeg;base64,/, ''); // Adjust prefix if needed

      // Define the path where the file will be saved
      let filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Check if the file already exists and generate a new name if necessary
      let fileExists = await RNFS.exists(filePath);
      while (fileExists) {
        const newFileName = generateUniqueFileName(fileName);
        filePath = `${RNFS.DocumentDirectoryPath}/${newFileName}`;
        fileExists = await RNFS.exists(filePath);
      }

      // Write the binary data to the file
      await RNFS.writeFile(filePath, base64Data, 'base64');

      console.log('File saved at:', filePath);
      return filePath;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  };

  // Function to upload a file
  const uploadFile = async filePath => {
    try {
      // Prepare the form data
      const formData = new FormData();
      formData.append('file', {
        uri: `file://${filePath}`,
        type: 'image/jpeg', // Adjust type based on the file type
        name: filePath.split('/').pop(), // Extract the file name
      });

      // Define your server upload URL
      const uploadUrl = 'https://validifyx.com/node/api/upload';

      // Make the POST request to upload the file
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
      return response.data.fileUrl[0];
    } catch (error) {
      console.error(
        'Error uploading file:',
        error.response ? error.response.data : error.message,
      );
      throw error;
    }
  };

  // Function to process images
  const processImages = async images => {
    try {
      // Upload all images and gather filenames
      const filePromises = images.map(async ({base64String, fileName}) => {
        const filePath = await saveBase64ToFile(base64String, fileName);
        return uploadFile(filePath);
      });
      const fileNames = await Promise.all(filePromises);

      // Ensure that filenames are properly assigned
      const [
        portraitImageFilename,
        signatureImageFilename,
        barcodeImageFilename,
        documentImageFilename,
      ] = fileNames;

      const parseDate = dateString => {
        return dateString ? new Date(dateString) : null;
      };

      // Prepare the updated requestData object
      const requestData = {
        issuingStateCode: issuingStateCode,
        documentNumber: documentNumber,
        dateofExpiry: parseDate(dateofExpiry), // Convert string to Date object
        dateofIssue: parseDate(dateofIssue), // Convert string to Date object
        dateofBirth: parseDate(dateofBirth),
        placeofBirth: placeofBirth,
        surname: surname,
        givenName: givenName,
        nationality: nationality,
        sex: sex,
        issuingAuthority: issuingAuthority,
        surnameandGivenNames: surnameandGivenNames,
        nationalityCode: nationalityCode,
        issuingState: issuingState,
        middleName: middleName,
        age: parseInt(age, 10), // Convert string to integer
        monthsToExpire: parseInt(monthsToExpire, 10), // Convert string to integer
        ageAtIssue: parseInt(ageAtIssue, 10), // Convert string to integer
        yearsSinceIssue: parseInt(yearsSinceIssue, 10),
        passportNumber: passportNumber,
        companyName: companyName,
        documentClassCode: documentClassCode,
        address: address,
        liveness: liveness,
        similarity: similarity,
        signatureImage: signatureImageFilename,
        portraitImage: portraitImageFilename,
        barcodeimage: barcodeImageFilename,
        documentImage: documentImageFilename,
        user_id: parseInt(userId, 10),
      };

      console.log('Updated requestData:', requestData);
      dispatch(
        verifedCustomerDataAction(
          requestData,
          navigation,
          userToken,
          setIsLoading,
        ),
      );
    } catch (error) {
      console.error('Error processing images:', error);
    }
  };

  // Handle the submission
  const handleSubmission = () => {
    processImages(images);
  };

  // Example images array
  const images = [
    {
      base64String: imagePortrait, // Your base64 string for the first image
      fileName: 'image1.jpg', // Desired file name for the first image
    },
    {
      base64String: signatureImage, // Your base64 string for the second image
      fileName: 'image2.jpg', // Desired file name for the second image
    },
    {
      base64String: barcodeimage, // Your base64 string for the third image
      fileName: 'image3.jpg', // Desired file name for the third image
    },
    {
      base64String: documentImage, // Your base64 string for the fourth image
      fileName: 'image4.jpg', // Desired file name for the fourth image
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        <TouchableOpacity
          style={styles.mainInnerView}
          onPress={() => {
            navigation.navigate('IdScreen');
          }}>
          <Image
            source={require('../../../../common/assets/back.png')}
            style={styles.mainImage}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.line}></View>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          {surnameandGivenNames && (
            <Text style={styles.nameText}>{surnameandGivenNames}</Text>
          )}
          {sex && <Text style={styles.sexText}>{sex}</Text>}
          {age && <Text style={styles.ageText}>Age {age}</Text>}
          <View style={{marginTop: 10, flexDirection: 'row'}}>
            {data && data?.textResult?.status == '0' ? (
              <Image
                source={require('../../../../common/assets/alert.png')}
                style={styles.alertImage}
                resizeMode="contain"
              />
            ) : (
              <View
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: 'green',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'white', fontSize: 15}}>✓</Text>
              </View>
            )}

            {liveness && liveness == 'passed' ? (
              <Image
                source={require('../../../../common/assets/live.png')}
                style={{width: 30, height: 30, marginLeft: 10}}
                resizeMode="contain"
              />
            ) : liveness == 'unknown' ? (
              <Image
                source={require('../../../../common/assets/notliveness.png')}
                style={{width: 30, height: 30, marginLeft: 10}}
                resizeMode="contain"
              />
            ) : null}

            {similarity && parseFloat(similarity) >= 75 ? (
              <Image
                source={require('../../../../common/assets/similarity.png')}
                style={{width: 30, height: 30, marginLeft: 10}}
                resizeMode="contain"
              />
            ) : (parseFloat(similarity) < 75 &&
                parseFloat(similarity) >= 0 &&
                parseFloat(similarity)) ||
              'error' ? (
              <Image
                source={require('../../../../common/assets/notsimilarity.png')}
                style={{width: 30, height: 30, marginLeft: 10}}
                resizeMode="contain"
              />
            ) : null}
          </View>
        </View>
        <View style={styles.headerRight}>
          <Image
            source={{
              uri: `data:image/png;base64,${imagePortrait}`,
            }}
            style={styles.portraitImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.containerLow}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
        />
      </View>
      <View
        style={{
          backgroundColor: 'white',
          paddingVertical: 1,
        }}>
        {similarity && parseFloat(similarity) >= 75 ? null : (
          <RedButton
            buttonContainerStyle={[
              styles.buttonContainer,
              {marginBottom: isPortrait ? 0 : 20},
            ]}
            ButtonContent={isFaceLoading ? <Loader /> : 'Verify Face '}
            image
            contentStyle={styles.buttonText}
            onPress={() => {
              initializeSDK();
            }}
          />
        )}

        <RedButton
          buttonContainerStyle={[
            styles.buttonContainer,
            {marginBottom: isPortrait ? 0 : 20},
          ]}
          ButtonContent={isLoading ? <Loader /> : 'Submit Verification '}
          image
          contentStyle={styles.buttonText}
          onPress={() => {
            handleSubmission();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  mainView: {
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  mainInnerView: {
    width: '15%',
    backgroundColor: 'white',
    marginLeft: '2%',
  },
  mainImage: {
    height: 30,
    width: 30,
    marginLeft: '5%',
  },
  line: {
    borderWidth: 0.7,
    width: '100%',
    borderColor: 'lightgrey',
  },
  headerContainer: {
    width: '100%',
    height: 150,
    flexDirection: 'row',
  },
  headerLeft: {
    width: '60%',
    backgroundColor: 'white',
    height: '100%',
    paddingVertical: '3%',
    paddingHorizontal: '3%',
  },
  headerRight: {
    width: '40%',
    backgroundColor: 'white',
    height: '100%',
    paddingVertical: '3%',
  },
  nameText: {
    fontSize: 20,
    color: 'black',
    marginVertical: 2,
    fontWeight: '800',
  },
  alertImage: {
    width: 30,
    height: 30,
  },
  sexText: {
    marginVertical: 2,
  },
  ageText: {
    marginVertical: 2,
  },
  portraitImage: {
    height: '90%',
    width: '90%',
    marginVertical: '5%',
    marginHorizontal: '5%',
  },
  containerLow: {
    flex: 1,
    backgroundColor: 'white',
  },
  indicator: {
    backgroundColor: 'black',
  },
  tabBar: {
    backgroundColor: 'white',
  },
  tabLabel: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '700',
  },
  selectedTabLabel: {
    color: 'black',
    fontSize: 14,
    fontWeight: '700',
  },
  scene: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataText: {
    fontSize: 16,
    color: 'black',
  },
  itemContainer: {
    height: '100%',
    width: '100%',
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
  dropDown: {
    flexDirection: 'row',
    backgroundColor: 'lightgrey',
  },
  dropDownView: {
    width: '20%',
    backgroundColor: 'transparent',
  },
  dropDownDash: {
    color: 'grey',
    fontSize: 40,
  },
  dropDownTick: {
    color: 'green',
    fontSize: 20,
  },
  fieldText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'black',
    fontWeight: '800',
  },
});

export default Liveness;
