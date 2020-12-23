import React, { Component } from "react";
import { NavigationEvents } from "react-navigation";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";
import moment from "moment";
import NumberFormat from "react-number-format";
import RBSheet from "react-native-raw-bottom-sheet";
import { getValue } from "./../../../../Modules/LocalData";
import { getDataWithHeader } from "./../../../../Services";
import Api from "../../../../Utils/Api";
import ApiEndPoint from "./../../../../Modules/Utils/ApiEndPoint";
import { moderateScale } from "../../../../Utils/Scale";

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
} from "react-native";
import { Picker } from "native-base";

let id = "";
let tok = "";
let data_tripa_user = "";
const dataUser = () => {
  getValue("userData").then((response) => {
    if (response != null) {
      id = response.data.id;
      tok = response.access_token;
      getDataWithHeader(
        ApiEndPoint.base_url + "/users/" + response.data.id + "/tripa",
        response.access_token
      ).then((res) => {
        if (res.success) {
          data_tripa_user = res.data.tripaUser;
        } else {
        }
      });
    }
  });
};

class BsPengajuanPKendaraan2 extends Component {
  constructor(props) {
    super(props);
    this.dataForm1 = {};
    dataUser();
    this.state = {
      dataMessage: [],
      jenisAsuransiKendaraan: "",
      modelSeriKendaraan: "",
      typeKendaraan: "",
      kodeWilayah: "",
      platNo: "",
      noMesin: "",
      noRangka: "",
      tahunPembuatan: "",
      nilaiKendaraan: 0,
      nilaiPeralatanTambahan: "0",
      totalNilaiPertanggungan: 0,
      kodeKendaraan: "",
      provinsi: "",

      accident_for_driver_value: 0,
      accident_for_passenger_value: 0,
      legal_liability_third_party_value: 0,
      legal_liability_for_passengers_value: 0,

      notif: 0,
      checkJailStatus: "",
      modalVisible: false,
      isDatePickerVisible: false,
      isFormValid: false,
      isAccordingToNeed: false,
      isVehicleCode: false,

      title: "",

      valueMonth: [
        { id: "0", nama: "- Pilih -" },
        { id: "1", nama: "1" },
        { id: "2", nama: "2" },
        { id: "3", nama: "3" },
        { id: "4", nama: "4" },
        { id: "5", nama: "5" },
        { id: "6", nama: "6" },
        { id: "7", nama: "7" },
        { id: "8", nama: "8" },
        { id: "9", nama: "9" },
        { id: "10", nama: "10" },
        { id: "11", nama: "11" },
        { id: "12", nama: "12" },
      ],
      valueTypeKendaraan: [
        { id: "0", nama: "- Pilih -" },
        { id: "1", nama: "Sedan" },
        { id: "2", nama: "MPV" },
        { id: "3", nama: "Minibus" },
        { id: "4", nama: "SUV" },
        { id: "5", nama: "Jeep" },
        { id: "6", nama: "City Car" },
      ],
      valueNamaPemilik: [
        { id: "0", nama: "- Pilih -" },
        { id: "Atas Nama Sendiri", nama: "Atas Nama Sendiri" },
        { id: "Nama Pada STNK Kendaraan", nama: "Nama Pada STNK Kendaraan" },
      ],
      valueOkupasi: [
        { id: "0", nama: "- Pilih -" },

        { id: "15", nama: "Audi" },
        { id: "11", nama: "BMW" },
        { id: "21", nama: "Chevrolet" },
        { id: "19", nama: "Daihatsu" },
        { id: "12", nama: "Datsun" },
        { id: "6", nama: "DVSK" },
        { id: "17", nama: "Fiat" },
        { id: "3", nama: "Ford" },
        { id: "9", nama: "Honda" },
        { id: "25", nama: "Hummer" },
        { id: "5", nama: "Hyundai" },
        { id: "16", nama: "Jeep" },
        { id: "14", nama: "KIA" },
        { id: "13", nama: "Lexus" },
        { id: "2", nama: "Mitsubishi" },
        { id: "22", nama: "Mazda" },
        { id: "10", nama: "Nissan" },
        { id: "7", nama: "Peugeot" },
        { id: "8", nama: "Range Rover" },
        { id: "24", nama: "Renault" },
        { id: "18", nama: "Suzuki" },
        { id: "1", nama: "Toyota" },
        { id: "20", nama: "Volvo" },
        { id: "4", nama: "VW" },
        { id: "23", nama: "Wuling" },
      ],
      valuekodeWilayah: [
        { id: "0", nama: "- Pilih -" },
        { id: "WILAYAH1", nama: "Wilayah I (Sumatera dan Kepulauannya)" },
        { id: "WILAYAH2", nama: "Wilayah II (Jakarta, Banten, Jabar)" },
        { id: "WILAYAH3", nama: "Wilayah III (Selain Wilayah I dan 2)" },
      ],
      valueYears: [],
      valueVehicleCode: [],
    };
  }
  componentDidMount() {
    this.props.onKendaraan2(this);
    // SoftInputMode.set(SoftInputMode.ADJUST_PAN);
  }
  componentWillUnmount() {
    this.props.onKendaraan2(undefined);
  }

