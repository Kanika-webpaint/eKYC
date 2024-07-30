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

      {/* {label === 'Barcode <=>' && (
        <Text style={{color: isMatch ? 'green' : 'grey', fontSize: 20}}>
          {isMatch ? '✓' : '-'}
        </Text>
      )} */}
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
  console.log(country, 'bjjjjjj');
  const countryBarcode =
    country?.values.find(item => item.sourceType === 18)?.value || '';
  const countryVisual =
    country?.values.find(item => item.sourceType === 17)?.value || '';
  console.log(countryBarcode, countryVisual, 'pppppppp');
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
    <View style={styles.container}>
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
    </View>
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
    const {fieldName, value, key, values} = item;
    const barcodeValues = values.filter(val => val.sourceType === 18);
    const visualValues = values.filter(val => val.sourceType === 17);

    const barcodeSet = new Set(barcodeValues.map(val => val.value));
    const visualSet = new Set(visualValues.map(val => val.value));

    const valuesMatch =
      [...barcodeSet].every(val => visualSet.has(val)) &&
      [...visualSet].every(val => barcodeSet.has(val));

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
            <Text style={[{color: valuesMatch ? 'green' : 'black'}]}>
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
            {barcodeValues.length > 0 && visualValues.length > 0 ? (
              valuesMatch ? (
                <Text style={{color: 'green', fontSize: 20}}>✓</Text>
              ) : (
                <Text style={{color: 'grey', fontSize: 40}}>-</Text>
              )
            ) : (
              <Text style={{color: 'grey', fontSize: 40}}>-</Text>
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
                isMatch={false} // No need to check match here
              />
            ))}
            {visualValues.map((subValue, index) => (
              <DropdownContent
                key={`visual-${index}`}
                label="Visual Zone"
                value={subValue.value}
                isMatch={false} // No need to check match here
              />
            ))}
            {barcodeValues.length > 0 && visualValues.length > 0 && (
              <DropdownContent
                label="Barcode <=>"
                value="Visual Zone"
                isMatch={valuesMatch}
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
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={rows}
        renderItem={renderRow}
        keyExtractor={item => item.key}
      />
    </View>
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

const FourthRoute = ({data}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const imageFront =
    data?.graphicResult?.fields.find(
      item => item.fieldName === 'Document image',
    )?.value || '';
  const {leftTop, rightTop, rightBottom, leftBottom} =
    data?.barcodePosition[0] || {};
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const renderDropdownItem = ({item, index}) => (
    <View
      style={{
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '10%',
      }}>
      <View style={{width: '80%'}}>
        <Text>{item?.elementTypeName}</Text>
        <Text>{item?.elementDiagnoseName}</Text>
      </View>

      <View style={{marginLeft: 'auto'}}>
        {item.status === 1 ? (
          <Text style={{color: 'green', fontSize: 20}}>✓</Text>
        ) : (
          <Text style={{color: 'grey', fontSize: 40}}>—</Text>
        )}
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

  const dataWithImage = data?.authenticityResult?.checks[0]?.elements || [];
  const lastIndex = dataWithImage.length - 1;

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          backgroundColor: 'lightgrey',
          flexDirection: 'row',
          paddingVertical: 10,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{width: '20%', alignItems: 'center'}}
          onPress={toggleDropdown}>
          {dropdownVisible ? (
            <Text style={{fontSize: 30}}>v</Text>
          ) : (
            <Text style={{fontSize: 30}}>{`>`}</Text>
          )}
        </TouchableOpacity>
        <View style={{width: '60%'}}>
          <Text>Barcode format Check</Text>
        </View>
        <View style={{width: '20%', alignItems: 'center'}}>
          {data?.authenticityResult?.checks[0]?.status === 1 ? (
            <Text style={{color: 'green', fontSize: 20}}>✓</Text>
          ) : (
            <Text style={{color: 'grey', fontSize: 40}}>-</Text>
          )}

          {/* <Icon name="check" size={24} /> */}
        </View>
      </View>
      {dropdownVisible && (
        <FlatList
          data={data?.authenticityResult?.checks[0]?.elements}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderDropdownItem}
          ListFooterComponent={renderImage}
          style={{backgroundColor: 'white', padding: 10}}
        />
      )}
    </View>
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
    <View style={{flex: 1, backgroundColor: 'white'}}>
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
        {similarity && similarity != 'nil' && similarity >= '75' ? (
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
        {data && data?.textResult?.status == '1' ? (
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
        {data && data?.authenticityResult?.status == '1' ? (
          <Text style={{color: 'green', fontSize: 20}}>✓</Text>
        ) : (
          <Text style={{color: 'grey', fontSize: 40}}>-</Text>
        )}
      </View>
    </View>
  );
};

const Liveness = ({route}) => {
  const data = route?.params?.data?.testData;
  console.log(data, 'hhhhhhhhhhhhhhhhh');
  const [similarity, setSimilarity] = useState('nil');
  const [liveness, setLiveness] = useState('nil');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const image1 = useRef(new MatchFacesImage());
  const image2 = useRef(new MatchFacesImage());

  const name = data?.textResult?.fields.find(
    item => item.fieldName === 'Surname and given names',
  );
  const age = data?.textResult?.fields.find(item => item.fieldName === 'Age');
  const imagePortrait = data?.graphicResult?.fields.find(
    item => item.fieldName === 'Portrait',
  );

  const gender = data?.textResult?.fields.find(
    item => item.fieldName === 'Sex',
  );
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  // console.log(Enum, 'IIIIIIIIIIIIIIIIIIIII');
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
    fourth: () => <FourthRoute data={data} />,
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
      // setLiveness('null');
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
      // livenessCheck();
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
    console.log('aaaaaaaaa');
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
          }
        } catch (error) {
          console.error('Error parsing liveness response:', error);
        }
      },
      error => {
        console.error('Liveness check error:', error);
      },
    );

    // FaceSDK.startLiveness(
    //   // {skipStep: LivenessSkipStep.ONBOARDING_STEP},
    //   json => {
    //     try {
    //       console.log('Liveness response JSON:');
    //       const parsedJson = JSON.parse(json);
    //       const response = LivenessResponse.fromJson(parsedJson);
    //       console.log(response, 'Parsed response:');

    //       if (response?.image) {
    //         setLiveness(
    //           response.liveness === Enum.LivenessStatus.PASSED
    //             ? 'passed'
    //             : 'unknown',
    //         );

    //         if (imagePortrait) {
    //           setImage(true, imagePortrait?.value, Enum.ImageType.PRINTED);
    //         }

    //         setImage(false, response?.image, Enum.ImageType.LIVE);
    //         matchFaces();
    //       }

    //       FaceSDK.stopLiveness(
    //         _ => {},
    //         _ => {},
    //       );
    //     } catch (error) {
    //       console.error('Error parsing liveness response:', error);
    //     }
    //   },
    //   error => {
    //     console.error('Liveness check error:', error);
    //   },
    // );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          {name && (
            <Text style={styles.nameText}>{name?.getValue?.originalValue}</Text>
          )}
          {gender && (
            <Text style={styles.sexText}>
              {gender?.getValue?.originalValue}
            </Text>
          )}
          {age && (
            <Text style={styles.ageText}>Age {age?.getValue?.value}</Text>
          )}
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
  },
  tabLabel: {
    color: 'gray',
    fontSize: 14,
  },
  selectedTabLabel: {
    color: 'black',
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
  // tabStyle: {
  //   width: 100,
  // },
});

