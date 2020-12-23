// 'use strict';
import { AsyncStorage } from "react-native";
import axios from "axios";

export const getDataWithHeader = (url, dataToken) => {
  var headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + dataToken,
  };
  return new Promise((resolve, reject) => {
    // const instance = axios.create({
    //   httpsAgent: new https.Agent({
    //     rejectUnauthorized: false,
    //   }),
    // });
    // axios.defaults.httpAgent = new https.Agent({rejectUnauthorized: false});
    axios
      .get(url, { headers: headers })
      .then((res) => {
        resolve(res.data);
        // console.log('data resolve di rest', res);
      })
      .catch((err) => {
        reject(err);
        console.log("data reject di rest", err.response);
        // if (err.response.status == 401) {
        //   console.log('error 401 nih');
        // }
      });
  });
};

export const postDataOutHeader = (url, data) => {
  // var headers = {
  //   'Content-Type': 'application/json',
  //   verify: false,
  // };
  // const instance = axios.create({
  //   httpsAgent: new https.Agent({
  //     rejectUnauthorized: false,
  //   }),
  // });
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then((res) => {
        resolve(res.data);
        // console.log('data resolve di rest', res);
      })
      .catch((err) => {
        reject(err);
        console.log("data reject di rest", err);
      });
  });
};

export const postDataWitHeader = (url, data, token) => {
  // getToken();
  var headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, { headers: headers })
      .then((res) => {
        resolve(res.data);
        // console.log('data resolve di rest', res);
      })
      .catch((err) => {
        reject(err);
        console.log("data reject di rest", err.response);
      });
  });
};
export const postDataWitHeaderForm = (url, data, token) => {
  // getToken();
  var headers = {
    "Content-Type":
      'multipart/form-data; charset=utf-8; boundary="another cool boundary";',
    Authorization: "Bearer " + token,
  };

  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then((res) => {
        resolve(res.data);
        // console.log('data resolve di rest', res);
      })
      .catch((err) => {
        reject(err);
        console.log("data reject di rest", err.response);
      });
  });
};

export const postNoHeader = (url, data) => {
  // let querystring = require('querystring');
  // let params = querystring.stringify(data)

  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then((res) => {
        resolve(res.data);
        // console.log("data resolve di rest", res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getDataWitHeader = (url, token) => {
  // getToken();
  var headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  // const instance = axios.create({
  //   httpsAgent: new https.Agent({
  //     rejectUnauthorized: false,
  //   }),
  // });

  return new Promise((resolve, reject) => {
    axios
      .get(url, { headers: headers })
      .then((res) => {
        resolve(res.data);
        // console.log('data resolve di rest', res);
      })
      .catch((err) => {
        reject(err);
        console.log("data reject di rest", err.response);
      });
  });
};

export const getData = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((res) => {
        resolve(res.data);
        // console.log('data resolve di rest', res);
      })
      .catch((err) => {
        reject(err);
        console.log("data reject di rest", err.response);
      });
  });
};
