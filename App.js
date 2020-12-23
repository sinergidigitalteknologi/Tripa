// import 'react-native-gesture-handler';

import {Provider} from 'react-redux';
import store from './App/redux/store';
import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {AppContainer} from './App/Modules/Navigation';
import {getValue, saveData} from './App/Modules/LocalData';
import * as pushNotifications from './App/Modules/Notifications';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {addMessage} from './App/Components/Screen/MainTab/Chat';
import {addTodo} from './App/redux/actions';
import AddTodo from './App/redux/Addtodo';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import AlertNoConnection from './App/Utils/AlertNoConnection';

import {StatusBar, SafeAreaView, Alert} from 'react-native';

pushNotifications.configure();

class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    pushNotifications.configure(this.onNotif.bind(this));
    await this.checkPermission();
    this.messageListener();
    console.log(' componentDidMount App');
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    console.log(' checkPermission App', enabled);

    if (enabled) {
      this.getFcmToken();
    } else {
      this.requestPermission();
    }
  }

  async getFcmToken() {
    let fcmToken = await AsyncStorage.getItem('fcm');
    console.log(' getFcmToken App', fcmToken);

    if (fcmToken == null || fcmToken == undefined || fcmToken == '') {
      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log('fcm in awal', fcmToken);
        await AsyncStorage.setItem('fcm', fcmToken);
        saveData('fcm', fcmToken);
      } else {
        this.showAlert('Gagal', 'Tidak ada fcm yang diterima');
        console.log('else getFcmToken App');
      }
    } else {
      console.log('else getFcmToken in local ');
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getFcmToken();
    } catch (error) {
      console.log('permission rejected', error);
    }
  }

  async messageListener() {
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification1 => {
        const {title, body} = notification1;
        let notifData = {title: title, body: body};
        console.log('onNotification', notification1);

        if (notification1._data.category == 'inbox') {
          this.showAlert(
            notification1._data.notificationTitle,
            notification1._data.notificationBody,
          );
          this.storeData(notification1._data);
        } else if (notification1._data.category == 'chat') {
          this.sendToChat(notification1._data.message);
        }

        // this.storeData(notification1._data);
        // this.showAlert(title, body); //show alert
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const {title, body} = notificationOpen.notification;
        console.log('onNotificationOpened', notificationOpen);

        this.storeData(notificationOpen._data);
        this.showAlert(title, body);
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();

    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
      console.log('notificationOpen', notificationOpen);

      if (notificationOpen.notification._data.category == 'inbox') {
        this.showAlert(
          notificationOpen.notification._data.notificationTitle,
          notificationOpen.notification._data.notificationBody,
        );
        this.storeData(notificationOpen.notification._data);
      } else if (notificationOpen.notification._data.category == 'chat') {
        this.sendToChat(notificationOpen.notification._data.message);
      }

      // this.storeData(notificationOpen.notification._data);
      // this.showAlert(title, body);
    }

    this.messageListener = firebase.messaging().onMessage(message => {
      let messageNotif = message._data;
      console.log('messageListener', message);
      //push to ui
      if (messageNotif.category == 'inbox') {
        this.showAlert(
          messageNotif.notificationTitle,
          messageNotif.notificationBody,
        );
        this.storeData(messageNotif);
      } else if (messageNotif.category == 'chat') {
        this.sendToChat(messageNotif.message);
        console.log('messageListener 2', messageNotif.message);
      }
    });
  }

  showAlert(title, message) {
    console.log('showAlert notif', title, message);
    pushNotifications.localNotification(title, message, title, message);
  }

  sendToChat(value) {
    try {
      var valuemsg = value.replace(/[\[\]']+/g, '');
      var obj = JSON.parse(valuemsg);
      obj.time = moment().format('HH:mm');
    } catch {}
    // console.log('sendToChat', obj.speech);
    this.onAddtodo.handleAddTodo(obj);
  }

  onNotif(notif) {
    pushNotifications.cancelAll();
    notif.finish(PushNotificationIOS.FetchResult.NoData);

    console.log('on notif ', notif);
    console.log('on notif 2  ', PushNotificationIOS.FetchResult.NoData);
    // this.storeData(notif);
    getValue('dataNotif');
  }

  storeData = async data => {
    console.log('storeData ', data);
    if (data != null) {
      if (data.category == 'chat') {
        // handleChatAgent(data.message);
      } else if (data.category == 'inbox') {
        var dataNotif = [];
        console.log('storeData', data);

        getValue('dataNotif').then(response => {
          if (response != null) {
            response.push(data);
            saveData('dataNotif', response);
          } else {
            dataNotif.push(data);
            saveData('dataNotif', dataNotif);
          }
        });
      }
    }
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <Provider store={store}>
          <AppContainers />
          <AlertNoConnection />
          <AddTodo onAddtodo={ref => (this.onAddtodo = ref)} />
          {/* <AddTodo onAddtodo={ref => (this.sendMessageToChat = ref)} /> */}
        </Provider>
      </SafeAreaView>
    );
  }
}

function AppContainers(a) {
  return <AppContainer />;
}

export default App;
