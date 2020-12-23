import React, { Component } from "react";
import { NavigationEvents } from "react-navigation";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";
import moment from "moment";
import RBSheet from "react-native-raw-bottom-sheet";

import Modal, {
  ModalTitle,
  ModalContent,
  ModalFooter,
  ModalButton,
  SlideAnimation,
  ScaleAnimation,
} from "react-native-modals";
import {
  View,
  Text,
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

class BsPengajuanPPA2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      namaTertanggung: "",
      jenisKelamin: "",
      tglLahir: "",
      nikPaspor: "",
      nilaiPertanggungan: "",
      periodeAsuransi: "",
      tglDimulaiAsuransi: "",
      namaAhliWaris: "",
      hubunganAhliWaris: "",

      modalVisible: false,
      isDatePickerVisible: false,
      valueAtasPilihanAsuransi: [
        { id: "0", nama: "- Pilih -" },
        { id: "1", nama: "Personal Accident Paket SILVER" },
        { id: "2", nama: "Personal Accident Paket GOLD" },
        { id: "3", nama: "Personal Accident Paket PLATINUM" },
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
    };
  }
  componentDidMount() {
    this.props.onPPA2(this);
  }
  componentWillUnmount() {
    this.props.onPPA2(undefined);
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
    this.RBSheet.open();
  }
  showDatePicker = () => {
    this.setState({ isDatePickerVisible: true });
  };
  batal() {
    this.setState({ modalVisible: false });
    this.props.messageCancel("batal");
    this.RBSheet.close();
  }
  nextForm() {
    this.setState({ modalVisible: false });
    this.RBSheet.close();
  }
  handleConfirm = (date) => {
    var dt = moment(date).format("DD/MM/YYYY");

    this.setState({ isDatePickerVisible: false });
    this.setState({ tglLahir: dt });
  };
  onValueGender = (value) => {
    this.setState({ selectedGender: value });
  };
  onValuePeriodePertanggungan = (value) => {
    this.setState({ periodeAsuransi: value });
  };
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
              Form Pengajuan Polis Personal Accident (2){" "}
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
                    mode="dropdown"
                    style={{ alignItems: "center" }}
                    selectedValue={this.state.periodeAsuransi}
                    onValueChange={(value) =>
                      this.onValuePeriodePertanggungan(value)
                    }
                    iosIcon={<Icon name="arrow-down" />}
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
              <Text style={styles.titleInput}>Atas Pilihan Asuransi : </Text>
              <View style={styles.vContentPicker}>
                <Picker
                  mode="dropdown"
                  placeholder="- Pilih -"
                  iosIcon={<Icon type="feather" name="arrow-down-circle" />}
                  selectedValue={this.state.selectedGender}
                  onValueChange={(value) => this.onValueGender(value)}
                >
                  {this.state.valueAtasPilihanAsuransi.map((gender, key) => {
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
                  <Text style={styles.textBtn}>Ajukan</Text>
                </TouchableOpacity>
              </View>

              <DateTimePickerModal
                isVisible={this.state.isDatePickerVisible}
                mode="date"
                onConfirm={(date) => this.handleConfirm(date)}
                onCancel={this.hideDatePicker}
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
  picker: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    justifyContent: "flex-start",
    alignItems: "flex-start",
    left: -35,
    width: "120%",
  },
});

export default BsPengajuanPPA2;
