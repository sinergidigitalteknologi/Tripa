import Geolocation from '@react-native-community/geolocation';
import CustomAlert from './CustomAlert';

const helpers = {
  checkFieldName: function(value) {
    var check = /^[a-zA-Z\s]+$/.test(value);
    return check;
  },
  getLocations: function(param1) {
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        return position;
      },
      // error => Alert.alert('Error', JSON.stringify(error)),
      error => CustomAlert.AlertLocation('Perhatian', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  },
  helper3: function(param1, param2) {},
};

export function convertToRupiah(angka) {
  try {
    var aa = parseInt(angka.replace(/,.*|[^0-9]/g, ''), 10);
  } catch {}
  try {
    var rupiah = '';
    var angkarev = aa
      .toString()
      .split('')
      .reverse()
      .join('');
    for (var i = 0; i < angkarev.length; i++)
      if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
    return rupiah
      .split('', rupiah.length - 1)
      .reverse()
      .join('');
  } catch {}
}

export default helpers;
