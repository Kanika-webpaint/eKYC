import React from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  TextInput,
} from 'react-native';
import {useSelector} from 'react-redux';
import Status from '../../../components/Status';
import {styles} from './styles';
import Header from '../../../components/Header';
import {userRed} from '../../../common/images';

function AdminProfile() {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
  const orgDetailsList = useSelector(state => state?.org?.orgDetails);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <Status isLight />
          <View style={{justifyContent: 'center'}}>
            <Header title={'Profile'} />
            <View style={styles.middleView}></View>
            <View style={styles.imageView}>
              <Image source={userRed} style={styles.img} />
            </View>
          </View>
          <View style={{margin: 20}}>
            <TextInput
              editable={false}
              value={orgDetailsList?.organization?.name || ''}
              style={styles.input}
            />
            <TextInput
              editable={false}
              value={orgDetailsList?.organization?.email || ''}
              style={styles.input}
            />
            <TextInput
              editable={false}
              value={orgDetailsList?.organization?.city || ''}
              style={styles.input}
            />
            <TextInput
              editable={false}
              value={orgDetailsList?.organization?.country || ''}
              style={styles.input}
            />
            <TextInput
              editable={false}
              value={orgDetailsList?.organization?.state || ''}
              style={styles.input}
            />
            <TextInput
              editable={false}
              value={orgDetailsList?.organization?.zip || ''}
              style={styles.input}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default AdminProfile;
