import 'react-native-gesture-handler' // must be first
import 'node-libs-react-native/globals.js'
import '#/platform/polyfills'

import {LogBox} from 'react-native'
import {registerRootComponent} from 'expo'

import {doPolyfill} from '#/lib/api/api-polyfill'
import App from '#/App'
import {IS_TEST} from '#/env'

doPolyfill()

if (IS_TEST) {
  LogBox.ignoreAllLogs() // suppress all logs in tests
} else {
  LogBox.ignoreLogs(['Require cycle:']) // suppress require-cycle warnings, it's fine
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
