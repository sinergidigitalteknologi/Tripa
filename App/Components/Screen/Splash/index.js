import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {withNavigation} from 'react-navigation';
import {getValue} from './../../../Modules/LocalData';

import {
  Container,
  Header,
  Content,
  Item,
  Card,
  CardItem,
  Body,
  Input,
} from 'native-base';
import {
  Text,
  View,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  Button,
  Dimensions,
  Platform,
} from 'react-native';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showSpinner: false,
      message: '',
    };
  }
  componentDidMount() {
    if (Platform.OS == 'android') {
      setTimeout(() => {
        this.checkLogin();
      }, 2000);
    } else {
      this.checkLogin();
    }
  }
  checkLogin() {
    let login = '';
    getValue('hasLogin').then(response => {
      // console.log('response hasLogin 1 =>  ', response);

      if (response != null) {
        login = response;
        // console.log('response hasLogin =>  ', login);
        if (login == true) {
          // console.log('response hasLogin if =>  ', login);
          this.props.navigation.replace('MainTab');
        } else {
          this.props.navigation.replace('Login');
        }
      } else {
        this.props.navigation.replace('Login');
      }
    });
  }
  render() {
    if (Platform.OS == 'ios') {
      return <View style={styles.container} />;
    } else {
      return (
        <View style={styles.container}>
          <Image
            source={require('./../../../assets/image/img_logo_tripa.png')}
            style={{
              width: 200,
              height: '10%',
              marginBottom: 50,
              resizeMode: 'stretch',
            }}
          />

          <Image
            source={require('./../../../assets/image/splash.png')}
            style={{
              width: '100%',
              height: (Dimensions.get('window').height * 4) / 6,
              resizeMode: 'stretch',
            }}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'white',
  },
});

export default withNavigation(Splash);
