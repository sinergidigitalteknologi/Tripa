import React, {Component} from 'react';

import moment from 'moment';
import {withNavigation} from 'react-navigation';
import * as EmailValidator from 'email-validator';
import RBSheet from 'react-native-raw-bottom-sheet';
import Spinner from 'react-native-loading-spinner-overlay';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Api from '../../../../Utils/Api';
import {moderateScale} from '../../../../Utils/Scale';

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';

import {
  Picker,
  CheckBox,
  Body,
  ListItem,
  Container,
  Content,
} from 'native-base';

import {Header, Icon} from 'react-native-elements';
import {getValue} from './../../../../Modules/LocalData';
import {postDataWitHeader} from './../../../../Services';
import {getDataWithHeader} from './../../../../Services';
import ApiEndPoint from './../../../../Modules/Utils/ApiEndPoint';

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.dataUser = this.props.navigation.getParam('dataUser');
    this.state = {
      id_user: this.dataUser.id,
      token: '',
      fullname: this.dataUser.name,
      nickname: this.dataUser.nickname,
      nik:
        this.dataUser.tripaUser.nik == null
          ? null
          : this.dataUser.tripaUser.nik.toString(),
      birthPlace: this.dataUser.tripaUser.tempat_lahir,
      email: this.dataUser.email,
      phone: this.dataUser.phone,
      phoneOther: this.dataUser.tripaUser.phone_another,
      birthDate: this.dataUser.birthDate,
      jenisKelamin: this.dataUser.gender,
      statusP: this.dataUser.tripaUser.status,
      gDarah: this.dataUser.tripaUser.golongan_darah,
      pekerjaan: this.dataUser.tripaUser.pekerjaan,
      namaPerusahaan: this.dataUser.tripaUser.nama_perusahaan,
      rangeGaji: this.dataUser.tripaUser.gaji,
      address: this.dataUser.tripaUser.alamat_tinggal,
      rt:
        this.dataUser.tripaUser.rt == null
          ? null
          : this.dataUser.tripaUser.rt.toString(),
      rw:
        this.dataUser.tripaUser.rw == null
          ? null
          : this.dataUser.tripaUser.rw.toString(),
      provinsi: this.dataUser.tripaUser.provinsi,
      kota: this.dataUser.tripaUser.kota,
      kecamatan: this.dataUser.tripaUser.kecamatan,
      kelurahan: this.dataUser.tripaUser.kelurahan,
      kodePos:
        this.dataUser.tripaUser.kode_pos == null
          ? null
          : this.dataUser.tripaUser.kode_pos.toString(),
      place: this.dataUser.tripaUser.alamat_jalan,
      isDataLikeKTP:
        this.dataUser.tripaUser.alamat_tinggal != null &&
        this.dataUser.tripaUser.alamat_jalan != null
          ? this.dataUser.tripaUser.alamat_tinggal ==
            this.dataUser.tripaUser.alamat_jalan
            ? true
            : false
          : false,
      isDataCorrect: false,
      isDatePickerVisible: false,
      message: '',
      pickerProv: false,
      pickerKota: false,
      pickerKecamatan: false,
      pickerKelurahan: false,
      isloading: true,
      // selectedGender: '',
      gender: [
        {id: '0', nama: '- Pilih -'},
        {id: 'm', nama: 'Laki - Laki'},
        {id: 'f', nama: 'Wanita'},
      ],
      statusPernikahan: [
        {id: 0, nama: '- Pilih -'},
        {id: 1, nama: 'Kawin'},
        {id: 2, nama: 'Belum Kawin'},
      ],
      golDarah: [
        {id: '0', nama: '- Pilih -'},
        {id: '1', nama: 'A'},
        {id: '2', nama: 'B'},
        {id: '3', nama: 'O'},
        {id: '4', nama: 'AB'},
      ],
      valuepekerjaan: [
        {id: '0', nama: '- Pilih -'},
        {id: '1', nama: 'Karyawan Swasta'},
        {id: '2', nama: 'Karyawan BUMN'},
        {id: '3', nama: 'Karyawan BUMD'},
        {id: '4', nama: 'Karyawan Honorer'},
        {id: '5', nama: 'Belum/Tidak Bekerja'},
        {id: '6', nama: 'Mengurus Rumah Tangga'},
        {id: '7', nama: 'Pelajar/Mahasiswa'},
        {id: '8', nama: 'Pensiunan'},
        {id: '9', nama: 'Pewagai Negeri Sipil'},
        {id: '10', nama: 'Lainnya'},
      ],
      valueRangeGaji: [
        {id: '0', nama: '- Pilih -'},
        {id: '1000000-3000000', nama: 'Rp 1.000.000 - Rp 3.000.000'},
        {id: '3000000-5000000', nama: 'Rp 3.000.000 - Rp 5.000.000'},
        {id: '>=5000000', nama: '>= Rp 5.000.000'},
      ],
      valueProvincies: [],
      valueCity: [],
      valueKecamatan: [],
      valueKelurahan: [],
    };
  }

  async componentDidMount() {
    console.log('DATA_USER_PARAMS', this.dataUser);
    if (this.dataUser.gender != '') {
      if (this.dataUser.gender == 'Pria') {
        this.setState({jenisKelamin: 'm'});
      } else {
        this.setState({jenisKelamin: 'f'});
      }
    } else {
      this.setState({jenisKelamin: '0'});
    }
    await this.getProfile();
    await this.getProvincinces();
    await this.getCity();
    await this.getDistricts();
    setTimeout(() => {
      this.getVillage();
    }, 1000);
  }
  showDatePicker = () => {
    this.setState({isDatePickerVisible: true});
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };

  handleConfirm = date => {
    var time = moment(date).format('YYYY-MM-DD');
    this.setState({
      birthDate: time.toString(),
      isDatePickerVisible: false,
    });
  };
  async getProfile() {
    await getValue('userData').then(response => {
      if (response != null) {
        const id = response.data.id;
        const tok = response.access_token;
        this.setState({id_user: id});
        this.setState({token: tok});
      }
    });
  }

  // getProvinsi = () => {
  //   getData('http://dev.farizdotid.com/api/daerahindonesia/provinsi').then(
  //     response => {
  //       if (response.error == false) {
  //         if (this.state.provinces.length > 1) {
  //           this.setState({
  //             provinces: this.state.provinces.filter(function(data) {
  //               return data.id == '0';
  //             }),
  //           });
  //         }
  //         this.setState({
  //           provinces: this.state.provinces.concat(response.semuaprovinsi),
  //         });
  //       }
  //     },
  //   );
  // };

  // getKota = id => {
  //   getData(
  //     'http://dev.farizdotid.com/api/daerahindonesia/provinsi/' +
  //       id +
  //       '/kabupaten',
  //   ).then(response => {
  //     if (response.error == false) {
  //       if (this.state.kotas.length > 1) {
  //         this.setState({
  //           kotas: this.state.kotas.filter(function(data) {
  //             return data.id == '00';
  //           }),
  //         });
  //       }
  //       this.setState({
  //         kotas: this.state.kotas.concat(response.kabupatens),
  //       });
  //     }
  //   });
  // };

  // getKecamatan = id => {
  //   getData(
  //     'http://dev.farizdotid.com/api/daerahindonesia/provinsi/kabupaten/' +
  //       id +
  //       '/kecamatan',
  //   ).then(response => {
  //     if (response.error == false) {
  //       if (this.state.kecamatans.length > 1) {
  //         this.setState({
  //           kecamatans: this.state.kecamatans.filter(function(data) {
  //             return data.id == '000';
  //           }),
  //         });
  //       }
  //       this.setState({
  //         kecamatans: this.state.kecamatans.concat(response.kecamatans),
  //       });
  //     }
  //   });
  // };

  // getKelurahan = id => {
  //   getData(
  //     'http://dev.farizdotid.com/api/daerahindonesia/provinsi/kabupaten/kecamatan/' +
  //       id +
  //       '/desa',
  //   ).then(response => {
  //     if (response.error == false) {
  //       if (this.state.kelurahans.length > 1) {
  //         this.setState({
  //           kelurahans: this.state.kelurahans.filter(function(data) {
  //             return data.id == '0000';
  //           }),
  //         });
  //       }
  //       this.setState({
  //         kelurahans: this.state.kelurahans.concat(response.desas),
  //       });
  //     }
  //   });
  // };

  // provinsiSelected = id => {
  //   console.log('id provinsi ', id);
  //   let provinceName = this.state.provinces.find(data => data.id === id);
  //   this.setState({
  //     provinsi: provinceName.nama,
  //     pickerProvinsi: provinceName.id,
  //   });
  //   this.getKota(id);
  // };

  // KotaSelected = id => {
  //   console.log('Kab/Kota', id);
  //   let kotaName = this.state.kotas.find(data => data.id === id);
  //   this.setState({
  //     kota: kotaName.nama,
  //     pickerKota: kotaName.id,
  //   });

  //   this.getKecamatan(id);
  // };

  // kecamatanSelected = id => {
  //   console.log(id);
  //   let kecamatanName = this.state.kecamatans.find(data => data.id === id);
  //   this.setState({
  //     kecamatan: kecamatanName.nama,
  //     pickerKecamatan: kecamatanName.id,
  //   });

  //   this.getKelurahan(id);
  // };

  // kelurahanSelected = id => {
  //   console.log(id);
  //   let kelurahanName = this.state.kelurahans.find(data => data.id === id);
  //   this.setState({
  //     kelurahan: kelurahanName.nama,
  //     pickerKelurahan: kelurahanName.id,
  //   });
  // };

  dataLikeKTP = () => {
    if (this.state.isDataLikeKTP) {
      this.setState({isDataLikeKTP: false});
    } else {
      this.setState({
        isDataLikeKTP: true,
        place: this.state.address,
      });
    }
  };

  dataCorrect = () => {
    if (this.state.isDataCorrect) this.setState({isDataCorrect: false});
    else this.setState({isDataCorrect: true});
  };

  gotoRegister = () => {
    this.props.navigation.navigate('Register');
  };

  simpanProfile = async () => {
    const params = {
      name: this.state.fullname,
      nik: this.state.nik,
      nickname: this.state.nickname,
      tempat_lahir: this.state.birthPlace,
      birth_date: this.state.birthDate,
      gender: this.state.jenisKelamin,
      status: this.state.statusP,
      golongan_darah: this.state.gDarah,
      pekerjaan: this.state.pekerjaan,
      alamat_tinggal: this.state.address,
      alamat_jalan: this.state.address,
      rt: this.state.rt,
      rw: this.state.rw,
      provinsi: this.state.provinsi,
      kota: this.state.kota,
      kecamatan: this.state.kecamatan,
      kelurahan: this.state.kelurahan,
      nama_perusahaan: this.state.namaPerusahaan,
      gaji: this.state.rangeGaji,
      email: this.state.email,
      phone: this.state.phone,
      phone_another: this.state.phoneOther,
      kode_pos: this.state.kodePos,
    };

    console.log('DATA_BEFORE_UPDATE', params);

    if (this.state.fullname == null || this.state.fullname == '') {
      this.statusRes('Harap isi nama lengkap dengan benar', 'FIELD_ERR');
    } else if (this.state.nickname == null || this.state.nickname == '') {
      this.statusRes('Harap isi nama panggilan dengan benar', 'FIELD_ERR');
    } else if (this.state.nik == null || this.state.nik == '') {
      this.statusRes('Harap isi nik dengan benar', 'FIELD_ERR');
    } else if (this.state.birthPlace == null || this.state.birthPlace == '') {
      this.statusRes('Harap isi tempat lahir dengan benar', 'FIELD_ERR');
    } else if (this.state.birthDate == null || this.state.birthDate == '') {
      this.statusRes('Harap isi tanggal lahir dengan benar', 'FIELD_ERR');
    } else if (this.state.phone == null || this.state.phone == '') {
      this.statusRes('Harap isi no.hp(utama) dengan benar', 'FIELD_ERR');
    } else if (this.state.jenisKelamin == '0') {
      this.statusRes('Harap pilih jenis kelamin dengan benar', 'FIELD_ERR');
    } else if (this.state.statusP == '- Pilih -') {
      this.statusRes('Harap pilih status pernikahan dengan benar', 'FIELD_ERR');
    } else if (this.state.gDarah == '- Pilih -') {
      this.statusRes('Harap pilih golongan darah dengan benar', 'FIELD_ERR');
    } else if (
      this.state.pekerjaan == '- Pilih -' ||
      this.state.pekerjaan == ''
    ) {
      this.statusRes('Harap pilih pekerjaan dengan benar', 'FIELD_ERR');
    } else if (
      (this.state.namaPerusahaan == null || this.state.namaPerusahaan == '') &&
      (this.state.pekerjaan != 'Belum/Tidak Bekerja' &&
        this.state.pekerjaan != 'Mengurus Rumah Tangga' &&
        this.state.pekerjaan != 'Pelajar/Mahasiswa' &&
        this.state.pekerjaan != 'Mengurus Rumah Tangga')
    ) {
      this.statusRes('Harap isi nama perusahaan dengan benar', 'FIELD_ERR');
    } else if (
      (this.state.rangeGaji == '- Pilih -' || this.state.rangeGaji == '0') &&
      (this.state.pekerjaan != 'Belum/Tidak Bekerja' &&
        this.state.pekerjaan != 'Mengurus Rumah Tangga' &&
        this.state.pekerjaan != 'Pelajar/Mahasiswa' &&
        this.state.pekerjaan != 'Mengurus Rumah Tangga')
    ) {
      this.statusRes('Harap pilih besaran gaji dengan benar', 'FIELD_ERR');
    } else if (this.state.address == null || this.state.address == '') {
      this.statusRes('Harap isi alamat dengan benar', 'FIELD_ERR');
    } else if (this.state.rt == null || this.state.rt == '') {
      this.statusRes('Harap isi RT dengan benar', 'FIELD_ERR');
    } else if (this.state.rw == null || this.state.rw == '') {
      this.statusRes('Harap isi RW dengan benar', 'FIELD_ERR');
    } else if (!this.state.isDataCorrect) {
      this.statusRes(
        'Harap centang untuk melanjutkan mengubah profil',
        'FIELD_ERR',
      );
    } else {
      if (
        this.state.pekerjaan == 'Belum/Tidak Bekerja' ||
        this.state.pekerjaan == 'Mengurus Rumah Tangga' ||
        this.state.pekerjaan == 'Pelajar/Mahasiswa' ||
        this.state.pekerjaan == 'Mengurus Rumah Tangga'
      ) {
        await this.setState({
          namaPerusahaan: null,
          rangeGaji: null,
        });
      }
      getValue('userData').then(resValue => {
        if (resValue.data.id != null && resValue.access_token != null) {
          this.RBSheetLoading.open();

          const dataRestSimpan = postDataWitHeader(
            ApiEndPoint.base_url + '/users/' + resValue.data.id + '/tripa',
            params,
            resValue.access_token,
          );

          dataRestSimpan
            .then(response => {
              if (response.success == true) {
                this.statusRes('Profil berhasil diperbaharui', 'RES_SUC');
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
      this.setState(
        {
          errorHit: status == 'RES_ERR' ? true : false,
        },
        () => {
          setTimeout(() => {
            this.alertMessage(value);
          }, 500);
        },
      );
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
  async onValueProvince(value) {
    await this.setState({provinsi: value});
    await this.getCity();
  }
  async onValueCity(value) {
    await this.setState({kota: value});
    await this.getDistricts();
  }
  async onValueDistrict(value) {
    await this.setState({kecamatan: value});
    await this.getVillage();
  }
  async onValueVillage(value) {
    await this.setState({kelurahan: value});
    await this.getKodePos();
  }
  async getProvincinces() {
    await getDataWithHeader(
      Api.base_url2 + 'tripa/' + this.state.id_user + '/get-provinces',
      this.state.token,
    )
      .then(res => {
        if (res.success != false) {
          this.setState({valueProvincies: res.data});
          this.setState({pickerProv: true});
          console.log('getProvincinces ' + this.state.valueProvincies);
        } else {
        }
      })
      .catch(err => {
        console.log(err.response);
      });
  }
  async getCity() {
    await this.setState({
      pickerKota: false,
      pickerKecamatan: false,
      pickerKelurahan: false,
      valueCity: [],
      valueKecamatan: [],
      valueKelurahan: [],
    });
    let id_prov = '';
    let value_kota = '';
    await this.state.valueProvincies.map(data => {
      if (data.nama_provinsi == this.state.provinsi) {
        id_prov = data.id_provinsi;
      }
    });
    console.log('get kota', id_prov);
    await getDataWithHeader(
      Api.base_url2 + 'tripa/' + this.state.id_user + '/get-cities/' + id_prov,
      this.state.token,
    )
      .then(res => {
        if (res.success != false) {
          this.setState({valueCity: res.data});
          this.setState({pickerKota: true});
          // console.log('getKota ' + this.state.valueCity);
        } else {
        }
      })
      .catch(err => {
        console.log(err.response);
      });
  }
  async getDistricts() {
    await this.setState({
      pickerKecamatan: false,
      pickerKelurahan: false,
      valueKecamatan: [],
      valueKelurahan: [],
    });
    let id_city = '';
    await this.state.valueCity.map(data => {
      if (data.nama_kabupaten == this.state.kota) {
        id_city = data.id_kabupaten;
      }
    });
    // console.log('get getKecamatan', id_city);

    await getDataWithHeader(
      Api.base_url2 +
        'tripa/' +
        this.state.id_user +
        '/get-districts/' +
        id_city,
      this.state.token,
    )
      .then(res => {
        if (res.success != false) {
          this.setState({valueKecamatan: res.data});
          this.setState({pickerKecamatan: true});

          // console.log('getKota ' + this.state.valueKecamatan);
        } else {
        }
      })
      .catch(err => {
        console.log(err.response);
      });
  }
  async getVillage() {
    await this.setState({
      pickerKelurahan: false,
      valueKelurahan: [],
    });
    let id_district = '';
    let value_city = '';
    let name_district = '';
    await this.state.valueKecamatan.map(data => {
      if (data.nama_kecamatan == this.state.kecamatan) {
        id_district = data.id_kabupaten;
        name_district = data.nama_kecamatan;
      }
    });
    // console.log('get getKecamatan', id_district);

    await getDataWithHeader(
      Api.base_url2 +
        'tripa/' +
        this.state.id_user +
        '/get-vilages/' +
        id_district +
        '/' +
        name_district,
      this.state.token,
    )
      .then(res => {
        if (res.success != false) {
          this.setState({valueKelurahan: res.data});
          this.setState({pickerKelurahan: true});

          // console.log('getKota ' + this.state.valueKecamatan);
        } else {
        }
      })
      .catch(err => {
        console.log(err.response);
        if (err.response.status == 401) {
          removeValue('userData');
          removeValue('hasLogin');
          removeValue('fcm');
          this.props.navigation.navigate('Login');
        }
      });
  }
  async getKodePos() {
    await this.setState({
      valueKodePos: [],
    });
    let id_kabupaten = '';
    await this.state.valueCity.map(data => {
      if (data.nama_kabupaten == this.state.kota) {
        id_kabupaten = data.id_kabupaten;
      }
    });
    // console.log('get getKecamatan', id_district);

    await getDataWithHeader(
      Api.base_url2 +
        'tripa/' +
        this.state.id_user +
        '/get-kode-pos/' +
        id_kabupaten +
        '/' +
        this.state.kecamatan +
        '/' +
        this.state.kelurahan,
      this.state.token,
    )
      .then(res => {
        if (res.success != false) {
          this.setState({
            kodePos: res.data[0].kode_pos,
          });
          console.log('KODE POS ' + res.data[0].kode_pos);
        } else {
        }
      })
      .catch(err => {});
  }

  render() {
    const {pickerProv} = this.state;
    return (
      <Container>
        <Header
          leftComponent={{
            icon: 'arrow-back',
            color: '#fff',
            onPress: () => this.props.navigation.goBack(),
          }}
          centerComponent={{
            text: 'Ubah Profil',
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
              <Text style={styles.textField}>Nama Lengkap :</Text>
              <TextInput
                style={styles.inputs}
                placeholder="Nama Lengkap Anda"
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                value={this.state.fullname}
                onChangeText={fullname => this.setState({fullname})}
                onSubmitEditing={() => this.nicknameInput.focus()}
                underlineColorAndroid="transparent"
              />
            </View>
            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Nama Panggilan :</Text>
              <TextInput
                style={styles.inputs}
                placeholder="Nama Panggilan Anda"
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                value={this.state.nickname}
                ref={input => (this.nicknameInput = input)}
                onChangeText={nickname => this.setState({nickname})}
                onSubmitEditing={() => this.nikInput.focus()}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Nik :</Text>
              <TextInput
                style={styles.inputs}
                placeholder="Nik"
                keyboardType="numeric"
                autoCapitalize="none"
                returnKeyType="next"
                maxLength={16}
                value={this.state.nik}
                ref={input => (this.nikInput = input)}
                onChangeText={nik => this.setState({nik})}
                onSubmitEditing={() => this.birthPlaceInput.focus()}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Tempat Lahir :</Text>
              <TextInput
                style={styles.inputs}
                placeholder="Tempat Lahir"
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                value={this.state.birthPlace}
                ref={input => (this.birthPlaceInput = input)}
                onChangeText={birthPlace => this.setState({birthPlace})}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Tanggal Lahir :</Text>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.inputDatePicker}
                  placeholder="Tanggal Lahir"
                  autoCapitalize="none"
                  value={this.state.birthDate}
                  showSoftInputOnFocus={false}
                  ref={input => (this.birthDateInput = input)}
                  onChangeText={birthDate => this.setState({birthDate})}
                  underlineColorAndroid="transparent"
                  editable={false}
                />
                <View
                  style={{
                    width: '20%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity onPress={this.showDatePicker}>
                    <Icon type="feather" name="calendar" size={34} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Email :</Text>
              <TextInput
                style={styles.inputs}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                value={this.state.email}
                ref={input => (this.email = input)}
                onSubmitEditing={() => this.phone.focus()}
                onChangeText={email => this.setState({email})}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>No.Handphone(Utama) :</Text>
              <TextInput
                style={styles.inputs}
                placeholder="No.Handphone"
                maxLength={13}
                keyboardType="numeric"
                autoCapitalize="none"
                returnKeyType="next"
                value={this.state.phone}
                ref={input => (this.phone = input)}
                onSubmitEditing={() => this.phoneOtherInput.focus()}
                onChangeText={phone => this.setState({phone})}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>No.Handphone(Kedua) :</Text>
              <TextInput
                style={styles.inputs}
                placeholder="No.Handphone"
                maxLength={13}
                keyboardType="numeric"
                autoCapitalize="none"
                returnKeyType="next"
                value={this.state.phoneOther}
                ref={input => (this.phoneOtherInput = input)}
                onChangeText={phoneOther => this.setState({phoneOther})}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Jenis kelamin :</Text>

              <View
                style={{
                  width: '100%',
                  color: '#989a9d',
                  paddingHorizontal: '4.5%',
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 0.8},
                  shadowOpacity: 0.5,
                  elevation: 2,
                }}>
                <Picker
                  style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                  }}
                  itemTextStyle={{fontSize: moderateScale(16)}}
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{marginRight: moderateScale(5)}}
                    />
                  }
                  mode="dropdown"
                  selectedValue={this.state.jenisKelamin}
                  onValueChange={value => this.setState({jenisKelamin: value})}>
                  {this.state.gender.map((data, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={data.nama}
                        value={data.id}
                        textStyle={{fontSize: 12}}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Status Pernikahan :</Text>

              <View
                style={{
                  width: '100%',
                  color: '#989a9d',
                  paddingHorizontal: '4.5%',
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 0.8},
                  shadowOpacity: 0.5,
                  elevation: 2,
                }}>
                <Picker
                  style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                  }}
                  itemTextStyle={{fontSize: moderateScale(16)}}
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{marginRight: moderateScale(5)}}
                    />
                  }
                  mode="dropdown"
                  selectedValue={this.state.statusP}
                  onValueChange={value => this.setState({statusP: value})}>
                  {this.state.statusPernikahan.map((data, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={data.nama}
                        value={data.nama}
                        textStyle={{fontSize: 12}}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Golongan Darah :</Text>

              <View
                style={{
                  width: '100%',
                  color: '#989a9d',
                  paddingHorizontal: '4.5%',
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 0.8},
                  shadowOpacity: 0.5,
                  elevation: 2,
                }}>
                <Picker
                  style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                  }}
                  itemTextStyle={{fontSize: moderateScale(16)}}
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{marginRight: moderateScale(5)}}
                    />
                  }
                  mode="dropdown"
                  selectedValue={this.state.gDarah}
                  onValueChange={value => this.setState({gDarah: value})}>
                  {this.state.golDarah.map((data, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={data.nama}
                        value={data.nama}
                        textStyle={{fontSize: 12}}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Pekerjaan :</Text>
              {/* <TextInput
                style={styles.inputs}
                placeholder="Pekerjaan Anda"
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                value={this.state.pekerjaan}
                ref={input => (this.pekerjaanInput = input)}
                onChangeText={pekerjaan => this.setState({pekerjaan})}
                onSubmitEditing={() => this.alamatKtpInput.focus()}
                underlineColorAndroid="transparent"
              /> */}
              <View
                style={{
                  width: '100%',
                  color: '#989a9d',
                  paddingHorizontal: '4.5%',
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 0.8},
                  shadowOpacity: 0.5,
                  elevation: 2,
                }}>
                <Picker
                  style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                  }}
                  itemTextStyle={{fontSize: moderateScale(16)}}
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{marginRight: moderateScale(5)}}
                    />
                  }
                  mode="dropdown"
                  selectedValue={this.state.pekerjaan}
                  onValueChange={value => this.setState({pekerjaan: value})}>
                  {this.state.valuepekerjaan.map((data, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={data.nama}
                        value={data.nama}
                        textStyle={{fontSize: 12}}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
            {this.state.pekerjaan != 'Belum/Tidak Bekerja' &&
              this.state.pekerjaan != 'Mengurus Rumah Tangga' &&
              this.state.pekerjaan != 'Pelajar/Mahasiswa' &&
              this.state.pekerjaan != 'Mengurus Rumah Tangga' && (
                <View>
                  <View style={{marginBottom: 10}}>
                    <Text style={styles.textField}>Nama Perusahaan :</Text>
                    <TextInput
                      style={styles.inputs}
                      placeholder="Nama Perusahaan"
                      keyboardType="default"
                      autoCapitalize="none"
                      returnKeyType="next"
                      numberOfLines={Platform.OS === 'ios' ? 1 : 1}
                      // minHeight={Platform.OS === 'ios' ? 20 * 4 : null}
                      value={this.state.namaPerusahaan}
                      // ref={input => (this.alamatKtpInput = input)}
                      onChangeText={namaPerusahaan =>
                        this.setState({namaPerusahaan})
                      }
                      // onSubmitEditing={() => this.rtInput.focus()}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                  <View style={{marginBottom: 10}}>
                    <Text style={styles.textField}>Range Gaji :</Text>
                    <View
                      style={{
                        width: '100%',
                        color: '#989a9d',
                        paddingHorizontal: '4.5%',
                        borderRadius: 12,
                        backgroundColor: '#fff',
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 0.8},
                        shadowOpacity: 0.5,
                        elevation: 2,
                      }}>
                      <Picker
                        style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                        textStyle={{
                          fontSize: moderateScale(14),
                          paddingLeft:
                            Platform.OS == 'ios' ? 0 : moderateScale(5),
                          paddingTop:
                            Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                          paddingBottom:
                            Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                        }}
                        itemTextStyle={{fontSize: moderateScale(16)}}
                        iosIcon={
                          <Icon
                            type="feather"
                            name="arrow-down-circle"
                            containerStyle={{marginRight: moderateScale(5)}}
                          />
                        }
                        mode="dropdown"
                        selectedValue={this.state.rangeGaji}
                        onValueChange={value =>
                          this.setState({rangeGaji: value})
                        }>
                        {this.state.valueRangeGaji.map((data, key) => {
                          return (
                            <Picker.Item
                              key={key}
                              label={data.nama}
                              value={data.id}
                              textStyle={{fontSize: 12}}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                  </View>
                </View>
              )}

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Alamat:</Text>
              {/* <TextInput
                style={styles.inputs}
                placeholder="Alamat Tinggal Anda"
                keyboardType="default"
                autoCapitalize="none"
                numberOfLines={Platform.OS === 'ios' ? null : 3}
                minHeight={Platform.OS === 'ios' ? 20 * 4 : null}
                value={this.state.place}
                onChangeText={place => this.setState({place})}
                underlineColorAndroid="transparent"
              /> */}
              <TextInput
                style={styles.inputs}
                placeholder="Alamat Anda"
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                numberOfLines={Platform.OS === 'ios' ? null : 3}
                minHeight={Platform.OS === 'ios' ? 20 * 4 : null}
                value={this.state.address}
                ref={input => (this.alamatKtpInput = input)}
                onChangeText={address => this.setState({address})}
                onSubmitEditing={() => this.rtInput.focus()}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <View style={{width: '48.7%', marginRight: 5}}>
                <Text style={styles.textField}>RT :</Text>
                <View style={styles.vContent}>
                  <TextInput
                    style={styles.inputPicker}
                    placeholder="RT"
                    keyboardType="numeric"
                    maxLength={3}
                    autoCapitalize="none"
                    returnKeyType="next"
                    value={this.state.rt}
                    ref={input => (this.rtInput = input)}
                    onChangeText={rt => this.setState({rt})}
                    onSubmitEditing={() => this.rwInput.focus()}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
              <View style={{width: '48.7%', marginLeft: 5}}>
                <Text style={styles.textField}>RW :</Text>
                <View style={styles.vContent}>
                  <TextInput
                    style={styles.inputPicker}
                    placeholder="RW"
                    keyboardType="numeric"
                    maxLength={3}
                    autoCapitalize="none"
                    returnKeyType="next"
                    value={this.state.rw}
                    ref={input => (this.rwInput = input)}
                    onChangeText={rw => this.setState({rw})}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Provinsi :</Text>

              <View
                style={{
                  width: '100%',
                  color: '#989a9d',
                  paddingHorizontal: '4.5%',
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 0.8},
                  shadowOpacity: 0.5,
                  elevation: 2,
                }}>
                {!this.state.pickerProv && (
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                  </View>
                )}
                <Picker
                  enabled={this.state.pickerProv}
                  placeholder="Select your SIM"
                  style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                  }}
                  itemTextStyle={{fontSize: moderateScale(16)}}
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{marginRight: moderateScale(5)}}
                    />
                  }
                  mode="dropdown"
                  selectedValue={this.state.provinsi}
                  onValueChange={value => this.onValueProvince(value)}>
                  {this.state.valueProvincies.map((data, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={data.nama_provinsi}
                        value={data.nama_provinsi}
                        textStyle={{fontSize: 12}}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Kota :</Text>

              <View
                style={{
                  width: '100%',
                  color: '#989a9d',
                  paddingHorizontal: '4.5%',
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 0.8},
                  shadowOpacity: 0.5,
                  elevation: 2,
                }}>
                {!this.state.pickerKota && (
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                  </View>
                )}
                <Picker
                  enabled={this.state.pickerKota}
                  style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                  }}
                  itemTextStyle={{fontSize: moderateScale(16)}}
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{marginRight: moderateScale(5)}}
                    />
                  }
                  mode="dropdown"
                  selectedValue={this.state.kota}
                  onValueChange={value => this.onValueCity(value)}>
                  {this.state.valueCity.map((data, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={data.nama_kabupaten}
                        value={data.nama_kabupaten}
                        textStyle={{fontSize: 12}}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Kecamatan :</Text>
              {/* <TextInput
                style={styles.inputs}
                placeholder="Kecamatan Anda"
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                value={this.state.kecamatan}
                ref={input => (this.kecamatanInput = input)}
                onChangeText={kecamatan => this.setState({kecamatan})}
                onSubmitEditing={() => this.kelurahanInput.focus()}
                underlineColorAndroid="transparent"
              /> */}
              <View
                style={{
                  width: '100%',
                  color: '#989a9d',
                  paddingHorizontal: '4.5%',
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 0.8},
                  shadowOpacity: 0.5,
                  elevation: 2,
                }}>
                {!this.state.pickerKecamatan && (
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                  </View>
                )}
                <Picker
                  enabled={this.state.pickerKecamatan}
                  style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                  }}
                  itemTextStyle={{fontSize: moderateScale(16)}}
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{marginRight: moderateScale(5)}}
                    />
                  }
                  mode="dropdown"
                  selectedValue={this.state.kecamatan}
                  onValueChange={value => this.onValueDistrict(value)}>
                  {this.state.valueKecamatan.map((data, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={data.nama_kecamatan}
                        value={data.nama_kecamatan}
                        textStyle={{fontSize: 12}}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Kelurahan :</Text>

              <View
                style={{
                  width: '100%',
                  color: '#989a9d',
                  paddingHorizontal: '4.5%',
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 0.8},
                  shadowOpacity: 0.5,
                  elevation: 2,
                }}>
                {!this.state.pickerKelurahan && (
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                  </View>
                )}
                <Picker
                  enabled={this.state.pickerKelurahan}
                  style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                  }}
                  itemTextStyle={{fontSize: moderateScale(16)}}
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{marginRight: moderateScale(5)}}
                    />
                  }
                  mode="dropdown"
                  selectedValue={this.state.kelurahan}
                  onValueChange={value => this.onValueVillage(value)}>
                  {this.state.valueKelurahan.map((data, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={data.nama_kelurahan}
                        value={data.nama_kelurahan}
                        textStyle={{fontSize: 12}}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            {/* <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Provinsi : </Text>
              <View style={styles.vContentPicker}>
                <Picker
                  mode="dropdown"
                  placeholder="- Pilih -"
                  iosIcon={<Icon type="feather" name="arrow-down-circle" />}
                  selectedValue={this.state.pickerProvinsi}
                  onValueChange={id => this.provinsiSelected(id)}>
                  {this.state.provinces.map((province, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={province.nama}
                        value={province.id}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Kota : </Text>
              <View style={styles.vContentPicker}>
                <Picker
                  mode="dropdown"
                  placeholder="- Pilih -"
                  iosIcon={<Icon type="feather" name="arrow-down-circle" />}
                  selectedValue={this.state.pickerKota}
                  onValueChange={id => this.KotaSelected(id)}>
                  {this.state.kotas.map((kota, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={kota.nama}
                        value={kota.id}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Kecamatan : </Text>
              <View style={styles.vContentPicker}>
                <Picker
                  mode="dropdown"
                  placeholder="- Pilih -"
                  iosIcon={<Icon type="feather" name="arrow-down-circle" />}
                  selectedValue={this.state.pickerKecamatan}
                  onValueChange={id => this.kecamatanSelected(id)}>
                  {this.state.kecamatans.map((kecamatan, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={kecamatan.nama}
                        value={kecamatan.id}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Kelurahan : </Text>
              <View style={styles.vContentPicker}>
                <Picker
                  mode="dropdown"
                  placeholder="- Pilih -"
                  iosIcon={<Icon type="feather" name="arrow-down-circle" />}
                  selectedValue={this.state.pickerKelurahan}
                  onValueChange={id => this.kelurahanSelected(id)}>
                  {this.state.kelurahans.map((kelurahan, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={kelurahan.nama}
                        value={kelurahan.id}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View> */}

            {/* <View style={{marginBottom: 10}}>
              <ListItem>
                <CheckBox
                  color="#FF8033"
                  checked={this.state.isDataLikeKTP}
                  onPress={() => this.dataLikeKTP()}
                />
                <Body>
                  <Text style={{paddingHorizontal: 6}}>
                    Alamat surat sama seperti alamat KTP
                  </Text>
                </Body>
              </ListItem>
            </View> */}

            {/* {this.state.isDataLikeKTP == false ? (
              
            ) : null} */}

            <View style={{marginBottom: 10}}>
              <Text style={styles.textField}>Kode Pos :</Text>
              <TextInput
                editable={false}
                keyboardType={'numeric'}
                style={styles.inputs}
                placeholder="Kode Pos"
                value={this.state.kodePos}
                onChangeText={kodePos => this.setState({kodePos})}
                // onSubmitEditing={() => this.passwordInput.focus()}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={{marginBottom: 10}}>
              <ListItem>
                <CheckBox
                  color="#FF8033"
                  checked={this.state.isDataCorrect}
                  onPress={() => this.dataCorrect()}
                />
                <Body>
                  <Text style={{paddingHorizontal: 6}}>
                    Pastikan data yang diisi sudah sesuai dan benar
                  </Text>
                </Body>
              </ListItem>
            </View>
            <View>
              <TouchableOpacity
                style={styles.btnSimpan}
                onPress={this.simpanProfile}>
                <Text style={{color: '#fff'}}>Simpan</Text>
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
  inputPicker: {
    width: '100%',
    color: '#989a9d',
    paddingVertical: '8%',
    paddingHorizontal: '9%',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  inputDatePicker: {
    width: '80%',
    color: '#989a9d',
    paddingVertical: '5.5%',
    paddingLeft: '5%',
    paddingRight: '5%',
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
  vContent: {
    paddingRight: 8,
    backgroundColor: 'white',
    paddingVertical: '1.5%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.8},
    shadowOpacity: 0.5,
    elevation: 2,
  },
  vContentPicker: {
    paddingRight: 8,
    backgroundColor: 'white',
    paddingVertical: '0.9%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    elevation: 2,
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
  },
  BSView: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
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
    // transform: [{scaleX: 0.8}, {scaleY: 0.8}],
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // left: -35,
    // width: '100%',
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

export default withNavigation(UpdateProfile);
