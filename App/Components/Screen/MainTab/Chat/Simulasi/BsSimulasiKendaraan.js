import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import {getValue} from './../../../../../Modules/LocalData';
import {getDataWithHeader} from './../../../../../Services';
import Api from '../../../../../Utils/Api';
import {moderateScale} from '../../../../../Utils/Scale';

import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Linking,
} from 'react-native';
import {CheckBox, ListItem, Picker, Body} from 'native-base';
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
class BsSimulasiKendaraan extends Component {
  constructor(props) {
    super(props);
    dataUser();
    this.state = {
      dataMessage: [],
      jenisAsuransiKendaraan: '',
      pemilikObjPertanggunan: '',
      namaPemilikObjTertanggung: '',
      jenisAsuransiKendaraanSesKeb: '',
      periodePertanggungan: '',
      dimulaiPeriode: moment().format('YYYY-MM-DD'),
      objekKendaraan: '',
      platNo: '',
      kodeWilayah: '',
      tahunPembuatan: '',
      nilaiKendaraan: 0,
      nilaiPeralatanTambahan: '0',
      totalNilaiPertanggungan: 0,

      accident_for_driver_value: 0,
      accident_for_passenger_value: 0,
      legal_liability_third_party_value: 0,
      legal_liability_for_passengers_value: 0,

      kecDiriPengemudi: false,
      kecDiriPenumpang: false,
      tanggungjwbbHuk3: false,
      tanggungjwbHukPenumpang: false,
      banjir: false,
      gempaBumi: false,
      huruHara: false,
      terorisme: false,
      authorized_workshop: false,
      notif: 0,
      checkJailStatus: '',
      modalVisible: false,
      isDatePickerVisible: false,
      isVehicleCode: false,
      isFormValid: true,
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
      valueAsuransiKendaraan: [
        {id: '0', nama: '- Pilih -'},
        {id: 'ASTRI AUTOSHIELD', nama: 'ASTRI AUTOSHIELD'},
        {id: 'ASTRI AUTOSHIELD GOLD', nama: 'ASTRI AUTOSHIELD GOLD'},
        {id: 'ASTRI AUTOSHIELD PLATINUM', nama: 'ASTRI AUTOSHIELD PLATINUM'},
        {
          id: 'ASTRI AUTOSHIELD ON DEMAND',
          nama: 'ASTRI AUTOSHIELD ON DEMAND',
        },
      ],
      valueAsuransiSesKeb: [
        {id: '0', nama: '- Pilih -'},
        {id: '1', nama: 'ASTRI ASTON (AUTOSHIELD TLO ON DEMAND)'},
        {id: '2', nama: 'ASTRI ASGARD (AUTOSHIELD ALLRISK ON DEMAND)'},
      ],
      valueJaminanPelunasan: [
        {id: '0', nama: '- Pilih -'},
        {id: '1', nama: 'Kecelakaan diri untuk pengemudi'},
        {id: '2', nama: 'Kecelakaan diri Untuk Penumpang Max 4 Orang'},
        {id: '2', nama: 'Tanggung Jawab Hukum Pihak Ke-3'},
        {id: '2', nama: 'Tanggung Jawab hukum Terhadap Penumpang'},
        {id: '2', nama: 'Banjir termasih Angin Topan'},
        {id: '2', nama: 'Gempa Bumi, Tsunami'},
        {id: '2', nama: 'Huru-hara dan Kerusuhan (SRCC)'},
        {id: '2', nama: 'Terorisme dan Sabotase'},
      ],
      valueNamaPemilik: [
        {id: '0', nama: '- Pilih -'},
        {id: 'Atas Nama Sendiri', nama: 'Atas Nama Sendiri'},
        {id: 'Nama Pada STNK Kendaraan', nama: 'Nama Pada STNK Kendaraan'},
      ],
      valueOkupasi: [
        // {id: '0', nama: '- Pilih -'},
        // {id: '1', nama: 'P = Pribadi/Dinas/Perusahaan'},
        // {id: '2', nama: 'C = Komersil/Disewakan/Taksi Online'},
        {id: '0', nama: '- Pilih -'},

        {id: '15', nama: 'Audi'},
        {id: '11', nama: 'BMW'},
        {id: '21', nama: 'Chevrolet'},
        {id: '19', nama: 'Daihatsu'},
        {id: '12', nama: 'Datsun'},
        {id: '6', nama: 'DVSK'},
        {id: '17', nama: 'Fiat'},
        {id: '3', nama: 'Ford'},
        {id: '9', nama: 'Honda'},
        {id: '25', nama: 'Hummer'},
        {id: '5', nama: 'Hyundai'},
        {id: '16', nama: 'Jeep'},
        {id: '14', nama: 'KIA'},
        {id: '13', nama: 'Lexus'},
        {id: '2', nama: 'Mitsubishi'},
        {id: '22', nama: 'Mazda'},
        {id: '10', nama: 'Nissan'},
        {id: '7', nama: 'Peugeot'},
        {id: '8', nama: 'Range Rover'},
        {id: '24', nama: 'Renault'},
        {id: '18', nama: 'Suzuki'},
        {id: '1', nama: 'Toyota'},
        {id: '20', nama: 'Volvo'},
        {id: '4', nama: 'VW'},
        {id: '23', nama: 'Wuling'},
      ],

      valuekodeWilayah: [],
      valueVehicleCode: [],
      valueYears: [],
    };
  }
  componentDidMount() {
    this.props.onSimulasiKendaraan(this);
  }
  componentWillUnmount() {
    this.props.onSimulasiKendaraan(undefined);
  }
  async setModalVisible(title, type) {
    this.setState({modalVisible: true});
    if (title == 'Asuransi Kendaraan Syariah Simulasi') {
      await this.setState({
        title,
        jenisAsuransiKendaraan: type,
        valueAsuransiKendaraan: [
          {id: '0', nama: '- Pilih -'},
          {id: '1', nama: 'ASTRI LITE AUTOSHIELD SHARIA'},
          {id: '2', nama: 'ASTRI PREMIUM AUTOSHIELD SHARIA'},
          {id: '3', nama: 'ASTRI AUTOSHIELD ON DEMAND SHARIA'},
        ],
      });
    }
    if (type != null) {
      this.showDetailType();
    }

    this.RBSheet.open();
    // this.getVehicleCode();
    var years = moment().format('YYYY') - 5;
    var arr = [{nama: '- Pilih -'}];
    for (var i = 0; i < 6; i++) {
      const obj = {nama: years.toString()};
      arr.push(obj);
      years++;
    }
    this.setState({valueYears: arr});
    var dt = moment().format('YYYY-MM-DD');
    this.setState({dimulaiPeriode: dt});
  }

