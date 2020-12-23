// import React from 'react';
// import {Icon} from 'react-native-elements';
// import {StackNavigator, NavigationActions} from 'react-navigation';
import {StackNavigator} from 'react-navigation';
import Login from './Components/Screen/Welcome/Login';
// import Main from './Components/Screen/Main';

export default StackNavigator(
  {
    Login: {
      screen: Login,
    },
  },
  {
    initialRouteName: 'Login',
  },
);
