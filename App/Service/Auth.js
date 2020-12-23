import {AsyncStorage} from 'react-native';
import {
  AUTH,
  AUTH_USER,
  TERMANDCONDITION,
  BOT_GENDER,
  TRANSPASS,
  NEWLOADFLAG,
  NOTIFICATION,
  NOTIFICATION2,
} from '../const/Config';

export const onSignIn = data => {
  let params = Object.assign({}, data);
  var values = [
    [AUTH, data.token],
    [AUTH_USER, JSON.stringify(params)],
  ];
  AsyncStorage.multiSet(values);

  // AsyncStorage.setItem(AUTH,data.token)
};

export const checkTNC = dataTNC =>
  AsyncStorage.setItem(TERMANDCONDITION, JSON.stringify(dataTNC));

export const transPass = data =>
  AsyncStorage.setItem(TRANSPASS, JSON.stringify(data));

export const newLoad = data =>
  AsyncStorage.setItem(NEWLOADFLAG, JSON.stringify(data));

export const updateData = data =>
  AsyncStorage.setItem(AUTH_USER, JSON.stringify(data));

export const notificationStore = data =>
  AsyncStorage.setItem(NOTIFICATION, JSON.stringify(data));

export const notificationStore2 = data =>
  AsyncStorage.setItem(NOTIFICATION2, JSON.stringify(data));

export const onSignOut = () => AsyncStorage.multiRemove([AUTH, AUTH_USER]);

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(AUTH)
      .then(res => {
        if (res == null) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
      .catch(err => reject(err));
  });
};
