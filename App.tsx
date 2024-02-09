/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  StatusBar
} from 'react-native';
import NavigationStack from './src/navigation/NavigationStack';
import colors from './src/common/colors';
import { validifyX_logo, x_logo } from './src/common/images';


function App(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 3000 milliseconds (3 seconds) timeout

    // Cleanup function to clear the timeout in case the component unmounts
    return () => clearTimeout(splashTimeout);
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={colors.app_blue}
      />
      {showSplash ? (
        <View style={styles.splashContainer}>
          <Image source={x_logo} style={styles.backgroundImage} />
          <Image source={validifyX_logo} style={styles.logo} />
        </View>
      ) : (
        <NavigationStack />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.app_blue,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    alignSelf: 'center',
    justifyContent: 'center',
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
});

export default App;
