import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {bin, close, filter, plus, profileGrey} from '../../../common/images';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import Status from '../../../components/Status';
import {fonts} from '../../../common/fonts';
import {styles} from './styles';
import colors from '../../../common/colors';
import Header from '../../../components/Header';
import {
  deleteUserAction,
  getUsersListAction,
} from '../../../redux/actions/Organization/organizationActions';
import {Swipeable} from 'react-native-gesture-handler';
import Loader from '../../../components/ActivityIndicator';

const UserList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const usersListing = useSelector(state => state?.org?.getUsersList);

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then(value => {
        if (value) {
          setToken(value);
          dispatch(getUsersListAction(value, setIsLoading));
        }
      })
      .then(res => {});
  }, [dispatch]);

  const handleSearch = text => {
    setSearchQuery(text);
    const filtered =
      usersListing &&
      usersListing?.filter(user =>
        user?.username.toLowerCase().includes(text.toLowerCase()),
      );
    setFilteredUsers(filtered);
  };

  const navigateToUserProfile = item => {
    navigation.navigate('UserProfile', {id: item?.id});
  };

  const handleDelete = id => {
    dispatch(deleteUserAction(id, token, navigation, setIsLoading));
  };

  const renderRightActions = id => {
    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={styles.rightItem}
          onPress={() => handleDelete(id)}>
          {isLoading ? (
            <Loader />
          ) : (
            <Image source={bin} style={styles.imageRightAction} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({item}) => {
    return (
      <Swipeable
        underlayColor="transparent"
        renderRightActions={() => renderRightActions(item.id)}>
        <View style={{justifyContent: 'space-between'}}>
          <TouchableHighlight
            underlayColor="transparent"
            hitSlop={{top: 100, bottom: 100, left: 200, right: 200}}
            style={styles.itemContainer}
            onPress={() => navigateToUserProfile(item)}>
            <View style={styles.userInfoContainer}>
              <Image source={profileGrey} style={styles.image} />
              <View>
                <Text style={styles.userName}>{item?.username || ''}</Text>
                <Text style={styles.phoneNumber}>
                  {item?.phoneNumber || ''}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </Swipeable>
    );
  };

  const removeSearchText = () => {
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Status isLight />
        <View>
          <Header title={'Users'} />
          {isLoading ? (
            <Loader />
          ) : (
            <View>
              <View style={{flexDirection: 'row', margin: 20}}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    backgroundColor: colors.purple_dim,
                    borderRadius: 5,
                    width: '80%',
                    elevation: 3,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                  }}>
                  <Image source={filter} style={styles.filterIcon} />
                  <TextInput
                    placeholder="Search user..."
                    onChangeText={handleSearch}
                    value={searchQuery}
                    style={styles.searchInput}
                  />

                  {searchQuery && searchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={() => removeSearchText()}
                      style={{position: 'absolute', right: 10}}>
                      <Image source={close} style={styles.close} />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreateUser')}
                  style={styles.addView}>
                  <Image source={plus} style={styles.plusIcon} />
                </TouchableOpacity>
              </View>

              {searchQuery && filteredUsers && filteredUsers.length === 0 && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontFamily: fonts.regular}}>
                    No users found!
                  </Text>
                </View>
              )}
              {!searchQuery && usersListing && usersListing.length === 0 && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontFamily: fonts.regular}}>
                    No users found!
                  </Text>
                </View>
              )}
              {usersListing && usersListing?.length > 0 ? (
                <FlatList
                  nestedScrollEnabled
                  style={{margin: 15}}
                  data={searchQuery ? filteredUsers : usersListing}
                  renderItem={renderItem}
                  keyExtractor={item => item?.id.toString()}
                />
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserList;
