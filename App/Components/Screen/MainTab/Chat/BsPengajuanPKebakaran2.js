import React, { Component } from "react";
import ImagePicker from "react-native-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";
import moment from "moment";
import RBSheet from "react-native-raw-bottom-sheet";
import { getValue } from "./../../../../Modules/LocalData";
import { getDataWithHeader } from "./../../../../Services";
import ApiEndPoint from "./../../../../Modules/Utils/ApiEndPoint";
import Api from "../../../../Utils/Api";
import { Picker } from "native-base";
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

class BsPengajuanPKebakaran2 extends Component {
  constructor(props) {
    super(props);
    dataUser();
    this.dataForm1 = {};
    this.state = {
      id_user: id,
      token: tok,
      kelasKontruksi: "",
      alamatLetakObyek: "",
      provinsi: "",
      kota: "",
      kelurahan: "",
      kecamatan: "",
      kodePos: "",
      nilaiBangunan: "",
      nilaiPerabot: "0",
      notif: 0,
      checkJailStatus: "",
      modalVisible: false,
      isDatePickerVisible: false,
      pickerProv: false,
      pickerKota: false,
      pickerKecamatan: false,
      pickerKelurahan: false,
      isAlertForm: true,
      isbtnKTP: true,
      valueProvincies: [],
      valueCity: [],
      valueKecamatan: [],
      valueKelurahan: [],
      valueKodePos: [],
      dataFileKTP: "",
      nameFileKTP: "",
      dataFileSTNK: "",
      dataFileBangunanDepan: "",
      dataFileBangunanSamping: "",
      dataFilePerabot: "",

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
      valueKelasKonstruksi: [
        { id: "0", nama: "- Pilih -" },
        { id: "Class I", nama: "Kelas I" },
        { id: "Class II", nama: "Kelas II" },
        { id: "Class III", nama: "Kelas III" },
      ],
    };
  }
  // componentWillReceiveProps(nextProps) {
  //   this.setState({modalVisible: nextProps.value});
  // }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }
  async getProvincinces() {
    await getDataWithHeader(
      Api.base_url2 + "tripa/" + id + "/get-provinces",
      tok
    )
      .then((res) => {
        if (res.success != false) {
          this.setState({ valueProvincies: res.data });
          this.setState({ pickerProv: true });
        } else {
        }
      })
      .catch((err) => {
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
    let id_prov = "";
    let value_kota = "";
    await this.state.valueProvincies.map((data) => {
      if (data.nama_provinsi == this.state.provinsi) {
        id_prov = data.id_provinsi;
      }
    });
    await getDataWithHeader(
      Api.base_url2 + "tripa/" + id + "/get-cities/" + id_prov,
      tok
    )
      .then((res) => {
        if (res.success != false) {
          this.setState({ valueCity: res.data });
          this.setState({ pickerKota: true });
        } else {
        }
      })
      .catch((err) => {
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
    let id_city = "";
    let value_city = "";
    await this.state.valueCity.map((data) => {
      if (data.nama_kabupaten == this.state.kota) {
        id_city = data.id_kabupaten;
      }
    });
    // console.log('get getKecamatan', id_city);

    await getDataWithHeader(
      Api.base_url2 + "tripa/" + id + "/get-districts/" + id_city,
      tok
    )
      .then((res) => {
        if (res.success != false) {
          this.setState({ valueKecamatan: res.data });
          this.setState({ pickerKecamatan: true });

          // console.log('getKota ' + this.state.valueKecamatan);
        } else {
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  async getVillage() {
    await this.setState({
      pickerKelurahan: false,
      valueKelurahan: [],
    });
    let id_district = "";
    let value_city = "";
    let name_district = "";
    await this.state.valueKecamatan.map((data) => {
      if (data.nama_kecamatan == this.state.kecamatan) {
        id_district = data.id_kabupaten;
        name_district = data.nama_kecamatan;
      }
    });
    // console.log('get getKecamatan', id_district);

    await getDataWithHeader(
      Api.base_url2 +
        "tripa/" +
        id +
        "/get-vilages/" +
        id_district +
        "/" +
        name_district,
      tok
    )
      .then((res) => {
        if (res.success != false) {
          this.setState({ valueKelurahan: res.data });
          this.setState({ pickerKelurahan: true });

          // console.log('getKota ' + this.state.valueKecamatan);
        } else {
        }
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status == 401) {
          removeValue("userData");
          removeValue("hasLogin");
          removeValue("fcm");
          this.props.navigation.navigate("Login");
        }
      });
  }

  async getKodePos() {
    await this.setState({
      valueKodePos: [],
    });
    let id_kabupaten = "";
    await this.state.valueCity.map((data) => {
      if (data.nama_kabupaten == this.state.kota) {
        id_kabupaten = data.id_kabupaten;
      }
    });
    // console.log('get getKecamatan', id_district);

    await getDataWithHeader(
      Api.base_url2 +
        "tripa/" +
        id +
        "/get-kode-pos/" +
        id_kabupaten +
        "/" +
        this.state.kecamatan +
        "/" +
        this.state.kelurahan,
      tok
    )
      .then((res) => {
        if (res.success != false) {
          this.setState({
            kodePos: res.data[0].kode_pos,
          });
        } else {
        }
      })
      .catch((err) => {});
  }

  async onValueProvince(value) {
    await this.setState({ provinsi: value });
    await this.getCity();
  }
  async onValueCity(value) {
    await this.setState({ kota: value });
    await this.getDistricts();
  }
  async onValueDistrict(value) {
    await this.setState({ kecamatan: value });
    await this.getVillage();
  }
  async onValueVillage(value) {
    await this.setState({ kelurahan: value, kodePos: "" });
    await this.getKodePos();
  }

  async setModalVisible(data, title) {
    this.RBSheet.open();
    if (title == "Asuransi Kebakaran Syariah") {
      this.setState({ modalVisible: true, title });
    }
    if (data != null || data != undefined) {
      this.dataForm1 = data;
    }
    this.getProvincinces();
  }

  showDatePicker = () => {
    this.setState({ isDatePickerVisible: true });
  };

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
      this.state.kelasKontruksi == "" ||
      this.state.kelasKontruksi == "- Pilih -" ||
      this.state.kelasKontruksi == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Isi Kelas Konstruksi");
    } else if (
      this.state.alamatLetakObyek == "" ||
      this.state.alamatLetakObyek == "- Pilih -" ||
      this.state.alamatLetakObyek == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert(
        "Perhatian",
        "Harap Isi Alamat Letak Objek Yang Dipertangguhkan"
      );
    } else if (
      this.state.provinsi == "" ||
      this.state.provinsi == "- Pilih -" ||
      this.state.provinsi == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Isi Provinsi");
    } else if (
      this.state.kota == "" ||
      this.state.kota == "- Pilih -" ||
      this.state.kota == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Isi Kota");
    } else if (
      this.state.kecamatan == "" ||
      this.state.kecamatan == "- Pilih -" ||
      this.state.kecamatan == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Isi Kecamatan");
    } else if (
      this.state.kelurahan == "" ||
      this.state.kelurahan == "- Pilih -" ||
      this.state.kelurahan == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Isi Kelurahan");
    } else if (
      this.state.kodePos == "" ||
      this.state.kodePos == "- Pilih -" ||
      this.state.kodePos == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Isi Kode POS");
    } else if (
      this.state.nilaiBangunan == "" ||
      this.state.nilaiBangunan == "- Pilih -" ||
      this.state.nilaiBangunan == null
    ) {
      this.setState({ isAlertForm: false });
      this.customAlert("Perhatian", "Harap Isi Nilai Bangunan");
    } else if (
      this.state.nilaiPerabot == "" ||
      this.state.nilaiPerabot == null
    ) {
      this.setState({ isAlertForm: false, nilaiPerabot: "0" });
      // this.customAlert('Perhatian', 'Harap Isi Nilai Perabot');
    } else {
      this.setState({ isAlertForm: true });
    }
  }

  batal() {
    this.setState({ modalVisible: false });
    // this.resetField();
    // this.props.messageCancel('batal');
    this.RBSheet.close();
    setTimeout(() => {
      this.props.backToWildFire();
    }, 1000);
  }

  async nextForm() {
    await this.validationsForm();
    if (this.state.isAlertForm == true) {
      // if (
      //   this.dataForm1.insurance_type == 'ASTRI HOD (HOME ON DEMAND)'
      // ) {
      var dataForm = {
        kode_referal: this.dataForm1.referal_code,
        insurance_type: this.dataForm1.insurance_type,
        //
        floods_and_hurricane: this.dataForm1.floods_and_hurricane,
        hit_vehicle: this.dataForm1.hit_vehicle,
        riot_and_damage: this.dataForm1.riot_and_damage,
        //
        name: this.dataForm1.name,
        month_period: this.dataForm1.month_period,
        start_insurance_period: this.dataForm1.start_insurance_period,
        insurance_object: this.dataForm1.insurance_object,
        class: this.state.kelasKontruksi,
        insurance_object_address: this.state.alamatLetakObyek,
        village: this.state.kelurahan,
        sub_district: this.state.kecamatan,
        postal_code: this.state.kodePos,
        building_value: this.state.nilaiBangunan.replace(/,.*|[^0-9]/g, ""),
        furniture_value: this.state.nilaiPerabot.replace(/,.*|[^0-9]/g, ""),
        // foto_ktp_insurance: this.state.dataFileKTP,
      };

      this.props.sendToChat(JSON.stringify(dataForm));
      this.RBSheet.close();
      setTimeout(() => {
        this.resetField();
      }, 1000);

      // this.props.showUploadFile('polis_kebakaran');
    }
  }
  resetField() {
    this.setState({
      modalVisible: false,
      kelasKontruksi: "",
      alamatLetakObyek: "",
      provinsi: "",
      kota: "",
      kelurahan: "",
      kecamatan: "",
      kodePos: "",
      nilaiBangunan: "",
      nilaiPerabot: "0",
      notif: 0,
      checkJailStatus: "",
      modalVisible: false,
      isDatePickerVisible: false,
      pickerProv: false,
      pickerKota: false,
      pickerKecamatan: false,
      pickerKelurahan: false,
      isAlertForm: true,
      isbtnKTP: true,
      valueProvincies: [],
      valueCity: [],
      valueKecamatan: [],
      valueKelurahan: [],
      valueKodePos: [],
      dataFileKTP: "",
      nameFileKTP: "",
      dataFileSTNK: "",
      dataFileBangunanDepan: "",
      dataFileBangunanSamping: "",
      dataFilePerabot: "",
      title: "",
    });
  }
  handleConfirm = (date) => {
    var dt = moment(date).format("DD/MM/YYYY");
    console.log("date", dt);

    this.setState({ isDatePickerVisible: false });
    this.setState({ dimulaiPeriode: dt });
  };

  onValueJenisAuransi = (value) => {
    this.setState({ kelasKontruksi: value });
  };

  onValueObjekOkupasi = (value) => {
    this.setState({ objekOkupasi: value });
  };

  async onValueNilaiBangunan(v) {
    let value = v;
    if (value == null || value == "") {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ""), 10);
    } catch {}

    // console.log('format money', this.convertToRupiah(value));
    await this.setState({ nilaiBangunan: this.convertToRupiah(aa) });
  }

  async onValueNilaiPerabot(value) {
    if (value == null || value == "") {
      value = 0;
    }
    try {
      var aa = parseInt(value.replace(/,.*|[^0-9]/g, ""), 10);
    } catch {}
    await this.setState({ nilaiPerabot: this.convertToRupiah(aa) });
  }

  async onValueKelas(value) {
    await this.setState({ kelasKontruksi: value });
    if (value != "- Pilih -") {
      this.showDetailType(this.state.kelasKontruksi);
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

  async chooseFileKtp() {
    if (this.state.isbtnKTP == true) {
      this.setState({ isbtnKTP: false });
      var options = {
        title: "Pilih Gambar",
        cancelButtonTitle: "batal",
        takePhotoButtonTitle: "Ambil Foto",
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
          skipBackup: true,
          path: "images",
        },
      };
      await ImagePicker.launchCamera(options, (response) => {
        // console.log('Response = ', response);
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
          alert(response.customButton);
        } else {
          let source = response;
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };
          this.setState({
            dataFileKTP: source.data,
            nameFileKTP: source.fileName,
          });
          // this.simpanProfile();
        }
      });
      this.setState({ isbtnKTP: true });
    }
  }
  showDetailType() {
    var form_name = "fire2";
    if (
      this.state.kelasKontruksi == "" ||
      this.state.kelasKontruksi == "- Pilih -" ||
      this.state.kelasKontruksi == null
    ) {
      this.customAlert("Perhatian", "Harap Pilih Jenis Asuransi");
    } else {
      this.RBSheet.close();
      setTimeout(() => {
        this.props.showDetailType(this.state.kelasKontruksi, form_name);
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
                ? " Form Pengajuan Polis Kebakaran"
                : "Asuransi Kebakaran Syariah"}
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
              <Text style={styles.titleInput}>
                Kelas Konstruksi Bangunan :{" "}
              </Text>
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
                    style={styles.picker}
                    itemTextStyle={{
                      fontSize:
                        Platform.OS == "ios"
                          ? moderateScale(16)
                          : moderateScale(16),
                    }}
                    textStyle={{
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
                    selectedValue={this.state.kelasKontruksi}
                    onValueChange={(value) => this.onValueKelas(value)}
                  >
                    {this.state.valueKelasKonstruksi.map((data, key) => {
                      return (
                        <Picker.Item
                          style={{
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                          key={key}
                          label={data.nama}
                          value={data.id}
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
              <Text style={styles.titleInput}>
                Alamat letak objek yang dipertanggungjawabkan :
              </Text>
              <View
                style={{
                  backgroundColor: "white",
                  paddingHorizontal:
                    Platform.OS == "ios"
                      ? moderateScale(16)
                      : moderateScale(16),
                  borderRadius: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  elevation: 5,
                }}
              >
                <TextInput
                  style={{
                    fontSize: moderateScale(14),
                    color: "black",
                    fontFamily: "HKGrotesk-Regular",
                    paddingTop: "3%",
                    paddingBottom: "3%",
                    marginTop: 3,
                    borderRadius: 9,
                    backgroundColor: "#fff",
                  }}
                  placeholder="Alamat letak objek"
                  onChangeText={(alamatLetakObyek) =>
                    this.setState({ alamatLetakObyek })
                  }
                  value={this.state.alamatLetakObyek}
                />
              </View>
              <Text style={styles.titleInput}>Provinsi : </Text>
              <View style={styles.vpicker}>
                {!this.state.pickerProv && (
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                  </View>
                )}
                <Picker
                  style={Platform.OS == "ios" ? {} : styles.picker}
                  itemTextStyle={{
                    fontSize:
                      Platform.OS == "ios"
                        ? moderateScale(16)
                        : moderateScale(16),
                  }}
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                  }}
                  enabled={this.state.pickerProv}
                  mode="dropdown"
                  placeholder="- Pilih -"
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{ marginRight: moderateScale(13) }}
                    />
                  } //ini styling icon nya agar tidak mentok di pinggir //agus
                  selectedValue={this.state.provinsi}
                  onValueChange={(value) => this.onValueProvince(value)}
                >
                  {this.state.valueProvincies.map((data, key) => {
                    return (
                      <Picker.Item
                        style={{
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                        key={key}
                        label={data.nama_provinsi}
                        value={data.nama_provinsi}
                      />
                    );
                  })}
                </Picker>
              </View>

              <Text style={styles.titleInput}>Kota : </Text>

              <View style={styles.vpicker}>
                {!this.state.pickerKota && (
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                  </View>
                )}
                <Picker
                  style={Platform.OS == "ios" ? {} : styles.picker}
                  itemTextStyle={{
                    fontSize:
                      Platform.OS == "ios"
                        ? moderateScale(16)
                        : moderateScale(16),
                  }}
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                  }}
                  enabled={this.state.pickerKota}
                  mode="dropdown"
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{ marginRight: moderateScale(13) }}
                    />
                  } //ini styling icon nya agar tidak mentok di pinggir //agus
                  placeholder="- Pilih -"
                  selectedValue={this.state.kota}
                  onValueChange={(value) => this.onValueCity(value)}
                >
                  {this.state.valueCity.map((data, key) => {
                    return (
                      <Picker.Item
                        style={{
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                        key={key}
                        label={data.nama_kabupaten}
                        value={data.nama_kabupaten}
                      />
                    );
                  })}
                </Picker>
              </View>

              <Text style={styles.titleInput}>Kecamatan : </Text>
              <View style={styles.vpicker}>
                {!this.state.pickerKecamatan && (
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                  </View>
                )}
                <Picker
                  style={Platform.OS == "ios" ? {} : styles.picker}
                  itemTextStyle={{
                    fontSize:
                      Platform.OS == "ios"
                        ? moderateScale(16)
                        : moderateScale(16),
                  }}
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                  }}
                  enabled={this.state.pickerKecamatan}
                  mode="dropdown"
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{ marginRight: moderateScale(13) }}
                    />
                  } //ini styling icon nya agar tidak mentok di pinggir //agus
                  placeholder="- Pilih -"
                  selectedValue={this.state.kecamatan}
                  onValueChange={(value) => this.onValueDistrict(value)}
                >
                  {this.state.valueKecamatan.map((data, key) => {
                    return (
                      <Picker.Item
                        style={{
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                        key={key}
                        label={data.nama_kecamatan}
                        value={data.nama_kecamatan}
                      />
                    );
                  })}
                </Picker>
              </View>
              <Text style={styles.titleInput}>Kelurahan : </Text>
              <View style={styles.vpicker}>
                {!this.state.pickerKelurahan && (
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                  </View>
                )}
                <Picker
                  style={Platform.OS == "ios" ? {} : styles.picker}
                  itemTextStyle={{
                    fontSize:
                      Platform.OS == "ios"
                        ? moderateScale(16)
                        : moderateScale(16),
                  }}
                  textStyle={{
                    fontSize: moderateScale(14),
                    paddingLeft: Platform.OS == "ios" ? 0 : moderateScale(5),
                  }}
                  enabled={this.state.pickerKelurahan}
                  mode="dropdown"
                  iosIcon={
                    <Icon
                      type="feather"
                      name="arrow-down-circle"
                      containerStyle={{ marginRight: moderateScale(13) }}
                    />
                  } //ini styling icon nya agar tidak mentok di pinggir //agus
                  placeholder="- Pilih -"
                  selectedValue={this.state.kelurahan}
                  onValueChange={(value) => this.onValueVillage(value)}
                >
                  {this.state.valueKelurahan.map((data, key) => {
                    return (
                      <Picker.Item
                        style={{
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                        key={key}
                        label={data.nama_kelurahan}
                        value={data.nama_kelurahan}
                      />
                    );
                  })}
                </Picker>
              </View>
              <Text style={styles.titleInput}>Kode Pos : </Text>
              <TextInput
                editable={false}
                keyboardType={"numeric"}
                style={styles.inputs}
                placeholder="Kode Pos"
                value={this.state.kodePos}
                onChangeText={(kodePos) => this.setState({ kodePos })}
                // onSubmitEditing={() => this.passwordInput.focus()}
                underlineColorAndroid="transparent"
              />

              <Text style={styles.titleInput}>Obyek Pertanggungan : </Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                <Text style={{ flex: 1, marginLeft: 16, marginTop: 10 }}>
                  Nilai Bangunan Tanpa Pondasi{" "}
                </Text>
                <TextInput
                  style={styles.input2}
                  keyboardType={"numeric"}
                  value={this.state.nilaiBangunan}
                  onChangeText={(nilaiBangunan) =>
                    this.onValueNilaiBangunan(nilaiBangunan)
                  }
                  // onSubmitEditing={() => this.passwordInput.focus()}
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ flex: 1, marginLeft: 16, marginTop: 10 }}>
                  Nilai Perabot{" "}
                </Text>
                <TextInput
                  style={styles.input2}
                  keyboardType={"numeric"}
                  value={this.state.nilaiPerabot}
                  onChangeText={(nilaiPerabot) =>
                    this.onValueNilaiPerabot(nilaiPerabot)
                  }
                  // onSubmitEditing={() => this.passwordInput.focus()}
                  underlineColorAndroid="transparent"
                />
              </View>

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
    fontSize: moderateScale(14),
  },
  input2: {
    width: "100%",
    color: "black",
    paddingTop: "3%",
    paddingBottom: "3%",
    paddingLeft: "5%",
    paddingRight: "5%",
    marginLeft: 5,
    borderRadius: 9,
    backgroundColor: "#fff",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    elevation: 5,
    fontSize: moderateScale(14),
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
  btnFoto: {
    flex: 1,
    color: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF8033",
  },
  textBtn: {
    color: "white",
    fontFamily: "HKGrotesk-Regular",
  },
  picker: {
    fontSize: Platform.OS == "ios" ? moderateScale(16) : moderateScale(16),
    // marginStart: 10,
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

export default BsPengajuanPKebakaran2;
