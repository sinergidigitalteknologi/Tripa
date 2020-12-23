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
import { ScrollView } from "react-native-gesture-handler";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorHit: false,
      nama: "",
      nickname: "",
      namaPanggilan: "",
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
        animationType={"none"}
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
        animationType={"none"}
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
    }, 500);
  };

  registerAction = () => {
    var dataPassword = encData(this.state.password);
    var valEmail = EmailValidator.validate(this.state.email);

    const params = {
      name: this.state.nama,
      nickname: this.state.nickname,
      email: this.state.email,
      phone: this.state.nohp,
      password: dataPassword,
      interests: ["Entertaiment", "Musik", "Film"],
      client: Platform.OS,
    };

    if (
      this.state.nama != "" &&
      this.state.nickname != "" &&
      this.state.email != "" &&
      this.state.nohp != "" &&
      this.state.nohp.length >= 10 &&
      this.state.password != "" &&
      this.state.rePassword != "" &&
      this.state.password == this.state.rePassword &&
      this.state.password.length >= 8 &&
      this.state.password.search("^(?=.*?[a-z])(?=.*?[0-9]).{8,}$") != -1 &&
      valEmail == true
    ) {
      this.RBSheetLoading.open();

      console.log("data postData() => ", params);

      postDataOutHeader(ApiEndPoint.base_url + "/users/register", params)
        .then((response) => {
          if (response.success == true) {
            this.statusRes("Register Berhasil", "RES_SUC");
          } else {
            this.statusRes(response.error.message, "RES_ERR");
          }
        })
        .catch((err) => {
          console.log("error catch ", err);
          if (err != null) {
            if (err == "Error: Network Error") {
              this.statusRes("Anda belum terhubung ke internet", "RES_ERR");
            } else {
              this.statusRes("Maaf Terjadi Kendala Teknis", "RES_ERR");
            }
          } else {
            this.statusRes("Anda belum terhubung ke internet", "RES_ERR");
          }
        });
    } else if (
      this.state.nama == "" &&
      this.state.nickname == "" &&
      this.state.email == "" &&
      this.state.nohp == "" &&
      this.state.password == "" &&
      this.state.rePassword == ""
    ) {
      this.statusRes(
        "Form tidak boleh kosong,harap isi data dengan benar",
        "FIELD_ERR"
      );
    } else if (this.state.nama == "") {
      this.statusRes(
        "Nama tidak boleh kosong,harap isi data dengan benar",
        "FIELD_ERR"
      );
    } else if (this.state.nickname == "") {
      this.statusRes(
        "Nama panggilan tidak boleh kosong,harap isi data dengan benar",
        "FIELD_ERR"
      );
    } else if (this.state.email == "") {
      this.statusRes(
        "Email tidak boleh kosong,harap isi data dengan benar",
        "FIELD_ERR"
      );
    } else if (!EmailValidator.validate(this.state.email)) {
      this.statusRes("Email salah, harap isi dengan benar", "FIELD_ERR");
    } else if (this.state.nohp == "") {
      this.statusRes(
        "No Hp tidak boleh kosong,harap isi data dengan benar",
        "FIELD_ERR"
      );
    } else if (this.state.nohp.length < 10) {
      this.statusRes("Harap masukkan no hp dengan benar", "FIELD_ERR");
    } else if (this.state.password == "") {
      this.statusRes(
        "Password tidak boleh kosong,harap isi data dengan benar",
        "FIELD_ERR"
      );
    } else if (this.state.rePassword == "") {
      this.statusRes(
        "Re-Password tidak boleh kosong,harap isi data dengan benar",
        "FIELD_ERR"
      );
    } else if (this.state.password != this.state.rePassword) {
      this.statusRes(
        "Password tidak sama,harap isi data dengan benar",
        "FIELD_ERR"
      );
    } else if (this.state.password.length < 8) {
      this.statusRes("Password minimal 8 karakter", "FIELD_ERR");
    } else if (
      this.state.password.search("^(?=.*?[a-z])(?=.*?[0-9]).{8,}$") == -1
    ) {
      this.statusRes("Password harus mengandung huruf dan angka", "FIELD_ERR");
    } else if (valEmail == false) {
      this.statusRes(
        "Email tidak sesuai,harap isi data dengan benar",
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

  onChangeValueName(value) {
    let vname = value;
    if (/^[a-zA-Z\s]+$/.test(vname) || vname === "") {
      this.setState({ nama: vname });
    }
  }
  onChangeValueNickName(value) {
    let vname = value;
    if (/^[a-zA-Z\s]+$/.test(vname) || vname === "") {
      this.setState({ nickname: vname });
    }
  }
  onChangeValueNoTelp(value) {
    let vname = value;
    if (/^([0-9][0-9]*|0)$/.test(vname) || vname === "") {
      this.setState({ nohp: vname });
    }
  }

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
              <View style={{ marginBottom: "15%", marginTop: 20 }}>
                <Image
                  source={require("./../../../../assets/image/img_logo_tripa.png")}
                  style={styles.logoImage}
                />
              </View>
              <ScrollView>
                <View style={{ marginBottom: 8 }}>
                  <TextInput
                    style={styles.inputs}
                    placeholder="Nama Lengkap"
                    keyboardType="default"
                    autoCapitalize="none"
                    returnKeyType="next"
                    autoCapitalize="none"
                    value={this.state.nama}
                    onChangeText={(nama) => this.onChangeValueName(nama)}
                    onSubmitEditing={() => this.nickNameInput.focus()}
                    underlineColorAndroid="transparent"
                  />
                </View>
                <View style={{ marginBottom: 8 }}>
                  <TextInput
                    style={styles.inputs}
                    placeholder="Nama Panggilan"
                    keyboardType="default"
                    autoCapitalize="none"
                    returnKeyType="next"
                    autoCapitalize="none"
                    value={this.state.nickname}
                    ref={(input) => (this.nickNameInput = input)}
                    onChangeText={(nama) => this.onChangeValueNickName(nama)}
                    onSubmitEditing={() => this.emailInput.focus()}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <View style={{ marginBottom: 8 }}>
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
                    onSubmitEditing={() => this.npHpInput.focus()}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <View style={{ marginBottom: 8 }}>
                  <TextInput
                    maxLength={13}
                    style={styles.inputs}
                    placeholder="No Tlp"
                    keyboardType="numeric"
                    autoCapitalize="none"
                    returnKeyType="next"
                    value={this.state.nohp}
                    onChangeText={(nohp) => this.onChangeValueNoTelp(nohp)}
                    ref={(input) => (this.npHpInput = input)}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <View style={{ marginBottom: 8 }}>
                  <TextInput
                    style={styles.inputs}
                    returnKeyType="next"
                    autoCapitalize="none"
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    ref={(input) => (this.passwordInput = input)}
                    onSubmitEditing={() => this.rePasswordInput.focus()}
                    placeholder="Kata Kunci"
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <View>
                  <TextInput
                    style={styles.inputs}
                    returnKeyType="go"
                    autoCapitalize="none"
                    value={this.state.rePassword}
                    onChangeText={(rePassword) => this.setState({ rePassword })}
                    onSubmitEditing={() => this.registerAction()}
                    ref={(input) => (this.rePasswordInput = input)}
                    placeholder="Konfirmasi  Kata Kunci"
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <View>
                  <TouchableOpacity
                    onPress={() => this.registerAction()}
                    style={styles.btnRegister}
                  >
                    <Text style={{ color: "#fff" }}>Daftar</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.containerText}>
                  <View style={styles.textContent2}>
                    <Text style={{ color: "#f65c06" }}>
                      Sudah punya akun ?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => this.gotoLogin()}>
                      <Text style={{ color: "#0a61c3" }}>Login disini</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
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
  BSMessage: {
    fontFamily: "HKGrotesk-Regular",
    fontSize: 18,
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
  BSCloseWarning: {
    width: 100,
    borderWidth: 2,
    alignSelf: "flex-end",
    borderColor: "#FFCC00",
    borderRadius: 12,
    paddingVertical: 10,
  },
  BSInfoWarning: {
    fontWeight: "bold",
    fontFamily: "HKGrotesk-Regular",
    fontSize: 20,
    marginBottom: 6,
    color: "#FFCC00",
  },
});

export default withNavigation(Register);
