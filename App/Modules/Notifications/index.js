import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const configure = onNotification => {
  PushNotification.configure({
    onRegister: function(token) {
      //process token
    },

    onNotification: onNotification,

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,
    requestPermissions: true,
  });
};

const localNotification = (title, message, subText, bigTextExpand) => {
  PushNotification.localNotification({
    autoCancel: true,
    largeIcon: 'ic_launcher',
    smallIcon: 'ic_notification',
    bigText: bigTextExpand,
    subText: subText,
    color: 'green',
    vibrate: true,
    vibration: 300,
    title: title,
    message: message,
    playSound: true,
    soundName: 'default',
    actions: null,
    alertAction: 'view', // (optional) default: view
    category: 'Notification', // (optional) default: null
    userInfo: {}, // (optional) default: null (object containing additional notification data)
    number: 1,
  });
};

const localNotificationIOS = (title, message, subText, bigTextExpand) => {
  PushNotificationIOS.presentLocalNotification({
    alertBody: title,
    applicationIconBadgeNumber: 1,
  });
};

const cancelAll = () => {
  PushNotification.cancelAllLocalNotifications();
};

export {configure, localNotification, cancelAll, localNotificationIOS};
