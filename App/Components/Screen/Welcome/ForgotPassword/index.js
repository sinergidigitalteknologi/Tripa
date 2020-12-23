import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import * as EmailValidator from "email-validator";
import RBSheet from "react-native-raw-bottom-sheet";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import { encData } from "./../../../../Modules/Utils/Encrypt";
import ApiEndPoint from "./../../../../Modules/Utils/ApiEndPoint";
import { postDataOutHeader } from "./../../../../Services";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorHit: false,
      nama: "",
      email: "",
      nohp: "",
      password: "",
      rePassword: "",
      message: "",
    };
  }

  gotoLogin = () => {
    this.props.navigation.navigate("Login");
  };

  registerSuccess = () => {
    this.RBSheet.close();
    this.props.navigation.navigate("Login");
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
            <Text numberOfLines={4} style={styles.BSMessage}>
              {this.state.message}
            </Text>
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
              onPress={this.registerSuccess}
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
    }, 1000);
  };

  registerAction = () => {
    var dataPassword = encData(this.state.password);
    var valEmail = EmailValidator.validate(this.state.email);

    const params = {
      email: this.state.email,
    };

    if (this.state.email != "" && valEmail == true) {
      this.RBSheetLoading.open();

      console.log("data postData() => ", params);

      postDataOutHeader(ApiEndPoint.base_url + "/tripa/forgot-password", params)
        .then((response) => {
          if (response.success == true) {
            this.statusRes(
              "Reset Password Berhasil Silahkan Cek Email Anda",
              "RES_SUC"
            );
          }
        })
        .catch((err) => {
          if (err.response) {
            this.statusRes(err.response.data.error.message, "RES_ERR");
          } else {
            this.statusRes(
              "Anda belum terhubung ke internet, tutup dan coba lagi",
              "RES_ERR"
            );
          }
        });
    } else if (this.state.email == "") {
      this.statusRes("Email tidak boleh kosong,harap diisi", "FIELD_ERR");
    } else if (this.state.email == "") {
      this.statusRes("Email tidak boleh kosong,harap diisi", "FIELD_ERR");
    } else if (valEmail == false) {
      this.statusRes(
        "Email tidak sesuai,harap diisi data dengan benar",
        "FIELD_ERR"
      );
    }
  };

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
      }, 1000);
    } else {
      this.RBSheetLoading.close();
      this.setState(
        {
          errorHit: status == "RES_ERR" ? true : false,
        },
        () => {
          setTimeout(() => {
            this.alertMessage(value);
          }, 500);
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
                  onChangeText={(email) => this.setState({ email })}
                  ref={(input) => (this.emailInput = input)}
                  // onSubmitEditing={() => this.npHpInput.focus()}
                  underlineColorAndroid="transparent"
                />
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => this.registerAction()}
                  style={styles.btnRegister}
                >
                  <Text
                    style={{ color: "#fff", fontFamily: "HKGrotesk-Regular" }}
                  >
                    Reset Password
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.containerText}>
                <View style={styles.textContent2}>
                  <Text style={{ color: "#f65c06" }}>
                    Ingin Kembali Login ?{" "}
                  </Text>
                  <TouchableOpacity onPress={() => this.gotoLogin()}>
                    <Text style={{ color: "#0a61c3" }}>Login disini</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>

        {this.renderBS()}
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
    marginBottom: 34,
    marginTop: 30,
  },
  textContent2: {
    flexDirection: "row",
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
  btnRegister: {
    width: "100%",
    color: "#fff",
    fontFamily: "HKGrotesk-Regular",
    marginTop: 28,
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
    fontFamily: "HKGrotesk-Regular",
    paddingHorizontal: 30,
    justifyContent: "center",
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
  BSInfoSucces: {
    fontWeight: "bold",
    fontFamily: "HKGrotesk-Regular",
    fontSize: 20,
    marginBottom: 6,
    color: "yellow",
  },
  BSMessage: {
    fontSize: 18,
    fontFamily: "HKGrotesk-Regular",
    marginBottom: 22,
  },
  BSClose: {
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
    fontSize: 14,
    fontFamily: "HKGrotesk-Regular",
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

export default withNavigation(ForgotPassword);
