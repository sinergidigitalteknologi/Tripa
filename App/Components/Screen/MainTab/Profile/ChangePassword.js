import React, {Component} from 'react';

import moment from 'moment';
import {withNavigation} from 'react-navigation';
import * as EmailValidator from 'email-validator';
import RBSheet from 'react-native-raw-bottom-sheet';
import Spinner from 'react-native-loading-spinner-overlay';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';

import {Container, Content} from 'native-base';

import {Header, Icon} from 'react-native-elements';

import {getValue} from './../../../../Modules/LocalData';
import {postDataWitHeader} from './../../../../Services';
import {encData} from './../../../../Modules/Utils/Encrypt';
import ApiEndPoint from './../../../../Modules/Utils/ApiEndPoint';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      reNewPassword: '',
      message: '',
      isValidate: false,
    };
  }

  componentDidMount() {}

  async validationForm() {
    var newPassword = this.state.newPassword;
    var reNewPassword = this.state.reNewPassword;
    this.setState({isValidate: false});
    if (this.state.oldPassword == '') {
      this.statusRes('Kata sandi lama harus diisi', 'FIELD_ERR');
    } else if (newPassword == '') {
      this.statusRes('Kata sandi baru harus diisi', 'FIELD_ERR');
    } else if (reNewPassword == '') {
      this.statusRes('Ulangi kata sandi baru harus diisi', 'FIELD_ERR');
    } else if (newPassword != reNewPassword) {
      this.statusRes('Kata baru tidak sama', 'FIELD_ERR');
    } else if (newPassword.length < 8) {
      this.statusRes('Password minimal 8 karakter', 'FIELD_ERR');
    } else if (reNewPassword.length < 8) {
      this.statusRes('Password minimal 8 karakter', 'FIELD_ERR');
    } else if (newPassword.search('^(?=.*?[a-z])(?=.*?[0-9]).{8,}$') == -1) {
      this.statusRes('Kata sandi harus berisi huruf dan angka', 'FIELD_ERR');
    } else {
      this.setState({isValidate: true});
    }
  }

  changePassword = async () => {
    await this.validationForm();
    if (
      this.state.isValidate == true &&
      this.state.newPassword == this.state.reNewPassword &&
      this.state.newPassword != '' &&
      this.state.reNewPassword != '' &&
      this.state.newPassword.search('^(?=.*?[a-z])(?=.*?[0-9]).{8,}$') != -1
    ) {
      var dataOldPassword = encData(this.state.oldPassword);
      var dataNewPassword = encData(this.state.newPassword);

      const params = {
        password: dataOldPassword,
        newPassword: dataNewPassword,
      };

      getValue('userData').then(resValue => {
        if (resValue.data.id != null && resValue.access_token != null) {
          this.RBSheetLoading.open();

          const dataRestSimpan = postDataWitHeader(
            ApiEndPoint.base_url +
              '/users/' +
              resValue.data.id +
              '/tripa/updatePassword',
            params,
            resValue.access_token,
          );

          dataRestSimpan
            .then(response => {
              if (response.success == true) {
                this.statusRes('Kata sandi berhasil diubah', 'RES_SUC');
              } else {
                // console.log('data', response);
              }
            })
            .catch(err => {
              if (err.response) {
                this.statusRes(err.response.data.error.message, 'RES_ERR');
              } else {
                this.statusRes(
                  'Anda belum terhubung ke internet, tutup dan coba lagi',
                  'RES_ERR',
                );
              }
            });
        }
      });
    }
  };

  statusRes = (value, status) => {
    if (status == 'FIELD_ERR') {
      this.RBSheetLoading.open();
      this.setState({errorHit: true});
      setTimeout(() => {
        this.RBSheetLoading.close();
        this.alertMessage(value);
      }, 1000);
    } else {
      this.RBSheetLoading.close();
      this.setState({errorHit: status == 'RES_ERR' ? true : false});
      setTimeout(() => {
        this.alertMessage(value);
      }, 500);
    }
  };

  renderBS = () => {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        height={Platform.OS == 'ios' ? 200 + getStatusBarHeight() : 200}
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
            <Text style={styles.BSInfo}>Peringatan</Text>
            <Text style={styles.BSMessage}>{this.state.message}</Text>
            <TouchableOpacity
              onPress={() => this.RBSheet.close()}
              style={styles.BSClose}>
              <Text style={styles.BSCloseText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.BSView}>
            <Text style={styles.BSInfo}>Berhasil</Text>
            <Text style={styles.BSMessage}>{this.state.message}</Text>
            <TouchableOpacity
              onPress={this.updateSuccess}
              style={styles.BSClose}>
              <Text style={styles.BSCloseText}>Ok</Text>
            </TouchableOpacity>
          </View>
        )}
      </RBSheet>
    );
  };

  updateSuccess = () => {
    this.props.navigation.goBack();
  };

  rbSheetLoading = () => {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheetLoading = ref;
        }}
        height={Platform.OS == 'ios' ? 200 + getStatusBarHeight() : 200}
        closeOnPressMask={false}
        duration={250}
        customStyles={{
          container: {
            backgroundColor: 'transparent',
            justifyContent: 'center',
          },
        }}>
        <View style={styles.BSView}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color="#FF8033" />
            <Text style={{marginTop: 10}}>Sedang memuat...</Text>
          </View>
        </View>
      </RBSheet>
    );
  };

  alertMessage = message => {
    this.setState({
      message: message,
    });
    setTimeout(() => {
      this.RBSheet.open();
    }, 1000);
  };

  render() {
    return (
      <Container>
        <Header
          leftComponent={{
            icon: 'arrow-back',
            color: '#fff',
            onPress: () => this.props.navigation.goBack(),
          }}
          centerComponent={{
            text: 'Ubah Kata Sandi',
            style: {
              color: '#fff',
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
            },
          }}
          containerStyle={{
            backgroundColor: '#FF8033',
            height: Platform.OS == 'ios' ? 64 : 56,
            paddingTop: 0,
          }}
        />

        <Content showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <KeyboardAwareScrollView
            contentContainerStyle={{padding: 20}}
            showsVerticalScrollIndicator={false}>
            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Kata Sandi Lama :</Text>
              <TextInput
                style={styles.inputs}
                placeholder="Kata Sandi Lama"
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                secureTextEntry={true}
                value={this.state.oldPassword}
                onChangeText={oldPassword => this.setState({oldPassword})}
                onSubmitEditing={() => this.newPasswordInput.focus()}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Kata Sandi Baru:</Text>
              <TextInput
                style={styles.inputs}
                placeholder="Kata Sandi Baru"
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                secureTextEntry={true}
                value={this.state.newPassword}
                ref={input => (this.newPasswordInput = input)}
                onChangeText={newPassword => this.setState({newPassword})}
                onSubmitEditing={() => this.reNewPasswordInput.focus()}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Ulangi Kata Sandi Baru :</Text>
              <TextInput
                style={styles.inputs}
                placeholder="Ulangi Kata Sandi Baru"
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                secureTextEntry={true}
                value={this.state.reNewPasswordInput}
                ref={input => (this.reNewPasswordInput = input)}
                onChangeText={reNewPassword => this.setState({reNewPassword})}
                onSubmitEditing={() => this.reNewPasswordInput.focus()}
                underlineColorAndroid="transparent"
              />
            </View>

            <View>
              <TouchableOpacity
                style={styles.btnChange}
                onPress={this.changePassword}>
                <Text style={{color: '#fff'}}>Ubah</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </Content>

        <DateTimePickerModal
          isVisible={this.state.isDatePickerVisible}
          mode="date"
          onConfirm={date => this.handleConfirm(date)}
          onCancel={this.hideDatePicker}
        />

        {this.renderBS()}
        {this.rbSheetLoading()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputs: {
    width: '100%',
    color: '#989a9d',
    paddingVertical: Platform.OS == 'ios' ? '4.5%' : '4%',
    paddingHorizontal: '4.5%',
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.8},
    shadowOpacity: 0.5,
    elevation: 2,
  },
  textField: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: 'bold',
  },
  btnChange: {
    width: '100%',
    color: '#fff',
    paddingTop: '4%',
    marginTop: 20,
    paddingBottom: '4%',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FF8033',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.8},
    shadowOpacity: 0.5,
    elevation: 2,
  },
  BSView: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: Platform.OS == 'ios' ? getStatusBarHeight() : 10,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  BSInfo: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 6,
    color: '#FF8033',
  },
  BSMessage: {
    fontSize: 18,
    marginBottom: 22,
  },
  BSClose: {
    width: 100,
    borderWidth: 2,
    alignSelf: 'flex-end',
    borderColor: '#FF8033',
    borderRadius: 12,
    paddingVertical: 10,
  },
  BSCloseText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FF8033',
  },
});

export default withNavigation(ChangePassword);
