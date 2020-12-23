import RBSheet from 'react-native-raw-bottom-sheet';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import React, {Component} from 'react';

class CustomBs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorHit: false,
      message: '',
      actions: '',
    };
  }

  componentDidMount() {
    this.props.onCustomBS(this);
  }

  componentWillUnmount() {
    this.props.onCustomBS(undefined);
  }
  showBsSuccess(message, actions) {
    this.setState({errorHit: false, message: message, actions});
    this.RBSheet.open();
  }

  showBsFail(message) {
    this.setState({errorHit: true, message: message});
    this.RBSheet.open();
  }
  showBsLoading() {
    this.RBSheetLoading.open();
  }

  showBSNotif(message) {
    this.setState({message: message});
    this.RBSheetNotification.open();
  }

  closeBsLoading() {
    this.RBSheetLoading.close();
    this.setState({actions: ''});
  }

  eventOnClose() {
    if (this.state.actions == 'back') {
      this.RBSheet.close();
      this.setState({actions: ''});
      this.props.goBack();
    } else {
      this.RBSheet.close();
      this.setState({actions: ''});
    }
  }

  renderBsLoading() {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheetLoading = ref;
        }}
        height={Dimensions.get('window').height / 2 + 100}
        closeOnPressMask={false}
        duration={250}
        customStyles={{
          container: {
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignContent: 'center',
          },
        }}>
        <View style={styles.BSView}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color="#0a61c3" />
            <Text style={{marginTop: 10}}>Sedang memuat...</Text>
          </View>
        </View>
      </RBSheet>
    );
  }

  renderBsNotification() {
    return (
      <View>
        <RBSheet
          ref={ref => {
            this.RBSheetNotification = ref;
          }}
          height={Dimensions.get('window').height / 2 + 100}
          closeOnPressMask={false}
          closeOnPressBack={false}
          duration={250}
          customStyles={{
            container: {
              backgroundColor: 'transparent',
              justifyContent: 'center',
            },
          }}>
          <View style={styles.BSView}>
            <Text style={styles.BSMessage}>{this.state.message}</Text>
            <TouchableOpacity
              onPress={() => this.RBSheetNotification.close()}
              style={styles.BSClose}>
              <Text style={styles.BSCloseText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
        {this.renderBsLoading()}
      </View>
    );
  }

  render() {
    return (
      <View>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={Dimensions.get('window').height / 2 + 100}
          closeOnPressMask={false}
          closeOnPressBack={false}
          duration={250}
          customStyles={{
            container: {
              backgroundColor: 'transparent',
              justifyContent: 'center',
            },
          }}>
          {this.state.errorHit != false ? (
            <View style={styles.BSView}>
              <Text style={styles.BSInfoWarning}>Peringatan !!</Text>
              <Text style={styles.BSMessage}>{this.state.message}</Text>
              <TouchableOpacity
                onPress={() => this.RBSheet.close()}
                style={styles.BSCloseWarning}>
                <Text style={styles.BSCloseTextWarning}>Tutup</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.BSView}>
              <Text style={styles.BSInfo}>Berhasil</Text>
              <Text style={styles.BSMessage}>{this.state.message}</Text>
              <TouchableOpacity
                onPress={() => this.eventOnClose()}
                style={styles.BSClose}>
                <Text style={styles.BSCloseText}>Ok</Text>
              </TouchableOpacity>
            </View>
          )}
        </RBSheet>
        {this.renderBsLoading()}
        {this.renderBsNotification()}
      </View>
    );
  }
}

export function BsLoading() {
  return (
    <RBSheet
      ref={ref => {
        this.RBSheetLoading = ref;
      }}
      height={Dimensions.get('window').height / 2 + 100}
      closeOnPressMask={false}
      duration={250}
      customStyles={{
        container: {
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignContent: 'center',
        },
      }}>
      <View style={styles.BSView}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#0a61c3" />
          <Text style={{marginTop: 10}}>Sedang memuat...</Text>
        </View>
      </View>
    </RBSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    alignItems: 'center',
    fontFamily: 'HKGrotesk-Regular',
    marginBottom: 34,
    marginTop: 30,
  },
  textContent2: {
    flexDirection: 'row',
    fontFamily: 'HKGrotesk-Regular',
  },
  containerText: {
    alignItems: 'center',
    marginTop: 18,
  },
  logoImage: {
    alignSelf: 'center',
    width: '70%',
    height: 70,
    resizeMode: 'contain',
  },
  inputs: {
    width: '100%',
    fontFamily: 'HKGrotesk-Regular',
    color: '#989a9d',
    paddingVertical: Platform.OS == 'ios' ? '4.6%' : '4%',
    paddingLeft: '5%',
    paddingRight: '5%',
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    elevation: 1,
  },
  btnLogin: {
    width: '100%',
    color: '#fff',
    paddingVertical: Platform.OS == 'ios' ? '4%' : '4.5%',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#0a61c3',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    elevation: 1,
  },
  BSView: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignContent: 'center',
    marginHorizontal: 10,
    marginBottom: Dimensions.get('window').height / 2 - 100,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  BSInfo: {
    fontWeight: 'bold',
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 20,
    marginBottom: 6,
    color: '#0a61c3',
  },
  BSInfoWarning: {
    fontWeight: 'bold',
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 20,
    marginBottom: 6,
    color: '#FFCC00',
  },
  BSMessage: {
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 18,
    marginBottom: 22,
  },
  BSClose: {
    fontFamily: 'HKGrotesk-Regular',
    width: 100,
    borderWidth: 2,
    alignSelf: 'flex-end',
    borderColor: '#0a61c3',
    borderRadius: 12,
    paddingVertical: 10,
  },
  BSCloseWarning: {
    width: 100,
    borderWidth: 2,
    alignSelf: 'flex-end',
    borderColor: '#FFCC00',
    borderRadius: 12,
    paddingVertical: 10,
  },
  BSCloseText: {
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#0a61c3',
  },
  BSCloseTextWarning: {
    fontSize: 14,
    fontFamily: 'HKGrotesk-Regular',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFCC00',
  },
});

export default CustomBs;
