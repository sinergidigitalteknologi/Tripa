import React, { Component } from "react";
import ImagePicker from "react-native-image-picker";
import { RNCamera } from "react-native-camera";
import { postDataWitHeader } from "./../../../../Services";
import { getDataWithHeader } from "./../../../../Services";

import { Icon } from "react-native-elements";
import moment from "moment";
import RBSheet from "react-native-raw-bottom-sheet";
import { getValue } from "./../../../../Modules/LocalData";
import ApiEndPoint from "./../../../../Modules/Utils/ApiEndPoint";
import Api from "../../../../Utils/Api";
import Geolocation from "@react-native-community/geolocation";
import { getStatusBarHeight } from "react-native-status-bar-height";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

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
  ActivityIndicator,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  DeviceEventEmitter,
  LayoutAnimation,
  Platform,
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

class BsUploadFoto extends Component {
  constructor(props) {
    super(props);
    dataUser();
    this.state = {
      modalVisible: false,

      id_polis: "",

      dataFileKTP: "",
      nameFileKTP: "",
      dataFileSTNK: "",
      nameFileSTNK: "",
      dataFileDepan: "",
      nameFileDepan: "",
      dataFileBelakang: "",
      nameFileBelakang: "",
      dataFileDashboard: "",
      nameFileDashboard: "",
      dataFilePeralatan: "",
      nameFilePeralatan: "",

      dataFileKTPTertanggung: "",
      nameFileKTPTertanggung: "",
      dataFileKTPPemilikObj: "",
      nameFileKTPPemilikObj: "",
      dataFileBangunanDepan: "",
      nameFileBangunanDepan: "",
      dataFileSebelah: "",
      nameFileSebelah: "",
      dataFilePerabotan: "",
      nameFilePerabotan: "",
      isbtnKTP: true,
      isPhoto: true,
      errorHit: false,
      message: "",
      latitude: "",
      longitude: "",
      isCamera: false,
      isIndex: "",
      cameraType: "back",

      title: "",

      dataUpload: [
        {
          id: 0,
          title: "Foto KTP Tertanggung \n",
          name: "",
          data: "",
          path: require("./../../../../assets/image/photo_ktp.jpeg"),
          uri: "",
        },
        {
          id: 1,
          title: "Foto Selfie Tertanggung + KTP \n",
          name: "",
          data: "",
          path: require("./../../../../assets/image/photo_ktp.jpeg"),
          uri: "",
        },
        {
          id: 2,
          title: " Foto tampak bangunan depan \n",
          name: "",
          data: "",
          path: require("./../../../../assets/image/no_image.png"),
          uri: "",
        },
        {
          id: 3,
          title: " Foto bangunan sebalah kiri / kanan bangunan",
          name: "",
          data: "",
          path: require("./../../../../assets/image/no_image.png"),
          uri: "",
        },
        {
          id: 4,
          title: " Foto perabot yang diasuransikan \n",
          name: "",
          data: "",
          path: require("./../../../../assets/image/no_image.png"),
          uri: "",
        },
      ],
    };
  }

  componentDidMount() {
    this.props.onUploadFoto(this);
    // Geolocation.getCurrentPosition(info => {
    //   this.setState({
    //     latitude: info.coords.latitude,
    //     longitude: info.coords.longitude,
    //   });
    // });
  }
  componentWillUnmount() {
    this.props.onUploadFoto(undefined);
  }
  componentDidUpdate() {}

