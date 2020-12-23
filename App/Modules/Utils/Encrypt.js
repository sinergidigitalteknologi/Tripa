import CryptoJS from "react-native-crypto-js";


export const encData = (data) => {
  let key = 'k384y0r4nTRIANGLE000000000000000';
    // console.log('key : ', key);
    let plaintext = data;
    let cipher = (function(plaintext) {
      let tmpKey = CryptoJS.enc.Utf8.parse(key);
      let iv = CryptoJS.enc.Utf8.parse('0000000000000000');
      let cipher = CryptoJS.AES.encrypt(plaintext, tmpKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        keySize: 256,
        padding: CryptoJS.pad.Pkcs7,
        //  keySize: 256 / 32,
      });
      return cipher;
    })(plaintext);

    let cipherBase64 = cipher.ciphertext.toString(CryptoJS.enc.Base64);

    return cipherBase64;
}
