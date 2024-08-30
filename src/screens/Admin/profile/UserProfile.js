import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Image,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Status from '../../../components/Status';
import {styles} from './styles';
import Header from '../../../components/Header';
import {getUserByIdAction} from '../../../redux/actions/Organization/organizationActions';
import colors from '../../../common/colors';
import {userRed, verifiedUser} from '../../../common/images';
import {FlatList} from 'react-native';
import axios from 'axios';
function UserProfile({route}) {
  const userDetail = useSelector(state => state?.org?.getUser);
  const [isLoading, setIsLoading] = useState(true); // Start with loading as true
  const dispatch = useDispatch();
  console.log(userDetail, 'kkkk');
  useEffect(() => {
    AsyncStorage.getItem('token').then(value => {
      if (value) {
        dispatch(getUserByIdAction(route?.params?.id, value, setIsLoading));
      }
    });
  }, [dispatch]);

  // useEffect(() => {
  //   const fetchImage = async () => {
  //     if (
  //       Array.isArray(userDetail?.documents) &&
  //       userDetail.documents.length > 0 &&
  //       userDetail.documents[0]?.portraitImage
  //     ) {
  //       try {
  //         const geturl = `https://validifyx.com/node/api/file/${userDetail.documents[0].portraitImage}`;
  //         const response = await axios.get(geturl);
  //         // Handle the response here
  //         console.log('Image fetched successfully:', response);
  //       } catch (error) {
  //         // Handle the error here
  //         console.error('Error fetching image:', error);
  //       }
  //     }
  //   };

  //   fetchImage();
  // }, [userDetail]);

  if (isLoading && userDetail.length == 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '40%',
        }}>
        <ActivityIndicator
          color={colors.app_red}
          style={{alignSelf: 'center'}}
          size={30}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Status isLight />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={{justifyContent: 'center'}}>
          <Header title={'Profile'} />

          <View style={styles.imageView}>
            {Array.isArray(userDetail?.documents) &&
            userDetail.documents.length > 0 &&
            userDetail.documents[0]?.portraitImage ? (
              <Image
                source={{
                  uri: `https://validifyx.com/node/api/file/${userDetail.documents[0].portraitImage}`,
                }}
                style={{width: 65, height: 65, borderRadius: 35}}
              />
            ) : (
              <Image source={userRed} style={styles.img} />
            )}

            {userDetail?.isVerified && (
              <Image source={verifiedUser} style={styles.verifyImg} />
            )}
          </View>
        </View>

        {userDetail && (
          <View style={{marginTop: 20, marginHorizontal: 20}}>
            <TextInput
              editable={false}
              value={userDetail?.username || ''}
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.grey}
            />
            <TextInput
              editable={false}
              value={userDetail?.phoneNumber || ''}
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor={colors.grey}
            />
          </View>
        )}

        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.address && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Address </Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {' '}
                  {userDetail.documents[0].address}
                </Text>
              </View>
            </View>
          )}

        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.age && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Age</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>{userDetail.documents[0].age}</Text>
              </View>
            </View>
          )}

        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.dateofBirth && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>DOB</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].dateofBirth}
                </Text>
              </View>
            </View>
          )}

        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.dateofBirth && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Date of Birth</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].dateofBirth}
                </Text>
              </View>
            </View>
          )}

        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.placeofBirth && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Place of Birth</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].placeofBirth}
                </Text>
              </View>
            </View>
          )}

        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.documentNumber && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Documnet Number</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].documentNumber}
                </Text>
              </View>
            </View>
          )}
        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.passportNumber && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Passport Number</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].passportNumber}
                </Text>
              </View>
            </View>
          )}
        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.dateofExpiry && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Date of Expiry</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].dateofExpiry}
                </Text>
              </View>
            </View>
          )}
        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.dateofIssue && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Date of Issue</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].dateofIssue}
                </Text>
              </View>
            </View>
          )}
        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.monthsToExpire && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Months to expire</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].monthsToExpire}
                </Text>
              </View>
            </View>
          )}

        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.ageAtIssue && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Age at Issue</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].ageAtIssue}
                </Text>
              </View>
            </View>
          )}
        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.yearsSinceIssue && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Years sice Issue</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].yearsSinceIssue}
                </Text>
              </View>
            </View>
          )}
        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.issuingState && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Issuing State</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].issuingState}
                </Text>
              </View>
            </View>
          )}
        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.surname && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Sur Name</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].surname}
                </Text>
              </View>
            </View>
          )}
        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.surnameandGivenNames && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Name</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].surnameandGivenNames}
                </Text>
              </View>
            </View>
          )}
        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.nationality && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Nationality</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].nationality}
                </Text>
              </View>
            </View>
          )}
        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.sex && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Gender</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>{userDetail.documents[0].sex}</Text>
              </View>
            </View>
          )}

        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.companyName && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Company Name</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].companyName}
                </Text>
              </View>
            </View>
          )}

        {Array.isArray(userDetail?.documents) &&
          userDetail.documents.length > 0 &&
          userDetail.documents[0]?.address && (
            <View style={styles.inputLower}>
              <View style={styles.inputLowerLeft}>
                <Text style={styles.text}>Address</Text>
              </View>
              <View style={styles.inputLowerRight}>
                <Text style={styles.text}>
                  {userDetail.documents[0].address}
                </Text>
              </View>
            </View>
          )}
        <View style={styles.verifyView}>
          <Text style={styles.verifiedStatus}>
            {userDetail?.isVerified == 1 ? 'Verified' : 'Not Verified'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default UserProfile;
