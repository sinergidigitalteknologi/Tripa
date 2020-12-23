import DeviceInfo from 'react-native-device-info'
const CryptoJS = require("crypto-js");

export let deviceIdEncryptedResult
export let uniqueID

export function encryptDeviceID(deviceName, userid){

    console.log('device name : ', deviceName, 'user id : ', userid)
    let keyDeviceID = 'k3b4y0r4nCIRCLE'
    
    let deleteSymbols = deviceName.replace(/[\W_]+/g," ");
    let repDeviceName = deleteSymbols.replace(/ /g,'')

    let plainDeviceID = repDeviceName + userid
    let encryptedDeviceID = (function(plainDeviceID) {
        let tmpKey = CryptoJS.enc.Utf8.parse(keyDeviceID)
        let iv = CryptoJS.enc.Utf8.parse('0000000000000000');
        let encryptedDeviceID = CryptoJS.AES.encrypt(plainDeviceID, tmpKey, {
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            keySize: 256,
                            padding: CryptoJS.pad.Pkcs7,
                            });
                            return encryptedDeviceID;
                 })(plainDeviceID);
                 
        let pureEncryptedDeviceID = encryptedDeviceID.ciphertext.toString(CryptoJS.enc.Base64);

    let addKeyLength = '0'
    let encryptedLength = pureEncryptedDeviceID.length
      
    if(encryptedLength <= 32)
    {
        let addLength = 32 - encryptedLength 
        for(let n = 1; n < addLength; n++)
        {
            addKeyLength += '0' 
        }

        return deviceIdEncryptedResult = pureEncryptedDeviceID + addKeyLength
    }

}


export function getUniqueID(){
    const IDFV = DeviceInfo.getUniqueID()
    let deleteSymbols = IDFV.replace(/[\W_]+/g," ");
    let clearSpace = deleteSymbols.replace(/ /g, "")
    return uniqueID = clearSpace
   
}
