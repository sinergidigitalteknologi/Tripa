import { DeviceEventEmitter } from 'react-native'
export const showAlert = (data) =>{ 
  DeviceEventEmitter.emit('alert-open',data)
};
export const closeAlert = () =>{ 
  DeviceEventEmitter.emit('alert-close')
};
export const openDrawer = () =>{ 
  DeviceEventEmitter.emit('drawer-open')
};
export const backNav = () =>{ 
  DeviceEventEmitter.emit('nav-back')
};