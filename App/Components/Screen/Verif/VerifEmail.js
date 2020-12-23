import React, {Component} from 'react';

import {withNavigation} from 'react-navigation';

import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';

import {Content, Container} from 'native-base';

import {Icon} from 'react-native-elements';

import {getDataWithHeader} from './../../../Services';
import {getValue} from './../../../Modules/LocalData';
import ApiEndPoint from './../../../Modules/Utils/ApiEndPoint';
import RBSheet from 'react-native-raw-bottom-sheet';

class VerifEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      errorHit: false,
      isLoading: false,
      emailAlready: '',
      isEmailAlready: false,
      email: this.props.navigation.getParam('email'),
    };
  }

  componentDidMount() {
    this.renderVerifEmail();
  }

  refreshLoad = () => {
    if (this.state.isEmailAlready != false) {
      this.props.navigation.goBack();
    } else {
      this.setState(
        {
          isEmailAlready: false,
          errorHit: false,
          isLoading: false,
        },
        () => {
          this.renderVerifEmail();
        },
      );
    }
  };

  handleBack() {
    this.RBSheetWarning.close();
    this.props.navigation.goBack();
  }

  rbSheetWarning = () => {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheetWarning = ref;
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
          <Text style={styles.BSInfoWarning}>Perhatian !!</Text>
          <Text style={styles.BSMessage}>
            Maaf terjadi kendala teknis, coba beberapa saat lagi
          </Text>
          <TouchableOpacity
            onPress={() => this.handleBack()}
            style={styles.BSCloseWarning}>
            <Text style={styles.BSCloseTextWarning}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  };

  renderVerifEmail = () => {
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
                this.setState({
                  isLoading: false,
                  errorHit: false,
                });
              })
              .catch(err => {
                this.setState({
                  isLoading: false,
                  errorHit: true,
                });
                this.RBSheetWarning.open();
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

  render() {
    return (
      <Container>
        <Content
          style={{
            flex: 1,
            backgroundColor: '#FF8033',
            paddingVertical: 20,
            paddingHorizontal: 40,
          }}>
          <View>
            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon name="x" type="feather" size={36} color="white" />
              </TouchableOpacity>
            </View>

            {this.state.isLoading != false ? (
              <View
                style={{
                  flex: 1,
                  marginTop: '20%',
                  alignItems: 'center',
                }}>
                <ActivityIndicator color="white" size="large" />
              </View>
            ) : this.state.errorHit != false ? (
              <View
                style={{
                  flex: 1,
                  marginTop: '20%',
                  alignItems: 'center',
                }}>
                <TouchableOpacity onPress={this.refreshLoad}>
                  <Image
                    source={
                      this.state.isEmailAlready != false
                        ? require('./../../../assets/image/img_already.png')
                        : require('./../../../assets/image/img_refresh.png')
                    }
                    style={{
                      width: 140,
                      height: 140,
                      marginBottom: 20,
                      marginTop: '30%',
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={{color: 'white', fontSize: 24, fontWeight: 'bold'}}>
                  {this.state.emailAlready}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  marginTop: '30%',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 28,
                    color: 'white',
                    marginBottom: 20,
                  }}>
                  Hampir Selesai!
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    width: '100%',
                    textAlign: 'center',
                    color: 'white',
                    marginBottom: 8,
                  }}>
                  Verifikasi email telah dikirimkan ke {this.state.email}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    width: '100%',
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  Silahkan periksa email Anda untuk proses verifikasi
                </Text>
                <Image
                  source={require('./../../../assets/image/img_email.png')}
                  style={{
                    width: 200,
                    height: 200,
                    marginTop: 50,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            )}
          </View>
          {this.rbSheetWarning()}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
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
  BSInfoWarning: {
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
    borderColor: 'red',
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
    color: 'red',
  },
});

export default withNavigation(VerifEmail);