export default Liveness;

// import React from 'react'
// import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, TouchableOpacity, Platform, NativeEventEmitter } from 'react-native'
// import { launchImageLibrary } from 'react-native-image-picker'
// import * as RNFS from 'react-native-fs'
// import FaceSDK, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, ComparedFacesSplit, InitConfig, InitResponse, LivenessSkipStep, SearchPerson, RNFaceApi, LivenessNotification } from '@regulaforensics/react-native-face-api'

// interface IProps {
// }

// interface IState {
//   img1: any
//   img2: any
//   similarity: string
//   liveness: string
// }

// var image1 = new MatchFacesImage()
// var image2 = new MatchFacesImage()

// export default class App extends React.Component<IProps, IState> {
//   constructor(props: {} | Readonly<{}>) {
//     super(props)

//     var eventManager = new NativeEventEmitter(RNFaceApi)
//     eventManager.addListener('livenessNotificationEvent', data => {
//       var notification = LivenessNotification.fromJson(JSON.parse(data))!
//       console.log("LivenessStatus: " + notification.status)
//     })

//     var onInit = (json: string) => {
//       var response = InitResponse.fromJson(JSON.parse(json))
//       console.log(response,'-------')
//       if (!response!.success) {
//         console.log(response!.error!.code);
//         console.log(response!.error!.message);
//       } else {
//         console.log("Init complete")
//       }
//     };

