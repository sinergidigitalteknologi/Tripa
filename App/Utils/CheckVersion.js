import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import RBSheet from 'react-native-raw-bottom-sheet';
import {getValue} from './../../../../Modules/LocalData';
import {getDataWithHeader} from './../../../../Services';
import Api from '../../../../Utils/Api';
import ApiEndPoint from './../../../../Modules/Utils/ApiEndPoint';
import {moderateScale} from '../../../../Utils/Scale';

import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Linking,
} from 'react-native';

class CheckVersion extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <RBSheet />;
  }
}
