import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import {getValue} from './../../../../../Modules/LocalData';
import {getDataWithHeader} from './../../../../../Services';
import ApiEndPoint from './../../../../../Modules/Utils/ApiEndPoint';
import Api from '../../../../../Utils/Api';
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
  ScrollView,
  FlatList,
  Alert,
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
  Header,
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

class BsSimulasiTravel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jenisAsuransiTravel: '',
      namaTertanggung: '',
      negaraTujuanWisata: '',
      tanggalPemberangkatan: moment().format('YYYY-MM-DD'),
      tanggalKepulangan: '',
      nikPaspor: '',
      jenisKelamin: '',
      namaAhliWaris: '',
      hubunganAhliWaris: '',
      modalVisible: false,
      isDatePickerVisible: false,
      isDatePickerVisible2: false,
      isAlertForm: true,
      gender: [
        {id: '0', nama: '- Pilih -'},
        {id: 'Laki-laki', nama: 'Laki-laki'},
        {id: 'Perempuan', nama: 'Perempuan'},
      ],
      optionsTravel: [
        {nama: '- Pilih -'},
        {nama: 'ASTRI TRIP DOMESTIK SILVER'},
        {nama: 'ASTRI TRIP DOMESTIK GOLD'},
        {nama: 'ASTRI TRIP DOMESTIK PLATINUM'},
        {nama: 'ASTRI TRIP INTERNATIONAL SILVER'},
        {nama: 'ASTRI TRIP INTERNATIONAL GOLD'},
        {nama: 'ASTRI TRIP INTERNATIONAL PLATINUM'},
        {nama: 'ASTRI TRIP DOMESTIK SILVER FAMILY'},
        {nama: 'ASTRI TRIP DOMESTIK GOLD FAMILY'},
        {nama: 'ASTRI TRIP DOMESTIK PLATINUM FAMILY'},
        {nama: 'ASTRI TRIP INTERNATIONAL SILVER FAMILY'},
        {nama: 'ASTRI TRIP INTERNATIONAL GOLD FAMILY'},
        {nama: 'ASTRI TRIP INTERNATIONAL PLATINUM FAMILY'},
        {nama: 'ASTRI TRIP INTERNATIONAL ASIA'},
        {nama: 'ASTRI TRIP INTERNATIONAL ASIA FAMILY'},
      ],
      valueAhliWaris: [
        {id: '0', nama: '- Pilih -'},
        {id: 'Husband (Suami)', nama: 'Suami'},
        {id: 'Daughter (Anak perempuan)', nama: 'Anak Perempuan'},
        {id: 'Father (Bapak)', nama: 'Bapak'},
        {id: 'Wife (Istri)', nama: 'Istri'},
        {id: 'Brother (Saudara Laki)', nama: 'Saudara Laki-Laki'},
        {id: 'Mother (Ibu)', nama: 'Ibu'},
        {id: 'Son (Anak laki-laki)', nama: 'Anak Laki-Laki'},
        {id: 'Sister (Saudara Perempuan)', nama: 'Saudara Perempuan'},
        {id: 'Parent (Orang Tua)', nama: 'Orang Tua'},
      ],
      valueNegaraTujuan: [
        // {id: '0', nama: '- Pilih -'},
        // {id: '1', nama: 'Amerika'},
        // {id: '2', nama: 'Brunei'},
        // {id: '3', nama: 'Indonesia'},
        // {id: '3', nama: 'Jepang'},
        // {id: '3', nama: 'Kamboja'},
        // {id: '3', nama: 'Laos'},
        // {id: '3', nama: 'Myanmar'},
        // {id: '3', nama: 'Singapura'},
        // {id: '3', nama: 'Vietnam'},
      ],
    };
  }
  componentDidMount() {
    this.props.onSimulasiTravel(this);
  }
  componentWillUnmount() {
    this.props.onSimulasiTravel(undefined);
  }

  async getCountry() {
    await getDataWithHeader(Api.base_url2 + id + 'tripa/getCountry', tok)
      .then(res => {
        if (res.success != false) {
          var valueCountry = [];
          valueCountry.push({name: '- Pilih -'});
          res.data.map((item, i) => valueCountry.push({name: item}));
          this.setState({valueNegaraTujuan: valueCountry});
        } else {
        }
      })
      .catch(err => {
        console.log(err.response);
      });
  }
  setModalVisible(visible) {
    this.RBSheet.open();

    this.setState({modalVisible: visible});
    this.getCountry();
    // this.renderModal();
  }
  showDatePicker = v => {
    if (v == 'Pemberangkatan') {
      this.setState({isDatePickerVisible: true});
    } else {
      this.setState({isDatePickerVisible2: true});
    }
  };
  batal() {
    this.setState({modalVisible: false});
    this.resetField();
    this.props.messageCancel('batal');
    this.RBSheet.close();
  }
  async nextForm() {
    this.setState({modalVisible: false});
    await this.validationsForm();
    if (this.state.isAlertForm == true) {
      var dataForm = {
        insurance_type: this.state.jenisAsuransiTravel,
        name: this.state.namaTertanggung,
        destination: this.state.negaraTujuanWisata,
        departure_date: this.state.tanggalPemberangkatan,
        return_date: this.state.tanggalKepulangan,
        identity_number: this.state.nikPaspor,
        gender: this.state.jenisKelamin,
        heir_name: this.state.namaAhliWaris,
        heir_relation: this.state.hubunganAhliWaris,
      };
      this.props.sendToChat(JSON.stringify(dataForm));
      this.resetField();
      this.RBSheet.close();
    }
  }
  resetField() {
    this.setState({
      jenisAsuransiTravel: '',
      namaTertanggung: '',
      negaraTujuanWisata: '',
      tanggalPemberangkatan: moment().format('YYYY-MM-DD'),
      tanggalKepulangan: '',
      nikPaspor: '',
      jenisKelamin: '',
      namaAhliWaris: '',
      hubunganAhliWaris: '',
      modalVisible: false,
      isDatePickerVisible: false,
      isDatePickerVisible2: false,
      isAlertForm: true,
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
      this.state.jenisAsuransiTravel == '' ||
      this.state.jenisAsuransiTravel == '- Pilih -' ||
      this.state.jenisAsuransiTravel == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Pilih Jenis Asuransi');
    } else if (
      this.state.namaTertanggung == '' ||
      this.state.namaTertanggung == '- Pilih -' ||
      this.state.namaTertanggung == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Isi Nama Tertanggung');
    } else if (
      this.state.negaraTujuanWisata == '' ||
      this.state.negaraTujuanWisata == '- Pilih -' ||
      this.state.negaraTujuanWisata == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Pilih Negara Tujuan Wisata');
    } else if (
      this.state.tanggalPemberangkatan == '' ||
      this.state.tanggalPemberangkatan == '- Pilih -' ||
      this.state.tanggalPemberangkatan == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Isi Tanggal Pemberangkatan');
    } else if (
      this.state.tanggalKepulangan == '' ||
      this.state.tanggalKepulangan == '- Pilih -' ||
      this.state.tanggalKepulangan == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Isi Tanggal Kepulangan');
    } else if (
      this.state.tanggalKepulangan == this.state.tanggalPemberangkatan ||
      this.state.tanggalKepulangan < this.state.tanggalPemberangkatan
    ) {
      this.setState({isAlertForm: false});
      this.customAlert(
        'Perhatian',
        'Harap Isi Tanggal Kepulangan dengan benar',
      );
    } else if (
      this.state.nikPaspor == '' ||
      this.state.nikPaspor == '- Pilih -' ||
      this.state.nikPaspor == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Isi Nik/Passport');
    } else if (
      this.state.jenisKelamin == '' ||
      this.state.jenisKelamin == '- Pilih -' ||
      this.state.jenisKelamin == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Pilih Jenis Kelamin');
    } else if (
      this.state.namaAhliWaris == '' ||
      this.state.namaAhliWaris == '- Pilih -' ||
      this.state.namaAhliWaris == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Isi Nama Ahli Waris');
    } else if (
      this.state.hubunganAhliWaris == '' ||
      this.state.hubunganAhliWaris == '- Pilih -' ||
      this.state.hubunganAhliWaris == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap Pilih Hubungan Ahli Waris');
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
          'Tanggal pemberangkatan tidak bisa kurang dari tanggal hari ini',
        );
      }, 1500);
    } else {
      this.setState({isDatePickerVisible: false});
      this.setState({tanggalPemberangkatan: dt});
    }
  };
  handleConfirm2 = date => {
    var dateNow = moment().format('YYYY-MM-DD');
    var dt = moment(date).format('YYYY-MM-DD');
    var startDate = moment(this.state.tanggalPemberangkatan).format(
      'YYYY-MM-DD',
    );
    var oneMonthAgo = moment(this.state.tanggalPemberangkatan).add('1', 'M');
    if (startDate >= dt) {
      this.setState({isDatePickerVisible2: false});
      setTimeout(() => {
        this.customAlert(
          'Perhatian',
          'Tanggal kepulangan harus lebih dari tanggal pemberangkatan',
        );
      }, 1500);
    } else if (oneMonthAgo < date) {
      this.setState({isDatePickerVisible2: false});
      setTimeout(() => {
        this.customAlert(
          'Perhatian',
          'Tanggal kepulangan tidak boleh lebih dari 1 bulan dari tanggal pemberangkatan',
        );
      }, 1500);
    } else {
      this.setState({isDatePickerVisible2: false});
      this.setState({tanggalKepulangan: dt});
    }
  };

  async onValueJenisTravel(value) {
    await this.setState({jenisAsuransiTravel: value});
    if (value != '- Pilih -') {
      this.showDetailType(this.state.jenisAsuransiTravel);
    }
  }
  async onValueName(value) {
    if (value.length != 0) {
      var check = Helper.checkFieldName(value);
      if (check == true) {
        this.setState({namaTertanggung: value});
      } else {
        this.customAlert('Perhatian', 'Harap masukkan nama dengan benar');
      }
    } else {
      this.setState({namaTertanggung: value});
    }
  }
  onValueHeirName(value) {
    if (value.length != 0) {
      var check = Helper.checkFieldName(value);
      if (check == true) {
        this.setState({namaAhliWaris: value});
      } else {
        this.customAlert('Perhatian', 'Harap masukkan nama dengan benar');
      }
    } else {
      this.setState({namaAhliWaris: value});
    }
  }
  showDetailType() {
    var form_name = 'travel_simulations';
    if (
      this.state.jenisAsuransiTravel == '' ||
      this.state.jenisAsuransiTravel == '- Pilih -' ||
      this.state.jenisAsuransiTravel == null
    ) {
      this.customAlert('Perhatian', 'Harap Pilih Jenis Asuransi');
    } else {
      this.RBSheet.close();
      setTimeout(() => {
        this.props.showDetailType(this.state.jenisAsuransiTravel, form_name);
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
              Form Simulasi Polis Travel{' '}
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
              <Text style={styles.titleInput}>Jenis Asuransi Travel : </Text>
              <View style={{flex: 1, flexDirection: 'row'}}>
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
                    textStyle={{
                      fontSize: moderateScale(14),
                      paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                      paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                      width: Platform.OS == 'ios' ? '80%' : '100%', //ini agar icon tidak tergeser oleh text
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
                    selectedValue={this.state.jenisAsuransiTravel}
                    onValueChange={value => this.onValueJenisTravel(value)}>
                    {this.state.optionsTravel.map((gender, key) => {
                      return (
                        <Picker.Item
                          key={key}
                          label={gender.nama}
                          value={gender.nama}
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
              <Text style={styles.titleInput}>Nama Tertanggung : </Text>
              <TextInput
                style={styles.inputs}
                placeholder="Nama Tertanggung"
                value={this.state.namaTertanggung}
                onChangeText={value => this.onValueName(value)}
              />
              <Text style={styles.titleInput}>Negara Tujuan : </Text>

              <View style={styles.vpicker}>
                <Picker
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
                  selectedValue={this.state.negaraTujuanWisata}
                  onValueChange={value =>
                    this.setState({negaraTujuanWisata: value})
                  }>
                  {this.state.valueNegaraTujuan.map((gender, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={gender.name}
                        value={gender.name}
                      />
                    );
                  })}
                </Picker>
              </View>
              <Text style={styles.titleInput}>Tanggal Pemberangkatan : </Text>
              <TouchableOpacity
                onPress={() => this.showDatePicker('Pemberangkatan')}>
                {/* { ini ditambahkan kondisi karna teouchableopacity / highlight tdk bisa digunakan di textinput ios //agus */}
                {Platform.OS == 'ios' ? (
                  <View style={styles.inputs}>
                    <Text>{this.state.tanggalPemberangkatan}</Text>
                  </View>
                ) : (
                  <TextInput
                    style={styles.inputs}
                    placeholder="Pilih Tanggal"
                    value={this.state.tanggalPemberangkatan}
                    // onChangeText={nik => this.setState({chosenDate})}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    underlineColorAndroid="transparent"
                    editable={false}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.titleInput}>Tanggal Kepulangan : </Text>
              <TouchableOpacity
                onPress={() => this.showDatePicker('Kepulangan')}>
                {/* { ini ditambahkan kondisi karna teouchableopacity / highlight tdk bisa digunakan di textinput ios //agus */}
                {Platform.OS == 'ios' ? (
                  <View style={styles.inputs}>
                    {this.state.tanggalKepulangan == '' ? (
                      <Text style={{color: '#C7C7CD'}}>Pilih Tanggal</Text>
                    ) : (
                      <Text>{this.state.tanggalKepulangan}</Text>
                    )}
                  </View>
                ) : (
                  <TextInput
                    style={styles.inputs}
                    placeholder="Pilih Tanggal"
                    value={this.state.tanggalKepulangan}
                    // onChangeText={nik => this.setState({chosenDate})}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    underlineColorAndroid="transparent"
                    editable={false}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.titleInput}>Nik/Passport : </Text>
              <TextInput
                keyboardType="default"
                style={styles.inputs}
                placeholder="Nik/Passport"
                value={this.state.nikPaspor}
                onChangeText={value => this.setState({nikPaspor: value})}
                // onSubmitEditing={() => this.passwordInput.focus()}
                underlineColorAndroid="transparent"
              />
              <Text style={styles.titleInput}>Jenis Kelamin :</Text>
              <View style={styles.vpicker}>
                <Picker
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0,
                    paddingBottom: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    //ini agar text ada di tengah (agus)
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
                  selectedValue={this.state.jenisKelamin}
                  onValueChange={value => this.setState({jenisKelamin: value})}>
                  {this.state.gender.map((gender, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={gender.nama}
                        value={gender.id}
                      />
                    );
                  })}
                </Picker>
              </View>

              <Text style={styles.titleInput}>Nama Ahli Waris : </Text>

              <TextInput
                style={styles.inputs}
                placeholder="Nama Ahli Waris"
                value={this.state.namaAhliWaris}
                onChangeText={value => this.onValueHeirName(value)}
              />
              <Text style={styles.titleInput}>Hubungan Ahli Waris :</Text>
              <View style={styles.vpicker}>
                <Picker
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
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
                  selectedValue={this.state.hubunganAhliWaris}
                  onValueChange={value =>
                    this.setState({hubunganAhliWaris: value})
                  }>
                  {this.state.valueAhliWaris.map((gender, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={gender.nama}
                        value={gender.id}
                      />
                    );
                  })}
                </Picker>
              </View>

              <Text style={{marginTop: 15}}>
                Disclaimer : perhitungan hanya bersifat simulasi dan bertujuan
                sebagai ilustrasi
              </Text>

              <View style={{marginTop: 5, flexDirection: 'row'}}>
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
              <DateTimePickerModal
                isVisible={this.state.isDatePickerVisible2}
                mode="date"
                onConfirm={date => this.handleConfirm2(date)}
                onCancel={() => this.setState({isDatePickerVisible2: false})}
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
    paddingStart: 16,
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
export default BsSimulasiTravel;