//     var licPath = Platform.OS === 'ios' ? (RNFS.MainBundlePath + "/license/regula.license") : "regula.license"
//     var readFile = Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets
//     console.log(licPath,readFile,'oooooooo')
//     readFile(licPath, 'base64').then((license) => {
//       var config = new InitConfig();
//       config.license = license
//       FaceSDK.initialize(config, onInit, (_e: any) => { })
//     }).catch(_ => {
//       FaceSDK.initialize(null, onInit, (_e: any) => { })
//     })

//     this.state = {
//       img1: require('../../../../common/assets/back.png'),
//       img2: require('../../../../common/assets/back.png'),
//       similarity: "nil",
//       liveness: "nil"
//     }
//   }

//   pickImage(first: boolean) {
//     Alert.alert("Select option", "", [
//       {
//         text: "Use gallery",
//         onPress: () => launchImageLibrary({
//           mediaType: 'photo',
//           selectionLimit: 1,
//           includeBase64: true
//         }, (response: any) => {
//           if (response.assets == undefined) return
//           this.setImage(first, response.assets[0].base64!, Enum.ImageType.PRINTED)
//         })
//       },
//       {
//         text: "Use camera",
//         onPress: () => FaceSDK.startFaceCapture(null, (json: string) => {
//           var response = FaceCaptureResponse.fromJson(JSON.parse(json))!
//           if (response.image != null && response.image.image != null)
//             this.setImage(first, response.image.image, Enum.ImageType.LIVE)
//         }, _e => { })
//       }], { cancelable: true })
//   }

//   setImage(first: boolean, base64: string, type: number) {
//     if (base64 == null) return
//     this.setState({ similarity: "null" })
//     if (first) {
//       image1 = new MatchFacesImage()
//       image1.image = base64
//       image1.imageType = type
//       this.setState({ img1: { uri: "data:image/png;base64," + base64 } })
//       this.setState({ liveness: "null" })
//     } else {
//       image2 = new MatchFacesImage()
//       image2.image = base64
//       image2.imageType = type
//       this.setState({ img2: { uri: "data:image/png;base64," + base64 } })
//     }
//   }

//   clearResults() {
//     this.setState({ img1: require('../../../../common/assets/back.png'), })
//     this.setState({ img2: require('../../../../common/assets/back.png'), })
//     this.setState({ similarity: "null" })
//     this.setState({ liveness: "null" })
//     image1 = new MatchFacesImage()
//     image2 = new MatchFacesImage()
//   }

//   matchFaces() {
//     if (image1 == null || image1.image == null || image1.image == "" || image2 == null || image2.image == null || image2.image == "")
//       return
//     this.setState({ similarity: "Processing..." })
//     var request = new MatchFacesRequest()
//     request.images = [image1, image2]
//     FaceSDK.matchFaces(request, null, (json: string) => {
//       var response = MatchFacesResponse.fromJson(JSON.parse(json))
//       FaceSDK.splitComparedFaces(response!.results!, 0.75, str => {
//         var split = ComparedFacesSplit.fromJson(JSON.parse(str))!
//         this.setState({ similarity: split.matchedFaces!.length > 0 ? ((split.matchedFaces![0].similarity! * 100).toFixed(2) + "%") : "error" })
//       }, e => { this.setState({ similarity: e }) })
//     }, e => { this.setState({ similarity: e }) })
//   }

//   liveness() {
//     console.log('aaaaa')
//     FaceSDK.startLiveness({ skipStep: [LivenessSkipStep.ONBOARDING_STEP] }, (json: string) => {
//       var response = LivenessResponse.fromJson(JSON.parse(json))!
//       console.log(response,'bbbbbbb')
//       if (response.image != null) {
//         this.setImage(true, response.image, Enum.ImageType.LIVE)
//         this.setState({ liveness: response.liveness == Enum.LivenessStatus.PASSED ? "passed" : "unknown" })
//       }
//     }, _e => { })
//   }

//   render() {
//     return (
//       <SafeAreaView style={styles.container}>

//         <View style={{ padding: 15 }}>
//           <TouchableOpacity onPress={() => this.pickImage(true)} style={{ alignItems: "center" }}>
//             <Image source={this.state.img1} resizeMode="contain" style={{ height: 150, width: 150 }} />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => this.pickImage(false)} style={{ alignItems: "center" }}>
//             <Image source={this.state.img2} resizeMode="contain" style={{ height: 150, width: 200 }} />
//           </TouchableOpacity>
//         </View>