  async getLocation() {
    if (Platform.OS == "android") {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message:
          "<h2>Aktivkan Lokasi Perangkat</h2>Aplikasi ini membutuhkan lokasi anda:<br/><br/>Menggunakan GPS, Wi-Fi, dan jaringan untuk mengakses lokasi<br/><br/>",
        ok: "YES",
        cancel: "NO",
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
        preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
        providerListener: true, // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
      })
        .then(
          function (success) {
            // success => {alreadyEnabled: true, enabled: true, status: "enabled"}
            Geolocation.getCurrentPosition(
              (position) => {
                let initialPosition = JSON.stringify(position);
                this.setState({ initialPosition });
                this.setState({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
              },
              (error) => console.log(error),
              { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
            );
          }.bind(this)
        )
        .catch((error) => {
          console.log("Error LocationServicesDialogBox", error.message);
        });

      DeviceEventEmitter.addListener("locationProviderStatusChange", function (
        status
      ) {
        // only trigger when "providerListener" is enabled
        console.log("LocationServicesDialogBox ", status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
      });
    } else {
      Geolocation.getCurrentPosition(
        (position) => {
          let initialPosition = JSON.stringify(position);
          this.setState({ initialPosition });
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.log(error),
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
      );
    }
  }

  setModalVisible(value, title) {
    this.RBSheet.open();
    if (title == "Asuransi Kebakaran Syariah") {
      this.setState({ title: title });
    } else {
      this.setState({ title: "" });
    }

    if (value != null) {
      value.map((dataColumn, index) => {
        if (dataColumn.label == "id_polis") {
          this.setState({ id_polis: dataColumn.value });
        }
      });
    }
    this.getLocation();
  }
  batal() {
    this.setState({ modalVisible: false });
    this.props.messageCancel("batal");
    this.RBSheet.close();
    this.resetForm();
    // this.RBSheetAllert.open();
  }
  nextForm() {
    this.setState({ modalVisible: false });
    this.postFoto();
  }

  resetForm() {
    this.setState({
      title: "",
      dataUpload: [
        {
          id: 0,
          title: "Foto KTP Tertanggung \n",
          name: "",
          data: "",
          path: require("./../../../../assets/image/photo_ktp.jpeg"),
          uri: "",
        },
        {
          id: 1,
          title: "Foto Selfie Tertanggung + KTP\n",
          name: "",
          data: "",
          path: require("./../../../../assets/image/photo_ktp.jpeg"),
          uri: "",
        },
        {
          id: 2,
          title: " Foto tampak bangunan depan \n",
          name: "",
          data: "",
          path: require("./../../../../assets/image/no_image.png"),
          uri: "",
        },
        {
          id: 3,
          title: " Foto bangunan sebalah kiri / kanan bangunan",
          name: "",
          data: "",
          path: require("./../../../../assets/image/no_image.png"),
          uri: "",
        },
        {
          id: 4,
          title: " Foto perabot yang diasuransikan \n",
          name: "",
          data: "",
          path: require("./../../../../assets/image/no_image.png"),
          uri: "",
        },
      ],
    });
  }

  changeCamera() {
    if (this.state.cameraType == "back") {
      this.setState({ cameraType: "front" });
    } else {
      this.setState({ cameraType: "back" });
    }
  }
  renderUploadPhoto() {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetUploadPhoto = ref;
        }}
        height={
          Platform.OS == "ios"
            ? Dimensions.get("window").height - getStatusBarHeight()
            : Dimensions.get("window").height
        }
        closeOnPressMask={false}
        duration={250}
        customStyles={{
          container: {
            backgroundColor: "black",
            justifyContent: "center",
            alignContent: "center",
          },
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => this.changeCamera()}>
              <Image
                style={{
                  height: 40,
                  width: 50,
                  resizeMode: "stretch",
                  marginTop: 5,
                  justifyContent: "center",
                }}
                source={require("../../../../assets/image/swicthCamera.png")}
              />
            </TouchableOpacity>
          </View>

          <RNCamera
            style={{ flex: 1, alignItems: "center" }}
            ref={(ref) => {
              this.camera = ref;
            }}
            // type={RNCamera.Constants.Type.back}
            type={this.state.cameraType}
            // flashMode={RNCamera.Constants.FlashMode.on}
            androidCameraPermissionOptions={{
              title: "Permission to use camera",
              message: "We need your permission to use your camera",
              buttonPositive: "Ok",
              buttonNegative: "Cancel",
            }}
          />
          <View
            style={{
              backgroundColor: "black",
              flex: 0,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={this.takePicture.bind(this)}
              style={styles.capture}
            >
              <Text style={{ fontSize: 14 }}> </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  }
  async takePicture() {
    if (this.camera) {
      const options = { width: 500, quality: 0.2, base64: true };
      const data = await this.camera.takePictureAsync(options);
      this.state.dataUpload[this.state.isIndex].data = data.base64;
      this.state.dataUpload[this.state.isIndex].uri = data.uri;
      this.setState({ isPhoto: false });

      this.RBSheetUploadPhoto.close();

      setTimeout(() => {
        this.RBSheet.open();
      }, 1000);

      //         this.setState({isPhoto: false});
    }
  }
  async chooseFile(index) {
    await this.setState({ isIndex: index });
    this.RBSheet.close();
    setTimeout(() => {
      this.RBSheetUploadPhoto.open();
    }, 1000);
  }

  async validationForm() {
    this.state.dataUpload.map((value, index) => {
      if (
        this.state.dataUpload[index].data == null ||
        this.state.dataUpload[index].data == ""
      ) {
        this.setState({ errorHit: true, message: "Harap lengkapi semua foto" });
        this.RBSheet.close();
        setTimeout(() => {
          this.RBSheetAllert.open();
        }, 500);
      } else if (this.state.longitude == "" || this.state.latitude == "") {
        this.getLocation();
        this.setState({
          errorHit: true,
          message: "Harap nyalakan lokasi anda",
        });
        this.RBSheet.close();
        setTimeout(() => {
          this.RBSheetAllert.open();
        }, 500);
      }
    });
  }
  async postFoto() {
    this.setState({ errorHit: false });
    await this.validationForm();
    if (this.state.errorHit == false) {
      this.RBSheet.close();
      setTimeout(() => {
        this.RBSheetLoading.open();
      }, 1000);
      // return console.log('post Foto ', this.state.latitude);
      var param = {
        id_polis: this.state.id_polis,
        foto_ktp_insurance: this.state.dataUpload[0].data,
        foto_ktp_owner_insurance: this.state.dataUpload[1].data,
        foto_front_building: this.state.dataUpload[2].data,
        foto_right_left_building: this.state.dataUpload[3].data,
        foto_insurance_perabot: this.state.dataUpload[4].data,
        time_send_foto: moment().format("YYYY-MM-DD HH:mm:ss"),
        latitude_send_foto: this.state.latitude,
        longitude_send_foto: this.state.longitude,
      };
      await postDataWitHeader(
        Api.base_url2 + "tripa/" + id + "/upload_foto_pengajuan_kebakaran",
        param,
        tok
      )
        .then((res) => {
          if (res.success != false) {
            console.log("postFoto ");
            this.RBSheetLoading.close();
            this.setState({ message: "berhasil", errorHit: false });
            setTimeout(() => {
              this.RBSheetAllert.open();
            }, 1000);
            this.resetForm();
          } else {
          }
        })
        .catch((err) => {
          console.log(err.response);
          this.RBSheetLoading.close();
          this.setState({
            message: "Maaf, terjadi kendala teknis",
          });
          setTimeout(() => {
            this.RBSheetVailed.open();
          }, 1000);
          this.resetForm();
        });
    }
  }
  eventClear() {
    this.setState({ isPhoto: true });
    this.state.dataUpload.map((data, index) => {
      data.data = "";
      this.setState({ isPhoto: false });
    });
    this.RBSheetAllert.close();
    this.RBSheet.close();
    var idPolis = {
      id_polis: this.state.id_polis,
    };
    this.RBSheet.close();
    this.props.sendToChat(JSON.stringify(idPolis));
  }
  eventClose() {
    this.RBSheetAllert.close();
    setTimeout(() => {
      this.RBSheet.open();
    }, 500);
  }
  renderUpload(item) {
    if (this.state.isPhoto == true) {
      return item.map((dataCarousel, index) => {
        return (
          <View
            style={{
              borderRadius: 10,
              width: 250,
              marginTop: 3,
              marginBottom: 3,
              marginEnd: 20,
              borderColor: "#c7c5c5",
              borderWidth: 0.7,
              shadowColor: "#000",
              shadowOpacity: Platform.OS == "ios" ? 0 : 0.6, //ini agus untuk menghilangkan shadow
              elevation: Platform.OS == "ios" ? 0 : 1.2, //ini agus untuk menghilangkan shadow
              shadowRadius: Platform.OS == "ios" ? 0 : 1,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontFamily: "HKGrotesk-Regular",
                margin: 5,
                fontSize: 12,
              }}
            >
              {dataCarousel.title}
            </Text>
            <View
              style={{
                height: 150,
                width: 250,
                paddingHorizontal: 5,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  height: 120,
                  width: "60%",
                  resizeMode: "stretch",

                  marginTop: 5,
                }}
                source={dataCarousel.path}
              />
            </View>
            <TouchableHighlight
              activeOpacity={0.1}
              underlayColor="#00000"
              style={{
                width: 60,
                height: 60,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                this.chooseFile(index);
              }}
            >
              <View>
                <Icon
                  name="plus"
                  type="evilicon"
                  size={60}
                  iconStyle={{ justifyContent: "center", alignItems: "center" }}
                  containerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 60,
                    height: 60,
                    borderRadius: 50,
                  }}
                />
              </View>
            </TouchableHighlight>
          </View>
        );
      });
    } else {
      return item.map((dataCarousel, index) => {
        return (
          <View
            style={{
              borderRadius: 10,
              width: 250,
              marginTop: 3,
              marginBottom: 3,
              marginEnd: 20,
              borderColor: "#c7c5c5",
              borderWidth: 0.7,
              shadowOpacity: Platform.OS == "ios" ? 0 : 0.6, //ini agus untuk menghilangkan shadow
              elevation: Platform.OS == "ios" ? 0 : 1.2, //ini agus untuk menghilangkan shadow
              shadowRadius: Platform.OS == "ios" ? 0 : 1,
              shadowRadius: 1,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontFamily: "HKGrotesk-Regular",
                margin: 5,
                fontSize: 12,
              }}
            >
              {dataCarousel.title}
            </Text>
            <View
              style={{
                height: 150,
                width: 250,
                paddingHorizontal: 5,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              {!this.state.dataUpload[index].data == "" && (
                <Image
                  style={{
                    height: 170,
                    borderRadius: 5,
                    width: "85%",
                    resizeMode: "stretch",
                    marginTop: 5,
                  }}
                  source={{
                    uri:
                      // 'data:image/jpeg;base64,' +
                      this.state.dataUpload[index].uri,
                  }}
                  // source={require('./../../../../assets/image/tripa_logo.png')}
                />
              )}
              {this.state.dataUpload[index].data == "" && (
                <Image
                  style={{
                    height: 120,
                    width: "60%",
                    resizeMode: "stretch",
                    marginTop: 5,
                  }}
                  source={dataCarousel.path}
                />
              )}
            </View>

            {this.state.dataUpload[index].data == "" && (
              <TouchableHighlight
                activeOpacity={0.1}
                underlayColor="#00000"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
                onPress={() => {
                  this.chooseFile(index);
                }}
              >
                <View>
                  <Icon
                    name="plus"
                    type="evilicon"
                    size={60}
                    iconStyle={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    containerStyle={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 60,
                      height: 60,
                      borderRadius: 50,
                    }}
                  />
                </View>
              </TouchableHighlight>
            )}
            {!this.state.dataUpload[index].data == "" && (
              <TouchableHighlight
                activeOpacity={0.1}
                underlayColor="#00000"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 35,
                }}
                onPress={() => {
                  this.chooseFile(index);
                }}
              >
                <View>
                  <Icon
                    name="edit"
                    type="font-awesome"
                    size={40}
                    iconStyle={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    containerStyle={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 50,
                    }}
                  />
                </View>
              </TouchableHighlight>
            )}
          </View>
        );
      });
    }
  }

  renderBSAllert = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetAllert = ref;
        }}
        height={Dimensions.get("window").height / 2 + 100}
        closeOnPressMask={false}
        closeOnPressBack={false}
        duration={250}
        customStyles={{
          container: {
            backgroundColor: "transparent",
            justifyContent: "center",
          },
        }}
      >
        {this.state.errorHit != false ? (
          <View style={styles.BSView}>
            <Text style={styles.BSInfoWarning}>Peringatan !!</Text>
            <Text style={styles.BSMessage}>{this.state.message}</Text>
            <TouchableOpacity
              onPress={() => this.eventClose()}
              style={styles.BSCloseWarning}
            >
              <Text style={styles.BSCloseTextWarning}>Tutup</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.BSView}>
            <Text style={styles.BSInfo}>Berhasil</Text>
            <Text style={styles.BSMessage}>{this.state.message}</Text>
            <TouchableOpacity
              onPress={() => this.eventClear()}
              style={styles.BSClose}
            >
              <Text style={styles.BSCloseText}>Ok</Text>
            </TouchableOpacity>
          </View>
        )}
      </RBSheet>
    );
  };

  renderVailed = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetVailed = ref;
        }}
        height={Dimensions.get("window").height / 2 + 100}
        closeOnPressMask={false}
        closeOnPressBack={false}
        duration={250}
        customStyles={{
          container: {
            backgroundColor: "transparent",
            justifyContent: "center",
          },
        }}
      >
        <View style={styles.BSView}>
          <Text style={styles.BSInfoVailed}>Gagal !!</Text>
          <Text style={styles.BSMessage}>{this.state.message}</Text>
          <TouchableOpacity
            onPress={() => this.RBSheetVailed.close()}
            style={{
              width: 100,
              borderWidth: 2,
              alignSelf: "flex-end",
              borderColor: "red",
              borderRadius: 12,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "HKGrotesk-Regular",
                textAlign: "center",
                fontWeight: "bold",
                color: "red",
              }}
            >
              Tutup
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  };

  renderBsLoading = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetLoading = ref;
        }}
        height={Dimensions.get("window").height / 2 + 100}
        closeOnPressMask={false}
        duration={250}
        customStyles={{
          container: {
            backgroundColor: "transparent",
            justifyContent: "center",
            alignContent: "center",
          },
        }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 30,
            justifyContent: "center",
            alignContent: "center",
            marginHorizontal: 10,
            marginBottom: Dimensions.get("window").height / 2 - 100,
            borderRadius: 12,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="#0a61c3" />
            <Text style={{ marginTop: 10 }}>Sedang memuat...</Text>
          </View>
        </View>
      </RBSheet>
    );
  };
  render() {
    return (
      <View>
        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          // height={(Dimensions.get('window').height * 5) / 6}
          // height={Platform.OS == 'ios' ? 200 + getStatusBarHeight() : 200}
          closeOnPressMask={false}
          closeOnPressBack={false}
          duration={250}
          customStyles={{
            container: {
              flex: 2.2,
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
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {this.state.title == ""
                  ? "Form Upload Foto Polis Kebakaran"
                  : "Form Upload Foto Polis Kebakaran Syariah"}
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
                <ScrollView
                  horizontal={true}
                  style={{ overflow: "visible" }}
                  keyboardShouldPersistTaps="handled"
                  showsHorizontalScrollIndicator={false}
                >
                  {this.renderUpload(this.state.dataUpload)}
                </ScrollView>

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
              </View>
            </ScrollView>
          </View>
        </RBSheet>
        {this.renderBsLoading()}
        {this.renderBSAllert()}
        {this.renderVailed()}
        {this.renderUploadPhoto()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  capture: {
    flex: 0,
    width: 50,
    height: 50,
    borderWidth: 5,
    borderColor: "white",
    backgroundColor: "red",
    borderRadius: 50,
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 30,
  },

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
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: "transparent",
    // height: (Dimensions.get('window').height * 7) / 8,
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
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginStart: 10,
  },
  vpicker: {
    backgroundColor: "white",
    paddingStart: 8,
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
  BSView: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: 10,
    marginBottom: Dimensions.get("window").height / 2 - 100,
    borderRadius: 12,
    backgroundColor: "white",
  },
  BSInfo: {
    fontWeight: "bold",
    fontFamily: "HKGrotesk-Regular",
    fontSize: 20,
    marginBottom: 6,
    color: "#0a61c3",
  },
  BSInfoWarning: {
    fontWeight: "bold",
    fontFamily: "HKGrotesk-Regular",
    fontSize: 20,
    marginBottom: 6,
    color: "#FFCC00",
  },
  BSInfoVailed: {
    fontWeight: "bold",
    fontFamily: "HKGrotesk-Regular",
    fontSize: 20,
    marginBottom: 6,
    color: "red",
  },
  BSMessage: {
    fontFamily: "HKGrotesk-Regular",
    fontSize: 18,
    marginBottom: 22,
  },
  BSClose: {
    fontFamily: "HKGrotesk-Regular",
    width: 100,
    borderWidth: 2,
    alignSelf: "flex-end",
    borderColor: "#0a61c3",
    borderRadius: 12,
    paddingVertical: 10,
  },
  BSCloseWarning: {
    width: 100,
    borderWidth: 2,
    alignSelf: "flex-end",
    borderColor: "#FFCC00",
    borderRadius: 12,
    paddingVertical: 10,
  },
  BSCloseText: {
    fontFamily: "HKGrotesk-Regular",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    color: "#0a61c3",
  },
  BSCloseTextWarning: {
    fontSize: 14,
    fontFamily: "HKGrotesk-Regular",
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFCC00",
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

export default BsUploadFoto;
