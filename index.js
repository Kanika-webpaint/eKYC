/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import store from './src/redux';
import { startNetworkLogging } from 'react-native-network-logger';

const ReduxApp = () => (
    <Provider store={store}>
        <App />
    </Provider>  
);
startNetworkLogging();
AppRegistry.registerComponent(appName, () => ReduxApp);