//         <View style={{ width: "100%", alignItems: "center" }}>
//           <View style={{ padding: 3, width: "60%" }}>
//             <Button title="Match" color="#4285F4" onPress={() => { this.matchFaces() }} />
//           </View>
//           <View style={{ padding: 3, width: "60%" }}>
//             <Button title="Liveness" color="#4285F4" onPress={() => { this.liveness() }} />
//           </View>
//           <View style={{ padding: 3, width: "60%" }}>
//             <Button title="Clear" color="#4285F4" onPress={() => { this.clearResults() }} />
//           </View>
//         </View>

//         <View style={{ flexDirection: 'row', padding: 10 }}>
//           <Text>Similarity: {this.state.similarity}</Text>
//           <View style={{ padding: 10 }} />
//           <Text>Liveness: {this.state.liveness}</Text>
//         </View>
//       </SafeAreaView>
//     )
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//     height: '100%',
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//     marginBottom: 12,
//   },
// });

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
// import {TouchableOpacity} from 'react-native-gesture-handler';

// function IdScreen() {
//   const navigation = useNavigation();
//   const [isLoading, setIsLoading] = useState(false);
//   const {height: screenHeight} = Dimensions.get('window');
//   const [isPotrait, setIsPortrait] = useState(true);
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
//   const [portrait, setPortrait] = useState(null);
//   const [radioButtons, setRadioButtons] = useState([]);
//   const [canRfid, setCanRfid] = useState(false); // Assuming you have a state for canRfid
//   const [canRfidTitle, setCanRfidTitle] = useState(''); // Assuming you have a state for canRfidTitle
//   const [documentType, setDocumentType] = useState([]);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [fields, setFields] = useState({
//     documentNumberField: '',
//     dob: '',
//     name: '',
//     country: '',
//     state: '',
//     fatherName: '',
//     bloodgroup: '',
//     age: '',
//     issuedate: '',
//     validto: '',
//     sex: '',
//     imageFront: '',
//     imagePortrait: '',
//     signature: '',
//     barCode: '',
//   });

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
//   // }, []);

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
//         Alert.alert('Initialization error');
//       },
//     );
//   };

//   const process = async () => {
//     if (!isInitialized) {
//       Alert.alert('Initialization Error', 'Checking again.');
//       initialize();
//     }
//     const eventManager = new NativeEventEmitter(RNRegulaDocumentReader);

//     const config = new ScannerConfig();
//     config.scenario = ScenarioIdentifier.SCENARIO_FULL_PROCESS;
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
//     console.log(completion, 'handleCompletion');
//     DocumentReader.deinitializeReader(
//       s => {},
//       e => {},
//     );
//     if (isReadingRfidCustomUi) {
//       // console.log('zzzzzzzzzz');
//       if (completion.action == Enum.DocReaderAction.ERROR)
//         console.log('xxxxxxxxxxxx');
//       restartRfidUI();
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
//     // console.log(
//     //   results?.textResult?.fields?.values,
//     //   '------------------------------------------------------',
//     // );
//     // console.log(
//     //   results?.graphicResult?.fields,
//     //   '9999999999999999999999999999999999999999999',
//     // );
//     console.log(results?.graphicResult, 'displayresults-------------');

//     if (results?.textResult?.fields == null || undefined) {
//       Alert.alert('Error Please check again');
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

//     if (results?.textResult?.fields) {
//       setDocumentType(results?.textResult?.fields);

//       const documentNumberField = results?.textResult?.fields.find(
//         item => item.fieldName === 'Document number',
//       );

//       if (documentNumberField) {
//         console.log(
//           'document number',
//           documentNumberField.getValue.originalValue,
//         );
//       } else {
//         console.log('Document number field not found.');
//       }

//       const dob = results?.textResult?.fields.find(
//         item => item.fieldName === 'Date of birth',
//       );

//       if (dob) {
//         console.log('dob', dob.getValue.originalValue);
//       } else {
//         console.log('dob not found.');
//       }

//       const name = results?.textResult?.fields.find(
//         item => item.fieldName === 'Surname and given names',
//       );

//       if (name) {
//         console.log('name', name.getValue.originalValue);
//       } else {
//         console.log('name not found.');
//       }

//       const country = results?.textResult?.fields.find(
//         item => item.fieldName === 'Issuing state',
//       );

