import React, {Component} from 'react';
import {withNavigation} from 'react-navigation';
import {Header, Icon} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {getValue} from './../../../../Modules/LocalData';
import {postDataWitHeader} from './../../../../Services';
import ApiEndPoint from './../../../../Modules/Utils/ApiEndPoint';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {RNCamera} from 'react-native-camera';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Linking,
} from 'react-native';
import {
  Container,
  Left,
  Right,
  Body,
  Content,
  Footer,
  Input,
  Button,
  Card,
  Picker,
} from 'native-base';

class UpdateFoto extends Component {
  constructor(props) {
    super(props);
    this.dataUser = this.props.navigation.getParam('dataUser');
    let date = new Date();
    this.state = {
      modalVisible: false,
      dataFile: {},
      isCamera: false,
      isIndex: '',
      cameraType: 'back',

      id_user: this.dataUser.id,
      token: '',
      fullname: this.dataUser.name,
      picture: this.dataUser.picture + '?=time' + date,
      nik:
        this.dataUser.tripaUser.nik == null ? '0' : this.dataUser.tripaUser.nik,
      birthPlace:
        this.dataUser.tripaUser.tempat_lahir == null
          ? '-'
          : this.dataUser.tripaUser.tempat_lahir,
      birthDate:
        this.dataUser.birthDate == null || this.dataUser.birthDate == ''
          ? '1996-07-30'
          : this.dataUser.birthDate,
      jenisKelamin: this.dataUser.gender == null ? 'm' : this.dataUser.gender,
      statusP:
        this.dataUser.tripaUser.status == null
          ? '-'
          : this.dataUser.tripaUser.status,
      gDarah:
        this.dataUser.tripaUser.golongan_darah == null
          ? '-'
          : this.dataUser.tripaUser.golongan_darah,
      pekerjaan:
        this.dataUser.tripaUser.pekerjaan == null
          ? '-'
          : this.dataUser.tripaUser.pekerjaan,
      namaPerusahaan:
        this.dataUser.tripaUser.nama_perusahaan == null
          ? '-'
          : this.dataUser.tripaUser.nama_perusahaan,
      rangeGaji:
        this.dataUser.tripaUser.gaji == null
          ? '-'
          : this.dataUser.tripaUser.gaji,
      address:
        this.dataUser.tripaUser.alamat_tinggal == null
          ? '-'
          : this.dataUser.tripaUser.alamat_tinggal,
      rt:
        this.dataUser.tripaUser.rt == null
          ? '0'
          : this.dataUser.tripaUser.rt.toString(),
      rw:
        this.dataUser.tripaUser.rw == null
          ? '0'
          : this.dataUser.tripaUser.rw.toString(),
      provinsi:
        this.dataUser.tripaUser.provinsi == null
          ? '-'
          : this.dataUser.tripaUser.provinsi,
      kota:
        this.dataUser.tripaUser.kota == null
          ? '-'
          : this.dataUser.tripaUser.provinsi,
      kecamatan:
        this.dataUser.tripaUser.kecamatan == null
          ? '-'
          : this.dataUser.tripaUser.kecamatan,
      kelurahan:
        this.dataUser.tripaUser.kelurahan == null
          ? '-'
          : this.dataUser.tripaUser.kelurahan,
      place:
        this.dataUser.tripaUser.alamat_jalan == null
          ? '-'
          : this.dataUser.tripaUser.alamat_jalan,
      isDataLikeKTP:
        this.dataUser.tripaUser.alamat_tinggal != null &&
        this.dataUser.tripaUser.alamat_jalan != null
          ? this.dataUser.tripaUser.alamat_tinggal ==
            this.dataUser.tripaUser.alamat_jalan
            ? true
            : false
          : false,
      isDataCorrect: true,
      isDatePickerVisible: false,
      message: '',
      pickerProv: false,
      pickerKota: false,
      pickerKecamatan: false,
      pickerKelurahan: false,
      isloading: true,
    };
  }

  componentDidMount() {
    console.log('DATA_USER_PARAMS', this.dataUser);
  }
  componentWillUnmount() {}
  componentDidUpdate() {
    console.log('componentDidUpdate updateFoto', this.state.dataFile.uri);
  }

