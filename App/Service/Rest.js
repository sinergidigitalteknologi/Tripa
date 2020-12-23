import {AsyncStorage, Dimensions, StyleSheet, Platform} from 'react-native';
import {AUTH, REFRESH_TOKEN} from '../const/Config';
import axios from 'axios';
import {getStorageValue, onSignIn, isSignedIn} from './Auth';
import API from '../const/APIEndPoints';
import jwtDecode from 'jwt-decode';
// import RNFetchBlob from 'react-native-fetch-blob';
// import Toast from 'react-native-toast-native';
import Colors from '../const/Colors';
const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');
const styles = {
  backgroundColor: '#1abc9c',
  width: deviceWidth - 40,
  height: Platform.OS === 'ios' ? 50 : 100,
  color: '#ffffff',
  fontSize: 15,
  lineHeight: 2,
  lines: 4,
  borderRadius: 4,
  fontWeight: 'bold',
  yOffset: 40,
};

const getRefreshToken = () => {
  return Promise.all([
    AsyncStorage.getItem(AUTH),
    AsyncStorage.getItem(REFRESH_TOKEN),
  ]).then(res => {
    var decodeToken = jwtDecode(res[0]);
    var userId = decodeToken.data.id;
    return axios.post(API.refreshToken, {refresh_token: res[1], id: userId});
  });
};

export const deleteHeaderToken = async () => {
  delete axios.defaults.headers.common['Authorization'];
};

axios.interceptors.request.use(async config => {
  let token = await AsyncStorage.getItem(AUTH);
  if (token) config.headers.Authorization = `bearer ${token}`;
  return config;
});

// axios.interceptors.response.use(response => response,
//   async error => {
//     let token = await AsyncStorage.getItem(AUTH)
//     if (error.response) {
//       if (error.response.status === 401 && token) {
//             return getRefreshToken().then((response)=> {
//               AsyncStorage.setItem(AUTH,response.data.meta.token)
//               error.config.__isRetryRequest = true;
//               error.config.headers.Authorization = response.data.meta.token;
//               return axios(error.config);
//             })
//       }else{
//         // Toast.show(error.response.data.message,Toast.SHORT, Toast.TOP,styles);
//         return Promise.reject(error);
//       }
//     }
//     else if (error.request) {
//       // Toast.show('Terjadi Kesalahan',Toast.SHORT, Toast.TOP,styles);
//     }
//     return Promise.reject(error);
// })

export const post = (url, data) => {
  // let querystring = require('querystring');
  // let params = querystring.stringify(data);
  let params = data;

  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export const postWithHeader = (url, data, token) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export const get = url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export const getWithHeader = (url, token) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {headers: {Authorization: 'Bearer ' + token}})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export const put = (url, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(url, data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export const del = url => {
  return new Promise((resolve, reject) => {
    axios
      .delete(url)
      .then(res => {
        console.log(res);
        resolve(res.data);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};
// export const upload = (url,param) => {
//   console.log(param)
//   return new Promise((resolve,reject)=>{
//       AsyncStorage.getItem(AUTH).then(token=>{
//         return RNFetchBlob.fetch('POST', url, {Authorization :token,'Content-Type' : 'multipart/form-data'},param)
//       })
//       .then((res) => {
//         console.log(res.json())
//         resolve(res.json())
//       })
//       .catch((err) => {
//         console.log(err)
//         // Toast.show(error.response.data.message,Toast.SHORT, Toast.TOP,styles);
//         reject(err)
//       })
//     })
// }
