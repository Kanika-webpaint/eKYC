import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { back, close, filter, plus, profileGrey, rightArrow } from '../../../common/images';
import { useNavigation } from '@react-navigation/native';
import { getUsersListAction } from '../../../redux/actions/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Status from '../../../components/Status';
import { fonts } from '../../../common/fonts';
import { styles } from './styles';
import colors from '../../../common/colors';
import Header from '../../../components/Header';

const UserList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const usersListing = useSelector((state) => state?.login?.getUsersList)

  useEffect(() => {
    AsyncStorage.getItem("token").then((value) => {
      if (value) {
        dispatch(getUsersListAction(value, setIsLoading))
      }
    })
      .then(res => {
        //do something else
      });
  }, [dispatch]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = usersListing && usersListing?.filter(user =>
      user?.username.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const navigateToUserProfile = (item) => {
    navigation.navigate('UserProfile', { id: item?.id })
  }

  const renderItem = ({ item }) => {
    return (
      <View style={{ justifyContent: 'space-between' }}>
        <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToUserProfile(item)}>
          <Image
            source={profileGrey}
            style={styles.image}
          />
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>{item?.username || ''}</Text>
            <Text style={styles.phoneNumber}>{item?.phoneNumber || ''}</Text>
          </View>
          <TouchableOpacity onPress={() => navigateToUserProfile(item)}>
            <Image source={rightArrow} style={{ height: 15, width: 15, resizeMode: 'contain' }} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    )
  }

  const removeSearchText = () => {
    setSearchQuery('')
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView keyboardShouldPersistTaps='handled'>
        <Status isLight />
        <View>
          <Header title={'Users'}/>
          {isLoading ? <Loader /> :
            <View >
              <View style={{ flexDirection: 'row' ,margin:20}}>
                <View style={{
                 
                  flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  backgroundColor: colors.purple_dim,
                  borderRadius: 5,
                  width: '80%',
                  elevation: 3

                }}>
                  <Image source={filter} style={styles.filterIcon} />
                  <TextInput
           
                    placeholder="Search user..."
                    onChangeText={handleSearch}
                    value={searchQuery}
                    style={styles.searchInput}
                  />
                  {searchQuery && (
                    <TouchableOpacity onPress={() => removeSearchText()} style={{ justifyContent: 'center' }}>
                      <Image source={close} style={styles.close} />
                    </TouchableOpacity>
                  )}

                </View>
                <TouchableOpacity onPress={() => navigation.navigate('CreateUser')} style={styles.addView}>
                  <Image source={plus} style={styles.plusIcon} />
                </TouchableOpacity>
              </View>
              {usersListing && usersListing?.length > 0 ?
                <FlatList
                style={{margin:20}}
                  data={searchQuery ? filteredUsers : usersListing} // Render filtered users if search query exists, otherwise render all users
                  renderItem={renderItem}
                  keyExtractor={item => item?.id.toString()}
                />
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontFamily: fonts.regular }}>No users found!</Text>
                </View>
              }
            </View>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default UserList;