  simpanProfile = () => {
    console.log('simpanprofil', this.dataUser.name);
    var data = new FormData();
    data.append('picture', {
      uri: this.state.dataFile.uri,
      name: this.dataUser.name,
      type: 'image/jpeg',
    });
    getValue('userData').then(resValue => {
      if (resValue.data.id != null && resValue.access_token != null) {
        if (this.state.isDataCorrect != false) {
          this.RBSheetLoading.open();

          const dataRestSimpan = postDataWitHeader(
            ApiEndPoint.base_url +
              '/users/' +
              resValue.data.id +
              '/tripa/updateFoto',
            data,
            resValue.access_token,
          );

          dataRestSimpan
            .then(response => {
              if (response.success == true) {
                let date = new Date();
                this.RBSheetLoading.close();
                setTimeout(() => {
                  this.statusRes('Berhasil mengubah foto', 'RES_SUC');
                  this.setState({
                    picture: response.data.picture + '?=time' + date,
                  });
                }, 1000);
              }
            })
            .catch(err => {
              if (err.response) {
                console.log('err response', err.response);
                this.statusRes(err, 'RES_ERR');
              } else {
                console.log('err ', err);
                this.statusRes('Maaf terjadi kendala teknis', 'RES_ERR');
              }
            });
        } else {
          this.statusRes('Maaf coba lagi', 'RES_ERR');
        }
      }
    });
  };

