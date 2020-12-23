import React, {Component} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import NetInfo from '@react-native-community/netinfo';

import {
  View,
  Text,
  Image,
  BackHandler,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
// import {Spinner} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

class AlertNoConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isOfflline: false,
      showSpinner: false,
    };
  }

  componentDidMount() {
    NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (state.isConnected) {
        this.setState({isOfflline: false});
      } else {
        this.setState({isOfflline: true});
        setTimeout(() => {
          this.RBSheetStatusConnection.open();
        }, 1000);
      }
      console.log('isOfflline?', this.state.isOfflline);
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }
  componentDidUpdate() {}

  handleBackButton = () => {
    console.log('handleBackButton');

    BackHandler.exitApp();
  };

  btnStatusInetChange = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        setTimeout(() => {
          this.setState({
            isLoading: false,
          });
          if (!this.state.isOfflline) {
            this.RBSheetStatusConnection.close();
          }
        }, 1000);
      },
    );
  };

  render() {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheetStatusConnection = ref;
        }}
        closeOnDragDown={false}
        closeOnPressMask={false}
        closeOnPressBack={false}
        height={350}
        duration={300}
        customStyles={{
          container: {
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'center',
          },
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            marginStart: 5,
            marginEnd: 5,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={{
              height: 200,
              width: 200,
              resizeMode: 'contain',
              marginBottom: -20,
            }}
            source={require('./../assets/image/no_connection.png')}
          />
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
            Anda sedang offline.
          </Text>
          <Text style={{fontSize: 12, marginTop: 5}}>
            Aktifkan data seluler atau Wi-Fi dan
          </Text>
          <Text style={{fontSize: 12}}>periksa sinyal di area anda</Text>

          <View style={{flexDirection: 'row', marginTop: 20}}>
            {this.state.isLoading ? (
              <View
                style={{
                  borderColor: '#02aced',
                  borderWidth: 1,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 120,
                  height: 30,
                  margin: 5,
                }}>
                <ActivityIndicator size="small" color="#02aced" />
              </View>
            ) : (
              <TouchableOpacity
                onPress={this.btnStatusInetChange}
                style={{
                  borderColor: '#02aced',
                  borderWidth: 1,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 120,
                  height: 30,
                  margin: 5,
                }}>
                <Text
                  style={{fontSize: 14, color: '#02aced', fontWeight: 'bold'}}>
                  Coba Lagi
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </RBSheet>
    );
  }
}

export default AlertNoConnection;
