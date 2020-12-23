import React, { Component } from "react";
import { NavigationEvents } from "react-navigation";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";
import moment from "moment";
import RBSheet from "react-native-raw-bottom-sheet";
import Helper from "../../../../Utils/Helper";
import { moderateScale } from "../../../../Utils/Scale";
import ApiEndPoint from "./../../../../Modules/Utils/ApiEndPoint";
import { postDataWitHeader, getDataWithHeader } from "./../../../../Services";
import { getValue } from "./../../../../Modules/LocalData";

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
} from "native-base";

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

class BsPengajuanPPA extends Component {
  constructor(props) {
    super(props);
    dataUser();
    this.state = {
      namaTertanggung: "",
      jenisAsuransi: "",
      jenisKelamin: "",
      tglLahir: "",
      nikPaspor: "",
      nilaiPertanggungan: "",
      periodeAsuransi: "12",
      tglDimulaiAsuransi: moment().format("YYYY-MM-DD"),
      namaAhliWaris: "",
      pilihanAsuransi: "",
      namaAhliWaris: "",
      hubAhliWaris: "",
      kode_referal: "",

      modalVisible: false,
      isDatePickerVisible: false,
      isDatePickerVisible2: false,
      isFormValid: false,

      title: "",
      data_referal_code: [],
      gender: [
        { id: "0", nama: "- Pilih -" },
        { id: "Laki-laki", nama: "Laki-laki" },
        { id: "Perempuan", nama: "Perempuan" },
      ],
      optionsTravel: [
        { id: "0", nama: "- Pilih -" },
        { id: "1", nama: "ASTRI MINE SILVER" },
        { id: "2", nama: "ASTRI MINE GOLD" },
        { id: "3", nama: "ASTRI MINE PLATINUM" },
      ],
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
      valueHubAhliWaris: [
        { id: "0", nama: "- Pilih -" },
        { id: "Husband (Suami)", nama: "Suami" },
        { id: "Daughter (Anak perempuan)", nama: "Anak Perempuan" },
        { id: "Father (Bapak)", nama: "Bapak" },
        { id: "Wife (Istri)", nama: "Istri" },
        { id: "Brother (Saudara Laki)", nama: "Saudara Laki-Laki" },
        { id: "Mother (Ibu)", nama: "Ibu" },
        { id: "Son (Anak laki-laki)", nama: "Anak Laki-Laki" },
        { id: "Sister (Saudara Perempuan)", nama: "Saudara Perempuan" },
        { id: "Parent (Orang Tua)", nama: "Orang Tua" },
      ],
      valueTypeAssurance: [
        { id: "0", nama: "- Pilih -" },
        { id: "1", nama: "ASTRI MINE SILVER" },
        { id: "2", nama: "ASTRI MINE GOLD" },
        { id: "3", nama: "ASTRI MINE PLATINUM" },
      ],
    };
  }
  componentDidMount() {
    this.props.onPPA(this);
  }
  componentWillUnmount() {
    this.props.onPPA(undefined);
  }
  async setModalVisible(data, title, type) {
    await this.getValueCodeReferal();
    if (data != "back") {
      if (title == "Asuransi Personal Accident Syariah") {
        await this.setState({
          valueTypeAssurance: [
            // {id: '0', nama: '- Pilih -'},
            { id: "1", nama: "ASTRI PERSONAL CARE ON DEMAND SHARIA" },
          ],
          title: title,
          jenisAsuransi: type,
        });
        // this.setState({nilaiPertanggungan: '50.000.000'});
      }
      if (
        this.state.jenisAsuransi != "" &&
        this.state.jenisAsuransi != "- Pilih -"
      ) {
        this.showDetailType();
      }
    }
    this.setState({ modalVisible: true });
    this.RBSheet.open();
    var dt = moment().format("YYYY-MM-DD");
    this.setState({ tglDimulaiAsuransi: dt });

    // this.renderModal();
  }

