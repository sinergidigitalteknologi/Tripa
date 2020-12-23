import React, {Component} from 'react';
import {Header, Icon} from 'react-native-elements';
import CustomBs from './../../../../Utils/CustomBs';
import {BsLoading} from './../../../../Utils/CustomBs';
import {RNCamera} from 'react-native-camera';

import RBSheet from 'react-native-raw-bottom-sheet';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import {
  NavigationEvents,
  NavigationActions,
  withNavigation,
  StackActions,
} from 'react-navigation';
import {Body, Card, Content, CardItem, Container} from 'native-base';
import {getDataWithHeader, postDataWitHeader} from './../../../../Services';
import ApiEndPoint from './../../../../Modules/Utils/ApiEndPoint';
import {getValue, removeValue} from './../../../../Modules/LocalData';
import {encData} from './../../../../Modules/Utils/Encrypt';
import Modal from 'react-native-modals';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  RefreshControl,
} from 'react-native';
import RegisterAgent from '../../Welcome/Register/RegisterAgent';
import {ScrollView} from 'react-native-gesture-handler';

class MemberRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: '',
      no_npwp: '',
      no_agent: '',
      no_account: '',
      name_bank: '',
      on_behalf_of_the: '',
      company_name: '',
      business_fields: '',
      position: '',
      name: '',
      address: '',
      phone: '',
      no_hp: '',
      email: '',
      password: '',
      re_password: '',

      message: '',
      selectedNasabah: true,
      selectedagen: false,

      id: '',
      npwp: '',
      no_anggota_agen: '',
      no_rekening: '',
      nama_bank: '',
      nama_pemilik_rekening: '',
      nama_perusahaan: '',
      bidang_usaha: '',
      jabatan: '',
      nama_anggota_darurat: '',
      alamat_anggota_darurat: '',
      telepon_anggota_darurat: '',
      handphone_anggota_darurat: '',
      email_anggota_darurat: '',

      foto_ktp: '',
      foto_npwp: '',
      foto_buku_rekening: '',
      foto_lisensi_agen: '',

      isIndex: '',
      isPhoto: false,
      isFormValidate: false,

      dataUpload: [
        {
          id: 0,
          title: 'Foto KTP \n',
          name: '',
          data: '',
          uri: '',
          path: require('./../../../../assets/image/photo_ktp.jpeg'),
        },
        {
          id: 1,
          title: 'Foto NPWP \n',
          name: '',
          data: '',
          uri: '',
          path: require('./../../../../assets/image/no_image.png'),
        },
        {
          id: 2,
          title: ' Foto buku rekening \n',
          name: '',
          data: '',
          uri: '',
          path: require('./../../../../assets/image/no_image.png'),
        },
        {
          id: 3,
          title: ' Foto lisensi agen \n',
          name: '',
          data: '',
          uri: '',
          path: require('./../../../../assets/image/no_image.png'),
        },
      ],
    };

    this.actionsGoBack = this.actionsGoBack.bind(this);
  }

  componentDidMount() {}

  async registerAgent() {
    await this.validationsForm();
    var params = {
      npwp: this.state.no_npwp,
      no_anggota_agen: this.state.no_agent,
      no_rekening: this.state.no_account,
      nama_bank: this.state.name_bank,
      nama_pemilik_rekening: this.state.on_behalf_of_the,
      nama_perusahaan: this.state.company_name,
      bidang_usaha: this.state.business_fields,
      jabatan: this.state.position,
      nama_anggota_darurat: this.state.name,
      alamat_anggota_darurat: this.state.address,
      telepon_anggota_darurat: this.state.phone,
      handphone_anggota_darurat: this.state.no_hp,
      email_anggota_darurat: this.state.email,

      foto_ktp: this.state.dataUpload[0].data,
      foto_npwp: this.state.dataUpload[1].data,
      foto_buku_rekening: this.state.dataUpload[2].data,
      foto_lisensi_agen:
        this.state.dataUpload[3].data == ''
          ? 'kosong'
          : this.state.dataUpload[3].data,
    };

    var bodyFormData = new FormData();
    bodyFormData.append('npwp', this.state.no_npwp);
    bodyFormData.append('no_anggota_agen', this.state.no_agent);
    bodyFormData.append('no_rekening', this.state.no_account);
    bodyFormData.append('nama_bank', this.state.name_bank);
    bodyFormData.append('nama_pemilik_rekening', this.state.on_behalf_of_the);
    bodyFormData.append('nama_perusahaan', this.state.company_name);
    bodyFormData.append('bidang_usaha', this.state.business_fields);
    bodyFormData.append('jabatan', this.state.position);
    bodyFormData.append('nama_anggota_darurat', this.state.name);
    bodyFormData.append('alamat_anggota_darurat', this.state.address);
    bodyFormData.append('telepon_anggota_darurat', this.state.phone);
    bodyFormData.append('handphone_anggota_darurat', this.state.no_hp);
    bodyFormData.append('email_anggota_darurat', this.state.email);

    bodyFormData.append('foto_ktp', {
      uri: this.state.dataUpload[0].uri,
      type: 'image/jpg',
      name: 'foto_ktp.jpg',
    });

    bodyFormData.append('foto_npwp', {
      uri: this.state.dataUpload[1].uri,
      type: 'image/jpg',
      name: 'foto_npwp.jpg',
    });

    bodyFormData.append('foto_buku_rekening', {
      uri: this.state.dataUpload[2].uri,
      type: 'image/jpg',
      name: 'foto_buku_rekening.jpg',
    });

    if (this.state.dataUpload[3].uri != '') {
      bodyFormData.append('foto_lisensi_agen', {
        uri: this.state.dataUpload[3].uri,
        type: 'image/jpg',
        name: 'foto_lisensi_agen.jpg',
      });
    } else {
      bodyFormData.append('foto_lisensi_agen', null);
    }

    if (this.state.isFormValidate == true) {
      this.customBs.showBsLoading();
      getValue('userData').then(resValue => {
        if (resValue.data.id != null && resValue.access_token != null) {
          //   this.RBSheetLoading.open();

          const dataRestSimpan = postDataWitHeader(
            ApiEndPoint.base_url + '/tripa/' + resValue.data.id + '/register',
            bodyFormData,
            resValue.access_token,
          );

          dataRestSimpan
            .then(response => {
              if (response.success == true) {
                this.customBs.closeBsLoading();
                setTimeout(() => {
                  this.customBs.showBsSuccess(
                    'Berhasil mendaftar sebagai agen',
                    'back',
                  );
                }, 1000);
              }
            })
            .catch(err => {
              console.log('error => ', err);
              this.customBs.closeBsLoading();

              setTimeout(() => {
                this.customBs.showBsFail(err.message);
              }, 1000);
            });
        }
      });
    }
  }
  validationsForm() {
    if (this.state.no_npwp == '' || this.state.no_npwp == null) {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('NPWP harap diisi');
    } else if (this.state.no_agent == '' || this.state.no_agent == null) {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('No anggota agen harap diisi');
    } else if (this.state.no_account == '' || this.state.no_account == null) {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('No rekening harap diisi');
    } else if (this.state.name_bank == '' || this.state.name_bank == null) {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('Nama bank cabang harap diisi');
    } else if (
      this.state.on_behalf_of_the == '' ||
      this.state.on_behalf_of_the == null
    ) {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('Nama pemilik rekening harap diisi');
    } else if (
      this.state.company_name == '' ||
      this.state.company_name == null
    ) {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('Nama perusahaan harap diisi');
    } else if (
      this.state.business_fields == '' ||
      this.state.business_fields == null
    ) {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('Bidang usaha harap diisi');
    } else if (this.state.position == '' || this.state.position == null) {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('Jabatan harap diisi');
    } else if (this.state.name == '' || this.state.name == null) {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('Nama harap diisi');
    } else if (this.state.address == '' || this.state.address == null) {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('Alamat harap diisi');
    } else if (this.state.phone == '' || this.state.no_hp == '') {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('Telepon dan No. Hp harap diisi');
    } else if (this.state.no_hp.length < 11) {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('Harap Masukkan no. hp dengan benar');
    } else if (this.state.email == '' || this.state.email == null) {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('Email harap diisi');
    } else if (this.state.dataUpload[0].data == '') {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('Foto KTP harap diisi');
    } else if (this.state.dataUpload[1].data == '') {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('Foto NPWP harap diisi');
    } else if (this.state.dataUpload[2].data == '') {
      this.setState({isFormValidate: false});
      this.customBs.showBsFail('Foto buku rekening harap diisi');
    } else {
      this.setState({isFormValidate: true});
    }
  }

  actionsGoBack() {
    this.props.navigation.goBack();
  }

  async chooseFile(index) {
    await this.setState({isIndex: index});
    // this.RBSheet.close();
    this.RBSheetUploadPhoto.open();
    console.log('chooseFile', this.state.isIndex);
  }

  async takePicture() {
    if (this.camera) {
      console.log('takePicture_ ', this.state.isIndex);
      const options = {width: 500, quality: 0.2, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this.state.dataUpload[this.state.isIndex].data = data.base64;
      this.state.dataUpload[this.state.isIndex].uri = data.uri;
      console.log('Data foto = ', data);
      this.setState({isPhoto: false});

      this.RBSheetUploadPhoto.close();

      //   setTimeout(() => {
      //     this.RBSheet.open();
      //   }, 1000);
    }
  }

  resetForm() {
    this.setState({
      dataUpload: [
        {
          id: 0,
          title: 'Foto KTP \n',
          name: '',
          data: '',
          uri: '',
          path: require('./../../../../assets/image/photo_ktp.jpeg'),
        },
        {
          id: 1,
          title: 'Foto NPWP \n',
          name: '',
          data: '',
          uri: '',
          path: require('./../../../../assets/image/no_image.png'),
        },
        {
          id: 2,
          title: ' Foto buku rekening \n',
          name: '',
          data: '',
          uri: '',
          path: require('./../../../../assets/image/no_image.png'),
        },
        {
          id: 3,
          title: ' Foto lisensi agen \n',
          name: '',
          data: '',
          uri: '',
          path: require('./../../../../assets/image/no_image.png'),
        },
      ],
    });
  }

  renderUpload(item) {
    if (this.state.isPhoto == true) {
      return item.map((dataCarousel, index) => {
        return (
          <View
            style={{
              borderRadius: 10,
              width: 250,
              marginTop: 3,
              marginBottom: 3,
              marginEnd: 20,
              borderColor: '#c7c5c5',
              borderWidth: 0.7,
              shadowColor: '#000',
              shadowOpacity: Platform.OS == 'ios' ? 0 : 0.6, //ini agus untuk menghilangkan shadow
              elevation: Platform.OS == 'ios' ? 0 : 1.2, //ini agus untuk menghilangkan shadow
              shadowRadius: Platform.OS == 'ios' ? 0 : 1,
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontFamily: 'HKGrotesk-Regular',
                margin: 5,
                fontSize: 12,
              }}>
              {dataCarousel.title}
            </Text>
            <View
              style={{
                height: 150,
                width: 250,
                paddingHorizontal: 5,
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  height: 120,
                  width: '60%',
                  resizeMode: 'stretch',

                  marginTop: 5,
                }}
                source={dataCarousel.path}
              />
            </View>
            <TouchableHighlight
              activeOpacity={0.1}
              underlayColor="#00000"
              style={{
                width: 60,
                height: 60,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.chooseFile(index);
              }}>
              <View>
                <Icon
                  name="plus"
                  type="evilicon"
                  size={60}
                  iconStyle={{justifyContent: 'center', alignItems: 'center'}}
                  containerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: 50,
                  }}
                />
              </View>
            </TouchableHighlight>
          </View>
        );
      });
    } else {
      return item.map((dataCarousel, index) => {
        return (
          <View
            style={{
              borderRadius: 10,
              width: 250,
              marginTop: 3,
              marginBottom: 3,
              marginEnd: 20,
              borderColor: '#c7c5c5',
              borderWidth: 0.7,
              shadowOpacity: Platform.OS == 'ios' ? 0 : 0.6, //ini agus untuk menghilangkan shadow
              elevation: Platform.OS == 'ios' ? 0 : 1.2, //ini agus untuk menghilangkan shadow
              shadowRadius: Platform.OS == 'ios' ? 0 : 1,
              shadowRadius: 1,
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontFamily: 'HKGrotesk-Regular',
                margin: 5,
                fontSize: 12,
              }}>
              {dataCarousel.title}
            </Text>
            <View
              style={{
                height: 150,
                width: 250,
                paddingHorizontal: 5,
                alignContent: 'center',
                alignItems: 'center',
              }}>
              {!this.state.dataUpload[index].data == '' && (
                <Image
                  style={{
                    height: 170,
                    borderRadius: 5,
                    width: '85%',
                    resizeMode: 'stretch',
                    marginTop: 5,
                  }}
                  source={{
                    uri:
                      'data:image/jpeg;base64,' +
                      this.state.dataUpload[index].data,
                  }}
                  // source={require('./../../../../assets/image/tripa_logo.png')}
                />
              )}
              {this.state.dataUpload[index].data == '' && (
                <Image
                  style={{
                    height: 120,
                    width: '60%',
                    resizeMode: 'stretch',
                    marginTop: 5,
                  }}
                  source={dataCarousel.path}
                />
              )}
            </View>

            {this.state.dataUpload[index].data == '' && (
              <TouchableHighlight
                activeOpacity={0.1}
                underlayColor="#00000"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}
                onPress={() => {
                  this.chooseFile(index);
                }}>
                <View>
                  <Icon
                    name="plus"
                    type="evilicon"
                    size={60}
                    iconStyle={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    containerStyle={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: 50,
                    }}
                  />
                </View>
              </TouchableHighlight>
            )}
            {!this.state.dataUpload[index].data == '' && (
              <TouchableHighlight
                activeOpacity={0.1}
                underlayColor="#00000"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 35,
                }}
                onPress={() => {
                  this.chooseFile(index);
                }}>
                <View>
                  <Icon
                    name="edit"
                    type="font-awesome"
                    size={40}
                    iconStyle={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    containerStyle={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: 50,
                    }}
                  />
                </View>
              </TouchableHighlight>
            )}
          </View>
        );
      });
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

  renderLoading() {
    return <BsLoading onBsLoading={ref => (this.bsLoading = ref)} />;
  }

  renderAgent() {
    return (
      <View style={{padding: 10}}>
        <View style={styles.title}>
          <Text>No NPWP</Text>
        </View>
        <View style={{marginBottom: 8}}>
          <TextInput
            style={styles.inputs}
            placeholder="No NPWP"
            keyboardType="numeric"
            autoCapitalize="none"
            returnKeyType="next"
            autoCapitalize="none"
            value={this.state.no_npwp}
            ref={input => (this.no_npwp = input)}
            onChangeText={no_npwp => this.setState({no_npwp})}
            onSubmitEditing={() => this.no_agent.focus()}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.title}>
          <Text>No Anggota Agen</Text>
        </View>
        <View style={{marginBottom: 8}}>
          <TextInput
            style={styles.inputs}
            placeholder="No Anggota Agen"
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            autoCapitalize="none"
            value={this.state.no_agent}
            ref={input => (this.no_agent = input)}
            onChangeText={no_agent => this.setState({no_agent})}
            onSubmitEditing={() => this.no_account.focus()}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.title}>
          <Text>No Rekening</Text>
        </View>

        <View style={{marginBottom: 8}}>
          <TextInput
            style={styles.inputs}
            placeholder="No Rekening"
            keyboardType="numeric"
            autoCapitalize="none"
            returnKeyType="next"
            autoCapitalize="none"
            value={this.state.no_account}
            onChangeText={no_account => this.setState({no_account})}
            ref={input => (this.no_account = input)}
            onSubmitEditing={() => this.name_bank.focus()}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.title}>
          <Text>Nama Bank/Cabang</Text>
        </View>

        <View style={{marginBottom: 8}}>
          <TextInput
            style={styles.inputs}
            placeholder="Nama Bank/Cabang"
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            value={this.state.name_bank}
            onChangeText={name_bank => this.setState({name_bank})}
            ref={input => (this.name_bank = input)}
            onSubmitEditing={() => this.on_behalf_of_the.focus()}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.title}>
          <Text>Nama pemilik rekening</Text>
        </View>

        <View style={{marginBottom: 8}}>
          <TextInput
            style={styles.inputs}
            placeholder="Nama pemilik rekening"
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            value={this.state.on_behalf_of_the}
            onChangeText={on_behalf_of_the => this.setState({on_behalf_of_the})}
            ref={input => (this.on_behalf_of_the = input)}
            onSubmitEditing={() => this.company_name.focus()}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.title}>
          <Text>Nama Perusahaan</Text>
        </View>

        <View style={{marginBottom: 8}}>
          <TextInput
            style={styles.inputs}
            placeholder="Nama Perusahaan"
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            value={this.state.company_name}
            onChangeText={company_name => this.setState({company_name})}
            ref={input => (this.company_name = input)}
            onSubmitEditing={() => this.business_fields.focus()}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.title}>
          <Text>Bidang Usaha</Text>
        </View>

        <View style={{marginBottom: 8}}>
          <TextInput
            style={styles.inputs}
            placeholder="Bidang Usaha"
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            value={this.state.business_fields}
            onChangeText={business_fields => this.setState({business_fields})}
            ref={input => (this.business_fields = input)}
            onSubmitEditing={() => this.position.focus()}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.title}>
          <Text>Jabatan</Text>
        </View>

        <View style={{marginBottom: 12}}>
          <TextInput
            style={styles.inputs}
            placeholder="Jabatan"
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            value={this.state.position}
            onChangeText={position => this.setState({position})}
            ref={input => (this.position = input)}
            onSubmitEditing={() => this.name.focus()}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.title}>
          <Text>Data Tambahan</Text>
          <Text style={{fontSize: 11, marginBottom: 8}}>
            *Data anggota yang dapat dihubungi dalam keadaan darurat
          </Text>
        </View>

        <View style={styles.title}>
          <Text>Nama Lengkap</Text>
        </View>

        <View style={{marginBottom: 8}}>
          <TextInput
            style={styles.inputs}
            placeholder="Nama Lengkap"
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            autoCapitalize="none"
            value={this.state.name}
            ref={input => (this.name = input)}
            onChangeText={name => this.setState({name})}
            onSubmitEditing={() => this.address.focus()}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.title}>
          <Text>Alamat</Text>
        </View>
        <View style={{marginBottom: 8}}>
          <TextInput
            style={styles.inputs}
            placeholder="Alamat"
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            value={this.state.address}
            onChangeText={address => this.setState({address})}
            ref={input => (this.address = input)}
            onSubmitEditing={() => this.phone.focus()}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.title}>
          <Text>Telepon</Text>
        </View>

        <View style={{marginBottom: 8}}>
          <TextInput
            style={styles.inputs}
            placeholder="Telepon"
            keyboardType="number-pad"
            autoCapitalize="none"
            returnKeyType="next"
            value={this.state.phone}
            onChangeText={phone => this.setState({phone})}
            ref={input => (this.phone = input)}
            onSubmitEditing={() => this.no_hp.focus()}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.title}>
          <Text>No. Hp</Text>
        </View>

        <View style={{marginBottom: 8}}>
          <TextInput
            maxLength={13}
            style={styles.inputs}
            placeholder="No Hp"
            keyboardType="number-pad"
            autoCapitalize="none"
            returnKeyType="next"
            value={this.state.no_hp}
            onChangeText={no_hp => this.setState({no_hp})}
            ref={input => (this.no_hp = input)}
            onSubmitEditing={() => this.email.focus()}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.title}>
          <Text>Email</Text>
        </View>

        <View style={{marginBottom: 8}}>
          <TextInput
            style={styles.inputs}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={this.state.email}
            onChangeText={email => this.setState({email})}
            ref={input => (this.email = input)}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.title}>
          <Text>Lampiran</Text>
        </View>

        <View style={{marginBottom: 8}}>
          <ScrollView
            horizontal={true}
            style={{overflow: 'visible'}}
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}>
            {this.renderUpload(this.state.dataUpload)}
          </ScrollView>
        </View>

        <View>
          <TouchableOpacity
            style={styles.btnSimpan}
            onPress={() => this.registerAgent()}>
            <Text style={{color: '#fff'}}>Daftar Sebagai Agen</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
            text: 'Daftar Sebagai Agen',
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
        <CustomBs
          goBack={this.actionsGoBack}
          onCustomBS={ref => (this.customBs = ref)}
        />

        <ScrollView>{this.renderAgent()}</ScrollView>
        {this.renderUploadPhoto()}
        {this.renderLoading()}
      </Container>
    );
  }
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
    marginBottom: 34,
    marginTop: 30,
  },
  textContent2: {
    flexDirection: 'row',
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
    color: '#989a9d',
    paddingVertical: Platform.OS == 'ios' ? '4.5%' : '4%',
    paddingHorizontal: '4.5%',
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.8},
    shadowOpacity: 0.5,
    elevation: 2,
    marginTop: 5,
    marginBottom: 5,
  },
  btnRegister: {
    width: '100%',
    color: '#fff',
    fontFamily: 'HKGrotesk-Regular',
    marginTop: 28,
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
    fontFamily: 'HKGrotesk-Regular',
    paddingHorizontal: 30,
    justifyContent: 'center',
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
  BSMessage: {
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 18,
    marginBottom: 22,
  },
  BSClose: {
    width: 100,
    borderWidth: 2,
    alignSelf: 'flex-end',
    borderColor: '#0a61c3',
    borderRadius: 12,
    paddingVertical: 10,
  },
  BSCloseText: {
    fontSize: 14,
    fontFamily: 'HKGrotesk-Regular',
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
  BSCloseWarning: {
    width: 100,
    borderWidth: 2,
    alignSelf: 'flex-end',
    borderColor: '#FFCC00',
    borderRadius: 12,
    paddingVertical: 10,
  },
  BSInfoWarning: {
    fontWeight: 'bold',
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 20,
    marginBottom: 6,
    color: '#FFCC00',
  },
  btnSimpan: {
    width: '100%',
    color: '#fff',
    paddingTop: '4%',
    paddingBottom: '4%',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FF8033',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.8},
    shadowOpacity: 0.5,
    elevation: 2,
    marginTop: 16,
  },
  title: {
    marginStart: 16,
    marginTop: 3,
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
});

export default withNavigation(MemberRegister);
