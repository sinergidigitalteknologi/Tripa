import "react-native-gesture-handler";
import React, { Component } from "react";
import {
  withNavigation,
  StackActions,
  NavigationActions,
} from "react-navigation";
import Tts from "react-native-tts";
import RBSheet from "react-native-raw-bottom-sheet";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as EmailValidator from "email-validator";
import Geolocation from "@react-native-community/geolocation";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "react-native-firebase";
import { getValue, saveData } from "../../../../Modules/LocalData";
import { encData } from "./../../../../Modules/Utils/Encrypt";
import ApiEndPoint from "./../../../../Modules/Utils/ApiEndPoint";
import { postDataOutHeader } from "./../../../../Services";
import util_string from "../../../../Utils/String";

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
  PermissionsAndroid,
  Linking,
  Platform,
} from "react-native";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorHit: false,
      email: "",
      password: "",
      fcm: "",
      message: "",
      messageEngineTTS: "",
      centerBS: "2",
      latitude: "",
      longitude: "",
      modalEngineTTS: false,
    };
  }
  async componentDidMount() {
    let h = Dimensions.get("window").height / 2;
    console.log("height screen ", h);
    await this.requestCameraPermission();
    this.getLocalFcm();
    this.checkEngine();
  }
  componentDidUpdate() {}

  async getLocalFcm() {
    console.log("getLocalFcm login");
    const enabled = await firebase.messaging().hasPermission();

    await getValue("fcm").then((response) => {
      if (response != null) {
        console.log("true getLocalFcm login", response);
        this.setState({ fcm: response });
      } else {
        console.log("else getLocalFcm login");
        if (enabled) {
          this.getFcmToken();
        } else {
          this.requestPermission();
        }
      }
    });
  }
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getFcmToken();
    } catch (error) {
      console.log("permission rejected", error);
    }
  }
  async getFcmToken() {
    let fcmToken = await AsyncStorage.getItem("fcm");
    console.log(" getFcmToken App", fcmToken);

    if (fcmToken == null || fcmToken == undefined || fcmToken == "") {
      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log("fcm in awal", fcmToken);
        await AsyncStorage.setItem("fcm", fcmToken);
        this.setState({ fcm: fcmToken });
        saveData("fcm", fcmToken);
      } else {
        // this.showAlert('Gagal', 'Tidak ada fcm yang diterima');
        console.log("else getFcmToken App");
      }
    } else {
      console.log("else getFcmToken in local ");
    }
  }
  async checkEngine() {
    // Tts.setDefaultEngine('com.google.android.tts');
    await Tts.engines().then((engines) => {
      console.log("engine", engines);
      var tts = false;
      var enginesLenght = engines.length - 1;
      if (Platform.OS == "android") {
        engines.map((data, index) => {
          if (data.name == "com.google.android.tts") {
            Tts.setDefaultEngine("com.google.android.tts");
            console.log("engine", data.name);
            tts = true;
            this.setState({ modalEngineTTS: true });
          }
          if (enginesLenght == index) {
            if (this.state.modalEngineTTS == false) {
              console.log("checkEngine tts false");
              this.setState({
                messageEngineTTS:
                  "Maaf perangkat anda belum terpasang Google Text-to-Speech",
                errorHit: true,
              });
              this.RBSheetTTS.open();
            } else {
              console.log("checkEngine tts true");
            }
          }
        });
      }
    });
    Tts.setDefaultLanguage("id-ID");
    Tts.setIgnoreSilentSwitch("ignore");
    Tts.voices().then((voices) => console.log("Voices"));
  }
  gotoRegister = () => {
    this.props.navigation.navigate("Register");
  };
  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }

      const granted2 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted2 === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
      const granted3 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Audio Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted3 === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the audio");
      } else {
        console.log("Audio permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  gotoPlayStore() {
    this.RBSheetTTS.close();
    this.setState({ modalVisible: false });
    // this.props.navigation.dispatch(resetActionHome);
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.google.android.tts&hl=id"
    );
  }

  onChangeEmail(email) {
    this.getLocalFcm();
    this.setState({ email });
  }

  renderBSTTS = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetTTS = ref;
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
          <Text style={styles.BSInfoWarning}>Peringatan !!</Text>
          <Text style={styles.BSMessage}>{this.state.messageEngineTTS}</Text>
          <TouchableOpacity
            onPress={() => this.gotoPlayStore()}
            style={styles.BSCloseWarning}
          >
            <Text style={styles.BSCloseTextWarning}>Unduh</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  };

  renderBS = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheet = ref;
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
              onPress={() => this.RBSheet.close()}
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
              onPress={this.loginSuccess}
              style={styles.BSClose}
            >
              <Text style={styles.BSCloseText}>Ok</Text>
            </TouchableOpacity>
          </View>
        )}
      </RBSheet>
    );
  };

  rbSheetLoading = () => {
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
        <View style={styles.BSView}>
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

  alertMessage = (message) => {
    this.setState({
      message: message,
    });
    setTimeout(() => {
      this.RBSheet.open();
    }, 300);
  };

  loginSuccess = () => {
    this.RBSheet.close();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "MainTab" })],
    });

    this.props.navigation.dispatch(resetAction);
  };

  async loginAction() {
    await this.getLocalFcm();
    this.checkEngine();
    var dataPassword = encData(this.state.password);

    const params = {
      email: this.state.email,
      password: dataPassword,
      fcm_token: this.state.fcm,
      client: Platform.OS,
    };

    if (
      this.state.email != "" &&
      this.state.password != "" &&
      EmailValidator.validate(this.state.email)
    ) {
      this.RBSheetLoading.open();
      const dataRestLogin = postDataOutHeader(
        ApiEndPoint.base_url + "/auth/login",
        params
      );
      console.log(ApiEndPoint.base_url + "/auth/login");
      console.log(params);
      dataRestLogin
        .then((response) => {
          console.log("LOGIN_RESPONSE", response);

          if (response.success == true) {
            saveData("userData", response);
            saveData("hasLogin", true);
            this.statusRes("Login Berhasil", "RES_SUC");
          }
        })
        .catch((err) => {
          if (err.response) {
            this.statusRes(err.response.data.error.message, "RES_ERR");
          } else {
            console.log("Error", err);
            this.statusRes(
              "Terjadi kendala teknis,tutup dan coba lagi",
              "RES_ERR"
            );
          }
        });
    } else if (this.state.email == "" && this.state.password == "") {
      this.statusRes(
        "Form tidak boleh kosong,harap diisi dengan benar",
        "FIELD_ERR"
      );
    } else if (this.state.email == "") {
      this.statusRes(
        "Email tidak boleh kosong,harap diisi dengan benar",
        "FIELD_ERR"
      );
    } else if (!EmailValidator.validate(this.state.email)) {
      this.statusRes(
        "Email tidak sesuai,harap isi data dengan benar",
        "FIELD_ERR"
      );
    } else if (this.state.password == "") {
      this.statusRes(
        "Password tidak boleh kosong,harap diisi dengan benar",
        "FIELD_ERR"
      );
    }
  }

  statusRes = (value, status) => {
    if (status == "FIELD_ERR") {
      this.RBSheetLoading.open();
      setTimeout(() => {
        this.setState(
          {
            errorHit: true,
          },
          () => {
            this.RBSheetLoading.close();
            this.alertMessage(value);
          }
        );
      }, 3000);
    } else {
      this.setState(
        {
          errorHit: status == "RES_ERR" ? true : false,
        },
        () => {
          setTimeout(() => {
            this.RBSheetLoading.close();
            this.alertMessage(value);
          }, 1000);
        }
      );
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require("./../../../../assets/image/img_background_registration.png")}
          style={{
            flex: 1,
            resizeMode: "cover",
          }}
        >
          <KeyboardAwareScrollView
            enableResetScrollToCoords={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                paddingHorizontal: 20,
              }}
            >
              <View style={{ marginBottom: "15%" }}>
                <Image
                  source={require("./../../../../assets/image/img_logo_tripa.png")}
                  style={styles.logoImage}
                />
              </View>

              <View style={{ marginBottom: 12 }}>
                <TextInput
                  style={styles.inputs}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  autoCapitalize="none"
                  value={this.state.email}
                  onChangeText={(email) => this.onChangeEmail(email)}
                  onSubmitEditing={() => this.passwordInput.focus()}
                  underlineColorAndroid="transparent"
                />
              </View>

              <View>
                <TextInput
                  style={styles.inputs}
                  returnKeyType="go"
                  autoCapitalize="none"
                  value={this.state.password}
                  onChangeText={(password) => this.setState({ password })}
                  onSubmitEditing={() => this.loginAction()}
                  ref={(input) => (this.passwordInput = input)}
                  placeholder="Kata Sandi"
                  secureTextEntry={true}
                  underlineColorAndroid="transparent"
                />
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("ForgotPassword")}
              >
                <View style={styles.textContent}>
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      color: "#0a61c3",
                      textAlign: "center",
                    }}
                  >
                    Lupa kata sandi?
                  </Text>
                </View>
              </TouchableOpacity>

              <View>
                <TouchableOpacity
                  onPress={() => this.loginAction()}
                  style={styles.btnLogin}
                >
                  <Text style={{ color: "#fff" }}>Masuk</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.containerText}>
                <View style={styles.textContent2}>
                  <Text style={{ color: "#f65c06" }}>Belum punya akun? </Text>
                  <TouchableOpacity onPress={() => this.gotoRegister()}>
                    <Text
                      style={{
                        textDecorationLine: "underline",
                        color: "#0a61c3",
                      }}
                    >
                      Daftar disini
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "HKGrotesk-Regular",
                marginTop: 30,
                marginBottom: 10,
              }}
            >
              {Platform.OS == "android"
                ? util_string.android_version
                : util_string.ios_version}
            </Text>
          </KeyboardAwareScrollView>
        </ImageBackground>

        {this.renderBS()}
        {this.renderBSTTS()}
        {this.rbSheetLoading()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  textContent: {
    alignItems: "center",
    fontFamily: "HKGrotesk-Regular",
    marginBottom: 34,
    marginTop: 30,
  },
  textContent2: {
    flexDirection: "row",
    fontFamily: "HKGrotesk-Regular",
  },
  containerText: {
    alignItems: "center",
    marginTop: 18,
  },
  logoImage: {
    alignSelf: "center",
    width: "70%",
    height: 70,
    resizeMode: "contain",
  },
  inputs: {
    width: "100%",
    fontFamily: "HKGrotesk-Regular",
    color: "#989a9d",
    paddingVertical: Platform.OS == "ios" ? "4.6%" : "4%",
    paddingLeft: "5%",
    paddingRight: "5%",
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    elevation: 1,
  },
  btnLogin: {
    width: "100%",
    color: "#fff",
    paddingVertical: Platform.OS == "ios" ? "4%" : "4.5%",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#0a61c3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    elevation: 1,
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
});

export default withNavigation(Login);