  async getValueCodeReferal() {
    getDataWithHeader(
      ApiEndPoint.base_url + "/tripa/" + id + "/get-kode-referal",
      tok
    ).then((response) => {
      this.setState({ data_referal_code: response.data });
    });
  }

  showDatePicker(v) {
    if (v == "tglLahir") {
      this.setState({ isDatePickerVisible: true });
    } else {
      this.setState({ isDatePickerVisible2: true });
    }
  }
  async nextForm() {
    await this.validationsForm();
    if (this.state.isFormValid == true) {
      var dataForm = {
        kode_referal: this.state.kode_referal,
        insurance_type: this.state.jenisAsuransi,
        name: this.state.namaTertanggung,
        gender: this.state.jenisKelamin,
        birth_date: this.state.tglLahir,
        identity_number: this.state.nikPaspor,
        insurance_value: this.state.nilaiPertanggungan.replace(
          /,.*|[^0-9]/g,
          ""
        ),
        month_period: this.state.periodeAsuransi,
        start_insurance_period: this.state.tglDimulaiAsuransi,
        heir_name: this.state.namaAhliWaris,
        heir_relation: this.state.hubAhliWaris,
      };
      this.setState({ modalVisible: false });
      this.props.sendToChat(JSON.stringify(dataForm));
      this.resetField();
      this.RBSheet.close();
      // this.props.showPPA2();
    }
  }
  batal() {
    this.setState({ modalVisible: false });
    this.resetField();
    this.props.messageCancel("batal");
    this.RBSheet.close();
  }
  resetField() {
    this.setState({
      kode_referal: "",
      namaTertanggung: "",
      jenisAsuransi: "",
      jenisKelamin: "",
      tglLahir: "",
      nikPaspor: "",
      nilaiPertanggungan: "",
      periodeAsuransi: "12",
      tglDimulaiAsuransi: moment().format("YYYY-MM-DD"),
      namaAhliWaris: "",
      pilihanAsuransi: "",
      namaAhliWaris: "",
      hubAhliWaris: "",
      title: "",

      modalVisible: false,
      isDatePickerVisible: false,
      isDatePickerVisible2: false,
      isFormValid: false,
      optionsTravel: [
        { id: "0", nama: "- Pilih -" },
        { id: "1", nama: "ASTRI MINE SILVER" },
        { id: "2", nama: "ASTRI MINE GOLD" },
        { id: "3", nama: "ASTRI MINE PLATINUM" },
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

  validationsForm() {
    if (this.state.namaTertanggung == "") {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Nama");
    } else if (
      this.state.jenisAsuransi == "" ||
      this.state.jenisAsuransi == "- Pilih -" ||
      this.state.jenisAsuransi == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Pilih Jenis Asuransi");
    } else if (
      this.state.jenisKelamin == "- Pilih -" ||
      this.state.jenisKelamin == "" ||
      this.state.jenisKelamin == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Pilih Jenis Kelamin");
    } else if (this.state.tglLahir == "") {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Tanggal Lahir");
    } else if (this.state.nikPaspor == "") {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Nik/Passport");
    } else if (this.state.nilaiPertanggungan == "") {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Nilai Pertanggungan");
    } else if (
      this.state.periodeAsuransi == "" ||
      this.state.periodeAsuransi == "- Pilih -" ||
      this.state.periodeAsuransi == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Periode Asuransi");
    } else if (this.state.tglDimulaiAsuransi == "") {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Tanggal Dimulainya Asuransi");
    } else if (this.state.namaAhliWaris == "") {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Isi Nama Ahli Waris");
    } else if (
      this.state.hubAhliWaris == "- Pilih -" ||
      this.state.hubAhliWaris == "" ||
      this.state.hubAhliWaris == null
    ) {
      this.setState({ isFormValid: false });
      this.customAlert("Perhatian", "Harap Pilih Hubungan Ahli Waris");
    } else {
      this.setState({ isFormValid: true });
    }
  }

  handleConfirm(date, message) {
    var dateNow = moment().format("YYYY-MM-DD");
    var dt = moment(date).format("YYYY-MM-DD");
    var sumDate = moment(dt).add("60", "Y");

    if (message == "tglLahir") {
      var a = moment().diff(moment(date), "years") >= 60;
      if (a) {
        this.customAlert("Perhatian", "Usia maksimal 60 tahun");
      } else {
        this.setState({ isDatePickerVisible: false });
        this.setState({ tglLahir: dt });
      }
    } else {
      if (dateNow > dt) {
        this.setState({ isDatePickerVisible2: false });
        this.customAlert(
          "Perhatian",
          "Tanggal dimulainya asuransi tidak bisa kurang dari tanggal hari ini"
        );
      } else {
        this.setState({ isDatePickerVisible2: false });
        this.setState({ tglDimulaiAsuransi: dt });
      }
    }
  }
  onValueGender = (value) => {
    this.setState({ jenisKelamin: value });
  };
  onValuePeriodePertanggungan = (value) => {
    this.setState({ periodeAsuransi: value });
  };
  onValueOptionAssurance = (value) => {
    this.setState({ hubAhliWaris: value });
  };
  onValueName(value) {
    if (value.length != 0) {
      var check = Helper.checkFieldName(value);
      if (check == true) {
        this.setState({ namaTertanggung: value });
      } else {
        this.customAlert("Perhatian", "Harap masukkan nama dengan benar");
      }
    } else {
      this.setState({ namaTertanggung: value });
    }
  }
  async onValueJenisAsuransi(value) {
    await this.setState({ jenisAsuransi: value });
    if (value == "ASTRI MINE SILVER") {
      this.setState({ nilaiPertanggungan: "25.000.000" });
    } else if (value == "ASTRI MINE GOLD") {
      this.setState({ nilaiPertanggungan: "50.000.000" });
    } else if (value == "ASTRI MINE PLATINUM") {
      this.setState({ nilaiPertanggungan: "100.000.000" });
    } else {
      // this.setState({nilaiPertanggungan: '50.000.000'});
    }
    if (value != "- Pilih -") {
      this.showDetailType(this.state.jenisAsuransi);
    }
  }
  onValueHeirName(value) {
    if (value.length != 0) {
      var check = Helper.checkFieldName(value);
      if (check == true) {
        this.setState({ namaAhliWaris: value });
      } else {
        this.customAlert("Perhatian", "Harap masukkan nama dengan benar");
      }
    } else {
      this.setState({ namaAhliWaris: value });
    }
  }
  showDetailType() {
    var form_name = "ppa";
    if (
      this.state.jenisAsuransi == "" ||
      this.state.jenisAsuransi == "- Pilih -" ||
      this.state.jenisAsuransi == null
    ) {
      this.customAlert("Perhatian", "Harap Pilih Jenis Asuransi");
    } else {
      this.RBSheet.close();
      setTimeout(() => {
        this.props.showDetailType(this.state.jenisAsuransi, form_name);
      }, 0);
    }
  }
  async onValueNilaiPertanggungan(value) {
    if (value == null || value == "") {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ""), 10);
    } catch {}

    if (aa <= 150000000) {
      await this.setState({ nilaiPertanggungan: this.convertToRupiah(aa) });
    } else if (aa == undefined) {
      await this.setState({ nilaiPertanggungan: this.convertToRupiah(aa) });
    } else if (aa > 150000000) {
      this.customAlert("Perhatian", "Nilai pertanggungan maksimal 150 juta");
    }
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
                ? "Form Pengajuan Polis Personal Accident"
                : "Asuransi Kecelakaan Diri Syariah"}
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

              <Text style={styles.titleInput}>Jenis Asuransi : </Text>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    flex: 1,
                    width: "70%",
                    backgroundColor: "white",
                    paddingStart: 20,
                    borderRadius: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.8,
                    elevation: 5,
                  }}
                >
                  <Picker
                    style={Platform.OS == "ios" ? {} : {}} //ini dikosongkan jika di ios agar icon ada di pojok
                    textStyle={{
                      width: Platform.OS == "ios" ? "80%" : "100%", //ini agar icon tidak tergeser oleh text //agus
                      fontSize: moderateScale(14),
                      paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                      paddingTop: Platform.OS == "ios" ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    }}
                    itemTextStyle={{ fontSize: moderateScale(16) }}
                    mode="dropdown"
                    placeholder="- Pilih -"
                    iosIcon={
                      <Icon
                        type="feather"
                        name="arrow-down-circle"
                        containerStyle={{ marginRight: moderateScale(3) }}
                      />
                    } //ini styling icon nya agar tidak mentok di pinggir //agus
                    selectedValue={this.state.jenisAsuransi}
                    onValueChange={(value) => this.onValueJenisAsuransi(value)}
                  >
                    {this.state.valueTypeAssurance.map((data, key) => {
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
                    width: "25%",
                    color: "#fff",
                    paddingVertical: "4%",
                    borderRadius: 12,
                    alignItems: "center",
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
              <Text style={styles.titleInput}>Nama Tertanggung : </Text>
              <TextInput
                style={styles.inputs}
                placeholder="Nama Tertanggung"
                value={this.state.namaTertanggung}
                onChangeText={(value) => this.onValueName(value)}
              />
              <Text style={styles.titleInput}>Jenis Kelamin :</Text>
              <View style={styles.vContentPicker}>
                <Picker
                  style={Platform.OS == "ios" ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == "ios" ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == "ios" ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                  }}
                  itemTextStyle={{ fontSize: moderateScale(16) }}
                  mode="dropdown"
                  placeholder="- Pilih -"
                  iosIcon={<Icon type="feather" name="arrow-down-circle" />} //ini styling icon nya agar tidak mentok di pinggir //agus
                  selectedValue={this.state.jenisKelamin}
                  onValueChange={(value) => this.onValueGender(value)}
                >
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
              <Text style={styles.titleInput}>Tanggal Lahir : </Text>
              <TouchableOpacity onPress={() => this.showDatePicker("tglLahir")}>
                {Platform.OS == "ios" ? (
                  <View style={styles.inputs}>
                    {this.state.tglLahir == "" ? (
                      <Text style={{ color: "#C7C7CD", marginVertical: 3 }}>
                        Pilih Tanggal
                      </Text>
                    ) : (
                      <Text>{this.state.tglLahir}</Text>
                    )}
                  </View>
                ) : (
                  <TextInput
                    style={styles.inputs}
                    placeholder="Tanggal Lahir"
                    value={this.state.tglLahir}
                    onChangeText={(value) => this.setState({ tglLahir: value })}
                    editable={false}
                  />
                )}
              </TouchableOpacity>

              <Text style={styles.titleInput}>NIK : </Text>
              <TextInput
                style={styles.inputs}
                keyboardType="numeric"
                placeholder="Nik"
                value={this.state.nikPaspor}
                onChangeText={(value) => this.setState({ nikPaspor: value })}
                // onSubmitEditing={() => this.passwordInput.focus()}
                underlineColorAndroid="transparent"
              />
              <Text style={styles.titleInput}>Nilai Pertanggungan : </Text>
              <TextInput
                editable={
                  this.state.title == "Asuransi Personal Accident Syariah"
                    ? true
                    : false
                }
                style={styles.inputs}
                keyboardType="numeric"
                placeholder="Nilai Pertanggungan"
                value={this.state.nilaiPertanggungan}
                onChangeText={(value) => this.onValueNilaiPertanggungan(value)}
                // onChangeText={nik => this.setState({chosenDate})}
                // onSubmitEditing={() => this.passwordInput.focus()}
                underlineColorAndroid="transparent"
              />

              <Text style={styles.titleInput}>Periode Asuransi : </Text>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    borderRadius: 9,
                    paddingStart: 5,
                    backgroundColor: "#fff",
                    width: 110,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.8,
                    elevation: 5,
                  }}
                >
                  <Picker
                    enabled={false}
                    textStyle={{
                      fontSize: moderateScale(14),
                      paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                      paddingTop: Platform.OS == "ios" ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    }}
                    itemTextStyle={{ fontSize: moderateScale(16) }}
                    mode="dropdown"
                    style={{ marginStart: 10, alignItems: "center" }}
                    iosIcon={
                      <Icon
                        type="feather"
                        name="arrow-down-circle"
                        containerStyle={{ marginRight: moderateScale(13) }}
                      />
                    } //ini styling icon nya agar tidak mentok di pinggir //agus
                    selectedValue={this.state.periodeAsuransi}
                    onValueChange={(value) =>
                      this.onValuePeriodePertanggungan(value)
                    }
                  >
                    {this.state.valueMonth.map((vmonth, key) => {
                      return (
                        <Picker.Item
                          key={key}
                          label={vmonth.nama}
                          value={vmonth.id}
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
                {Platform.OS == "ios" ? (
                  <View style={styles.inputs}>
                    {this.state.tglLahir == "" ? (
                      <Text style={{ color: "#C7C7CD", marginVertical: 3 }}>
                        Pilih Tanggal
                      </Text>
                    ) : (
                      <Text>{this.state.tglDimulaiAsuransi}</Text>
                    )}
                  </View>
                ) : (
                  <TextInput
                    editable={false}
                    style={styles.inputs}
                    placeholder="Tanggal Dimulainya Asuransi"
                    value={this.state.tglDimulaiAsuransi}
                    onChangeText={(value) => this.setState({ tglLahir: value })}
                    editable={false}
                  />
                )}
              </TouchableOpacity>

              <Text style={styles.titleInput}>Nama Ahli Waris : </Text>
              <TextInput
                style={styles.inputs}
                keyboardType="default"
                placeholder="Nama Ahli Waris"
                value={this.state.namaAhliWaris}
                onChangeText={(value) => this.onValueHeirName(value)}
                // onSubmitEditing={() => this.passwordInput.focus()}
                underlineColorAndroid="transparent"
              />

              <Text style={styles.titleInput}>Hubungan Ahli Waris : </Text>
              <View style={styles.vContentPicker}>
                <Picker
                  style={Platform.OS == "ios" ? {} : styles.picker} //ini dikosongkan jika di ios agar icon ada di pojok
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == "ios" ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == "ios" ? moderateScale(5) : 0,
                  }}
                  itemTextStyle={{ fontSize: moderateScale(16) }}
                  mode="dropdown"
                  placeholder="- Pilih -"
                  iosIcon={<Icon type="feather" name="arrow-down-circle" />} //ini styling icon nya agar tidak mentok di pinggir //agus
                  selectedValue={this.state.hubAhliWaris}
                  onValueChange={(value) => this.onValueOptionAssurance(value)}
                >
                  {this.state.valueHubAhliWaris.map((ahliWaris, key) => {
                    return (
                      <Picker.Item
                        key={key}
                        label={ahliWaris.nama}
                        value={ahliWaris.id}
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
                  <Text style={styles.textBtn}>Ajukan</Text>
                </TouchableOpacity>
              </View>

              <DateTimePickerModal
                isVisible={this.state.isDatePickerVisible}
                mode="date"
                onCancel={() => this.setState({ isDatePickerVisible: false })}
                onConfirm={(date) => this.handleConfirm(date, "tglLahir")}
              />

              <DateTimePickerModal
                isVisible={this.state.isDatePickerVisible2}
                mode="date"
                onConfirm={(date) =>
                  this.handleConfirm(date, "dimulainyaAsuransi")
                }
                onCancel={() => this.setState({ isDatePickerVisible2: false })}
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
  vContentPicker: {
    color: "black",
    fontFamily: "HKGrotesk-Regular",
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
  textBtn: {
    color: "white",
    fontFamily: "HKGrotesk-Regular",
  },
  picker: {},

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
});
export default BsPengajuanPPA;
