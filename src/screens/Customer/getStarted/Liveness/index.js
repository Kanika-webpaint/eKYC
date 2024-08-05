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
const DropdownContent = ({label, value, isMatch}) => (
  <View style={{flexDirection: 'row', backgroundColor: 'lightgrey'}}>
    <View style={{width: '20%', backgroundColor: 'transparent'}}></View>
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
          <Text style={{color: 'green', fontSize: 20}}>✓</Text>
        ) : (
          <Text style={{color: 'grey', fontSize: 40}}>-</Text>
        )
      ) : (
        <Text style={{color: 'grey', fontSize: 40}}>-</Text>
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
  // console.log(country, 'bjjjjjj');
  const countryBarcode =
    country?.values.find(item => item.sourceType === 18)?.value || '';
  const countryVisual =
    country?.values.find(item => item.sourceType === 17)?.value || '';
  // console.log(countryBarcode, countryVisual, 'pppppppp');
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

      <Text
        style={{
          textAlign: 'center',
          marginTop: 20,
          color: 'black',
          fontWeight: '800',
        }}>
        {documentName}
      </Text>
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
    // console.log(status, '999999999');
    const barcodeValues = values.filter(val => val.sourceType === 18);
    const visualValues = values.filter(val => val.sourceType === 17);

    const barcodeSet = new Set(barcodeValues.map(val => val.value));
    const visualSet = new Set(visualValues.map(val => val.value));

    // const valuesMatch =
    //   [...barcodeSet].every(val => visualSet.has(val)) &&
    //   [...visualSet].every(val => barcodeSet.has(val));

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

  // console.log(imageDimensions, '----------------');

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
    // console.log(width, height, '----------------');
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
                // maxHeight: '250',
                // maxWidth: '80%',
                width: width > maximumWidth ? maximumWidth : width,
                height: height > maximumHeight ? maximumHeight : height,

                // aspectRatio: width / height,
                // alignSelf: 'center',
                // marginHorizontal: '5%',
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
  // console.log(
  //   liveness,
  //   'kkkkkkkkk',
  //   similarity,
  //   data?.authenticityResult?.checks[0]?.elements,
  //   'mmmmmmmmmmmm',
  //   data?.textResult?.status,
  //   'ffffffffffffffffffffff',
  // );

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
            // paddingLeft: '10%',
            // marginTop: 20,
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
          // marginTop: 10,
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
          // marginTop: 10,
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
            // paddingLeft: '10%',
            // marginTop: 20,
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
  console.log(data?.textResult?.fields, 'hhhhhhhhhhhhhhhhh');
  const navigation = useNavigation();
  const {height: screenHeight} = Dimensions.get('window');
  const dispatch = useDispatch();
  const [userToken, setTokenUser] = useState('');
  const a = data?.textResult;
  // a.fields.forEach(field => {
  //   console.log(
  //     `Field Name: ${field.fieldName}, Status: ${field.status}, Validity Status: ${field.validityStatus}`,
  //   );
  // });
  const [similarity, setSimilarity] = useState('nil');
  const [liveness, setLiveness] = useState('nil');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const image1 = useRef(new MatchFacesImage());
  const image2 = useRef(new MatchFacesImage());
  const [isPortrait, setIsPortrait] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const name = data?.textResult?.fields.find(
    item => item.fieldName === 'Surname and given names',
  );

  const imagePortrait = data?.graphicResult?.fields.find(
    item => item.fieldName === 'Portrait',
  );

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

  // const middleName = data?.textResult?.fields.find(
  //   item => item.fieldName === 'Middle name',
  // );

  // const middleName = data?.textResult?.fields.find(
  //   item => item.fieldName === 'Middle name',
  // );

  // const middleName = data?.textResult?.fields.find(
  //   item => item.fieldName === 'Middle name',
  // );

  // const middleName = data?.textResult?.fields.find(
  //   item => item.fieldName === 'Middle name',
  // );

  // const middleName = data?.textResult?.fields.find(
  //   item => item.fieldName === 'Middle name',
  // );

  const requestData = {
    issuingStateCode: issuingStateCode,
    documentNumber: documentNumber,
    dateofExpiry: dateofExpiry,
    dateofIssue: dateofIssue,
    dateofBirth: dateofBirth,
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
    age: age,
    monthsToExpire: monthsToExpire,
    ageAtIssue: ageAtIssue,
    yearsSinceIssue: yearsSinceIssue,
    passportNumber: passportNumber,
    companyName: companyName,
    documentClassCode: documentClassCode,
    address: address,
  };

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

  const calculateTabWidth = title => {
    const baseWidth = 80;
    const extraWidthPerChar = 8;
    return baseWidth + title.length * extraWidthPerChar;
  };

  const renderTabBar = props => {
    // console.log(props?.navigationState?.routes[1]?.key, 'kkkkkkkk');

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
    // console.log(json, 'kkkkkkk', InitResponse, 'jjjjjjjjjj');
    const response = InitResponse.fromJson(JSON.parse(json));
    console.log(response, '----------------');
    if (response && response.success === false) {
      console.log('Init Error Code:', response.error?.code);
      console.log('Init Error Message:', response.error?.message);
    } else {
      console.log('Init complete');
      livenessCheck();
    }
  };

  const initializeSDK = async () => {
    console.log('Initializing SDK...');
    try {
      const licPath =
        Platform.OS === 'ios'
          ? RNFS.MainBundlePath + '/license/regula.license'
          : 'regula.license';
      const readFile =
        Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets;
      const license = await readFile(licPath, 'base64');
      // console.log('License read successfully');

      const config = new InitConfig();
      console.log(config, 'config');
      config.license = license;
      config.online = true;
      // console.log((config.license = license), 'license');
      FaceSDK.initialize(null, onInit, error => {
        console.log('Initialization callback error:', error);
      });
    } catch (error) {
      FaceSDK.initialize(null, onInit, _e => {});
      console.error('Error during SDK initialization:', error);
    }
  };

  const matchFaces = () => {
    if (!image1.current.image || !image2.current.image) return;
    setSimilarity('Processing...');
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
      },
      e => {
        setSimilarity(e);
      },
    );
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

            if (imagePortrait) {
              setImage(false, imagePortrait?.value, Enum.ImageType.PRINTED);
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

  const handleSubmission = () => {
    setIsLoading(true);
    console.log('111111');
    dispatch(
      verifedCustomerDataAction(
        requestData,
        navigation,
        userToken,
        setIsLoading,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          height: 60,
          backgroundColor: 'white',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{width: '15%', backgroundColor: 'white', marginLeft: '2%'}}
          onPress={() => {
            navigation.navigate('IdScreen');
          }}>
          <Image
            source={require('../../../../common/assets/back.png')}
            style={{height: 30, width: 30, marginLeft: '5%'}}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderWidth: 0.7,
          width: '100%',
          borderColor: 'lightgrey',
        }}></View>
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
                style={{width: 30, height: 30}}
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

            {
              liveness && liveness == 'passed' ? (
                <Image
                  source={require('../../../../common/assets/live.png')}
                  style={{width: 30, height: 30, marginLeft: 10}}
                  resizeMode="contain"
                />
              ) : null
              // <Text style={{color: 'grey', fontSize: 40, marginLeft: 10}}>
              //   -
              // </Text>
            }
          </View>
        </View>
        <View style={styles.headerRight}>
          <Image
            source={{
              uri: `data:image/png;base64,${imagePortrait?.value}`,
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
          // initialLayout={{width: layout.width}}
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
            ButtonContent={isLoading ? <Loader /> : 'Verify Face '}
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
    // width: 100,
  },
  tabBar: {
    backgroundColor: 'white',
    // paddingHorizontal: 10,
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
  // tabStyle: {
  //   width: 100,
  // },
});

export default Liveness;