  async onValueNilaiKendaraan(value) {
    if (value == null || value == '') {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ''), 10);
    } catch {}
    // console.log('format money', this.convertToRupiah(value));
    await this.setState({nilaiKendaraan: this.convertToRupiah(aa)});

    var nilaiken = this.state.nilaiKendaraan;
    var nilatam = this.state.nilaiPeralatanTambahan;
    try {
      var kendaraan = parseInt(nilaiken.replace(/,.*|[^0-9]/g, ''), 10);
      var tambahan = parseInt(nilatam.replace(/,.*|[^0-9]/g, ''), 10);
    } catch {}

    var a = parseFloat(kendaraan == undefined ? 0 : kendaraan);
    var b = parseFloat(tambahan == undefined ? 0 : tambahan);
    var c = a + b;
    this.setState({
      totalNilaiPertanggungan: this.convertToRupiah(c.toString()),
    });
  }

  async onValueNilaiTambahan(value) {
    if (value == null || value == '') {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ''), 10);
    } catch {}
    await this.setState({nilaiPeralatanTambahan: this.convertToRupiah(aa)});
    var nilaiken = this.state.nilaiKendaraan;
    var nilatam = this.state.nilaiPeralatanTambahan;
    try {
      var kendaraan = parseInt(nilaiken.replace(/,.*|[^0-9]/g, ''), 10);
      var tambahan = parseInt(nilatam.replace(/,.*|[^0-9]/g, ''), 10);
    } catch {}

    var a = parseFloat(kendaraan == undefined ? 0 : kendaraan);
    var b = parseFloat(tambahan == undefined ? 0 : tambahan);
    var c = a + b;

    this.setState({
      totalNilaiPertanggungan: this.convertToRupiah(c.toString()),
    });
  }

  convertToRupiah(angka) {
    try {
      var rupiah = '';
      var angkarev = angka
        .toString()
        .split('')
        .reverse()
        .join('');
      for (var i = 0; i < angkarev.length; i++)
        if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
      return rupiah
        .split('', rupiah.length - 1)
        .reverse()
        .join('');
    } catch {}
  }
  showDatePicker = () => {
    this.setState({isDatePickerVisible: true});
  };
  async nextForm() {
    this.setState({modalVisible: false});

    await this.validationsForm();
    let insuranceType = this.state.jenisAsuransiKendaraan;
    if (this.state.jenisAsuransiKendaraan == 'ASTRI AUTOSHIELD ON DEMAND') {
      insuranceType = this.state.jenisAsuransiKendaraanSesKeb;

      if (insuranceType == 'ASTRI ASGARD (AUTOSHIELD ALLRISK ON DEMAND)') {
        if (this.state.isFormValid == true) {
          var data = {
            insurance_type: insuranceType,
            //
            accident_for_driver: this.state.kecDiriPengemudi ? 'true' : 'false',
            accident_for_passenger: this.state.kecDiriPenumpang
              ? 'true'
              : 'false',
            legal_liability_third_party: this.state.tanggungjwbbHuk3
              ? 'true'
              : 'false',
            legal_liability_for_passengers: this.state.tanggungjwbHukPenumpang
              ? 'true'
              : 'false',
            floods_include_typhons: this.state.banjir ? 'true' : 'false',
            earthquake_tsunami: this.state.gempaBumi ? 'true' : 'false',
            riot_and_damage: this.state.huruHara ? 'true' : 'false',
            terrorism_and_sabotage: this.state.terorisme ? 'true' : 'false',
            authorized_workshop: this.state.authorized_workshop,

            //
            model: 'Wtvi',
            month_period: this.state.periodePertanggungan,
            start_insurance_period: this.state.dimulaiPeriode,
            brand: this.state.objekKendaraan,
            vehicle_region_code: this.state.platNo,
            build_year: this.state.tahunPembuatan,
            vehicle_value: this.state.nilaiKendaraan.replace(/,.*|[^0-9]/g, ''),
            additional_vehicle_value: this.state.nilaiPeralatanTambahan.replace(
              /,.*|[^0-9]/g,
              '',
            ),
            added_value_tools: this.state.totalNilaiPertanggungan.replace(
              /,.*|[^0-9]/g,
              '',
            ),

            accident_for_driver_value: this.state.accident_for_driver_value
              .toString()
              .replace(/,.*|[^0-9]/g, ''),
            accident_for_passengers_value: this.state.accident_for_passenger_value
              .toString()
              .replace(/,.*|[^0-9]/g, ''),
            legal_liability_third_party_value: this.state.legal_liability_third_party_value
              .toString()
              .replace(/,.*|[^0-9]/g, ''),
            legal_liability_for_passengers_value: this.state.legal_liability_for_passengers_value
              .toString()
              .replace(/,.*|[^0-9]/g, ''),
          };

          //   this.props.showPolis2(data);
          this.props.sendToChat(JSON.stringify(data));
          this.resetField();
          this.RBSheet.close();
        }
      } else {
        if (this.state.isFormValid == true) {
          var data = {
            insurance_type: insuranceType,
            //
            accident_for_driver: this.state.kecDiriPengemudi ? 'true' : 'false',
            accident_for_passenger: this.state.kecDiriPenumpang
              ? 'true'
              : 'false',
            legal_liability_third_party: this.state.tanggungjwbbHuk3
              ? 'true'
              : 'false',
            legal_liability_for_passengers: this.state.tanggungjwbHukPenumpang
              ? 'true'
              : 'false',
            floods_include_typhons: this.state.banjir ? 'true' : 'false',
            earthquake_tsunami: this.state.gempaBumi ? 'true' : 'false',
            riot_and_damage: this.state.huruHara ? 'true' : 'false',
            terrorism_and_sabotage: this.state.terorisme ? 'true' : 'false',
            //
            model: 'Wtvi',
            month_period: this.state.periodePertanggungan,
            start_insurance_period: this.state.dimulaiPeriode,
            brand: this.state.objekKendaraan,
            vehicle_region_code: this.state.platNo,
            build_year: this.state.tahunPembuatan,
            vehicle_value: this.state.nilaiKendaraan.replace(/,.*|[^0-9]/g, ''),
            additional_vehicle_value: this.state.nilaiPeralatanTambahan.replace(
              /,.*|[^0-9]/g,
              '',
            ),
            added_value_tools: this.state.totalNilaiPertanggungan.replace(
              /,.*|[^0-9]/g,
              '',
            ),

            accident_for_driver_value: this.state.accident_for_driver_value
              .toString()
              .replace(/,.*|[^0-9]/g, ''),
            accident_for_passengers_value: this.state.accident_for_passenger_value
              .toString()
              .replace(/,.*|[^0-9]/g, ''),
            legal_liability_third_party_value: this.state.legal_liability_third_party_value
              .toString()
              .replace(/,.*|[^0-9]/g, ''),
            legal_liability_for_passengers_value: this.state.legal_liability_for_passengers_value
              .toString()
              .replace(/,.*|[^0-9]/g, ''),
          };

          //   this.props.showPolis2(data);
          this.props.sendToChat(JSON.stringify(data));
          this.resetField();
          this.RBSheet.close();
        }
      }
    } else {
      if (this.state.isFormValid == true) {
        var data = {
          insurance_type: insuranceType,
          //
          accident_for_driver: this.state.kecDiriPengemudi ? 'true' : 'false',
          accident_for_passenger: this.state.kecDiriPenumpang
            ? 'true'
            : 'false',
          legal_liability_third_party: this.state.tanggungjwbbHuk3
            ? 'true'
            : 'false',
          legal_liability_for_passengers: this.state.tanggungjwbHukPenumpang
            ? 'true'
            : 'false',
          floods_include_typhons: this.state.banjir ? 'true' : 'false',
          earthquake_tsunami: this.state.gempaBumi ? 'true' : 'false',
          riot_and_damage: this.state.huruHara ? 'true' : 'false',
          terrorism_and_sabotage: this.state.terorisme ? 'true' : 'false',
          //
          model: 'Wtvi',
          month_period: this.state.periodePertanggungan,
          start_insurance_period: this.state.dimulaiPeriode,
          brand: this.state.objekKendaraan,
          vehicle_region_code: this.state.platNo,
          build_year: this.state.tahunPembuatan,
          vehicle_value: this.state.nilaiKendaraan.replace(/,.*|[^0-9]/g, ''),
          additional_vehicle_value: this.state.nilaiPeralatanTambahan.replace(
            /,.*|[^0-9]/g,
            '',
          ),
          added_value_tools: this.state.totalNilaiPertanggungan.replace(
            /,.*|[^0-9]/g,
            '',
          ),

          accident_for_driver_value: 0,

          accident_for_passengers_value: 0,
          legal_liability_third_party_value: 0,
          legal_liability_for_passengers_value: 0,
        };

        //   this.props.showPolis2(data);
        this.props.sendToChat(JSON.stringify(data));
        this.resetField();
        this.RBSheet.close();
      }
    }
  }
  batal() {
    this.setState({modalVisible: false});
    this.resetField();
    this.props.messageCancel('batal');
    this.RBSheet.close();
    // this.props.messageCancel('batal');
  }
  resetField() {
    this.setState({
      jenisAsuransiKendaraan: '',
      pemilikObjPertanggunan: '',
      namaPemilikObjTertanggung: '',
      jenisAsuransiKendaraanSesKeb: '',
      periodePertanggungan: '',
      dimulaiPeriode: moment().format('YYYY-MM-DD'),
      objekKendaraan: '',
      platNo: '',
      kodeWilayah: '',
      tahunPembuatan: '',
      nilaiKendaraan: 0,
      nilaiPeralatanTambahan: '0',
      totalNilaiPertanggungan: 0,
      title: '',

      valueAsuransiKendaraan: [
        {id: '0', nama: '- Pilih -'},
        {id: 'ASTRI AUTOSHIELD', nama: 'ASTRI AUTOSHIELD'},
        {id: 'ASTRI AUTOSHIELD GOLD', nama: 'ASTRI AUTOSHIELD GOLD'},
        {id: 'ASTRI AUTOSHIELD PLATINUM', nama: 'ASTRI AUTOSHIELD PLATINUM'},
        {
          id: 'ASTRI AUTOSHIELD ON DEMAND',
          nama: 'ASTRI AUTOSHIELD ON DEMAND',
        },
      ],

      accident_for_driver_value: 0,
      accident_for_passenger_value: 0,
      legal_liability_third_party_value: 0,
      legal_liability_for_passengers_value: 0,

      kecDiriPengemudi: false,
      kecDiriPenumpang: false,
      tanggungjwbbHuk3: false,
      tanggungjwbHukPenumpang: false,
      banjir: false,
      gempaBumi: false,
      huruHara: false,
      terorisme: false,
      notif: 0,
      checkJailStatus: '',
      modalVisible: false,
      isDatePickerVisible: false,
      isVehicleCode: false,
      isFormValid: true,
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
    var date = moment().format('YYYY');
    if (
      this.state.jenisAsuransiKendaraan == '' ||
      this.state.jenisAsuransiKendaraan == '- Pilih -' ||
      this.state.jenisAsuransiKendaraan == null
    ) {
      this.setState({isFormValid: false});
      this.customAlert('Perhatian', 'Harap Isi Jenis Asuransi Kendaraan');
    } else if (
      (this.state.jenisAsuransiKendaraan == 'ASTRI AUTOSHIELD ON DEMAND' ||
        this.state.jenisAsuransiKendaraan ==
          'ASTRI AUTOSHIELD ON DEMAND SHARIA') &&
      (this.state.kecDiriPengemudi == false &&
        this.state.kecDiriPenumpang == false &&
        this.state.tanggungjwbbHuk3 == false &&
        this.state.tanggungjwbHukPenumpang == false &&
        this.state.banjir == false &&
        this.state.gempaBumi == false &&
        this.state.huruHara == false &&
        this.state.terorisme == false)
    ) {
      this.setState({isFormValid: false});
      this.customAlert(
        'Perhatian',
        'Harap Pilih Jenis Asuransi Sesuai Kebutuhan',
      );
    } else if (
      this.state.jenisAsuransiKendaraan == 'ASTRI AUTOSHIELD ON DEMAND' &&
      (this.state.jenisAsuransiKendaraanSesKeb == '' ||
        this.state.jenisAsuransiKendaraanSesKeb == '- Pilih -' ||
        this.state.jenisAsuransiKendaraanSesKeb == null)
    ) {
      this.setState({isFormValid: false});
      this.customAlert(
        'Perhatian',
        'Harap Pilih Jenis Asuransi Sesuai Kebutuhan',
      );
    } else if (
      this.state.periodePertanggungan == '' ||
      this.state.periodePertanggungan == '- Pilih -' ||
      this.state.periodePertanggungan == null
    ) {
      this.setState({isFormValid: false});
      this.customAlert('Perhatian', 'Harap Isi Periode Pertanggungn Asuransi');
    } else if (
      this.state.dimulaiPeriode == '' ||
      this.state.dimulaiPeriode == '- Pilih -' ||
      this.state.dimulaiPeriode == null
    ) {
      this.setState({isFormValid: false});
      this.customAlert('Perhatian', 'Harap Isi Tangal Dimulainya Asuransi');
    } else if (
      this.state.objekKendaraan == '' ||
      this.state.objekKendaraan == '- Pilih -' ||
      this.state.objekKendaraan == null
    ) {
      this.setState({isFormValid: false});
      this.customAlert(
        'Perhatian',
        'Harap Isi Objek Kendaraan Yang Dipertanggungkan',
      );
    } else if (
      this.state.kodeWilayah == '' ||
      this.state.kodeWilayah == '- Pilih -' ||
      this.state.kodeWilayah == null
    ) {
      this.setState({isFormValid: false});
      this.customAlert('Perhatian', 'Harap Isi Kode Wilayah');
    } else if (
      this.state.tahunPembuatan == '' ||
      this.state.tahunPembuatan == '- Pilih -' ||
      this.state.tahunPembuatan == null
    ) {
      this.setState({isFormValid: false});
      this.customAlert('Perhatian', 'Harap Isi Tahun Pembuatan');
    } else if (this.state.tahunPembuatan < date - 5) {
      this.setState({isFormValid: false});
      this.customAlert('Perhatian', 'Maksimal usia kendaraan 5 tahun');
    } else if (
      this.state.nilaiKendaraan == '' ||
      this.state.nilaiKendaraan == null
    ) {
      this.setState({isFormValid: false});
      this.customAlert('Perhatian', 'Harap Isi Nilai Kendaraan');
    } else if (
      this.state.nilaiPeralatanTambahan == '' ||
      this.state.nilaiPeralatanTambahan == null
    ) {
      this.setState({isFormValid: false, nilaiPeralatanTambahan: 0});
      // this.customAlert('Perhatian', 'Harap Isi Nilai Perlatan Tambahan');
    } else if (
      this.state.kecDiriPengemudi == true &&
      (this.state.accident_for_driver_value == '' ||
        this.state.accident_for_driver_value == null)
    ) {
      this.setState({isFormValid: false});
      this.customAlert(
        'Perhatian',
        'Harap isi nilai kecelakaan diri untuk pengemudi',
      );
    } else if (
      this.state.kecDiriPenumpang == true &&
      (this.state.accident_for_passenger_value == '' ||
        this.state.accident_for_passenger_value == null)
    ) {
      this.setState({isFormValid: false});
      this.customAlert(
        'Perhatian',
        'Harap isi nilai kecelakaan diri untuk penumpang max 4 orang',
      );
    } else if (
      this.state.tanggungjwbbHuk3 == true &&
      (this.state.legal_liability_third_party_value == '' ||
        this.state.legal_liability_third_party_value == null)
    ) {
      this.setState({isFormValid: false});
      this.customAlert(
        'Perhatian',
        'Harap isi nilai tanggung jawab hukum pihak ke-3',
      );
    } else if (
      this.state.tanggungjwbbHuk3 == true &&
      (this.state.jenisAsuransiKendaraanSesKeb ==
        'ASTRI ASTON (AUTOSHIELD TLO ON DEMAND)' ||
        this.state.jenisAsuransiKendaraanSesKeb ==
          'ASTRI ASGARD (AUTOSHIELD ALLRISK ON DEMAND)' ||
        this.state.jenisAsuransiKendaraan ==
          'ASTRI AUTOSHIELD ON DEMAND SHARIA') &&
      parseInt(
        this.state.legal_liability_third_party_value.replace(/,.*|[^0-9]/g, ''),
        10,
      ) > 25000000
    ) {
      this.setState({isFormValid: false});
      this.customAlert(
        'Perhatian',
        'Nilai tanggung jawab hukum pihak ke-3 Maksimal 25.000.000',
      );
    } else if (
      this.state.tanggungjwbHukPenumpangrr == true &&
      (this.state.legal_liability_for_passengers_value == '' ||
        this.state.legal_liability_for_passengers_value == null)
    ) {
      this.setState({isFormValid: false});
      this.customAlert(
        'Perhatian',
        'Harap isi nilai tanggung jawab hukum terhadap penumpang',
      );
    } else {
      this.setState({isFormValid: true});
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
  onValueJenisAuransi = value => {
    this.setState({jenisAsuransiKendaraan: value});
  };
  onValuePemilikObjek = value => {
    this.setState({pemilikObjPertanggunan: value});
    if (value == 'Atas Nama Sendiri') {
      this.setState({namaPemilikObjTertanggung: name});
    }
  };
  onValueObjekOkupasi = value => {
    this.setState({objekKendaraan: value});
  };

  async onValueAccidentDriver(value) {
    if (value == null || value == '') {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ''), 10);
    } catch {}
    await this.setState({accident_for_driver_value: this.convertToRupiah(aa)});
  }

  async onValueAccidentPassenger(value) {
    if (value == null || value == '') {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ''), 10);
    } catch {}
    await this.setState({
      accident_for_passenger_value: this.convertToRupiah(aa),
    });
  }

  async onValueLegalThirdParty(value) {
    if (value == null || value == '') {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ''), 10);
    } catch {}
    await this.setState({
      legal_liability_third_party_value: this.convertToRupiah(aa),
    });
  }
  async onValueLegalPassenger(value) {
    if (value == null || value == '') {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ''), 10);
    } catch {}
    await this.setState({
      legal_liability_for_passengers_value: this.convertToRupiah(aa),
    });
  }

  onValueYear(value) {
    var date = moment().format('YYYY');
    this.setState({tahunPembuatan: value});
  }

  async getVehicleCode() {
    await getDataWithHeader(
      Api.base_url2 + 'tripa/' + id + '/get-vehicle-region-code',
      tok,
    )
      .then(res => {
        if (res.success != false) {
          this.setState({valueVehicleCode: res.data});
          this.setState({isVehicleCode: true});
        } else {
        }
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  endSubmit(value) {
    var valid1 = /^[A-Z]{1,2}$/.test(value);
    if (valid1 == false) {
      this.customAlert(
        'Perhatian',
        'Harap isi plat nomor sesuai format\n(contoh: B/AB)',
      );
    }
  }
  onValuePlatNo(value) {
    var v = value.toUpperCase();
    var platno = v.replace(/ /g, '');
    // platno = /^[A-Z]{2} ?- ?\d{4} ?- ?[A-Z]{2}$/.test(value);

    this.setState({platNo: platno});

    //get 1 or 2 caracter to hit api
    var data = value.toUpperCase();
    var res = data.charAt(0);
    var car = this.isLetter(res);
    var res2 = data.charAt(1);
    var car2 = this.isLetter(res2);
    console.log('onValuePlatNo', car + ' ' + car2);

    if (value.length == 1 && car != null) {
      this.getKodeKendaraan(res);
    } else if (car != null && car2 != null && value.length >= 2) {
      this.getKodeKendaraan(res + '' + res2);
    } else if (car != null && value.length >= 2) {
      this.getKodeKendaraan(res);
    } else if (car == null || car2 == null) {
      this.customAlert('Perhatian', 'Harap isi plat nomor dengan sesuai');
    }
  }

  async onValueJenisAsuransi(value) {
    await this.setState({jenisAsuransiKendaraan: value});
    if (value != '- Pilih -' && value != 'ASTRI AUTOSHIELD ON DEMAND') {
      this.showDetailType(this.state.jenisAsuransiKendaraan);
    }
  }

  async onValueJenisAssuransiSes(value) {
    this.setState({jenisAsuransiKendaraanSesKeb: value});
    var jenisAsuransi = '';
    if (value == 'ASTRI ASTON (AUTOSHIELD TLO ON DEMAND)') {
      jenisAsuransi = 'ASTRI ASTON';
    } else if (value == 'ASTRI ASGARD (AUTOSHIELD ALLRISK ON DEMAND)') {
      jenisAsuransi = 'ASTRI ASGARD';
    }

    if (value != '- Pilih -') {
      this.showDetailType(jenisAsuransi);
      console.log('onValueJenisAssuransiSes', jenisAsuransi);
    }
  }

  isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

  async getKodeKendaraan(data) {
    await getDataWithHeader(
      Api.base_url2 + 'tripa/' + id + '/get-province-code/' + data,
      tok,
    )
      .then(res => {
        if (res.success != false) {
          this.setState({
            kodeKendaraan: res.data[0].kode,
            provinsi: res.data[0].deskripsi,
          });
          // this.setState({isVehicleCode: true});
          console.log('sasasassas', this.state.kodeKendaraan);
        } else {
        }
      })
      .catch(err => {
        console.log(err.response);
      });

    await getDataWithHeader(
      Api.base_url2 +
        'tripa/' +
        id +
        '/get-wilayah/' +
        this.state.kodeKendaraan,
      tok,
    )
      .then(res => {
        if (res.success != false) {
          this.setState({
            kodeWilayah: res.data[0].kode,
          });
          // this.setState({isVehicleCode: true});
        } else {
        }
      })
      .catch(err => {
        console.log(err.response);
      });
  }
  showDetailType(value) {
    var form_name = 'vehicle_simulations';
    if (
      this.state.jenisAsuransiKendaraan == '' ||
      this.state.jenisAsuransiKendaraan == '- Pilih -' ||
      this.state.jenisAsuransiKendaraan == null
    ) {
      this.customAlert('Perhatian', 'Harap Pilih Jenis Asuransi');
    } else if (value == 'ASTRI AUTOSHIELD ON DEMAND') {
      console.log('showDetailType', value);
    } else {
      this.RBSheet.close();
      setTimeout(() => {
        this.props.showDetailType(this.state.jenisAsuransiKendaraan, form_name);
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
                : 'Form Simulasi Kendaraan'}
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
              <Text style={styles.titleInput}>Jenis Asuransi Kendaraan : </Text>
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
                        containerStyle={{
                          marginRight: moderateScale(13),
                        }}
                      />
                    }
                    selectedValue={this.state.jenisAsuransiKendaraan}
                    onValueChange={value => this.onValueJenisAsuransi(value)}>
                    {this.state.valueAsuransiKendaraan.map((data, key) => {
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
                <TouchableOpacity
                  onPress={() => this.showDetailType()}
                  style={{
                    width: '25%',
                    color: '#fff',
                    paddingVertical: '4%',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
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

              {(this.state.jenisAsuransiKendaraan ==
                'ASTRI AUTOSHIELD ON DEMAND' ||
                this.state.jenisAsuransiKendaraan ==
                  'ASTRI AUTOSHIELD ON DEMAND SHARIA') && (
                <View>
                  {this.state.jenisAsuransiKendaraan ==
                    'ASTRI AUTOSHIELD ON DEMAND' && (
                    <View
                      style={{
                        backgroundColor: 'white',
                        marginTop: 5,
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
                          paddingLeft:
                            Platform.OS == 'ios' ? 0 : moderateScale(5),
                          paddingTop:
                            Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                          paddingBottom:
                            Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
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
                        selectedValue={this.state.jenisAsuransiKendaraanSesKeb}
                        onValueChange={value =>
                          this.onValueJenisAssuransiSes(value)
                        }>
                        {this.state.valueAsuransiSesKeb.map((data, key) => {
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
                  )}

                  <ListItem>
                    <CheckBox
                      color="#3d9acc"
                      checked={this.state.kecDiriPengemudi}
                      onPress={() =>
                        this.setState({
                          kecDiriPengemudi: !this.state.kecDiriPengemudi,
                        })
                      }
                    />
                    <Body style={{marginLeft: 5}}>
                      <Text>Kecelakaan Diri Untuk Pengemudi</Text>
                    </Body>
                  </ListItem>
                  <ListItem>
                    <CheckBox
                      color="#3d9acc"
                      checked={this.state.kecDiriPenumpang}
                      onPress={() =>
                        this.setState({
                          kecDiriPenumpang: !this.state.kecDiriPenumpang,
                        })
                      }
                    />
                    <Body style={{marginLeft: 5}}>
                      <Text>
                        Kecelakaan Diri Untuk Penumpang Maksimal 4 Orang
                      </Text>
                    </Body>
                  </ListItem>
                  <ListItem>
                    <CheckBox
                      color="#3d9acc"
                      checked={this.state.tanggungjwbbHuk3}
                      onPress={() =>
                        this.setState({
                          tanggungjwbbHuk3: !this.state.tanggungjwbbHuk3,
                        })
                      }
                    />
                    <Body style={{marginLeft: 5}}>
                      <Text>Tanggung Jawab Hukum Pihak Ke-3</Text>
                    </Body>
                  </ListItem>
                  <ListItem>
                    <CheckBox
                      color="#3d9acc"
                      checked={this.state.tanggungjwbHukPenumpang}
                      onPress={() =>
                        this.setState({
                          tanggungjwbHukPenumpang: !this.state
                            .tanggungjwbHukPenumpang,
                        })
                      }
                    />
                    <Body style={{marginLeft: 5}}>
                      <Text>Tanggung Jawab Hukum Terhadap Penumpang</Text>
                    </Body>
                  </ListItem>
                  <ListItem>
                    <CheckBox
                      color="#3d9acc"
                      checked={this.state.banjir}
                      onPress={() =>
                        this.setState({
                          banjir: !this.state.banjir,
                        })
                      }
                    />
                    <Body style={{marginLeft: 5}}>
                      <Text>Banjir Termasuk Angin Topan</Text>
                    </Body>
                  </ListItem>
                  <ListItem>
                    <CheckBox
                      color="#3d9acc"
                      checked={this.state.gempaBumi}
                      onPress={() =>
                        this.setState({
                          gempaBumi: !this.state.gempaBumi,
                        })
                      }
                    />
                    <Body style={{marginLeft: 5}}>
                      <Text>Gempa Bumi, Tsunami</Text>
                    </Body>
                  </ListItem>
                  <ListItem>
                    <CheckBox
                      color="#3d9acc"
                      checked={this.state.huruHara}
                      onPress={() =>
                        this.setState({
                          huruHara: !this.state.huruHara,
                        })
                      }
                    />
                    <Body style={{marginLeft: 5}}>
                      <Text>Huru-hara dan Kerusuhan (SRCC)</Text>
                    </Body>
                  </ListItem>
                  <ListItem>
                    <CheckBox
                      color="#3d9acc"
                      checked={this.state.terorisme}
                      onPress={() =>
                        this.setState({
                          terorisme: !this.state.terorisme,
                        })
                      }
                    />
                    <Body style={{marginLeft: 5}}>
                      <Text>Terorisme dan Sabotase</Text>
                    </Body>
                  </ListItem>

                  {(this.state.jenisAsuransiKendaraanSesKeb ==
                    'ASTRI ASGARD (AUTOSHIELD ALLRISK ON DEMAND)' ||
                    this.state.jenisAsuransiKendaraan ==
                      'ASTRI AUTOSHIELD ON DEMAND SHARIA') && (
                    <ListItem>
                      <CheckBox
                        color="#3d9acc"
                        checked={this.state.authorized_workshop}
                        onPress={() =>
                          this.setState({
                            authorized_workshop: !this.state
                              .authorized_workshop,
                          })
                        }
                      />
                      <Body style={{marginLeft: 5}}>
                        <Text>Authorized Workshop</Text>
                      </Body>
                    </ListItem>
                  )}
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
                    shadowOffset: {width: 0, height: 0.8},
                    shadowOpacity: 0.5,
                    elevation: 2,
                  }}>
                  <Picker
                    style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                    textStyle={{
                      fontSize: moderateScale(14),
                      flexDirection: 'column',
                      flex: 1,
                      paddingLeft: Platform.OS == 'ios' ? 0 : moderateScale(5),
                      paddingTop: Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                      paddingBottom:
                        Platform.OS == 'ios' ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    }}
                    itemTextStyle={{fontSize: moderateScale(16)}}
                    mode="dropdown"
                    placeholder="- Pilih -"
                    iosIcon={
                      <Icon
                        type="feather"
                        name="arrow-down-circle"
                        containerStyle={{
                          marginRight: moderateScale(3),
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
                Tanggal Dimulainya Asuransi :{' '}
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
                Objek Kendaraan yang dipertanggungkan :{' '}
              </Text>
              <View style={styles.vpicker}>
                <Picker
                  style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    flexDirection: 'column',
                    flex: 1,
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
                      containerStyle={{
                        marginRight: moderateScale(13),
                      }}
                    />
                  }
                  selectedValue={this.state.objekKendaraan}
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
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    flex: 1,
                    paddingStart: 16,
                    fontSize: 14,
                    marginBottom: 2,
                    marginTop: 10,
                    fontFamily: 'HKGrotesk-Regular',
                    fontWeight: 'bold',
                  }}>
                  Plat No Kendaraan :
                </Text>
                <Text style={{flex: 1, marginTop: 10}}>
                  (kode wilayah saja)
                </Text>
              </View>

              <TextInput
                maxLength={2}
                style={styles.inputs}
                placeholder="Plat No Kendaraan"
                value={this.state.platNo}
                onChangeText={platNo => this.onValuePlatNo(platNo)}
                onSubmitEditing={() => this.endSubmit(this.state.platNo)}
                onBlur={platNo => this.endSubmit(this.state.platNo)}
              />
              <Text style={styles.titleInput}>Kode Wilayah : </Text>
              {/* <View style={styles.vpicker}>
                {!this.state.isVehicleCode && (
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                  </View>
                )}
                <Picker
                  style={styles.picker}
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  selectedValue={this.state.kodeWilayah}
                  onValueChange={value => this.setState({kodeWilayah: value})}>
                  {this.state.valueVehicleCode.map((data, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={data.deskripsi}
                        value={data.deskripsi}
                        textStyle={{fontSize: 40}}
                      />
                    );
                  })}
                </Picker>
              </View> */}
              <TextInput
                editable={false}
                keyboardType="default"
                style={styles.inputs}
                placeholder="Kode Wilayah Kendaraan"
                value={this.state.kodeWilayah}
                onChangeText={value => this.setState({kodeWilayah: value})}
              />
              <Text style={styles.titleInput}>
                Tahun Pembuatan Kendaraan :{' '}
              </Text>
              <View style={styles.vpicker}>
                <Picker
                  style={Platform.OS == 'ios' ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    flexDirection: 'column',
                    flex: 1,
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
                      containerStyle={{
                        marginRight: moderateScale(13),
                      }}
                    />
                  }
                  selectedValue={this.state.tahunPembuatan}
                  onValueChange={value =>
                    this.setState({tahunPembuatan: value})
                  }>
                  {this.state.valueYears.map((data, key) => {
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

              {/* <TextInput
                maxLength={4}
                keyboardType="numeric"
                style={styles.inputs}
                placeholder="Tahun Pembuatan Kendaraan"
                value={this.state.tahunPembuatan}
                onChangeText={tahunPembuatan =>
                  this.onValueYear(tahunPembuatan)
                }
              /> */}
              <Text style={styles.titleInput}>
                Nilai Pertanggungan Kendaraan :{' '}
              </Text>

              <TextInput
                keyboardType="numeric"
                style={{
                  width: '100%',
                  marginBottom: 7,
                  marginTop: 3,
                  color: 'black',
                  paddingTop: '3%',
                  paddingBottom: '3%',
                  paddingLeft: '5%',
                  paddingRight: '5%',
                  borderRadius: 9,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 0.8},
                  shadowOpacity: 0.5,
                  elevation: 2,
                }}
                placeholder="Nilai Kendaraan"
                value={this.state.nilaiKendaraan}
                onChangeText={nilaiKendaraan =>
                  this.onValueNilaiKendaraan(nilaiKendaraan)
                }
              />

              <TextInput
                keyboardType="numeric"
                style={{
                  width: '100%',
                  marginBottom: 10,
                  marginTop: 2,
                  color: 'black',
                  paddingTop: '3%',
                  paddingBottom: '3%',
                  paddingLeft: '5%',
                  paddingRight: '5%',
                  borderRadius: 9,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 0.8},
                  shadowOpacity: 0.5,
                  elevation: 2,
                }}
                placeholder="Nilai Peralatan Tambahan"
                value={this.state.nilaiPeralatanTambahan}
                onChangeText={nilaiTambahan =>
                  this.onValueNilaiTambahan(nilaiTambahan)
                }
              />

              <TextInput
                editable={false}
                style={styles.inputs}
                placeholder="Total Nilai Pertanggungan"
                value={this.state.totalNilaiPertanggungan}
              />

              {(this.state.jenisAsuransiKendaraanSesKeb ==
                'ASTRI ASTON (AUTOSHIELD TLO ON DEMAND)' ||
                this.state.jenisAsuransiKendaraanSesKeb ==
                  'ASTRI ASGARD (AUTOSHIELD ALLRISK ON DEMAND)' ||
                this.state.jenisAsuransiKendaraan ==
                  'ASTRI AUTOSHIELD ON DEMAND SHARIA') && (
                <View>
                  <Text style={styles.titleInput}>
                    Nilai Jaminan Perluasan :{' '}
                  </Text>

                  {this.state.kecDiriPengemudi == true && (
                    <TextInput
                      keyboardType="numeric"
                      style={{
                        width: '100%',
                        marginBottom: 7,
                        marginTop: 3,
                        color: 'black',
                        paddingTop: '3%',
                        paddingBottom: '3%',
                        paddingLeft: '5%',
                        paddingRight: '5%',
                        borderRadius: 9,
                        backgroundColor: '#fff',
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 0.8},
                        shadowOpacity: 0.5,
                        elevation: 2,
                      }}
                      placeholder="Kecelakaan diri untuk pengemudi"
                      value={this.state.accident_for_driver_value}
                      onChangeText={value => this.onValueAccidentDriver(value)}
                    />
                  )}
                  {this.state.kecDiriPenumpang == true && (
                    <TextInput
                      keyboardType="numeric"
                      style={{
                        width: '100%',
                        marginBottom: 7,
                        marginTop: 3,
                        color: 'black',
                        paddingTop: '3%',
                        paddingBottom: '3%',
                        paddingLeft: '5%',
                        paddingRight: '5%',
                        borderRadius: 9,
                        backgroundColor: '#fff',
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 0.8},
                        shadowOpacity: 0.5,
                        elevation: 2,
                      }}
                      placeholder="Kecelakaan diri Untuk Penumpang Max 4 Orang"
                      value={this.state.accident_for_passenger_value}
                      onChangeText={nilaiKendaraan =>
                        this.onValueAccidentPassenger(nilaiKendaraan)
                      }
                    />
                  )}

                  {this.state.tanggungjwbbHuk3 == true && (
                    <TextInput
                      keyboardType="numeric"
                      style={{
                        width: '100%',
                        marginBottom: 7,
                        marginTop: 3,
                        color: 'black',
                        paddingTop: '3%',
                        paddingBottom: '3%',
                        paddingLeft: '5%',
                        paddingRight: '5%',
                        borderRadius: 9,
                        backgroundColor: '#fff',
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 0.8},
                        shadowOpacity: 0.5,
                        elevation: 2,
                      }}
                      placeholder="Tanggung Jawab Hukum Pihak Ke-3"
                      value={this.state.legal_liability_third_party_value}
                      onChangeText={nilaiKendaraan =>
                        this.onValueLegalThirdParty(nilaiKendaraan)
                      }
                    />
                  )}
                  {this.state.tanggungjwbHukPenumpang == true && (
                    <TextInput
                      keyboardType="numeric"
                      style={{
                        width: '100%',
                        marginBottom: 7,
                        marginTop: 3,
                        color: 'black',
                        paddingTop: '3%',
                        paddingBottom: '3%',
                        paddingLeft: '5%',
                        paddingRight: '5%',
                        borderRadius: 9,
                        backgroundColor: '#fff',
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 0.8},
                        shadowOpacity: 0.5,
                        elevation: 2,
                      }}
                      placeholder="Tanggung Jawab hukum Terhadap Penumpang"
                      value={this.state.legal_liability_for_passengers_value}
                      onChangeText={nilaiKendaraan =>
                        this.onValueLegalPassenger(nilaiKendaraan)
                      }
                    />
                  )}
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
                  <Text style={styles.textBtn}>Hitung Premi</Text>
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
export default BsSimulasiKendaraan;
