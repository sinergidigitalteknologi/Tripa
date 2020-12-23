import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import {getValue} from './../../../../../Modules/LocalData';
import Helper from '../../../../../Utils/Helper';
import {moderateScale} from '../../../../../Utils/Scale';

import Modal, {
  ModalTitle,
  ModalContent,
  ModalFooter,
  ModalButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-modals';
import {
  View,
  Text,
  Alert,
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
import {CheckBox, ListItem, Body, Picker} from 'native-base';

let id = '';
let tok = '';
let name = '';
const dataUser = () => {
  getValue('userData').then(response => {
    if (response != null) {
      id = response.data.id;
      tok = response.access_token;
      name = response.data.name;
    }
  });
};

class BsSimulasiKebakaran extends Component {
  constructor(props) {
    super(props);
    dataUser();
    this.state = {
      modalVisibleObject: false,
      dataMessage: [],
      dataForm: {},
      jenisAsuransiKebakaran: '',
      jaminanPerluasan: '',
      bencana: false,
      tertabrak: false,
      kerusuhan: false,
      pemilikObjPertanggunan: '',
      namaPemilikObjTertanggung: '',
      namaTertanggung: '',
      periodePertanggungan: '',
      dimulaiPeriode: moment().format('YYYY-MM-DD'),
      objekOkupasi: '',
      notif: 0,
      checkJailStatus: '',
      modalVisible: false,
      isDatePickerVisible: false,
      isKebutuhan: false,
      isAlertForm: true,
      title: '',
      valueMonth: [
        {id: '0', nama: '- Pilih -'},
        {id: '1', nama: '1'},
        {id: '2', nama: '2'},
        {id: '3', nama: '3'},
        {id: '4', nama: '4'},
        {id: '5', nama: '5'},
        {id: '6', nama: '6'},
        {id: '7', nama: '7'},
        {id: '8', nama: '8'},
        {id: '9', nama: '9'},
        {id: '10', nama: '10'},
        {id: '11', nama: '11'},
        {id: '12', nama: '12'},
      ],
      valueAsuransiKebakaran: [
        {id: '0', nama: '- Pilih -'},
        {id: '1', nama: 'ASTRI HOMI PLUS'},
        {id: '2', nama: 'ASTRI HOME'},
        {id: '3', nama: 'ASTRI HOD (HOME ON DEMAND)'},
      ],

      valueJaminanPelunasan: [
        {id: '0', nama: '- Pilih -'},
        {id: '1', nama: 'Banjir, angin Topan, Badai dan Tanah longsor'},
        {id: '2', nama: 'Tertabrak kendaraan'},
        {
          id: '3',
          nama: ' Kerusuhan, pemogokan, perbuatan jahat orang lain, huru hara',
        },
      ],

      valueNamaPemilik: [
        {id: '0', nama: '- Pilih -'},
        {id: '1', nama: 'Atas Nama Sendiri'},
        {id: '2', nama: 'Atas Nama Orang Lain'},
      ],
      valueOkupasi: [
        {id: '0', nama: '- Pilih -'},
        {id: '1', nama: 'Rumah Tinggal'},
      ],
      valueOkupasiOndemand: [
        {id: '0', nama: '- Pilih -'},
        {id: '1', nama: 'Rumah Tinggal'},
        {id: '2', nama: 'Ruko/Toko'},
        {
          id: '3',
          nama: 'Apartement dengan jumlah lantai < 6 lantai',
        },
        {
          id: '4',
          nama: 'Apartement dengan jumlah lantai 6 - 18 lantai',
        },
        {id: '5', nama: 'Apartement dengan jumlah lantai > 18 lantai'},
        {
          id: '6',
          nama: 'Apartement dengan jumlah lantai > 24 lantai',
        },
      ],
    };
  }
  componentDidMount() {
    this.props.onSimulasiKebakaran(this);
  }
  componentWillUnmount() {
    this.props.onSimulasiKebakaran(undefined);
  }
  async setModalVisible(data, title, type) {
    this.setState({modalVisible: true});
    if (data != 'back') {
      this.resetField();
      if (title == 'Asuransi Kebakaran Syariah Simulasi') {
        await this.setState({
          title,
          jenisAsuransiKebakaran: type,
          valueAsuransiKebakaran: [
            {id: '0', nama: '- Pilih -'},
            {id: '1', nama: 'ASTRI FIRE HOMI SHARIA'},
            {id: '2', nama: 'ASTRI FIRE ON DEMAND SHARIA'},
          ],
          valueOkupasiOndemand: [
            {id: '0', nama: '- Pilih -'},
            {id: '1', nama: 'Rumah Tinggal'},
            {
              id: '2',
              nama: 'Apartement dengan jumlah lantai < 6 lantai',
            },
            {
              id: '3',
              nama: 'Apartement dengan jumlah lantai 6 - 18 lantai',
            },
            {id: '4', nama: 'Apartement dengan jumlah lantai > 18 lantai'},
            {
              id: '5',
              nama: 'Apartement dengan jumlah lantai > 24 lantai',
            },
          ],
        });
        if (type == 'ASTRI FIRE ON DEMAND SHARIA') {
          this.setState({isKebutuhan: true});
        }
      }
      if (
        this.state.jenisAsuransiKebakaran != '' &&
        this.state.jenisAsuransiKebakaran != '- Pilih -'
      ) {
        this.showDetailType();
      }
    }

    this.RBSheet.open();
    // this.renderModal();
    var dt = moment().format('YYYY-MM-DD');
    this.setState({dimulaiPeriode: dt});
  }

  showDatePicker = () => {
    this.setState({isDatePickerVisible: true});
  };
  async nextForm() {
    await this.validationsForm();
    if (this.state.isAlertForm == true) {
      var data = {
        insurance_type: this.state.jenisAsuransiKebakaran,
        //
        floods_and_hurricane: this.state.bencana,
        hit_vehicle: this.state.tertabrak,
        riot_and_damage: this.state.kerusuhan,
        //
        name: this.state.namaPemilikObjTertanggung,
        month_period: this.state.periodePertanggungan,
        start_insurance_period: this.state.dimulaiPeriode,
        insurance_object: this.state.objekOkupasi,
      };
      this.RBSheet.close();

      setTimeout(() => {
        this.props.showWildFireSimulation_2(data);
      }, 1000);

      // this.resetField();
    }
  }
  batal() {
    this.setState({modalVisible: false});
    this.resetField();
    this.props.messageCancel('batal');
    this.RBSheet.close();
  }
  resetField() {
    this.setState({
      modalVisible: false,
      jenisAsuransiKebakaran: '',
      jaminanPerluasan: '',
      bencana: false,
      tertabrak: false,
      kerusuhan: false,
      pemilikObjPertanggunan: '',
      namaPemilikObjTertanggung: '',
      namaTertanggung: '',
      periodePertanggungan: '',
      title: '',
      dimulaiPeriode: moment().format('YYYY-MM-DD'),
      objekOkupasi: '',
      isKebutuhan: false,
      valueAsuransiKebakaran: [
        {id: '0', nama: '- Pilih -'},
        {id: '1', nama: 'ASTRI HOMI PLUS'},
        {id: '2', nama: 'ASTRI HOME'},
        {id: '3', nama: 'ASTRI HOD (HOME ON DEMAND)'},
      ],
      valueOkupasiOndemand: [
        {id: '0', nama: '- Pilih -'},
        {id: '1', nama: 'Rumah Tinggal'},
        {id: '2', nama: 'Ruko/Toko'},
        {
          id: '3',
          nama: 'Apartement dengan jumlah lantai < 6 lantai',
        },
        {
          id: '4',
          nama: 'Apartement dengan jumlah lantai 6 - 18 lantai',
        },
        {id: '5', nama: 'Apartement dengan jumlah lantai > 18 lantai'},
        {
          id: '6',
          nama: 'Apartement dengan jumlah lantai > 24 lantai',
        },
      ],
    });
  }

  customAlert(t, m) {
    Alert.alert(
      t,
      m,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  validationsForm() {
    if (
      this.state.jenisAsuransiKebakaran == '' ||
      this.state.jenisAsuransiKebakaran == '- Pilih -' ||
      this.state.jenisAsuransiKebakaran == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Isi jenis asuransi');
    } else if (
      this.state.jenisAsuransiKebakaran == 'ASTRI HOD (HOME ON DEMAND)' &&
      (this.state.bencana == false &&
        this.state.tertabrak == false &&
        this.state.kerusuhan == false)
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Pilih Jaminan Perluasan');
    } else if (
      this.state.pemilikObjPertanggunan == '' ||
      this.state.pemilikObjPertanggunan == '- Pilih -' ||
      this.state.pemilikObjPertanggunan == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Isi Objek Pertanggungan');
    } else if (
      this.state.namaPemilikObjTertanggung == '' ||
      this.state.namaPemilikObjTertanggung == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Isi Nama Objek Pertanggungan');
    } else if (
      this.state.periodePertanggungan == '' ||
      this.state.periodePertanggungan == '- Pilih -' ||
      this.state.periodePertanggungan == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Isi Periode Pertanggungan');
    } else if (
      this.state.dimulaiPeriode == '' ||
      this.state.dimulaiPeriode == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Isi Dimulainya Periode');
    } else if (
      this.state.objekOkupasi == '' ||
      this.state.objekOkupasi == '- Pilih -' ||
      this.state.objekOkupasi == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert(
        'Perhatian',
        'Harap Isi Objek Okupasi Yang Dipertangguhkan',
      );
    } else {
      this.setState({isAlertForm: true});
    }
  }

  handleConfirm = date => {
    var dateNow = moment().format('YYYY-MM-DD');
    var dt = moment(date).format('YYYY-MM-DD');
    if (dateNow > dt) {
      this.setState({isDatePickerVisible: false});

      setTimeout(() => {
        this.customAlert(
          'Perhatian',
          'Tanggal dimulainya asuransi tidak bisa kurang dari tanggal hari ini',
        );
      }, 1500);
    } else {
      this.setState({isDatePickerVisible: false});
      this.setState({dimulaiPeriode: dt});
    }
  };
  onValuePeriodePertanggungan = value => {
    this.setState({periodePertanggungan: value});
  };
  async onValueJenisAuransi(value) {
    await this.setState({jenisAsuransiKebakaran: value});
    if (
      this.state.jenisAsuransiKebakaran == 'ASTRI HOD (HOME ON DEMAND)' ||
      this.state.jenisAsuransiKebakaran == 'ASTRI FIRE ON DEMAND SHARIA'
    ) {
      this.setState({isKebutuhan: true});
      var data = this.state.valueOkupasi;
      var onDemand = [];
    } else {
      this.setState({isKebutuhan: false, jaminanPelunasasn: ''});
    }
    if (value != '- Pilih -') {
      this.showDetailType(this.state.jenisAsuransiKebakaran);
    }
  }
  onValueJaminanPelunasan = value => {
    this.setState({jaminanPerluasan: value});
  };
  onValuePemilikObjek = value => {
    this.setState({pemilikObjPertanggunan: value});
    if (value == 'Atas Nama Sendiri') {
      this.setState({namaPemilikObjTertanggung: name});
    } else {
      this.setState({namaPemilikObjTertanggung: ''});
    }
  };
  onValueName(value) {
    if (value.length != 0) {
      var check = Helper.checkFieldName(value);
      if (check == true) {
        this.setState({namaPemilikObjTertanggung: value});
      } else {
        this.customAlert('Perhatian', 'Harap masukkan nama dengan benar');
      }
    } else {
      this.setState({namaPemilikObjTertanggung: value});
    }
  }
  onValueObjekOkupasi = value => {
    this.setState({objekOkupasi: value});
  };

  renderModalObjek() {
    return (
      <Modal
        visible={this.state.modalVisibleObject}
        onTouchOutside={() => {
          this.setState({modalVisibleObject: false});
        }}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }>
        <ModalContent>
          <View>
            <Text>hahah</Text>
          </View>
        </ModalContent>
      </Modal>
    );
  }
  showDetailType() {
    var form_name = 'fire_simulations';
    if (
      this.state.jenisAsuransiKebakaran == '' ||
      this.state.jenisAsuransiKebakaran == '- Pilih -' ||
      this.state.jenisAsuransiKebakaran == null
    ) {
      this.customAlert('Perhatian', 'Harap Pilih Jenis Asuransi');
    } else {
      this.RBSheet.close();
      setTimeout(() => {
        this.props.showDetailType(this.state.jenisAsuransiKebakaran, form_name);
      }, 0);
    }
  }
  render() {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        height={(Dimensions.get('window').height * 7) / 8}
        closeOnPressMask={false}
        closeOnPressBack={false}
        duration={250}
        customStyles={{
          container: {
            flex: 10,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignContent: 'center',
          },
        }}>
        <View style={styles.contentbottomSheet}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#FF8033',
              height: 40,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginBottom: 10,
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {this.state.title != ''
                ? this.state.title
                : 'Form Simulasi Kebakaran'}
            </Text>
          </View>
          <ScrollView>
            <View
              style={{
                marginHorizontal: 10,
                marginBottom: 20,
                flex: 1,
                paddingHorizontal: 5,
              }}>
              <Text style={styles.titleInput}>Jenis Asuransi Kebakaran : </Text>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    width: '70%',
                    backgroundColor: 'white',
                    paddingStart: 16,
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.8,
                    elevation: 5,
                  }}>
                  <Picker
                    style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                    textStyle={{
                      fontSize: moderateScale(14),
                      flexDirection: 'column',
                      flex: 1,
                      paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                      paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    }}
                    itemTextStyle={{fontSize: moderateScale(16)}}
                    mode="dropdown"
                    placeholder="- Pilih -"
                    iosIcon={
                      <Icon
                        type="feather"
                        name="arrow-down-circle"
                        containerStyle={{marginRight: moderateScale(13)}}
                      />
                    }
                    selectedValue={this.state.jenisAsuransiKebakaran}
                    onValueChange={value => this.onValueJenisAuransi(value)}>
                    {this.state.valueAsuransiKebakaran.map((data, key) => {
                      return (
                        <Picker.Item
                          key={key}
                          label={data.nama}
                          value={data.nama}
                        />
                      );
                    })}
                  </Picker>
                </View>
                <TouchableOpacity
                  onPress={() => this.showDetailType()}
                  style={{
                    width: '25%',
                    color: '#fff',
                    paddingVertical: '4%',
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: '#FF8033',
                    marginLeft: '5%',
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.8,
                    elevation: 5,
                  }}>
                  <Text style={styles.textBtn}>Detail</Text>
                </TouchableOpacity>
              </View>

              {this.state.isKebutuhan && (
                <View>
                  <Text style={styles.titleInput}>
                    Jaminan Perluasan Tambahan :{''}
                  </Text>
                  {/* <View style={styles.vpicker}>
                    <Picker
                      textStyle={styles.picker}
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      selectedValue={this.state.jaminanPerluasan}
                      onValueChange={value =>
                        this.onValueJaminanPelunasan(value)
                      }>
                      {this.state.valueJaminanPelunasan.map((data, key) => {
                        return (
                          <Picker.Item
                            key={key}
                            label={data.nama}
                            value={data.nama}
                            textStyle={{fontSize: 40}}
                          />
                        );
                      })}
                    </Picker>
                  </View> */}
                  <ListItem>
                    <CheckBox
                      color="#3d9acc"
                      checked={this.state.bencana}
                      onPress={() =>
                        this.setState({
                          bencana: !this.state.bencana,
                        })
                      }
                    />
                    <Body style={{marginLeft: 5}}>
                      <Text>Banjir, angin Topan, Badai dan Tanah longsor</Text>
                    </Body>
                  </ListItem>
                  <ListItem>
                    <CheckBox
                      color="#3d9acc"
                      checked={this.state.tertabrak}
                      onPress={() =>
                        this.setState({
                          tertabrak: !this.state.tertabrak,
                        })
                      }
                    />
                    <Body style={{marginLeft: 5}}>
                      <Text>Tertabrak kendaraan</Text>
                    </Body>
                  </ListItem>
                  <ListItem>
                    <CheckBox
                      color="#3d9acc"
                      checked={this.state.kerusuhan}
                      onPress={() =>
                        this.setState({
                          kerusuhan: !this.state.kerusuhan,
                        })
                      }
                    />
                    <Body style={{marginLeft: 5}}>
                      <Text>
                        Kerusuhan, pemogokan, perbuatan jahat orang lain, huru
                        hara
                      </Text>
                    </Body>
                  </ListItem>
                </View>
              )}

              <Text style={styles.titleInput}>
                Nama Pemilik Objek Pertanggungan :{' '}
              </Text>
              <View style={styles.vpicker}>
                <Picker
                  style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0,
                    paddingBottom: Platform.OS == 'ios' ? moderateScale(5) : 0,
                  }}
                  itemTextStyle={{fontSize: moderateScale(16)}}
                  mode="dropdown"
                  placeholder="- Pilih -"
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{marginRight: moderateScale(13)}}
                    />
                  }
                  selectedValue={this.state.pemilikObjPertanggunan}
                  onValueChange={value => this.onValuePemilikObjek(value)}>
                  {this.state.valueNamaPemilik.map((data, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={data.nama}
                        value={data.nama}
                        textStyle={{fontSize: 40}}
                      />
                    );
                  })}
                </Picker>
              </View>
              {(this.state.pemilikObjPertanggunan == 'Atas Nama Orang Lain' ||
                this.state.pemilikObjPertanggunan == 'Atas Nama Sendiri') && (
                <View>
                  <TextInput
                    style={{
                      color: 'black',
                      fontFamily: 'HKGrotesk-Regular',
                      paddingTop: '3%',
                      paddingBottom: '3%',
                      paddingLeft: '5%',
                      paddingRight: '5%',
                      marginTop: 3,
                      borderRadius: 9,
                      backgroundColor: '#fff',
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 1},
                      shadowOpacity: 0.8,
                      elevation: 5,
                    }}
                    placeholder="Nama"
                    value={this.state.namaPemilikObjTertanggung}
                    onChangeText={namaPemilikObjTertanggung =>
                      this.onValueName(namaPemilikObjTertanggung)
                    }
                    underlineColorAndroid="transparent"
                  />
                </View>
              )}
              <Text style={styles.titleInput}>
                Periode Pertanggungan Asuransi :{' '}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    borderRadius: 9,
                    paddingStart: 16,
                    backgroundColor: '#fff',
                    width: 110,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.8,
                    elevation: 5,
                  }}>
                  <Picker
                    style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                    textStyle={{
                      fontSize: moderateScale(14),
                      paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                      paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0,
                      paddingBottom:
                        Platform.OS == 'ios' ? moderateScale(5) : 0,
                    }}
                    itemTextStyle={{fontSize: moderateScale(16)}}
                    mode="dropdown"
                    placeholder="- Pilih -"
                    iosIcon={
                      <Icon
                        type="feather"
                        name="arrow-down-circle"
                        containerStyle={{
                          marginRight: moderateScale(13),
                        }}
                      />
                    }
                    selectedValue={this.state.periodePertanggungan}
                    onValueChange={value =>
                      this.onValuePeriodePertanggungan(value)
                    }>
                    {this.state.valueMonth.map((vmonth, key) => {
                      return (
                        <Picker.Item
                          key={key}
                          label={vmonth.nama}
                          value={vmonth.nama}
                          textStyle={{fontSize: 12}}
                        />
                      );
                    })}
                  </Picker>
                </View>
                <View style={{justifyContent: 'center', marginStart: 20}}>
                  <Text>Bulan</Text>
                </View>
              </View>

              <Text style={styles.titleInput}>
                Periode Dimulainya Asuransi :{' '}
              </Text>
              <TouchableOpacity onPress={() => this.showDatePicker()}>
                {Platform.OS == 'ios' ? (
                  <View style={styles.inputs}>
                    <Text>{this.state.dimulaiPeriode}</Text>
                  </View>
                ) : (
                  <TextInput
                    editable={false}
                    style={styles.inputs}
                    placeholder="Pilih Tanggal"
                    value={this.state.dimulaiPeriode}
                    // onChangeText={nik => this.setState({chosenDate})}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    underlineColorAndroid="transparent"
                    editable={false}
                  />
                )}
              </TouchableOpacity>

              <Text style={styles.titleInput}>
                Objek/Okupasi yang dipertangguhkan :{' '}
              </Text>
              {this.state.jenisAsuransiKebakaran ==
                'ASTRI HOD (HOME ON DEMAND)' || this.state.title != '' ? (
                <View style={styles.vpicker}>
                  <Picker
                    style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                    textStyle={{
                      fontSize: moderateScale(14),
                      paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                      paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0,
                      paddingBottom:
                        Platform.OS == 'ios' ? moderateScale(5) : 0,
                    }}
                    itemTextStyle={{fontSize: moderateScale(16)}}
                    mode="dropdown"
                    placeholder="- Pilih -"
                    iosIcon={
                      <Icon
                        type="feather"
                        name="arrow-down-circle"
                        containerStyle={{marginRight: moderateScale(13)}}
                      />
                    }
                    selectedValue={this.state.objekOkupasi}
                    onValueChange={value => this.onValueObjekOkupasi(value)}>
                    {this.state.valueOkupasiOndemand.map((data, key) => {
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
              ) : (
                <View style={styles.vpicker}>
                  <Picker
                    style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                    textStyle={{
                      fontSize: moderateScale(14),
                      paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                      paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0,
                      paddingBottom:
                        Platform.OS == 'ios' ? moderateScale(5) : 0,
                    }}
                    itemTextStyle={{fontSize: moderateScale(16)}}
                    mode="dropdown"
                    placeholder="- Pilih -"
                    iosIcon={
                      <Icon
                        type="feather"
                        name="arrow-down-circle"
                        containerStyle={{marginRight: moderateScale(13)}}
                      />
                    }
                    selectedValue={this.state.objekOkupasi}
                    onValueChange={value => this.onValueObjekOkupasi(value)}>
                    {this.state.valueOkupasi.map((data, key) => {
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
              )}

              <Text style={{marginTop: 15}}>
                Disclaimer : perhitungan hanya bersifat simulasi dan bertujuan
                sebagai ilustrasi
              </Text>

              <View style={{marginTop: 20, flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => this.batal()}
                  style={styles.btnBatal}>
                  <Text style={styles.textBtn}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.nextForm()}
                  style={styles.btnLanjut}>
                  <Text style={styles.textBtn}>Lanjut</Text>
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={this.state.isDatePickerVisible}
                mode="date"
                onConfirm={date => this.handleConfirm(date)}
                onCancel={() => this.setState({isDatePickerVisible: false})}
              />
            </View>
          </ScrollView>
        </View>
      </RBSheet>
    );
  }
}
const styles = StyleSheet.create({
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
    height: (Dimensions.get('window').height * 7) / 8,
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
    backgroundColor: '#FF8033',
    marginTop: 10,
    marginLeft: '5%',
  },
  btnBatal: {
    width: '45%',
    color: '#fff',
    paddingVertical: '4%',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FF8033',
    marginTop: 10,
    marginRight: '5%',
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
    paddingStart: 20,
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
});
export default BsSimulasiKebakaran;