  async setModalVisible(data, title) {
    this.RBSheet.open();

    if (title == "Asuransi Kendaraan Syariah") {
      this.setState({ modalVisible: true, title });
    }
    if (data != null || data != undefined) {
      this.dataForm1 = data;
    }

    var years = moment().format("YYYY") - 5;
    var arr = [{ nama: "- Pilih -" }];
    for (var i = 0; i < 6; i++) {
      const obj = { nama: years.toString() };
      arr.push(obj);
      years++;
    }
    this.setState({ valueYears: arr });

    // this.getVehicleCode();
  }
  showDatePicker = () => {
    this.setState({ isDatePickerVisible: true });
  };
  async nextForm() {
    await this.validationsForm();
    if (this.state.isFormValid == true) {
      console.log("nextForm", this.dataForm1.referal_code);
      if (
        this.dataForm1.insurance_type ==
        "ASTRI ASTON (AUTOSHIELD TLO ON DEMAND)"
      ) {
        var formPKendaraan = {
          kode_referal: this.dataForm1.referal_code,
          insurance_type: this.dataForm1.insurance_type,
          name: this.dataForm1.name,

          accident_for_driver: this.dataForm1.accident_for_driver,
          accident_for_passenger: this.dataForm1.accident_for_passenger,
          legal_liability_third_party: this.dataForm1
            .legal_liability_third_party,
          legal_liability_for_passengers: this.dataForm1
            .legal_liability_for_passengers,
          floods_include_typhons: this.dataForm1.floods_include_typhons,
          earthquake_tsunami: this.dataForm1.earthquake_tsunami,
          riot_and_damage: this.dataForm1.riot_and_damage,
          terrorism_and_sabotage: this.dataForm1.terrorism_and_sabotage,

          month_period: this.dataForm1.month_period,
          start_insurance_period: this.dataForm1.start_insurance_period,
          brand: this.dataForm1.brand,
          model: this.state.modelSeriKendaraan,
          vehicle_type: this.state.typeKendaraan,
          vehicle_region_code: this.state.kodeWilayah,
          vehicle_number: this.state.platNo,
          machine_number: this.state.noMesin,
          frame_number: this.state.noRangka,
          build_year: this.state.tahunPembuatan,
          vehicle_value: this.state.nilaiKendaraan.replace(/,.*|[^0-9]/g, ""),
          additional_vehicle_value: this.state.nilaiPeralatanTambahan.replace(
            /,.*|[^0-9]/g,
            ""
          ),
          added_value_tools: this.state.totalNilaiPertanggungan.replace(
            /,.*|[^0-9]/g,
            ""
          ),

          accident_for_driver_value: this.state.accident_for_driver_value
            .toString()
            .replace(/,.*|[^0-9]/g, ""),
          accident_for_passengers_value: this.state.accident_for_passenger_value
            .toString()
            .replace(/,.*|[^0-9]/g, ""),
          legal_liability_third_party_value: this.state.legal_liability_third_party_value
            .toString()
            .replace(/,.*|[^0-9]/g, ""),
          legal_liability_for_passengers_value: this.state.legal_liability_for_passengers_value
            .toString()
            .replace(/,.*|[^0-9]/g, ""),
        };
      } else if (
        this.dataForm1.insurance_type ==
          "ASTRI ASGARD (AUTOSHIELD ALLRISK ON DEMAND)" ||
        this.dataForm1.insurance_type == "ASTRI AUTOSHIELD ON DEMAND SHARIA"
      ) {
        var formPKendaraan = {
          kode_referal: this.dataForm1.referal_code,
          insurance_type: this.dataForm1.insurance_type,
          name: this.dataForm1.name,

          accident_for_driver: this.dataForm1.accident_for_driver,
          accident_for_passenger: this.dataForm1.accident_for_passenger,
          legal_liability_third_party: this.dataForm1
            .legal_liability_third_party,
          legal_liability_for_passengers: this.dataForm1
            .legal_liability_for_passengers,
          floods_include_typhons: this.dataForm1.floods_include_typhons,
          earthquake_tsunami: this.dataForm1.earthquake_tsunami,
          riot_and_damage: this.dataForm1.riot_and_damage,
          terrorism_and_sabotage: this.dataForm1.terrorism_and_sabotage,
          authorized_workshop: this.dataForm1.authorized_workshop,

          month_period: this.dataForm1.month_period,
          start_insurance_period: this.dataForm1.start_insurance_period,
          brand: this.dataForm1.brand,
          model: this.state.modelSeriKendaraan,
          vehicle_type: this.state.typeKendaraan,
          vehicle_region_code: this.state.kodeWilayah,
          vehicle_number: this.state.platNo,
          machine_number: this.state.noMesin,
          frame_number: this.state.noRangka,
          build_year: this.state.tahunPembuatan,
          vehicle_value: this.state.nilaiKendaraan.replace(/,.*|[^0-9]/g, ""),
          additional_vehicle_value: this.state.nilaiPeralatanTambahan.replace(
            /,.*|[^0-9]/g,
            ""
          ),
          added_value_tools: this.state.totalNilaiPertanggungan.replace(
            /,.*|[^0-9]/g,
            ""
          ),

          accident_for_driver_value: this.state.accident_for_driver_value
            .toString()
            .replace(/,.*|[^0-9]/g, ""),
          accident_for_passengers_value: this.state.accident_for_passenger_value
            .toString()
            .replace(/,.*|[^0-9]/g, ""),
          legal_liability_third_party_value: this.state.legal_liability_third_party_value
            .toString()
            .replace(/,.*|[^0-9]/g, ""),
          legal_liability_for_passengers_value: this.state.legal_liability_for_passengers_value
            .toString()
            .replace(/,.*|[^0-9]/g, ""),
        };
      } else {
        var formPKendaraan = {
          kode_referal: this.dataForm1.referal_code,
          insurance_type: this.dataForm1.insurance_type,
          name: this.dataForm1.name,

          accident_for_driver: this.dataForm1.accident_for_driver,
          accident_for_passenger: this.dataForm1.accident_for_passenger,
          legal_liability_third_party: this.dataForm1
            .legal_liability_third_party,
          legal_liability_for_passengers: this.dataForm1
            .legal_liability_for_passengers,
          floods_include_typhons: this.dataForm1.floods_include_typhons,
          earthquake_tsunami: this.dataForm1.earthquake_tsunami,
          riot_and_damage: this.dataForm1.riot_and_damage,
          terrorism_and_sabotage: this.dataForm1.terrorism_and_sabotage,

          month_period: this.dataForm1.month_period,
          start_insurance_period: this.dataForm1.start_insurance_period,
          brand: this.dataForm1.brand,
          model: this.state.modelSeriKendaraan,
          vehicle_type: this.state.typeKendaraan,
          vehicle_region_code: this.state.kodeWilayah,
          vehicle_number: this.state.platNo,
          machine_number: this.state.noMesin,
          frame_number: this.state.noRangka,
          build_year: this.state.tahunPembuatan,
          vehicle_value: this.state.nilaiKendaraan.replace(/,.*|[^0-9]/g, ""),
          additional_vehicle_value: this.state.nilaiPeralatanTambahan.replace(
            /,.*|[^0-9]/g,
            ""
          ),
          added_value_tools: this.state.totalNilaiPertanggungan.replace(
            /,.*|[^0-9]/g,
            ""
          ),

          accident_for_driver_value: 0,
          accident_for_passengers_value: 0,
          legal_liability_third_party_value: 0,
          legal_liability_for_passengers_value: 0,
        };
      }
      this.props.sendToChat(JSON.stringify(formPKendaraan));
      this.resetField();
      this.RBSheet.close();
    }

    // this.props.showPolis2(true);
  }
  batal() {
    this.setState({ modalVisible: false });
    // this.resetField();
    // this.props.messageCancel('batal');
    this.RBSheet.close();
    setTimeout(() => {
      this.props.backToVehicle();
    }, 500);
    // this.props.messageCancel('batal');
  }
  async getVehicleCode() {
    await getDataWithHeader(
      Api.base_url2 + "tripa/" + id + "/get-vehicle-region-code",
      tok
    )
      .then((res) => {
        if (res.success != false) {
          this.setState({ valueVehicleCode: res.data });
          this.setState({ isVehicleCode: true });
        } else {
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  resetField() {
    this.setState({
      jenisAsuransiKendaraan: "",
      modelSeriKendaraan: "",
      typeKendaraan: "",
      kodeWilayah: "",
      platNo: "",
      noMesin: "",
      noRangka: "",
      tahunPembuatan: "",
      nilaiKendaraan: 0,
      nilaiPeralatanTambahan: "0",
      totalNilaiPertanggungan: 0,
      kodeKendaraan: "",
      provinsi: "",

      accident_for_driver_value: 0,
      accident_for_passenger_value: 0,
      legal_liability_third_party_value: 0,
      legal_liability_for_passengers_value: 0,

      notif: 0,
      checkJailStatus: "",
      modalVisible: false,
      isDatePickerVisible: false,
      isFormValid: false,
      isAccordingToNeed: false,
      isVehicleCode: false,
    });
  }
  customAlert(t, m) {
    Alert.alert(
      t,
      m,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );
  }
  validationsForm() {
    var date = moment().format("YYYY");
    if (
      this.state.modelSeriKendaraan == "" ||
      this.state.modelSeriKendaraan == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Model / Seri Kendaraan");
    } else if (
      this.state.typeKendaraan == "" ||
      this.state.typeKendaraan == "- Pilih -" ||
      this.state.typeKendaraan == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Type Kendaraan");
    } else if (
      this.state.kodeWilayah == "" ||
      this.state.kodeWilayah == "- Pilih -" ||
      this.state.kodeWilayah == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Kode Wilayah Kendaraan");
    } else if (this.state.platNo == "" || this.state.platNo == null) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Plat No Kendaraan");
    } else if (
      /^[A-Z]{1,2} ?- ?\d{1,4} ?- ?[A-Z]{1,3}$/.test(this.state.platNo) != true
    ) {
      this.setState({ isFormValid: false });
      this.customAlert(
        "Perhatian",
        "Harap isi plat nomor sesuai format\n(contoh: B-1234-AA)"
      );
    } else if (this.state.noMesin == "" || this.state.noMesin == null) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi No Mesin Kendaraan");
    } else if (this.state.noRangka == "" || this.state.noRangka == null) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi No rangka Kendaraan");
    } else if (
      this.state.tahunPembuatan == "" ||
      this.state.tahunPembuatan == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Tahun Pembuatan Kendaraan");
    } else if (this.state.tahunPembuatan < date - 5) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Maksimal usia kendaraan 5 tahun");
    } else if (
      this.state.nilaiKendaraan == "" ||
      this.state.nilaiKendaraan == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Nilai Kendaraan");
    } else if (
      this.state.nilaiPeralatanTambahan == "" ||
      this.state.nilaiPeralatanTambahan == null
    ) {
      this.setState({ isFormValid: false, nilaiPeralatanTambahan: 0 });
      // this.customAlert('Perhatian', 'Harap Isi Nilai Perlatan Tambahan');
    } else if (
      this.dataForm1.accident_for_driver == "true" &&
      (this.state.accident_for_driver_value == "" ||
        this.state.accident_for_driver_value == null)
    ) {
      this.setState({ isFormValid: false });
      this.customAlert(
        "Perhatian",
        "Harap isi nilai kecelakaan diri untuk pengemudi"
      );
    } else if (
      this.dataForm1.accident_for_passenger == "true" &&
      (this.state.accident_for_passenger_value == "" ||
        this.state.accident_for_passenger_value == null)
    ) {
      this.setState({ isFormValid: false });
      this.customAlert(
        "Perhatian",
        "Harap isi nilai kecelakaan diri untuk penumpang max 4 orang"
      );
    } else if (
      this.dataForm1.legal_liability_third_party == "true" &&
      (this.state.legal_liability_third_party_value == "" ||
        this.state.legal_liability_third_party_value == null)
    ) {
      this.setState({ isFormValid: false });
      this.customAlert(
        "Perhatian",
        "Harap isi nilai tanggung jawab hukum pihak ke-3"
      );
    } else if (
      this.dataForm1.legal_liability_third_party == "true" &&
      (this.dataForm1.insurance_type ==
        "ASTRI ASTON (AUTOSHIELD TLO ON DEMAND)" ||
        this.dataForm1.insurance_type ==
          "ASTRI ASGARD (AUTOSHIELD ALLRISK ON DEMAND)" ||
        this.dataForm1.insurance_type == "ASTRI AUTOSHIELD ON DEMAND SHARIA") &&
      parseInt(
        this.state.legal_liability_third_party_value.replace(/,.*|[^0-9]/g, ""),
        10
      ) > 25000000
    ) {
      this.setState({ isFormValid: false });
      this.customAlert(
        "Perhatian",
        "Nilai tanggung jawab hukum pihak ke-3 Maksimal 25.000.000"
      );
    } else if (
      this.dataForm1.legal_liability_for_passengers == "true" &&
      (this.state.legal_liability_for_passengers_value == "" ||
        this.state.legal_liability_for_passengers_value == null)
    ) {
      this.setState({ isFormValid: false });
      this.customAlert(
        "Perhatian",
        "Harap isi nilai tanggung jawab hukum terhadap penumpang"
      );
    } else {
      this.setState({ isFormValid: true });
    }
  }
  handleConfirm = (date) => {
    var dt = moment(date).format("YYYY/MM/DD");
    this.setState({ isDatePickerVisible: false });
    this.setState({ dimulaiPeriode: dt });
  };
  onValuePeriodePertanggungan = (value) => {
    this.setState({ periodePertanggungan: value });
  };
  onValueJenisAuransi = (value) => {
    this.setState({ jenisAsuransiKebakaran: value });
  };
  onValuePemilikObjek = (value) => {
    this.setState({ pemilikObjPertanggunan: value });
  };
  onValueObjekOkupasi = (value) => {
    this.setState({ objekOkupasi: value });
  };
  async onValueNilaiKendaraan(value) {
    if (value == null || value == "") {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ""), 10);
    } catch {}
    // console.log('format money', this.convertToRupiah(value));
    await this.setState({ nilaiKendaraan: this.convertToRupiah(aa) });

    var nilaiken = this.state.nilaiKendaraan;
    var nilatam = this.state.nilaiPeralatanTambahan;
    try {
      var kendaraan = parseInt(nilaiken.replace(/,.*|[^0-9]/g, ""), 10);
      var tambahan = parseInt(nilatam.replace(/,.*|[^0-9]/g, ""), 10);
    } catch {}

    var a = parseFloat(kendaraan == undefined ? 0 : kendaraan);
    var b = parseFloat(tambahan == undefined ? 0 : tambahan);
    var c = a + b;

    this.setState({
      totalNilaiPertanggungan: this.convertToRupiah(c.toString()),
    });
  }

  async onValueNilaiTambahan(value) {
    if (value == null || value == "") {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ""), 10);
    } catch {}
    await this.setState({ nilaiPeralatanTambahan: this.convertToRupiah(aa) });
    var nilaiken = this.state.nilaiKendaraan;
    var nilatam = this.state.nilaiPeralatanTambahan;
    try {
      var kendaraan = parseInt(nilaiken.replace(/,.*|[^0-9]/g, ""), 10);
      var tambahan = parseInt(nilatam.replace(/,.*|[^0-9]/g, ""), 10);
    } catch {}

    // console.log('onValueNilaiTambahan ', kendaraan + ' ' + tambahan);

    var a = parseFloat(kendaraan == undefined ? 0 : kendaraan);
    var b = parseFloat(tambahan == undefined ? 0 : tambahan);
    var c = a + b;

    this.setState({
      totalNilaiPertanggungan: this.convertToRupiah(c.toString()),
    });
  }

  convertToRupiah(angka) {
    try {
      var rupiah = "";
      var angkarev = angka.toString().split("").reverse().join("");
      for (var i = 0; i < angkarev.length; i++)
        if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + ".";
      return rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("");
    } catch {}
  }

  async onValueAccidentDriver(value) {
    if (value == null || value == "") {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ""), 10);
    } catch {}
    await this.setState({
      accident_for_driver_value: this.convertToRupiah(aa),
    });
  }

  onValueMachineNo(value) {
    var data = value.toUpperCase();
    this.setState({
      noMesin: data,
    });
  }
  onValueCassisNo(value) {
    var data = value.toUpperCase();
    this.setState({
      noRangka: data,
    });
  }

  onValueMachineNo(value) {
    var data = value.toUpperCase();
    this.setState({
      noMesin: data,
    });
  }

  async onValueAccidentPassenger(value) {
    if (value == null || value == "") {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ""), 10);
    } catch {}
    await this.setState({
      accident_for_passenger_value: this.convertToRupiah(aa),
    });
  }

  async onValueLegalThirdParty(value) {
    if (value == null || value == "") {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ""), 10);
    } catch {}

    await this.setState({
      legal_liability_third_party_value: this.convertToRupiah(aa),
    });
  }
  async onValueLegalPassenger(value) {
    if (value == null || value == "") {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ""), 10);
    } catch {}
    await this.setState({
      legal_liability_for_passengers_value: this.convertToRupiah(aa),
    });
  }

  onValueYear(value) {
    var date = moment().format("YYYY");

    this.setState({ tahunPembuatan: value });
  }
  endSubmit(value) {
    var valid1 = /^[A-Z]{1,2} ?- ?\d{1,4} ?- ?[A-Z]{1,3}$/.test(value);
    if (Platform.OS == "ios") {
    } else {
      if (valid1 == false) {
        this.customAlert(
          "Perhatian",
          "Harap isi plat nomor sesuai format\n(contoh: B-1234-AA)"
        );
        this.platNoInput.focus();
      }
    }
  }
  onValuePlatNo(value) {
    var v = value.toUpperCase();
    var platno = v.replace(/ /g, "-");
    // platno = /^[A-Z]{2} ?- ?\d{4} ?- ?[A-Z]{2}$/.test(value);

    this.setState({ platNo: platno });

    //get 1 or 2 caracter to hit api
    var data = value.toUpperCase();
    var res = data.charAt(0);
    var car = this.isLetter(res);
    var res2 = data.charAt(1);
    var car2 = this.isLetter(res2);

    if (value.length == 1 && car != null) {
      this.getKodeKendaraan(res);
    } else if (car != null && car2 != null && value.length > 4) {
      this.getKodeKendaraan(res + "" + res2);
    } else if (car != null && value.length > 4) {
      this.getKodeKendaraan(res);
    } else if (car == null) {
      this.customAlert("Perhatian", "Harap isi plat nomor dengan sesuai");
    }
  }

  isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

  async getKodeKendaraan(data) {
    await getDataWithHeader(
      Api.base_url2 + "tripa/" + id + "/get-province-code/" + data,
      tok
    )
      .then((res) => {
        if (res.success != false) {
          this.setState({
            kodeKendaraan: res.data[0].kode,
            provinsi: res.data[0].deskripsi,
          });
          // this.setState({isVehicleCode: true});
        } else {
        }
      })
      .catch((err) => {
        console.log(err.response);
      });

    await getDataWithHeader(
      Api.base_url2 +
        "tripa/" +
        id +
        "/get-wilayah/" +
        this.state.kodeKendaraan,
      tok
    )
      .then((res) => {
        if (res.success != false) {
          this.setState({
            kodeWilayah: res.data[0].kode,
          });
          // this.setState({isVehicleCode: true});
        } else {
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  render() {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheet = ref;
        }}
        height={(Dimensions.get("window").height * 7) / 8}
        closeOnPressMask={false}
        closeOnPressBack={false}
        duration={250}
        customStyles={{
          container: {
            flex: 10,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignContent: "center",
          },
        }}
      >
        <View style={styles.contentbottomSheet}>
          <View
            style={
              this.state.title == ""
                ? styles.bgTitleForm
                : styles.bgTitleFormSyariah
            }
          >
            <Text style={styles.titleForm}>
              {this.state.title == ""
                ? " Form Pengajuan Polis Kendaraan"
                : "Asuransi Kendaraan Syariah"}
            </Text>
          </View>
          <ScrollView>
            <View
              style={{
                marginHorizontal: 10,
                marginBottom: 20,
                flex: 1,
                paddingHorizontal: 5,
              }}
            >
              <Text style={styles.titleInput}>Model dan seri Kendaraan : </Text>

              <TextInput
                style={styles.inputs}
                placeholder="Model dan seri  Kendaraan"
                value={this.state.modelSeriKendaraan}
                onChangeText={(modelSeriKendaraan) =>
                  this.setState({ modelSeriKendaraan })
                }
              />

              <Text style={styles.titleInput}>Tipe Kendaraan : </Text>
              <View style={styles.vpicker}>
                <Picker
                  style={Platform.OS == "ios" ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == "ios" ? moderateScale(7) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == "ios" ? moderateScale(7) : 0, //ini agar text ada di tengah (agus)
                  }}
                  itemTextStyle={{ fontSize: moderateScale(16) }}
                  mode="dropdown"
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{ marginRight: moderateScale(13) }}
                    />
                  } //ini styling icon nya agar tidak mentok di pinggir //agus
                  placeholder="- Pilih -"
                  selectedValue={this.state.typeKendaraan}
                  onValueChange={(value) =>
                    this.setState({ typeKendaraan: value })
                  }
                >
                  {this.state.valueTypeKendaraan.map((data, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={data.nama}
                        value={data.nama}
                        textStyle={{ fontSize: 12 }}
                      />
                    );
                  })}
                </Picker>
              </View>

              <Text style={styles.titleInput}>Plat No Kendaraan : </Text>

              <TextInput
                ref={(input) => {
                  this.platNoInput = input;
                }}
                maxLength={11}
                style={styles.inputs}
                placeholder="Plat No Kendaraan"
                value={this.state.platNo}
                onChangeText={(platNo) => this.onValuePlatNo(platNo)}
                onSubmitEditing={() => this.endSubmit(this.state.platNo)}
                onBlur={(platNo) => this.endSubmit(this.state.platNo)}
              />

              <Text style={styles.titleInput}>Kode Wilayah Kendaraan: </Text>

              <TextInput
                editable={false}
                keyboardType="ascii-capable"
                style={styles.inputs}
                placeholder="Kode Wilayah Kendaraan"
                value={this.state.kodeWilayah}
                onChangeText={(value) => this.setState({ kodeWilayah: value })}
              />

              <Text style={styles.titleInput}>No Mesin Kendaraan : </Text>

              <TextInput
                style={styles.inputs}
                placeholder="No Mesin Kendaraan"
                value={this.state.noMesin}
                onChangeText={(noMesin) => this.onValueMachineNo(noMesin)}
              />
              <Text style={styles.titleInput}>No Rangka Kendaraan : </Text>

              <TextInput
                style={styles.inputs}
                placeholder="No Rangka Kendaraan"
                value={this.state.noRangka}
                onChangeText={(noRangka) => this.onValueCassisNo(noRangka)}
              />
              <Text style={styles.titleInput}>
                Tahun Pembuatan Kendaraan :{" "}
              </Text>
              <View style={styles.vpicker}>
                <Picker
                  style={Platform.OS == "ios" ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == "ios" ? moderateScale(7) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == "ios" ? moderateScale(7) : 0, //ini agar text ada di tengah (agus)
                  }}
                  itemTextStyle={{ fontSize: moderateScale(16) }}
                  mode="dropdown"
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{ marginRight: moderateScale(13) }}
                    />
                  } //ini styling icon nya agar tidak mentok di pinggir //agus
                  placeholder="- Pilih -"
                  selectedValue={this.state.tahunPembuatan}
                  onValueChange={(value) =>
                    this.setState({ tahunPembuatan: value })
                  }
                >
                  {this.state.valueYears.map((data, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={data.nama}
                        value={data.nama}
                        textStyle={{ fontSize: 40 }}
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
                Nilai Pertanggungan Kendaraan :{" "}
              </Text>

              <TextInput
                keyboardType="numeric"
                style={{
                  width: "100%",
                  marginBottom: 10,
                  marginTop: Platform.OS == "ios" ? 3 : 3,
                  paddingBottom: Platform.OS == "ios" ? "4%" : "3%",
                  color: "black",
                  paddingTop: "3%",
                  paddingLeft: "5%",
                  paddingRight: "5%",
                  borderRadius: 9,
                  backgroundColor: "#fff",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 0.8 },
                  shadowOpacity: 0.5,
                  elevation: 2,
                }}
                placeholder="Nilai Kendaraan"
                value={this.state.nilaiKendaraan}
                onChangeText={(nilaiKendaraan) =>
                  this.onValueNilaiKendaraan(nilaiKendaraan)
                }
              />

              <TextInput
                keyboardType="numeric"
                style={{
                  width: "100%",
                  marginBottom: 10,
                  marginTop: 2,
                  color: "black",
                  paddingTop: "3%",
                  paddingBottom: "4%",
                  paddingLeft: "5%",
                  paddingRight: "5%",
                  borderRadius: 9,
                  backgroundColor: "#fff",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 0.8 },
                  shadowOpacity: 0.5,
                  elevation: 2,
                }}
                placeholder="Nilai Peralatan Tambahan"
                value={this.state.nilaiPeralatanTambahan}
                onChangeText={(nilaiTambahan) =>
                  this.onValueNilaiTambahan(nilaiTambahan)
                }
              />

              <TextInput
                editable={false}
                style={styles.inputs}
                placeholder="Total Nilai Pertanggungan"
                value={this.state.totalNilaiPertanggungan}
              />
              {(this.dataForm1.insurance_type ==
                "ASTRI ASTON (AUTOSHIELD TLO ON DEMAND)" ||
                this.dataForm1.insurance_type ==
                  "ASTRI ASGARD (AUTOSHIELD ALLRISK ON DEMAND)" ||
                this.dataForm1.insurance_type ==
                  "ASTRI AUTOSHIELD ON DEMAND SHARIA") && (
                <View>
                  <Text style={styles.titleInput}>
                    Nilai Jaminan Perluasan :{" "}
                  </Text>
                  {this.dataForm1.accident_for_driver == "true" && (
                    <TextInput
                      keyboardType="numeric"
                      style={{
                        width: "100%",
                        marginBottom: 7,
                        marginTop: 3,
                        color: "black",
                        paddingTop: "3%",
                        paddingBottom: Platform.OS == "ios" ? "4%" : "3%",
                        paddingLeft: "5%",
                        paddingRight: "5%",
                        borderRadius: 9,
                        backgroundColor: "#fff",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 0.8 },
                        shadowOpacity: 0.5,
                        elevation: 2,
                      }}
                      placeholder="Kecelakaan diri untuk pengemudi"
                      value={this.state.accident_for_driver_value}
                      onChangeText={(value) =>
                        this.onValueAccidentDriver(value)
                      }
                    />
                  )}

                  {this.dataForm1.accident_for_passenger == "true" && (
                    <TextInput
                      keyboardType="numeric"
                      style={{
                        width: "100%",
                        marginBottom: 7,
                        marginTop: 3,
                        color: "black",
                        paddingTop: "3%",
                        paddingBottom: Platform.OS == "ios" ? "4%" : "3%",
                        paddingLeft: "5%",
                        paddingRight: "5%",
                        borderRadius: 9,
                        backgroundColor: "#fff",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 0.8 },
                        shadowOpacity: 0.5,
                        elevation: 2,
                      }}
                      placeholder="Kecelakaan diri Untuk Penumpang Max 4 Orang"
                      value={this.state.accident_for_passenger_value}
                      onChangeText={(nilaiKendaraan) =>
                        this.onValueAccidentPassenger(nilaiKendaraan)
                      }
                    />
                  )}

                  {this.dataForm1.legal_liability_third_party == "true" && (
                    <TextInput
                      keyboardType="numeric"
                      style={{
                        width: "100%",
                        marginBottom: 7,
                        marginTop: 3,
                        color: "black",
                        paddingTop: "3%",
                        paddingBottom: Platform.OS == "ios" ? "4%" : "3%",

                        paddingLeft: "5%",
                        paddingRight: "5%",
                        borderRadius: 9,
                        backgroundColor: "#fff",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 0.8 },
                        shadowOpacity: 0.5,
                        elevation: 2,
                      }}
                      placeholder="Tanggung Jawab Hukum Pihak Ke-3"
                      value={this.state.legal_liability_third_party_value}
                      onChangeText={(nilaiKendaraan) =>
                        this.onValueLegalThirdParty(nilaiKendaraan)
                      }
                    />
                  )}
                  {this.dataForm1.legal_liability_for_passengers == "true" && (
                    <TextInput
                      keyboardType="numeric"
                      style={{
                        width: "100%",
                        marginBottom: 7,
                        marginTop: 3,
                        color: "black",
                        paddingTop: "3%",
                        paddingBottom: Platform.OS == "ios" ? "4%" : "3%",
                        paddingLeft: "5%",
                        paddingRight: "5%",
                        borderRadius: 9,
                        backgroundColor: "#fff",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 0.8 },
                        shadowOpacity: 0.5,
                        elevation: 2,
                      }}
                      placeholder="Tanggung Jawab hukum Terhadap Penumpang"
                      value={this.state.legal_liability_for_passengers_value}
                      onChangeText={(nilaiKendaraan) =>
                        this.onValueLegalPassenger(nilaiKendaraan)
                      }
                    />
                  )}
                </View>
              )}

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => this.batal()}
                  style={
                    this.state.title == ""
                      ? styles.btnBatal
                      : styles.btnBatalSyariah
                  }
                >
                  <Text style={styles.textBtn}>Kembali</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.nextForm()}
                  style={
                    this.state.title == ""
                      ? styles.btnLanjut
                      : styles.btnLanjutSyariah
                  }
                >
                  <Text style={styles.textBtn}>Ajukan</Text>
                </TouchableOpacity>
              </View>
              {/* <DateTimePickerModal
        isVisible={this.state.isDatePickerVisible}
        mode="date"
        onConfirm={date => this.handleConfirm(date)}
        onCancel={this.hideDatePicker}
      /> */}
            </View>
          </ScrollView>
        </View>
      </RBSheet>
    );
  }
}
const styles = StyleSheet.create({
  titleInput: {
    paddingHorizontal:
      Platform.OS == "ios" ? moderateScale(16) : moderateScale(16),
    fontSize: 14,
    marginBottom: Platform.OS == "ios" ? moderateScale(5) : moderateScale(2),
    marginTop: 10,
    fontFamily: "HKGrotesk-Regular",
    fontWeight: "bold",
  },
  inputs: {
    color: "black",
    fontFamily: "HKGrotesk-Regular",
    fontSize: moderateScale(14),
    paddingTop: "3%",
    paddingBottom: "3%",
    paddingLeft: "5%",
    paddingRight: "5%",
    borderRadius: 9,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    elevation: 5,
  },
  input2: {
    width: "100%",
    color: "black",
    paddingTop: "3%",
    paddingBottom: "3%",
    paddingLeft: "5%",
    paddingRight: "5%",
    borderRadius: 9,
    backgroundColor: "#fff",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    elevation: 5,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: "transparent",
    height: (Dimensions.get("window").height * 7) / 8,
  },
  titleBottomSheeet: {
    textAlign: "center",
    fontWeight: "bold",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#3d9acc",
    marginStart: 5,
    marginEnd: 5,
  },
  contentbottomSheet: {
    flex: 1,
    backgroundColor: "#ededed",
    marginStart: 5,
    marginEnd: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // alignItems: 'center',
  },
  btnLanjut: {
    width: "45%",
    color: "#fff",
    paddingVertical: "4%",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#3d9acc",
    marginTop: 10,
    marginLeft: "5%",
  },
  btnBatal: {
    width: "45%",
    color: "#fff",
    paddingVertical: "4%",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#3d9acc",
    marginTop: 10,
    marginRight: "5%",
  },

  btnBatalSyariah: {
    width: "45%",
    color: "#fff",
    paddingVertical: "4%",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#01853a",
    marginTop: 10,
    marginRight: "5%",
  },
  btnLanjutSyariah: {
    width: "45%",
    color: "#fff",
    paddingVertical: "4%",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#01853a",
    marginTop: 10,
    marginLeft: "5%",
  },
  textBtn: {
    color: "white",
    fontFamily: "HKGrotesk-Regular",
  },
  picker: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginStart: 10,
  },
  vpicker: {
    backgroundColor: "white",
    paddingStart: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    elevation: 5,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(0, 0.1, 0.1, 0.1)",
  },

  titleForm: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },

  bgTitleForm: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3d9acc",
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 10,
  },

  bgTitleFormSyariah: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#01853a",
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 10,
  },
});

export default BsPengajuanPKendaraan2;
