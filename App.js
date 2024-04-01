import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import colors from './src/common/colors';
import { splashLogo, x_logo } from './src/common/images';
import NavigationStack from './src/navigation/NavigationStack';
import NetworkLogger from 'react-native-network-logger';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [openLogs, setOpenLogs] = useState(false);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(splashTimeout);
  }, []);

  const handleToggleLogs = () => {
    setOpenLogs(prevState => !prevState);
  };

  const handleCloseLogs = () => {
    setOpenLogs(false);
  };

  const renderNavigation = useCallback(() => {
    return showSplash ? (
      <View style={styles.splashContainer}>
        <Image source={x_logo} style={styles.backgroundImage} />
        <Image source={splashLogo} style={styles.logo} />
      </View>
    ) : (
      <NavigationStack />
    );
  }, [showSplash]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={handleCloseLogs}>
        <View style={styles.container}>
          <StatusBar backgroundColor={colors.app_blue} />
          {renderNavigation()}
          <TouchableOpacity style={styles.logButton} onPress={handleToggleLogs}>
            <Text style={styles.logButtonText}>Logs</Text>
          </TouchableOpacity>
          {openLogs && <NetworkLogger />}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.app_blue,
  },
  container: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    height: 80,
    width: '80%'
  },
  backgroundImage: {
    position: 'absolute',
    top: '30%',
    left: 0,
    height: '40%',
    width: 250,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  logButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.app_red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logButtonText: {
    alignSelf: 'center',
    color: colors.white,
  },
});

export default App;
