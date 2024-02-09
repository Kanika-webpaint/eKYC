import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, ScrollView } from 'react-native';
import { background_image } from '../common/images';
import colors from '../common/colors';
import Logo from '../components/Logo';

const ChooseRole = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole === 'organization') {
      // Navigate to organization registration screen
      navigation.navigate('OrganizationStack');
    } else if (selectedRole === 'user') {
      // Navigate to user registration screen
      navigation.navigate('UserStack');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={background_image}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps='handled'>
          <Logo />
          <View style={{ margin: 20 }}>
            <Text style={styles.title}>Choose your role</Text>
            <View style={{ marginTop: 50 }}>
              <TouchableOpacity
                style={[styles.roleButton, selectedRole === 'organization' && styles.selected]}
                onPress={() => handleRoleSelection('organization')}
              >
                <Text style={[styles.roleButtonText, selectedRole === 'organization' && styles.selectedText]}>ORGANIZATION</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, selectedRole === 'user' && styles.selected]}
                onPress={() => handleRoleSelection('user')}
              >
                <Text style={[styles.roleButtonText, selectedRole === 'user' && styles.selectedText]}>USER</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                disabled={!selectedRole}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#06071A'
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    alignSelf: 'center'
  },
  title: {
    alignSelf: 'center',
    fontWeight: '500',
    fontSize: 20,
    color: colors.white,
    padding: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  roleButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: colors.light_purple,
    marginBottom: 15,
  },
  roleButtonText: {
    fontSize: 18,
    alignSelf: 'center',
  },
  selected: {
    backgroundColor: colors.light_purple,
    color: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  continueButton: {
    marginTop: 30,
    backgroundColor: colors.app_red,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  selectedText: {
    color: colors.app_red,
    fontWeight: '600'
  }
});

export default ChooseRole