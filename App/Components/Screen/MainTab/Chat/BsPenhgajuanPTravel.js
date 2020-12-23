import React, { Component } from "react";
import { NavigationEvents } from "react-navigation";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";
import moment from "moment";
import RBSheet from "react-native-raw-bottom-sheet";
import { getValue } from "./../../../../Modules/LocalData";
import ApiEndPoint from "./../../../../Modules/Utils/ApiEndPoint";
import Api from "../../../../Utils/Api";
import Helper from "../../../../Utils/Helper";
import { moderateScale } from "../../../../Utils/Scale";
import { postDataWitHeader, getDataWithHeader } from "./../../../../Services";

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
  TouchableHighlight,
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
// import { TouchableHighlight } from 'react-native-gesture-handler';

let id = "";
let tok = "";
let data_tripa_user = "";

let dateNow = moment().format("YYYY-MM-DD");
let dtConfirm;
let dtConfirm2;
let dateInputConfirm2;

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

class BsPengajuanPTravel extends Component {
  constructor(props) {
    super(props);
    dataUser();
    this.state = {
      jenisAsuransiTravel: "",
      namaTertanggung: "",
      negaraTujuanWisata: "",
      tanggalPemberangkatan: moment().format("YYYY-MM-DD"),
      tanggalKepulangan: "",
      checkMonth: "",
      nikPaspor: "",
      jenisKelamin: "",
      namaAhliWaris: "",
      hubunganAhliWaris: "",
      modalVisible: false,
      isDatePickerVisible: false,
      isDatePickerVisible2: false,
      isAlertForm: true,
      kode_referal: "",
      data_referal_code: [],
      gender: [
        { id: "0", nama: "- Pilih -" },
        { id: "Laki-laki", nama: "Laki-laki" },
        { id: "Perempuan", nama: "Perempuan" },
      ],
      optionsTravel: [
        { nama: "- Pilih -" },
        { nama: "ASTRI TRIP DOMESTIK SILVER" },
        { nama: "ASTRI TRIP DOMESTIK GOLD" },
        { nama: "ASTRI TRIP DOMESTIK PLATINUM" },
        { nama: "ASTRI TRIP INTERNATIONAL SILVER" },
        { nama: "ASTRI TRIP INTERNATIONAL GOLD" },
        { nama: "ASTRI TRIP INTERNATIONAL PLATINUM" },
        { nama: "ASTRI TRIP DOMESTIK SILVER FAMILY" },
        { nama: "ASTRI TRIP DOMESTIK GOLD FAMILY" },
        { nama: "ASTRI TRIP DOMESTIK PLATINUM FAMILY" },
        { nama: "ASTRI TRIP INTERNATIONAL SILVER FAMILY" },
        { nama: "ASTRI TRIP INTERNATIONAL GOLD FAMILY" },
        { nama: "ASTRI TRIP INTERNATIONAL PLATINUM FAMILY" },
        { nama: "ASTRI TRIP INTERNATIONAL ASIA" },
        { nama: "ASTRI TRIP INTERNATIONAL ASIA FAMILY" },
      ],
      valueAhliWaris: [
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
    this.props.onTravel(this);
  }
  componentWillUnmount() {
    this.props.onTravel(undefined);
  }

  async getCountry() {
    await getDataWithHeader(Api.base_url2 + "tripa/getCountry", tok)
      .then((res) => {
        if (res.success != false) {
          var valueCountry = [];
          valueCountry.push({ name: "- Pilih -" });
          res.data.map((item, i) => {
            valueCountry.push({ name: item });
          });
          this.setState({ valueNegaraTujuan: valueCountry });
        } else {
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
  async setModalVisible(visible) {
    this.RBSheet.open();
    await this.getValueCodeReferal();

    this.setState({ modalVisible: visible });
    this.getCountry();
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

  showDatePicker = (v) => {
    if (v == "Pemberangkatan") {
      this.setState({ isDatePickerVisible: true });
    } else {
      this.setState({ isDatePickerVisible2: true });
    }
  };
  batal() {
    this.setState({ modalVisible: false });
    this.props.messageCancel("batal");
    this.resetField();
    this.RBSheet.close();
  }
  async nextForm() {
    this.setState({ modalVisible: false });
    await this.validationsForm();
    if (this.state.isAlertForm == true) {
      var dataForm = {
        kode_referal: this.state.kode_referal,
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
      kode_referal: "",
      jenisAsuransiTravel: "",
      namaTertanggung: "",
      negaraTujuanWisata: "",
      tanggalPemberangkatan: moment().format("YYYY-MM-DD"),
      tanggalKepulangan: "",
      nikPaspor: "",
      jenisKelamin: "",
      namaAhliWaris: "",
      hubunganAhliWaris: "",
      modalVisible: false,
      isDatePickerVisible: false,
      isDatePickerVisible2: false,
      isAlertForm: true,
      optionsTravel: [
        { nama: "- Pilih -" },
        { nama: "ASTRI TRIP DOMESTIK SILVER" },
        { nama: "ASTRI TRIP DOMESTIK GOLD" },
        { nama: "ASTRI TRIP DOMESTIK PLATINUM" },
        { nama: "ASTRI TRIP INTERNATIONAL SILVER" },
        { nama: "ASTRI TRIP INTERNATIONAL GOLD" },
        { nama: "ASTRI TRIP INTERNATIONAL PLATINUM" },
        { nama: "ASTRI TRIP DOMESTIK SILVER FAMILY" },
        { nama: "ASTRI TRIP DOMESTIK GOLD FAMILY" },
        { nama: "ASTRI TRIP DOMESTIK PLATINUM FAMILY" },
        { nama: "ASTRI TRIP INTERNATIONAL SILVER FAMILY" },
        { nama: "ASTRI TRIP INTERNATIONAL GOLD FAMILY" },
        { nama: "ASTRI TRIP INTERNATIONAL PLATINUM FAMILY" },
        { nama: "ASTRI TRIP INTERNATIONAL ASIA" },
        { nama: "ASTRI TRIP INTERNATIONAL ASIA FAMILY" },
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
    if (
      this.state.jenisAsuransiTravel == "" ||
      this.state.jenisAsuransiTravel == "- Pilih -" ||
      this.state.jenisAsuransiTravel == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Pilih Jenis Asuransi");
    } else if (
      this.state.namaTertanggung == "" ||
      this.state.namaTertanggung == "- Pilih -" ||
      this.state.namaTertanggung == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Isi Nama Tertanggung");
    } else if (
      this.state.negaraTujuanWisata == "" ||
      this.state.negaraTujuanWisata == "- Pilih -" ||
      this.state.negaraTujuanWisata == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Pilih Negara Tujuan Wisata");
    } else if (
      this.state.tanggalPemberangkatan == "" ||
      this.state.tanggalPemberangkatan == "- Pilih -" ||
      this.state.tanggalPemberangkatan == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Isi Tanggal Pemberangkatan");
    } else if (
      this.state.tanggalKepulangan == "" ||
      this.state.tanggalKepulangan == "- Pilih -" ||
      this.state.tanggalKepulangan == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Isi Tanggal Kepulangan");
    } else if (
      this.state.tanggalKepulangan == this.state.tanggalPemberangkatan ||
      this.state.tanggalKepulangan < this.state.tanggalPemberangkatan
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert(
        "Perhatian",
        "Tanggal kepulangan tidak bisa kurang atau sama dengan tanggal keberangkatan"
      );
    } else if (
      this.state.nikPaspor == "" ||
      this.state.nikPaspor == "- Pilih -" ||
      this.state.nikPaspor == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Isi Nik/Passport");
    } else if (
      this.state.jenisKelamin == "" ||
      this.state.jenisKelamin == "- Pilih -" ||
      this.state.jenisKelamin == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Pilih Jenis Kelamin");
    } else if (
      this.state.namaAhliWaris == "" ||
      this.state.namaAhliWaris == "- Pilih -" ||
      this.state.namaAhliWaris == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Isi Nama Ahli Waris");
    } else if (
      this.state.hubunganAhliWaris == "" ||
      this.state.hubunganAhliWaris == "- Pilih -" ||
      this.state.hubunganAhliWaris == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Pilih Hubungan Ahli Waris");
    } else if (dateNow > dtConfirm) {
      this.setState({ isAlertForm: false });
      this.customAlert(
        "Perhatian",
        "Tanggal keberangkatan tidak bisa kurang dari tanggal hari ini"
      );
    } //kondisi tambahan agus 14-06-20
    else if (this.state.checkMonth < dateInputConfirm2) {
      this.setState({ isAlertForm: false });
      this.customAlert(
        "Perhatian",
        "Tanggal kepulangan tidak boleh lebih dari 1 bulan dari tanggal pemberangkatan"
      );
    } //kondisi tambahan agus 14-06-20
    else {
      this.setState({ isAlertForm: true });
    }
  }

  handleConfirm = (date) => {
    //ini code agus
    dtConfirm = moment(date).format("YYYY-MM-DD");

    this.setState({ isDatePickerVisible: false });
    this.setState({ tanggalPemberangkatan: dtConfirm });
    //ini code agus 14-06-2020 ini dilakukan untuk membuat validasi tanggal karena di ios tanggal keberangkatan auto close
  };
  handleConfirm2 = (date) => {
    dtConfirm2 = moment(date).format("YYYY-MM-DD");
    dateInputConfirm2 = date;
    var month = moment(this.state.tanggalPemberangkatan).add("1", "M");

    this.setState({ isDatePickerVisible2: false });
    this.setState({ tanggalKepulangan: dtConfirm2, checkMonth: month });
    //ini code agus 14-06-2020 ini dilakukan untuk membuat validasi tanggal karena di ios tanggal keberangkatan auto close
  };

  async onValueJenisTravel(value) {
    await this.setState({ jenisAsuransiTravel: value });
    if (value != "- Pilih -") {
      this.showDetailType(this.state.jenisAsuransiTravel);
    }
  }
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
    var form_name = "travel";
    if (
      this.state.jenisAsuransiTravel == "" ||
      this.state.jenisAsuransiTravel == "- Pilih -" ||
      this.state.jenisAsuransiTravel == null
    ) {
      this.customAlert("Perhatian", "Harap Pilih Jenis Asuransi");
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
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#3d9acc",
              height: 40,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Form Pengajuan Polis Travel{" "}
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

              <Text style={styles.titleInput}>Jenis Asuransi Travel : </Text>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
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
                    textStyle={{
                      fontSize: moderateScale(14),
                      paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                      paddingTop: Platform.OS == "ios" ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                      width: Platform.OS == "ios" ? "80%" : "100%", //ini agar icon tidak tergeser oleh text
                    }}
                    itemTextStyle={{ fontSize: moderateScale(16) }}
                    mode="dropdown"
                    placeholder="- Pilih -"
                    iosIcon={
                      <Icon
                        type="feather"
                        name="arrow-down-circle"
                        containerStyle={{ marginRight: moderateScale(13) }}
                      />
                    } //ini styling icon nya agar tidak mentok di pinggir //agus
                    selectedValue={this.state.jenisAsuransiTravel}
                    onValueChange={(value) => this.onValueJenisTravel(value)}
                  >
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
              <Text style={styles.titleInput}>Negara Tujuan : </Text>

              <View style={styles.vpicker}>
                <Picker
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == "ios" ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == "ios" ? moderateScale(5) : 0,
                  }}
                  itemTextStyle={{ fontSize: moderateScale(16) }}
                  mode="dropdown"
                  placeholder="- Pilih -"
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{ marginRight: moderateScale(13) }}
                    />
                  } //ini styling icon nya agar tidak mentok di pinggir //agus
                  selectedValue={this.state.negaraTujuanWisata}
                  onValueChange={(value) =>
                    this.setState({ negaraTujuanWisata: value })
                  }
                >
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
              <Text style={styles.titleInput}>Tanggal Keberangkatan : </Text>
              <TouchableOpacity
                onPress={() => this.showDatePicker("Pemberangkatan")}
              >
                {/* { ini ditambahkan kondisi karna teouchableopacity / highlight tdk bisa digunakan di textinput ios //agus */}
                {Platform.OS == "ios" ? (
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
                onPress={() => this.showDatePicker("Kepulangan")}
              >
                {/* { ini ditambahkan kondisi karna teouchableopacity / highlight tdk bisa digunakan di textinput ios //agus */}
                {Platform.OS == "ios" ? (
                  <View style={styles.inputs}>
                    {this.state.tanggalKepulangan == "" ? (
                      <Text style={{ color: "#C7C7CD" }}>Pilih Tanggal</Text>
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
                onChangeText={(value) => this.setState({ nikPaspor: value })}
                // onSubmitEditing={() => this.passwordInput.focus()}
                underlineColorAndroid="transparent"
              />
              <Text style={styles.titleInput}>Jenis Kelamin :</Text>
              <View style={styles.vpicker}>
                <Picker
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == "ios" ? moderateScale(5) : 0,
                    paddingBottom: Platform.OS == "ios" ? moderateScale(5) : 0,
                  }}
                  itemTextStyle={{ fontSize: moderateScale(16) }}
                  mode="dropdown"
                  placeholder="- Pilih -"
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{ marginRight: moderateScale(13) }}
                    />
                  } //ini styling icon nya agar tidak mentok di pinggir //agus
                  selectedValue={this.state.jenisKelamin}
                  onValueChange={(value) =>
                    this.setState({ jenisKelamin: value })
                  }
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

              <Text style={styles.titleInput}>Nama Ahli Waris : </Text>

              <TextInput
                style={styles.inputs}
                placeholder="Nama Ahli Waris"
                value={this.state.namaAhliWaris}
                onChangeText={(value) => this.onValueHeirName(value)}
              />
              <Text style={styles.titleInput}>Hubungan Ahli Waris :</Text>
              <View style={styles.vpicker}>
                <Picker
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                    paddingTop: Platform.OS == "ios" ? moderateScale(5) : 0, //ini agar text ada di tengah (agus)
                    paddingBottom: Platform.OS == "ios" ? moderateScale(5) : 0,
                  }}
                  itemTextStyle={{ fontSize: moderateScale(16) }}
                  mode="dropdown"
                  placeholder="- Pilih -"
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{ marginRight: moderateScale(13) }}
                    />
                  } //ini styling icon nya agar tidak mentok di pinggir //agus
                  selectedValue={this.state.hubunganAhliWaris}
                  onValueChange={(value) =>
                    this.setState({ hubunganAhliWaris: value })
                  }
                >
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

              {/* <Text style={styles.titleInput}>Tanggal Lahir : </Text>
            <View>
              <TouchableOpacity onPress={() => this.showDatePicker()}>
                <TextInput
                  style={styles.inputs}
                  placeholder="Pilih Tanggal"
                  value={this.state.dimulaiPeriode}
                  // onChangeText={nik => this.setState({chosenDate})}
                  // onSubmitEditing={() => this.passwordInput.focus()}
                  underlineColorAndroid="transparent"
                  editable={false}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.titleInput}>Nilai Pertanggungan : </Text>
            <TextInput
              style={styles.inputs}
              placeholder="Nilai Pertanggungan"
              value={this.state.dimulaiPeriode}
              // onChangeText={nik => this.setState({chosenDate})}
              onSubmitEditing={() => this.passwordInput.focus()}
              underlineColorAndroid="transparent"
            /> */}

              <View style={{ marginTop: 5, flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => this.batal()}
                  style={styles.btnBatal}
                >
                  <Text style={styles.textBtn}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.nextForm()}
                  style={styles.btnLanjut}
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
              <DateTimePickerModal
                isVisible={this.state.isDatePickerVisible2}
                mode="date"
                onConfirm={(date) => this.handleConfirm2(date)}
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
  picker: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginStart: 10,
  },
  vpicker: {
    backgroundColor: "white",
    paddingStart: 20,
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
});
export default BsPengajuanPTravel;
