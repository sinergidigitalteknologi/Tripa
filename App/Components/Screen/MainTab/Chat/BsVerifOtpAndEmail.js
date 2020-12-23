import React, {Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';
import {postDataWitHeader} from './../../../../Services';
import {getDataWithHeader} from './../../../../Services';

import {Icon} from 'react-native-elements';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import {getValue} from './../../../../Modules/LocalData';
import ApiEndPoint from './../../../../Modules/Utils/ApiEndPoint';
import Api from '../../../../Utils/Api';
import Geolocation from '@react-native-community/geolocation';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import {
  View,
  Text,
  Linking,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  DeviceEventEmitter,
} from 'react-native';

let id = '';
let tok = '';
let data_tripa_user = '';
const dataUser = () => {
  getValue('userData').then(response => {
    if (response != null) {
      id = response.data.id;
      tok = response.access_token;
      getDataWithHeader(
        ApiEndPoint.base_url + '/users/' + response.data.id + '/tripa',
        response.access_token,
      ).then(res => {
        if (res.success) {
          data_tripa_user = res.data.tripaUser;
        } else {
        }
      });
    }
  });
};

class BsVerifOtpAndEmail extends Component {
  constructor(props) {
    super(props);
    dataUser();
    this.state = {
      modalVisible: false,
      latitude: '',
      longitude: '',
      isLoading: false,
      isLoadingPhone: false,
      dataUser: '',
      uriPhoto: '',
      dataUserTripa: '',
      isFetching: false,
      isEmailVerified: '',
      isPhoneVerified: '',

      visibleBtn: true,
      counter: 30,

      messageVerifEmail: 'Verifikasi Email',
      statusSendEmail: false,

      message: '',
      errorHit: false,
      emailAlready: '',
      isEmailAlready: false,
      email: '',
    };
  }

  componentDidMount() {
    this.props.onVerifOtp(this);
  }
  componentWillUnmount() {
    this.props.onVerifOtp(undefined);
  }
  componentDidUpdate() {}

  async getLocation() {
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message:
        '<h2>Aktivkan Lokasi Perangkat</h2>Aplikasi ini membutuhkan lokasi anda:<br/><br/>Menggunakan GPS, Wi-Fi, dan jaringan untuk mengakses lokasi<br/><br/>',
      ok: 'YES',
      cancel: 'NO',
      enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
      preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
      providerListener: true, // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
    })
      .then(
        function(success) {
          // success => {alreadyEnabled: true, enabled: true, status: "enabled"}
          Geolocation.getCurrentPosition(
            position => {
              let initialPosition = JSON.stringify(position);
              this.setState({initialPosition});
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              console.log('Lat Long', this.state.latitude);
            },
            error => console.log(error),
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
          );
        }.bind(this),
      )
      .catch(error => {
        console.log('Error LocationServicesDialogBox', error.message);
      });

    DeviceEventEmitter.addListener('locationProviderStatusChange', function(
      status,
    ) {
      // only trigger when "providerListener" is enabled
      console.log('LocationServicesDialogBox ', status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
    });
  }

  async setModalVisible(value) {
    await this.getProfile();
    this.RBSheet.open();
    this.getLocation();
    console.log('render bottom shet VerifOtp', data_tripa_user);
  }
  batal() {
    this.setState({modalVisible: false});
    this.props.messageCancel('batal');
    this.RBSheet.close();
    // this.RBSheetAllert.open();
  }
  nextForm() {
    this.setState({modalVisible: false});
  }

  async getProfile() {
    getValue('userData').then(response => {
      // console.log('response saveData =>  ', response);
      this.setState(
        {
          //   isLoading: true,
        },
        () => {
          if (response.data.id != null && response.access_token != null) {
            const dataRest = getDataWithHeader(
              ApiEndPoint.base_url + '/users/' + response.data.id + '/tripa',
              response.access_token,
            );
            dataRest
              .then(res => {
                let date = new Date();
                console.log('GET_PROFILE_RESPONSE', res);
                if (res.success) {
                  this.setState({
                    isLoading: false,
                    dataUser: res.data,
                    uriPhoto: res.data.picture + '?time=' + date,
                    dataUserTripa: res.data.tripaUser,
                    isFetching: false,
                    isEmailVerified: res.data.isEmailVerified,
                    isPhoneVerified: res.data.isPhoneVerified,
                  });
                } else {
                  this.setState({
                    isLoading: false,
                    isFetching: false,
                  });
                }
              })
              .catch(err => {
                this.setState({
                  isLoading: false,
                  isFetching: false,
                });
                if (err.response.status == 401 || err.response.status == 404) {
                  removeValue('userData');
                  removeValue('hasLogin');
                  removeValue('fcm');

                  this.props.navigation.dispatch(resetAction);
                }
              });
          }
        },
      );
    });
  }

  verifEmail = () => {
    getValue('userData').then(response => {
      this.setState(
        {
          isLoading: true,
        },
        () => {
          if (response.data.id != null && response.access_token != null) {
            const dataRest = getDataWithHeader(
              ApiEndPoint.base_url +
                '/users/' +
                response.data.id +
                '/email-verification',
              response.access_token,
            );
            dataRest
              .then(res => {
                console.log('is email', res);
                this.setState({
                  isLoading: false,
                  errorHit: false,
                  statusSendEmail: true,
                });
              })
              .catch(err => {
                this.setState({
                  isLoading: false,
                  errorHit: true,
                });
                if (err.response) {
                  this.setState({
                    isEmailAlready: true,
                    emailAlready: err.response.data.error.message,
                  });
                } else if (err.request) {
                  this.setState({
                    isEmailAlready: false,
                    emailAlready: 'Coba Lagi ...',
                  });
                } else {
                  this.setState({
                    isEmailAlready: false,
                    emailAlready: 'Coba Lagi ...',
                  });
                }
              });
          }
        },
      );
    });
  };

  actionClose(data) {
    this.RBSheet.close();
    if (data != 'sukses') {
      this.props.messageCancel('batal');
    }
    this.setState({
      modalVisible: false,
      latitude: '',
      longitude: '',
      isLoading: false,
      isLoadingPhone: false,
      dataUser: '',
      uriPhoto: '',
      dataUserTripa: '',
      isFetching: false,
      isEmailVerified: '',
      isPhoneVerified: '',
      visibleBtn: true,
      counter: 30,
      messageVerifEmail: 'Verifikasi Email',
      statusSendEmail: false,
      message: '',
      errorHit: false,
      emailAlready: '',
      isEmailAlready: false,
      email: '',
    });
  }

  verifNoHpAction = () => {
    this.setState({isLoadingPhone: true});
    getValue('userData').then(response => {
      if (response.data.id != null && response.access_token != null) {
        const dataRest = getDataWithHeader(
          ApiEndPoint.base_url +
            '/users/' +
            response.data.id +
            '/phone-verification2',
          response.access_token,
        );
        dataRest
          .then(res => {
            if (res.success) {
              this.props.showInputOtp();
              this.actionClose('sukses');
              this.setState(
                {
                  errorHit: false,
                  isLoadingPhone: false,
                },
                () => {},
              );
            }
          })
          .catch(err => {
            this.setState({
              errorHit: true,
              phoneAlready: 'Terjadi Kendala Teknis, Tutup dan Coba Lagi',
            });
          });
      }
    });
    // setTimeout(() => {
    //   this.props.showInputOtp();
    //   this.actionClose();
    // }, 6000);
  };

  openEmail() {
    Linking.openURL('message:viky@as.com '); // iOS
    return;
  }

  renderBSAllert = () => {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheetAllert = ref;
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
              onPress={() => this.RBSheetAllert.close()}
              style={styles.BSCloseWarning}>
              <Text style={styles.BSCloseTextWarning}>Tutup</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.BSView}>
            <Text style={styles.BSInfo}>Berhasil</Text>
            <Text style={styles.BSMessage}>{this.state.message}</Text>
            <TouchableOpacity
              onPress={() => this.evenClose()}
              style={styles.BSClose}>
              <Text style={styles.BSCloseText}>Ok</Text>
            </TouchableOpacity>
          </View>
        )}
      </RBSheet>
    );
  };

  renderVailed = () => {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheetVailed = ref;
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
          <Text style={styles.BSInfoVailed}>Gagal !!</Text>
          <Text style={styles.BSMessage}>{this.state.message}</Text>
          <TouchableOpacity
            onPress={() => this.RBSheetVailed.close()}
            style={{
              width: 100,
              borderWidth: 2,
              alignSelf: 'flex-end',
              borderColor: 'red',
              borderRadius: 12,
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'HKGrotesk-Regular',
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'red',
              }}>
              Tutup
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  };

  renderBsLoading = () => {
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
        <View
          style={{
            flex: 1,
            paddingHorizontal: 30,
            justifyContent: 'center',
            alignContent: 'center',
            marginHorizontal: 10,
            marginBottom: Dimensions.get('window').height / 2 - 100,
            borderRadius: 12,
            backgroundColor: 'white',
          }}>
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
  };

  renderInputOTP() {
    if (this.state.visibleBtn) {
      return (
        <OTPInputView
          pinCount={4}
          autoFocusOnLoad
          code={this.state.codeOtp}
          style={{width: '70%', height: 120}}
          codeInputFieldStyle={styles.underlineStyleBase}
          onCodeChanged={codeOtp => {
            this.setState({codeOtp});
          }}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <View>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          // height={(Dimensions.get('window').height * 5) / 6}
          // height={Platform.OS == 'ios' ? 200 + getStatusBarHeight() : 200}
          closeOnPressMask={false}
          closeOnPressBack={false}
          closeOnDragDown={false}
          animationType="fade"
          openDuration={200}
          onClose={() => this.setState({statusSendEmail: false})}
          customStyles={{
            container: {
              flex: 1,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignContent: 'center',
            },
          }}>
          <View style={styles.contentbottomSheet}>
            <View
              style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                margin: 7,
              }}>
              <Icon
                style={{margin: 10}}
                name="x"
                type="feather"
                size={36}
                color="#0a61c3"
                onPress={() => this.actionClose()}
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: '#3d9acc',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'HKGrotesk-Regular',
                  marginTop: 10,
                  fontSize: 16,
                  marginBottom: 20,
                  marginLeft: 30,
                  marginRight: 30,
                }}>
                Untuk melakukan pengajuan polis asuransi harap melakukan
                verifikasi {!this.state.isEmailVerified && 'email '}{' '}
                {!this.state.isEmailVerified &&
                  !this.state.isPhoneVerified &&
                  'dan '}
                {!this.state.isPhoneVerified && 'no. telepon'}
              </Text>

              {!this.state.isEmailVerified && (
                <View>
                  <TouchableOpacity onPress={() => this.verifEmail()}>
                    <View
                      style={{
                        borderRadius: 10,
                        marginTop: 15,
                        alignItems: 'center',
                        paddingVertical: 10,
                        paddingHorizontal: 30,
                        backgroundColor: '#0a61c3',
                        width: Dimensions.get('window').width - 30,
                        marginRight: 20,
                        marginLeft: 20,
                      }}>
                      <Text style={{color: 'white'}}>Verifikasi Email</Text>
                    </View>
                  </TouchableOpacity>
                  {this.state.isLoading && (
                    <View
                      style={{
                        position: 'absolute',
                        borderRadius: 10,
                        marginTop: 15,
                        alignItems: 'center',
                        paddingVertical: 10,
                        paddingHorizontal: 30,
                        backgroundColor: '#0a61c3',
                        width: Dimensions.get('window').width - 30,
                        marginRight: 20,
                        marginLeft: 20,
                      }}>
                      <ActivityIndicator color="#FF8033" />
                    </View>
                  )}

                  {this.state.statusSendEmail && (
                    <View
                      style={{
                        position: 'absolute',
                        borderRadius: 5,
                        marginTop: 15,
                        alignItems: 'center',
                        paddingVertical: 10,
                        paddingHorizontal: 30,
                        backgroundColor: '#FF8033',
                        width: Dimensions.get('window').width - 30,
                        marginRight: 20,
                        marginLeft: 20,
                      }}>
                      {/* <TouchableOpacity onPress={() => this.openEmail()}> */}
                      <Text style={{color: 'white'}}>
                        Periksa email anda untuk verifikasi
                      </Text>
                      {/* </TouchableOpacity> */}
                    </View>
                  )}
                </View>
              )}

              {!this.state.isPhoneVerified && (
                <View>
                  <TouchableOpacity onPress={() => this.verifNoHpAction()}>
                    <View
                      style={{
                        borderRadius: 10,
                        marginTop: 20,
                        alignItems: 'center',
                        paddingVertical: 10,
                        paddingHorizontal: 30,
                        backgroundColor: '#0a61c3',
                        width: Dimensions.get('window').width - 30,
                        marginRight: 20,
                        marginLeft: 20,
                      }}>
                      <Text style={{color: 'white'}}>
                        Verifikasi No. Telepon
                      </Text>
                    </View>
                    {this.state.isLoadingPhone && (
                      <View
                        style={{
                          position: 'absolute',
                          borderRadius: 10,
                          marginTop: 15,
                          alignItems: 'center',
                          paddingVertical: 10,
                          paddingHorizontal: 30,
                          backgroundColor: '#0a61c3',
                          width: Dimensions.get('window').width - 30,
                          marginRight: 20,
                          marginLeft: 20,
                        }}>
                        <ActivityIndicator color="#FF8033" />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </RBSheet>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    width: 50,
    height: 50,
    borderWidth: 5,
    borderColor: 'white',
    backgroundColor: 'red',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 30,
  },

  titleInput: {
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 2,
    marginTop: 10,
    fontFamily: 'HKGrotesk-Regular',
    fontWeight: 'bold',
  },
  inputs: {
    color: 'black',
    fontFamily: 'HKGrotesk-Regular',
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingLeft: '5%',
    paddingRight: '5%',
    borderRadius: 9,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    elevation: 5,
  },
  input2: {
    width: '100%',
    color: 'black',
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingLeft: '5%',
    paddingRight: '5%',
    marginLeft: 5,
    borderRadius: 9,
    backgroundColor: '#fff',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    elevation: 5,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: 'transparent',
    // height: (Dimensions.get('window').height * 7) / 8,
  },
  titleBottomSheeet: {
    textAlign: 'center',
    fontWeight: 'bold',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#3d9acc',
    marginStart: 5,
    marginEnd: 5,
  },
  contentbottomSheet: {
    flex: 1,
    backgroundColor: '#ededed',
    marginStart: 5,
    marginEnd: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // alignItems: 'center',
  },
  btnLanjut: {
    width: '45%',
    color: '#fff',
    paddingVertical: '4%',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#3d9acc',
    marginTop: 10,
    marginLeft: '5%',
  },
  btnBatal: {
    width: '45%',
    color: '#fff',
    paddingVertical: '4%',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#3d9acc',
    marginTop: 10,
    marginRight: '5%',
  },
  btnFoto: {
    flex: 1,
    color: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8033',
  },
  textBtn: {
    color: 'white',
    fontFamily: 'HKGrotesk-Regular',
  },
  picker: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginStart: 10,
  },
  vpicker: {
    backgroundColor: 'white',
    paddingStart: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    elevation: 5,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0.1, 0.1, 0.1)',
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
  BSInfoVailed: {
    fontWeight: 'bold',
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 20,
    marginBottom: 6,
    color: 'red',
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
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 3,
    color: '#FF8033',
    fontSize: 22,
    borderColor: '#FF8033',
  },
});

export default BsVerifOtpAndEmail;