  statusRes = (value, status) => {
    if (status == 'FIELD_ERR') {
      setTimeout(() => {
        this.setState(
          {
            errorHit: true,
          },
          () => {
            this.RBSheetLoading.close();
            this.alertMessage(value);
          },
        );
      }, 1000);
    } else {
      this.RBSheetLoading.close();
      this.setState({
        errorHit: status == 'RES_ERR' ? true : false,
      });

      if (value.response == 422) {
        this.alertMessage('Maaf ukuran file terlalu besar');
      }
    }
  };
  alertMessage = message => {
    console.log('alert Message', message);
    this.setState({
      message: message,
    });
    setTimeout(() => {
      this.RBSheet.open();
    }, 2000);
  };
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
    // this.renderModal();
    console.log('render bottom shet', '');
  }
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
            <Text numberOfLines={3} style={styles.BSMessage}>
              {this.state.message}
            </Text>
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
              onPress={() => this.RBSheet.close()}
              style={styles.BSClose}>
              <Text style={styles.BSCloseText}>Ok</Text>
            </TouchableOpacity>
          </View>
        )}
      </RBSheet>
    );
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

  changeCamera() {
    if (this.state.cameraType == 'back') {
      this.setState({cameraType: 'front'});
    } else {
      this.setState({cameraType: 'back'});
    }
  }
  renderUploadPhoto() {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheetUploadPhoto = ref;
        }}
        height={
          Platform.OS == 'ios'
            ? Dimensions.get('window').height - getStatusBarHeight()
            : Dimensions.get('window').height
        }
        closeOnPressMask={false}
        duration={250}
        customStyles={{
          container: {
            backgroundColor: 'black',
            justifyContent: 'center',
            alignContent: 'center',
          },
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'black',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => this.changeCamera()}>
              <Image
                style={{
                  height: 40,
                  width: 50,
                  resizeMode: 'stretch',
                  marginTop: 5,
                  justifyContent: 'center',
                }}
                source={require('../../../../assets/image/swicthCamera.png')}
              />
            </TouchableOpacity>
          </View>

          <RNCamera
            style={{flex: 1, alignItems: 'center'}}
            ref={ref => {
              this.camera = ref;
            }}
            // type={RNCamera.Constants.Type.back}
            type={this.state.cameraType}
            // flashMode={RNCamera.Constants.FlashMode.on}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
          />
          <View
            style={{
              backgroundColor: 'black',
              flex: 0,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={this.takePicture.bind(this)}
              style={styles.capture}>
              <Text style={{fontSize: 14}}> </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  }
  renderBsOption() {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheetOptions = ref;
        }}
        height={Dimensions.get('window').height / 2 + 100}
        closeOnPressMask={true}
        openDuration={300}
        animationType={'slide'}
        customStyles={{
          container: {
            backgroundColor: 'transparent',
            justifyContent: 'center',
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
            borderRadius: 6,
            backgroundColor: 'white',
            backgroundColor: 'white',
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Pilih Gambar{' '}
            </Text>
            {/* <TouchableOpacity
              activeOpacity={0.1}
              underlayColor="#00000"
              onPress={() => this.takeFromCamera()}> */}
            <Text
              onPress={() => this.takeFromCamera()}
              style={{fontSize: 16, marginTop: 25}}>
              Ambil Gambar
            </Text>
            {/* </TouchableOpacity> */}

            {/* <TouchableOpacity
              activeOpacity={0.1}
              underlayColor="#00000"
              onPress={() => this.takeFromGalery()}> */}
            <Text
              onPress={() => this.takeFromGalery()}
              style={{fontSize: 16, marginTop: 23}}>
              Pilih Dari Galery
            </Text>
            {/* </TouchableOpacity> */}

            <TouchableOpacity
              activeOpacity={0.1}
              underlayColor="#00000"
              onPress={() => this.RBSheetOptions.close()}>
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 25,
                  color: 'red',
                  textAlign: 'right',
                }}>
                Batal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  }
  async takePicture() {
    if (this.camera) {
      const options = {quality: 0.5, base64: true, fixOrientation: true};
      const data = await this.camera.takePictureAsync(options);
      await this.setState({dataFile: data});
      this.RBSheetUploadPhoto.close();
      console.log('data take picture', this.state.dataFile.uri);
      if (this.state.dataFile != '' || this.state.dataFile != null) {
        this.simpanProfile();
      }
      // this.simpanProfile();
    }
  }
  async chooseFile(index) {
    this.RBSheetOptions.open();
    // this.RBSheetUploadPhoto.open();
  }
  takeFromCamera() {
    this.RBSheetOptions.close();
    setTimeout(() => {
      this.RBSheetUploadPhoto.open();
    }, 1000);
  }
  takeFromGalery() {
    var options = {
      title: 'Pilih Gambar',
      // customButtons: [{name: 'fb', title: 'Ambil Foto'}],
      cancelButtonTitle: 'batal',
      // takePhotoButtonTitle: 'Ambil Foto',
      chooseFromLibraryButtonTitle: 'Pilih dari Galery',

      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    try {
      ImagePicker.launchImageLibrary(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
        } else {
          this.RBSheetOptions.close();
          let source = response;
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };
          this.setState({
            dataFile: source,
          });
          setTimeout(() => {
            this.simpanProfile();
          }, 1000);
        }
      });
    } catch (error) {
      console.log('image picker', error);
    }
  }

  // chooseFile = () => {
  //   var options = {
  //     title: 'Pilih Gambar',
  //     // customButtons: [{name: 'fb', title: 'Ambil Foto'}],
  //     cancelButtonTitle: 'batal',
  //     // takePhotoButtonTitle: 'Ambil Foto',
  //     chooseFromLibraryButtonTitle: 'Pilih dari Galery',
  //     maxWidth: 1500,
  //     maxHeight: 1500,
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };
  //   try {
  //     ImagePicker.showImagePicker(options, response => {
  //       console.log('Response = ', response);

  //       if (response.didCancel) {
  //         console.log('User cancelled image picker');
  //       } else if (response.error) {
  //         console.log('ImagePicker Error: ', response.error);
  //       } else if (response.customButton) {
  //         console.log('User tapped custom button: ', response.customButton);
  //         alert(response.customButton);
  //       } else {
  //         let source = response;
  //         // You can also display the image using data:
  //         // let source = { uri: 'data:image/jpeg;base64,' + response.data };
  //         this.setState({
  //           dataFile: source,
  //         });
  //         this.simpanProfile();
  //       }
  //     });
  //   } catch (error) {
  //     console.log('image picker', error);
  //   }
  // };

  render() {
    return (
      <Container>
        <Header
          statusBarProps={{translucent: false}}
          leftComponent={
            <View>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" color="#fff" backgroundColor="#000" />
              </TouchableOpacity>
            </View>
          }
          rightComponent={
            <View>
              <TouchableOpacity onPress={() => this.chooseFile()}>
                <Icon
                  name="pencil"
                  type="font-awesome"
                  color="#fff"
                  backgroundColor="#000"
                />
              </TouchableOpacity>
            </View>
          }
          centerComponent={{
            text: 'Ubah foto',
            style: {
              color: '#fff',
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
            },
            // onPress: () => this.simpanProfile(),
          }}
          containerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
            paddingTop: 0,
            height: Platform.OS == 'ios' ? 64 : 56,
          }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -3,
          }}>
          {this.state.picture != '' && (
            <Image
              style={styles.fotoContent}
              source={{uri: this.state.picture}}
              // source={require('./../../../../assets/image/img_profile_page.png')}
            />
          )}
          {this.state.picture == '' && (
            <Image
              style={{
                justifyContent: 'center',
                alignContent: 'center',
                width: '100%',
                height: 300,
                resizeMode: 'stretch',
                borderColor: 'white',
              }}
              // source={{uri: this.state.picture}}
              source={require('./../../../../assets/image/img_profile_page.png')}
            />
          )}
        </View>
        {this.renderBS()}
        {this.rbSheetLoading()}
        {this.renderUploadPhoto()}
        {this.renderBsOption()}
      </Container>
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
  },
  inputs: {
    width: '100%',
    color: '#989a9d',
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingLeft: '5%',
    paddingRight: '5%',
    borderRadius: 9,
    backgroundColor: '#fff',
  },
  bottomSheet: {
    backgroundColor: 'transparent',
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
    backgroundColor: '#ededed',
    marginStart: 5,
    marginEnd: 5,
    alignItems: 'center',
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
  textBtn: {
    color: 'white',
  },
  fotoContent: {
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    height: 300,
    borderWidth: 5,
    marginBottom: 16,
    // backgroundColor: 'green',
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
  picker: {
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    left: -35,
    width: '120%',
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
});

export default withNavigation(UpdateFoto);
