import React, { Component } from "react";
import { NavigationEvents } from "react-navigation";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";
import moment from "moment";
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

class BsPengajuanPTravel2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jenisAsuransiTravel: "",
      namaTertanggung: "",
      negaraTujuanWisata: "",
      tanggalPemberangkatan: "",
      nikPaspor: "",
      jenisKelamin: "",
      namaAhliWaris: "",
      selectedGender: "",
      hubunganAhliWaris: "",
      modalVisible: false,
      isDatePickerVisible: false,
      gender: [
        { id: "0", nama: "- Pilih -" },
        { id: "1", nama: "Laki - Laki" },
        { id: "2", nama: "Wanita" },
      ],
      gender2: [
        { id: "0", nama: "- Pilih -" },
        { id: "1", nama: "Suami" },
        { id: "2", nama: "Anak Perempuan" },
        { id: "3", nama: "Bapak" },
        { id: "4", nama: "Istri" },
        { id: "5", nama: "Saudara Laki-laki" },
        { id: "6", nama: "Ibu" },
        { id: "7", nama: "Anak Laki-laki" },
        { id: "8", nama: "Saudara Perempuan" },
        { id: "9", nama: "Orang Tua" },
      ],
    };
  }
  componentDidMount() {
    this.props.onTravel2(this);
  }
  componentWillUnmount() {
    this.props.onTravel2(undefined);
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
    // this.renderModal();
  }
  showDatePicker = () => {
    this.setState({ isDatePickerVisible: true });
  };
  batal() {
    this.setState({ modalVisible: false });
    this.props.messageCancel("batal");
  }
  nextForm() {
    this.setState({ modalVisible: false });
  }
  handleConfirm = (date) => {
    var dt = moment(date).format("DD/MM/YYYY");

    this.setState({ isDatePickerVisible: false });
    this.setState({ dimulaiPeriode: dt });
  };
  onValueAhliwaris = (value) => {
    this.setState({ hubunganAhliWaris: value });
  };
  onValueGender = (value) => {
    this.setState({ selectedGender: value });
  };
  render() {
    return (
      <Modal.BottomModal
        onHardwareBackPress={() => true}
        modalStyle={styles.bottomSheet}
        visible={this.state.modalVisible}
        rounded
        actionsBordered
        onTouchOutside={() => {
          // this.setState({modalVisible: false});
        }}
      >
        <ModalTitle
          style={styles.titleBottomSheeet}
          textStyle={{ fontSize: 16, color: "white" }}
          title="Form Pengajuan Polis Travel"
        />
        <ModalContent style={styles.contentbottomSheet}>
          <View style={{ width: "100%", paddingRight: 5 }}>
            <Text style={styles.titleInput}>Jenis Kelamin :</Text>
            <View style={styles.vContentPicker}>
              <Picker
                mode="dropdown"
                placeholder="- Pilih -"
                iosIcon={<Icon type="feather" name="arrow-down-circle" />}
                selectedValue={this.state.selectedGender}
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

            <Text style={styles.titleInput}>Nama Ahli Waris : </Text>

            <TextInput
              style={styles.inputs}
              placeholder="Nama Ahli Waris"
              value={this.state.alamat}
            />
            <Text style={styles.titleInput}>Hubungan Ahli Waris :</Text>
            <View style={styles.vContentPicker}>
              <Picker
                mode="dropdown"
                placeholder="- Pilih -"
                iosIcon={<Icon type="feather" name="arrow-down-circle" />}
                selectedValue={this.state.hubunganAhliWaris}
                onValueChange={(value) => this.onValueAhliwaris(value)}
              >
                {this.state.gender2.map((gender, key) => {
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
        </ModalContent>
      </Modal.BottomModal>
    );
  }
}
const styles = StyleSheet.create({
  titleInput: {
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 2,
    marginTop: 10,
  },
  inputs: {
    width: "100%",
    color: "#989a9d",
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
  bottomSheet: {
    backgroundColor: "transparent",
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
    backgroundColor: "#ededed",
    marginStart: 5,
    marginEnd: 5,
    alignItems: "center",
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
  },
  vContentPicker: {
    paddingHorizontal: 14,
    backgroundColor: "white",
    // paddingVertical: '1%',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    elevation: 5,
  },
});

export default BsPengajuanPTravel2;