//       if (country) {
//         console.log('country', country.getValue.value);
//       } else {
//         console.log('country not found.');
//       }

//       const state = results?.textResult?.fields.find(
//         item => item.fieldName === 'State',
//       );

//       if (state) {
//         console.log('state', state.getValue.value);
//       } else {
//         console.log('state not found.');
//       }

//       const fathername = results?.textResult?.fields.find(
//         item => item.fieldName === "Father's name",
//       );

//       if (fathername) {
//         console.log('fathername', fathername.getValue.value);
//       } else {
//         console.log('father name not found.');
//       }

//       const bloodgroup = results?.textResult?.fields.find(
//         item => item.fieldName === 'Blood group',
//       );

//       if (bloodgroup) {
//         console.log('bloodgroup', bloodgroup.getValue.originalValue);
//       } else {
//         console.log('blood group not found.');
//       }
//       const age = results?.textResult?.fields.find(
//         item => item.fieldName === 'Age',
//       );

//       if (age) {
//         console.log('age', age.getValue.value);
//       } else {
//         console.log('age not found.');
//       }
//       const issuedate = results?.textResult?.fields.find(
//         item => item.fieldName === 'First issue date',
//       );

//       if (issuedate) {
//         console.log('issuedate', issuedate.getValue.originalValue);
//       } else {
//         console.log('issue date not found.');
//       }

//       const validto = results?.textResult?.fields.find(
//         item => item.fieldName === 'DL category NT valid to',
//       );

//       if (validto) {
//         console.log('validto', validto.getValue.originalValue);
//       } else {
//         console.log('valid to not found.');
//       }

//       const sex = results?.textResult?.fields.find(
//         item => item.fieldName === 'Sex',
//       );
//       if (sex) {
//         console.log('sex', sex.getValue.originalValue);
//       } else {
//         console.log('sex not found.');
//       }

//       const updatedFields = {
//         documentNumberField: documentNumberField?.getValue?.originalValue || '',
//         dob: dob?.getValue?.originalValue || '',
//         name: name?.getValue?.originalValue || '',
//         country: country?.getValue?.value || '',
//         state: state?.getValue?.value || '',
//         fatherName: fathername?.getValue?.value || '',
//         bloodgroup: bloodgroup?.getValue?.originalValue || '',
//         age: age?.getValue?.value || '',
//         issuedate: issuedate?.getValue?.originalValue || '',
//         validto: validto?.getValue?.originalValue || '',
//         sex: sex?.getValue?.originalValue || '',
//         imageFront: imageFront?.value || '',
//         imagePortrait: imagePortrait?.value,
//         signature: signature?.value,
//         barCode: barCode?.value,
//       };

//       setFields(updatedFields); // Set the updated fields state
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
//       });
//     }
//   };

//   const recognize = async () => {
//     if (!isInitialized) {
//       Alert.alert('Initialization Error', 'Checking again.');
//       initialize();
//     }
//     await handlePermissions();
//     launchImageLibrary(
//       {
//         mediaType: 'mixed',
//         includeBase64: true,
//         selectionLimit: 1,
//       },
//       response => {
//         if (response.errorCode != null) {
//           console.log('Error code: ' + response.errorCode);
//           console.log('Error message: ' + response.errorMessage);
//           return;
//         }
//         if (response.didCancel) return;

//         const response1 = response.assets;
//         // console.log(response1, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
//         if (response1 && response1.length > 0) {
//           const images = response1[0].base64;
//           // console.log(images, 'zzzzzzzzzzzzzzzz');

//           const eventManager = new NativeEventEmitter(RNRegulaDocumentReader);
//           const config = new RecognizeConfig();
//           config.scenario = ScenarioIdentifier.SCENARIO_FULL_PROCESS;
//           config.images = [images];
//           DocumentReader.recognize(
//             config,
//             _ => {},
//             e => console.log(e, '3444444444555555'),
//           );
//           eventManager.addListener('completion', e =>
//             handleCompletion(
//               DocumentReaderCompletion.fromJson(JSON.parse(e['msg'])),
//             ),
//           );

//           eventManager.addListener('rfidOnProgressCompletion', e =>
//             updateRfidUI(
//               DocumentReaderNotification.fromJson(JSON.parse(e['msg'])),
//             ),
//           );
//         }
//       },
//     );
//   };

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
//     await DocumentReader.deinitializeReader(
//       s => {},
//       e => {},
//     );
//     setIsLoading(true);
//     await prepareDatabase();
//     setIsLoading(false);
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
