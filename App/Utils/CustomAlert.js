import React, {Component} from 'react';
import {Alert, Linking} from 'react-native';

const CustomAlert = {
  AlertLocation: function(title, message) {
    return Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => openSetting()},
      ],
      {cancelable: false},
    );
  },
  AlertValidation: function(title, message) {
    return Alert.alert(
      title,
      message,
      [
        {
          text: 'batal',
          style: 'cancel',
        },
        {text: 'OK'},
      ],
      {cancelable: false},
    );
  },
  helper2: function(param1) {},
  helper3: function(param1, param2) {},
};

function openSetting() {
  try {
    //ios
    // Linking.openURL('app-settings:');
    Linking.openURL('app-settings:');
  } catch (error) {
    console.log('error', error);
  }
}

export default CustomAlert;
