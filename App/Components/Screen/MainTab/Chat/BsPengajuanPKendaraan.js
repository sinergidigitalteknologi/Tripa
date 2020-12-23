import React, { Component } from "react";
import { NavigationEvents } from "react-navigation";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import { Icon } from "react-native-elements";
import moment from "moment";
import { getValue } from "./../../../../Modules/LocalData";
import Helper from "../../../../Utils/Helper";
import { moderateScale } from "../../../../Utils/Scale";
import ApiEndPoint from "./../../../../Modules/Utils/ApiEndPoint";
import { postDataWitHeader, getDataWithHeader } from "./../../../../Services";

import {
  View,
  Text,
  ScrollView,
  Alert,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Linking,
} from "react-native";
import { CheckBox, ListItem, Picker, Body } from "native-base";
let id = "";
let tok = "";
let name = "";
const dataUser = () => {
  getValue("userData").then((response) => {
    if (response != null) {
      id = response.data.id;
      tok = response.access_token;
      name = response.data.name;
    }
  });
};
class BsPengajuanPKendaraan extends Component {
  constructor(props) {
    super(props);
    dataUser();
    this.state = {
      dataMessage: [],
      jenisAsuransiKendaraan: "",
      jenisAsuransiKendaraanSesKeb: "",
      pemilikObjPertanggunan: "",
      namaPemilikObjTertanggung: "",
      periodePertanggungan: "",
      dimulaiPeriode: moment().format("YYYY-MM-DD"),
      objekKendaraan: "",
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
      checkJailStatus: "",
      modalVisible: false,
      isDatePickerVisible: false,
      isFormValid: true,
      kode_referal: "",
      isDemand: false,
      title: "",
      data_referal_code: [],
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
      valueAsuransiKendaraan: [
        { id: "0", nama: "- Pilih -" },
        { id: "ASTRI AUTOSHIELD ", nama: "ASTRI AUTOSHIELD" },
        { id: "ASTRI AUTOSHIELD GOLD", nama: "ASTRI AUTOSHIELD GOLD" },
        { id: "ASTRI AUTOSHIELD PLATINUM", nama: "ASTRI AUTOSHIELD PLATINUM" },
        {
          id: "ASTRI AUTOSHIELD ON DEMAND",
          nama: "ASTRI AUTOSHIELD ON DEMAND",
        },
      ],

      valueAsuransiSesKeb: [
        { id: "0", nama: "- Pilih -" },
        { id: "1", nama: "ASTRI ASTON (AUTOSHIELD TLO ON DEMAND)" },
        { id: "2", nama: "ASTRI ASGARD (AUTOSHIELD ALLRISK ON DEMAND)" },
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
    };
  }
  componentDidMount() {
    this.props.onKendaraan(this);
  }
  componentWillUnmount() {
    this.props.onKendaraan(undefined);
  }
  async setModalVisible(data, title, type) {
    await this.getValueCodeReferal();
    this.setState({ modalVisible: true });
    if (data != "back") {
      await this.resetField();
      if (title == "Asuransi Kendaraan Syariah") {
        this.setState({
          valueAsuransiKendaraan: [
            { id: "0", nama: "- Pilih -" },
            { id: "1", nama: "ASTRI LITE AUTOSHIELD SHARIA" },
            { id: "2", nama: "ASTRI PREMIUM AUTOSHIELD SHARIA" },
            { id: "3", nama: "ASTRI AUTOSHIELD ON DEMAND SHARIA" },
          ],
        });
        this.setState({
          modalVisible: true,
          title: title,
          jenisAsuransiKendaraan: type,
        });
      } else {
        this.setState({ title: "" });
      }

      if (
        this.state.jenisAsuransiKendaraan != "" &&
        this.state.jenisAsuransiKendaraan != "- Pilih -"
      ) {
        this.showDetailType();
      }
    }
    this.RBSheet.open();
    // this.renderModal();
    var dt = moment().format("YYYY-MM-DD");
    this.setState({ dimulaiPeriode: dt });
  }

  async getValueCodeReferal() {
    getDataWithHeader(
      ApiEndPoint.base_url + "/tripa/" + id + "/get-kode-referal",
      tok
    ).then((response) => {
      this.setState({ data_referal_code: response.data });
    });
  }

  showDatePicker = () => {
    this.setState({ isDatePickerVisible: true });
  };
  async nextForm() {
    this.setState({ modalVisible: false });
    await this.validationsForm();
    await this.validationTypeForm();
    let insuranceType = this.state.jenisAsuransiKendaraan;
    if (this.state.jenisAsuransiKendaraan == "ASTRI AUTOSHIELD ON DEMAND") {
      insuranceType = this.state.jenisAsuransiKendaraanSesKeb;
    }
    if (this.state.isFormValid == true) {
      if (this.state.pemilikObjPertanggunan != "Atas Nama Sendiri") {
        var data = {
          referal_code: this.state.kode_referal,
          insurance_type: insuranceType,
          name: this.state.namaPemilikObjTertanggung + " QQ " + name,
          //
          accident_for_driver: this.state.kecDiriPengemudi ? "true" : "false",
          accident_for_passenger: this.state.kecDiriPenumpang
            ? "true"
            : "false",
          legal_liability_third_party: this.state.tanggungjwbbHuk3
            ? "true"
            : "false",
          legal_liability_for_passengers: this.state.tanggungjwbHukPenumpang
            ? "true"
            : "false",
          floods_include_typhons: this.state.banjir ? "true" : "false",
          earthquake_tsunami: this.state.gempaBumi ? "true" : "false",
          riot_and_damage: this.state.huruHara ? "true" : "false",
          terrorism_and_sabotage: this.state.terorisme ? "true" : "false",
          authorized_workshop: this.state.authorized_workshop
            ? "true"
            : "false",
          //
          month_period: this.state.periodePertanggungan,
          start_insurance_period: this.state.dimulaiPeriode,
          brand: this.state.objekKendaraan,
        };
      } else {
        var data = {
          referal_code: this.state.kode_referal,
          insurance_type: insuranceType,
          name: this.state.namaPemilikObjTertanggung,
          //
          accident_for_driver: this.state.kecDiriPengemudi ? "true" : "false",
          accident_for_passenger: this.state.kecDiriPenumpang
            ? "true"
            : "false",
          legal_liability_third_party: this.state.tanggungjwbbHuk3
            ? "true"
            : "false",
          legal_liability_for_passengers: this.state.tanggungjwbHukPenumpang
            ? "true"
            : "false",
          floods_include_typhons: this.state.banjir ? "true" : "false",
          earthquake_tsunami: this.state.gempaBumi ? "true" : "false",
          riot_and_damage: this.state.huruHara ? "true" : "false",
          terrorism_and_sabotage: this.state.terorisme ? "true" : "false",
          authorized_workshop: this.state.authorized_workshop
            ? "true"
            : "false",
          //
          month_period: this.state.periodePertanggungan,
          start_insurance_period: this.state.dimulaiPeriode,
          brand: this.state.objekKendaraan,
        };
      }
      this.RBSheet.close();
      setTimeout(() => {
        this.props.showPolis2(data, this.state.title);
      }, 1000);
      // this.resetField();
    }
  }
  batal() {
    this.setState({ modalVisible: false });
    this.resetField();
    this.props.messageCancel("batal");
    this.RBSheet.close();
    // this.props.messageCancel('batal');
  }
  resetField() {
    this.setState({
      kode_referal: "",
      jenisAsuransiKendaraan: "",
      jenisAsuransiKendaraanSesKeb: "",
      pemilikObjPertanggunan: "",
      namaPemilikObjTertanggung: "",
      periodePertanggungan: "",
      dimulaiPeriode: moment().format("YYYY-MM-DD"),
      objekKendaraan: "",
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
      checkJailStatus: "",
      modalVisible: false,
      isDatePickerVisible: false,
      isFormValid: true,
      title: "",
      valueAsuransiKendaraan: [
        { id: "0", nama: "- Pilih -" },
        { id: "ASTRI AUTOSHIELD ", nama: "ASTRI AUTOSHIELD" },
        { id: "ASTRI AUTOSHIELD GOLD", nama: "ASTRI AUTOSHIELD GOLD" },
        { id: "ASTRI AUTOSHIELD PLATINUM", nama: "ASTRI AUTOSHIELD PLATINUM" },
        {
          id: "ASTRI AUTOSHIELD ON DEMAND",
          nama: "ASTRI AUTOSHIELD ON DEMAND",
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
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );
  }
  validationTypeForm() {
    if (
      this.state.jenisAsuransiKendaraan != "ASTRI AUTOSHIELD ON DEMAND" &&
      this.state.jenisAsuransiKendaraan != "ASTRI AUTOSHIELD ON DEMAND SHARIA"
    ) {
      this.setState({
        kecDiriPengemudi: false,
        kecDiriPenumpang: false,
        tanggungjwbbHuk3: false,
        tanggungjwbHukPenumpang: false,
        banjir: false,
        gempaBumi: false,
        huruHara: false,
        terorisme: false,
      });
    }
  }
  validationsForm() {
    if (
      this.state.jenisAsuransiKendaraan == "" ||
      this.state.jenisAsuransiKendaraan == "- Pilih -" ||
      this.state.jenisAsuransiKendaraan == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Jenis Asuransi Kendaraan");
    } else if (
      (this.state.jenisAsuransiKendaraan == "ASTRI AUTOSHIELD ON DEMAND" ||
        this.state.jenisAsuransiKendaraan ==
          "ASTRI AUTOSHIELD ON DEMAND SHARIA") &&
      this.state.kecDiriPengemudi == false &&
      this.state.kecDiriPenumpang == false &&
      this.state.tanggungjwbbHuk3 == false &&
      this.state.tanggungjwbHukPenumpang == false &&
      this.state.banjir == false &&
      this.state.gempaBumi == false &&
      this.state.huruHara == false &&
      this.state.terorisme == false
    ) {
      this.setState({ isFormValid: false });
      this.customAlert(
        "Perhatian",
        "Harap Pilih Jenis Asuransi Sesuai Kebutuhan"
      );
    } else if (
      this.state.jenisAsuransiKendaraan == "ASTRI AUTOSHIELD ON DEMAND" &&
      (this.state.jenisAsuransiKendaraanSesKeb == "" ||
        this.state.jenisAsuransiKendaraanSesKeb == "- Pilih -" ||
        this.state.jenisAsuransiKendaraanSesKeb == null)
    ) {
      this.setState({ isFormValid: false });
      this.customAlert(
        "Perhatian",
        "Harap Pilih Jenis Asuransi Sesuai Kebutuhan"
      );
    } else if (
      this.state.jenisAsuransiKendaraan == "Tripa Platinum Autoshield"
    ) {
      this.setState({
        banjir: true,
        gempaBumi: true,
        kecDiriPengemudi: true,
        kecDiriPenumpang: true,
        tanggungjwbbHuk3: true,
        tanggungjwbHukPenumpang: true,
        huruHara: true,
        terorisme: true,
      });
    } else if (
      this.state.jenisAsuransiKendaraan == "Tripa Premium Autoshield"
    ) {
      this.setState({
        banjir: true,
        gempaBumi: true,
        kecDiriPengemudi: true,
        kecDiriPenumpang: true,
        tanggungjwbbHuk3: false,
        tanggungjwbHukPenumpang: false,
        huruHara: false,
        terorisme: false,
      });
    } else if (this.state.jenisAsuransiKendaraan == "Tripa Lite Autoshield") {
      this.setState({
        kecDiriPengemudi: false,
        kecDiriPenumpang: false,
        tanggungjwbbHuk3: false,
        tanggungjwbHukPenumpang: false,
        banjir: false,
        gempaBumi: false,
        huruHara: false,
        terorisme: false,
      });
    } else if (
      this.state.pemilikObjPertanggunan == "" ||
      this.state.pemilikObjPertanggunan == "- Pilih -" ||
      this.state.pemilikObjPertanggunan == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Nama Pemilik Objek Tertanggung");
    } else if (
      this.state.namaPemilikObjTertanggung == "" ||
      this.state.namaPemilikObjTertanggung == "- Pilih -" ||
      this.state.namaPemilikObjTertanggung == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Nama Pemilik Objek Tertanggung");
    } else if (
      this.state.periodePertanggungan == "" ||
      this.state.periodePertanggungan == "- Pilih -" ||
      this.state.periodePertanggungan == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Periode Pertanggungn Asuransi");
    } else if (
      this.state.dimulaiPeriode == "" ||
      this.state.dimulaiPeriode == "- Pilih -" ||
      this.state.dimulaiPeriode == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Tangal Dimulainya Asuransi");
    } else if (
      this.state.objekKendaraan == "" ||
      this.state.objekKendaraan == "- Pilih -" ||
      this.state.objekKendaraan == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert(
        "Perhatian",
        "Harap Isi Objek Kendaraan Yang Dipertanggungkan"
      );
    } else {
      this.setState({ isFormValid: true });
    }
  }

  handleConfirm = (date) => {
    var dateNow = moment().format("YYYY-MM-DD");
    var dt = moment(date).format("YYYY-MM-DD");
    if (dateNow > dt) {
      this.setState({ isDatePickerVisible: false });
      this.customAlert(
        "Perhatian",
        "Tanggal dimulainya asuransi tidak bisa kurang dari tanggal hari ini"
      );
    } else {
      this.setState({ isDatePickerVisible: false });
      this.setState({ dimulaiPeriode: dt });
    }
  };
  onValuePeriodePertanggungan = (value) => {
    this.setState({ periodePertanggungan: value });
  };
  onValueJenisAuransi = (value) => {
    this.setState({ jenisAsuransiKebakaran: value });
  };
  onValuePemilikObjek = (value) => {
    this.setState({ pemilikObjPertanggunan: value });
    if (value == "Atas Nama Sendiri") {
      this.setState({ namaPemilikObjTertanggung: name });
    } else {
      this.setState({ namaPemilikObjTertanggung: "" });
    }
  };
  onValueName(value) {
    if (value.length != 0) {
      var check = Helper.checkFieldName(value);
      if (check == true) {
        this.setState({ namaPemilikObjTertanggung: value });
      } else {
        this.customAlert("Perhatian", "Harap masukkan nama dengan benar");
      }
    } else {
      this.setState({ namaPemilikObjTertanggung: value });
    }
  }
  async onValueJenisAsuransi(value) {
    await this.setState({ jenisAsuransiKendaraan: value });
    if (value != "- Pilih -" && value != "ASTRI AUTOSHIELD ON DEMAND") {
      this.showDetailType(this.state.jenisAsuransiKendaraan);
    }
  }
  async onValueJenisAssuransiSes(value) {
    this.setState({ jenisAsuransiKendaraanSesKeb: value });
    var jenisAsuransi = "";
    if (value == "ASTRI ASTON (AUTOSHIELD TLO ON DEMAND)") {
      jenisAsuransi = "ASTRI ASTON";
    } else if (value == "ASTRI ASGARD (AUTOSHIELD ALLRISK ON DEMAND)") {
      jenisAsuransi = "ASTRI ASGARD";
    }

    if (value != "- Pilih -") {
      this.showDetailType(jenisAsuransi);
    }
  }
  onValueObjekOkupasi = (value) => {
    this.setState({ objekKendaraan: value });
  };
  onValueNamaPemilikObjek(value) {
    this.setState({ namaPemilikObjTertanggung: value });
  }
  showDetailType(value) {
    var form_name = "vehicle";
    if (
      this.state.jenisAsuransiKendaraan == "" ||
      this.state.jenisAsuransiKendaraan == "- Pilih -" ||
      this.state.jenisAsuransiKendaraan == null
    ) {
      this.customAlert("Perhatian", "Harap Pilih Jenis Asuransi");
    } else if (value == "ASTRI AUTOSHIELD ON DEMAND") {
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
                ? "Form Pengajuan Polis Kendaraan "
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
              <Text style={styles.titleInput}>Kode Referal :</Text>
              <View style={styles.vpicker}>
                <Picker
                  itemTextStyle={{
                    fontSize:
                      Platform.OS == "ios"
                        ? moderateScale(16)
                        : moderateScale(16),
                  }}
                  textStyle={{
                    width: Platform.OS == "ios" ? "90%" : "100%", //ini agar icon tidak tergeser oleh text //agus
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                  }}
                  mode="dropdown"
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{ marginRight: moderateScale(13) }}
                    />
                  } //ini styling icon nya agar tidak mentok di pinggir //agus
                  placeholder="- Pilih -"
                  selectedValue={this.state.kode_referal}
                  onValueChange={(value) =>
                    this.setState({ kode_referal: value })
                  }
                >
                  {this.state.data_referal_code.map((data, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={data.kode}
                        value={data.kode}
                        textStyle={{ fontSize: 12 }}
                      />
                    );
                  })}
                </Picker>
              </View>

              <Text style={styles.titleInput}>Jenis Asuransi Kendaraan : </Text>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    width: "70%",
                    backgroundColor: "white",
                    paddingStart: 16,
                    borderRadius: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.8,
                    elevation: 5,
                  }}
                >
                  <Picker
                    textStyle={{
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      fontSize: moderateScale(14),
                      paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                      width: Platform.OS == "ios" ? "80%" : "100%", //ini agar icon tidak tergeser oleh text //agus
                    }}
                    itemTextStyle={{
                      fontSize:
                        Platform.OS == "ios"
                          ? moderateScale(16)
                          : moderateScale(16),
                    }}
                    mode="dropdown"
                    iosIcon={
                      <Icon
                        type="feather"
                        name="arrow-down-circle"
                        containerStyle={{ marginRight: moderateScale(13) }}
                      />
                    } //ini styling icon nya agar tidak mentok di pinggir //agus
                    placeholder="- Pilih -"
                    selectedValue={this.state.jenisAsuransiKendaraan}
                    onValueChange={(value) => this.onValueJenisAsuransi(value)}
                  >
                    {this.state.valueAsuransiKendaraan.map((data, key) => {
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
                <TouchableOpacity
                  onPress={() => this.showDetailType()}
                  style={{
                    width: "25%",
                    color: "#fff",
                    paddingVertical: "4%",
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FF8033",
                    marginLeft: "5%",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.8,
                    elevation: 5,
                  }}
                >
                  <Text style={styles.textBtn}>Detail</Text>
                </TouchableOpacity>
              </View>

              {(this.state.jenisAsuransiKendaraan ==
                "ASTRI AUTOSHIELD ON DEMAND" ||
                this.state.jenisAsuransiKendaraan ==
                  "ASTRI AUTOSHIELD ON DEMAND SHARIA") && (
                <View>
                  {this.state.jenisAsuransiKendaraan ==
                    "ASTRI AUTOSHIELD ON DEMAND" && (
                    <View
                      style={{
                        backgroundColor: "white",
                        paddingStart: 16,
                        borderRadius: 12,
                        shadowColor: "#000",
                        marginTop: 12,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.8,
                        elevation: 5,
                      }}
                    >
                      <Picker
                        style={Platform.OS == "ios" ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                        textStyle={{
                          fontSize: moderateScale(14),
                          flexDirection: "column",
                          flex: 1,
                          paddingLeft:
                            Platform.OS == "ios" ? 0 : moderateScale(5),
                          paddingTop:
                            Platform.OS == "ios" ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                          paddingBottom:
                            Platform.OS == "ios" ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                        }}
                        itemTextStyle={{ fontSize: moderateScale(16) }}
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
                        } //ini styling icon nya agar tidak mentok di pinggir //agus
                        placeholder="- Pilih -"
                        selectedValue={this.state.jenisAsuransiKendaraanSesKeb}
                        onValueChange={(value) =>
                          this.onValueJenisAssuransiSes(value)
                        }
                      >
                        {this.state.valueAsuransiSesKeb.map((data, key) => {
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
                    <Body style={{ marginLeft: 5 }}>
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
                    <Body style={{ marginLeft: 5 }}>
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
                    <Body style={{ marginLeft: 5 }}>
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
                    <Body style={{ marginLeft: 5 }}>
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
                    <Body style={{ marginLeft: 5 }}>
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
                    <Body style={{ marginLeft: 5 }}>
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
                    <Body style={{ marginLeft: 5 }}>
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
                    <Body style={{ marginLeft: 5 }}>
                      <Text>Terorisme dan Sabotase</Text>
                    </Body>
                  </ListItem>
                  {(this.state.jenisAsuransiKendaraanSesKeb ==
                    "ASTRI ASGARD (AUTOSHIELD ALLRISK ON DEMAND)" ||
                    this.state.jenisAsuransiKendaraan ==
                      "ASTRI AUTOSHIELD ON DEMAND SHARIA") && (
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
                      <Body style={{ marginLeft: 5 }}>
                        <Text>Authorized Workshop</Text>
                      </Body>
                    </ListItem>
                  )}
                </View>
              )}
              <Text style={styles.titleInput}>
                Nama Pemilik Objek Pertanggungan :{" "}
              </Text>
              <View style={styles.vpicker}>
                <Picker
                  style={Platform.OS == "ios" ? {} : styles.picker}
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(0),
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
                  selectedValue={this.state.pemilikObjPertanggunan}
                  onValueChange={(value) => this.onValuePemilikObjek(value)}
                >
                  {this.state.valueNamaPemilik.map((data, key) => {
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
              {(this.state.pemilikObjPertanggunan == "Atas Nama Sendiri" ||
                this.state.pemilikObjPertanggunan ==
                  "Nama Pada STNK Kendaraan") && (
                <View>
                  <TextInput
                    style={{
                      color: "black",
                      fontFamily: "HKGrotesk-Regular",
                      fontSize: moderateScale(16),
                      paddingTop: "3%",
                      paddingBottom: "3%",
                      paddingLeft: "5%",
                      paddingRight: "5%",
                      marginTop: 3,
                      borderRadius: 9,
                      backgroundColor: "#fff",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.8,
                      elevation: 5,
                    }}
                    placeholder="Nama"
                    value={this.state.namaPemilikObjTertanggung}
                    onChangeText={(namaPemilikObjTertanggung) =>
                      this.onValueName(namaPemilikObjTertanggung)
                    }
                    underlineColorAndroid="transparent"
                  />
                </View>
              )}
              <Text style={styles.titleInput}>
                Periode Pertanggungan Asuransi :{" "}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    borderRadius: 9,
                    paddingStart: Platform.OS == "ios" ? 2 : 16,
                    backgroundColor: "#fff",
                    width: 110,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 0.8 },
                    shadowOpacity: 0.5,
                    elevation: 2,
                  }}
                >
                  <Picker
                    itemTextStyle={{
                      fontSize:
                        Platform.OS == "ios"
                          ? moderateScale(16)
                          : moderateScale(16),
                      flex: 1,
                    }}
                    textStyle={{ fontSize: moderateScale(14) }}
                    mode="dropdown"
                    selectedValue={this.state.periodePertanggungan}
                    iosIcon={
                      <Icon
                        type="feather"
                        name="arrow-down-circle"
                        containerStyle={{ marginRight: moderateScale(13) }}
                      />
                    } //ini styling icon nya agar tidak mentok di pinggir //agus
                    placeholder="- Pilih -"
                    onValueChange={(value) =>
                      this.onValuePeriodePertanggungan(value)
                    }
                  >
                    {this.state.valueMonth.map((vmonth, key) => {
                      return (
                        <Picker.Item
                          key={key}
                          label={vmonth.nama}
                          value={vmonth.nama}
                          textStyle={{ fontSize: 12 }}
                        />
                      );
                    })}
                  </Picker>
                </View>
                <View style={{ justifyContent: "center", marginStart: 20 }}>
                  <Text>Bulan</Text>
                </View>
              </View>

              <Text style={styles.titleInput}>
                Tanggal Dimulainya Asuransi :{" "}
              </Text>
              <TouchableOpacity onPress={() => this.showDatePicker()}>
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
              </TouchableOpacity>

              <Text style={styles.titleInput}>
                Objek Kendaraan yang dipertanggungkan :{" "}
              </Text>
              <View style={styles.vpicker}>
                <Picker
                  style={Platform.OS == "ios" ? {} : styles.picker}
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
                  selectedValue={this.state.objekKendaraan}
                  onValueChange={(value) => this.onValueObjekOkupasi(value)}
                >
                  {this.state.valueOkupasi.map((data, key) => {
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
              <View style={{ marginTop: 20, flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => this.batal()}
                  style={
                    this.state.title == ""
                      ? styles.btnBatal
                      : styles.btnBatalSyariah
                  }
                >
                  <Text style={styles.textBtn}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.nextForm()}
                  style={
                    this.state.title == ""
                      ? styles.btnLanjut
                      : styles.btnLanjutSyariah
                  }
                >
                  <Text style={styles.textBtn}>Lanjut</Text>
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={this.state.isDatePickerVisible}
                mode="date"
                onConfirm={(date) => this.handleConfirm(date)}
                onCancel={() => this.setState({ isDatePickerVisible: false })}
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
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    paddingStart: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    elevation: 5,
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
export default BsPengajuanPKendaraan;
