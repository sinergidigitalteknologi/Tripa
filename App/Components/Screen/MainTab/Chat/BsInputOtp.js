import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import RBSheet from "react-native-raw-bottom-sheet";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { Icon } from "react-native-elements";

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";

import { Content, Container } from "native-base";

import { Header } from "react-native-elements";

import { postDataWitHeader, getDataWithHeader } from "./../../../../Services";

import { getValue, removeValue } from "./../../../../Modules/LocalData";
import ApiEndPoint from "./../../../../Modules/Utils/ApiEndPoint";
import CountDown from "react-native-countdown-component";
import moment from "moment";
import { TextInput } from "react-native-paper";

class BsInputOtp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      codeOtp: "",
      visibleBtn: true,
      counter: 30,
      phone: "",
    };
  }

  componentDidMount() {
    this.props.onInputOtp(this);
  }
  componentWillUnmount() {
    this.props.onInputOtp(undefined);
  }

  async setModalVisible(value) {
    this.RBSheetOtp.open();
  }

  backToHome = () => {};
  verifNoHpAction = () => {
    this.RBSheetLoadVerifNum.open();

    getValue("userData").then((response) => {
      if (response.data.id != null && response.access_token != null) {
        const dataRest = getDataWithHeader(
          ApiEndPoint.base_url +
            "/users/" +
            response.data.id +
            "/phone-verification2",
          response.access_token
        );
        dataRest
          .then((res) => {
            if (res.success) {
              this.RBSheetLoadVerifNum.close();
              this.setState(
                {
                  errorHit: false,
                },
                () => {
                  setTimeout(() => {
                    this.RBSheetLoadVerifSuccess.open();
                  }, 1000);
                  setTimeout(() => {
                    this.RBSheetLoadVerifSuccess.close();
                  }, 4000);
                  setTimeout(() => {
                    this.kirimUlang();
                  }, 5000);
                }
              );
            }
          })
          .catch((err) => {
            this.RBSheetLoadVerifNum.close();
            this.setState(
              {
                errorHit: true,
                phoneAlready: "Terjadi Kendala Teknis, Tutup dan Coba Lagi",
              },
              () => {
                setTimeout(() => {
                  this.RBSheetLoadVerifSuccess.open();
                }, 1000);
              }
            );
          });
      }
    });
  };
  rbSheetVerifSucces = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetLoadVerifSuccess = ref;
        }}
        height={200}
        closeOnPressMask={false}
        duration={250}
        customStyles={{
          container: {
            justifyContent: "center",
          },
        }}
      >
        {this.state.errorHit != false ? (
          <View style={styles.BSView}>
            <Image
              style={{ width: 80, height: 80, resizeMode: "contain" }}
              source={require("./../../../../assets/image/img_warning.png")}
            />
            <Text style={{ marginTop: 10 }}>{this.state.phoneAlready}</Text>
            <TouchableOpacity
              onPress={() => this.RBSheetLoadVerifSuccess.close()}
            >
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 20,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderColor: "red",
                  borderRadius: 7,
                  borderWidth: 2,
                }}
              >
                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Close
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.BSView}>
            <Image
              style={{ width: 80, height: 80, resizeMode: "contain" }}
              source={require("./../../../../assets/image/img_check_success.png")}
            />
            <Text style={{ marginTop: 10 }}>Kirim ulang otp berhasil...</Text>
          </View>
        )}
      </RBSheet>
    );
  };

  rbSheetVerifNumber = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetLoadVerifNum = ref;
        }}
        height={200}
        closeOnPressMask={false}
        duration={250}
        customStyles={{
          container: {
            justifyContent: "center",
          },
        }}
      >
        <View style={styles.BSView}>
          <ActivityIndicator size="large" color="#FF8033" />
          <Text style={{ marginTop: 10 }}>Sedang memuat...</Text>
        </View>
      </RBSheet>
    );
  };

  sumbitNoHpAction = () => {
    this.RBSheetLoadKonfirm.open();
    if (this.state.codeOtp.length >= 4) {
      getValue("userData").then((response) => {
        if (response.data.id != null && response.access_token != null) {
          let params = {
            // user_id: user_id.data.id,
            otp: this.state.codeOtp,
          };

          const dataRest = postDataWitHeader(
            ApiEndPoint.base_url +
              "/users/" +
              response.data.id +
              "/verify-phone",
            params,
            response.access_token
          );
          dataRest
            .then((res) => {
              setTimeout(() => {
                this.RBSheetLoadKonfirm.close();
                this.setState(
                  {
                    codeOtp: "",
                    message: "Verifikasi Nomor Telepon Berhasil",
                  },
                  () => {
                    this.RBSheetSuceesMemuat.open();
                  },
                  1000
                );
              });
            })
            .catch((err) => {
              this.RBSheetLoadKonfirm.close();
              if (err.response) {
                setTimeout(() => {
                  this.setState(
                    {
                      codeOtp: "",
                      message: err.response.data.error.message,
                    },
                    () => {
                      this.RBSheetGagalMemuat.open();
                    }
                  );
                }, 1000);
              } else if (err.request) {
                setTimeout(() => {
                  this.setState(
                    {
                      codeOtp: "",
                      message: err.request._response,
                    },
                    () => {
                      this.RBSheetGagalMemuat.open();
                    }
                  );
                }, 1000);
              } else {
                setTimeout(() => {
                  this.setState(
                    {
                      codeOtp: "",
                      message:
                        "Tidak ada koneksi internet, Tutup dan coba lagi!!",
                    },
                    () => {
                      this.RBSheetGagalMemuat.open();
                    }
                  );
                }, 1000);
              }
            });
        }
      });
    } else {
      setTimeout(() => {
        this.RBSheetLoadKonfirm.close();
      }, 1000);
      setTimeout(() => {
        this.setState(
          {
            codeOtp: "",
            message: "Masukkan Nomor OTP dengan benar, Tutup dan coba lagi!",
          },
          () => {
            this.RBSheetGagalMemuat.open();
          }
        );
      }, 1500);
    }
  };

  kirimUlang = () => {
    this.setState({ counter: 30 });
    this.setState({ visibleBtn: true });
  };

  goBackSuccess = () => {
    this.RBSheetSuceesMemuat.close();
    this.props.messageCancel("batal");
    setTimeout(() => {
      //   this.props.navigation.goBack();
      this.RBSheetOtp.close();
    }, 1000);
  };
  actionClose() {
    this.RBSheetOtp.close();
    this.props.messageCancel("batal");
    this.setState({});
  }
  rbSheetLoadKonfirm = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetLoadKonfirm = ref;
        }}
        height={200}
        closeOnPressMask={false}
        duration={250}
        customStyles={{
          container: {
            justifyContent: "center",
          },
        }}
      >
        <View style={styles.BSView}>
          <ActivityIndicator size="large" color="#FF8033" />
          <Text style={{ marginTop: 10 }}>Sedang memuat...</Text>
        </View>
      </RBSheet>
    );
  };

  rbSheetSuccesKonfirm = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetSuceesMemuat = ref;
        }}
        height={200}
        closeOnPressMask={false}
        duration={250}
        customStyles={{
          container: {
            justifyContent: "center",
          },
        }}
      >
        <View style={styles.BSView}>
          <Image
            style={{ width: 80, height: 80, resizeMode: "contain" }}
            source={require("./../../../../assets/image/img_check_success.png")}
          />
          <Text style={{ marginVertical: 10 }}>{this.state.message}</Text>
          <TouchableOpacity onPress={this.goBackSuccess}>
            <View
              style={{
                marginTop: 10,
                marginBottom: 20,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderColor: "#FF8033",
                borderRadius: 7,
                borderWidth: 2,
              }}
            >
              <Text
                style={{
                  color: "#FF8033",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Done
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  };

  rbSheetGagalKonfirm = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetGagalMemuat = ref;
        }}
        height={200}
        closeOnPressMask={false}
        duration={250}
        customStyles={{
          container: {
            justifyContent: "center",
          },
        }}
      >
        <View style={styles.BSView}>
          <Image
            style={{ width: 80, height: 80, resizeMode: "contain" }}
            source={require("./../../../../assets/image/img_warning.png")}
          />
          <Text style={{ marginVertical: 10 }}>{this.state.message}</Text>
          <TouchableOpacity onPress={() => this.RBSheetGagalMemuat.close()}>
            <View
              style={{
                marginTop: 10,
                marginBottom: 20,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderColor: "red",
                borderRadius: 7,
                borderWidth: 2,
              }}
            >
              <Text
                style={{
                  color: "red",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Tutup
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  };
  renderBtn() {
    // if (this.state.visibleBtn) {
    return (
      <View style={{ width: 200 }}>
        <TouchableOpacity
          style={{
            width: "100%",
            backgroundColor: "#FF8033",
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: "center",
            marginBottom: 10,
          }}
          onPress={this.sumbitNoHpAction}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Konfirmasi
          </Text>
        </TouchableOpacity>
        {!this.state.visibleBtn && (
          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: "#FF8033",
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
              marginTop: 20,
            }}
            onPress={this.verifNoHpAction}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Kirim Ulang
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
    // } else {
    //   return (
    //     <TouchableOpacity
    //       style={{
    //         width: '100%',
    //         backgroundColor: '#FF8033',
    //         borderRadius: 8,
    //         paddingVertical: 14,
    //         alignItems: 'center',
    //         marginTop: 20,
    //       }}
    //       onPress={this.verifNoHpAction}>
    //       <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
    //         Kirim Ulang
    //       </Text>
    //     </TouchableOpacity>
    //   );
    // }
  }

  renderInputOTP() {
    // if (this.state.visibleBtn) {
    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        {/* <TextInput
          style={{
            color: 'black',
            fontFamily: 'HKGrotesk-Regular',
            paddingLeft: '5%',
            paddingRight: '5%',
            borderRadius: 9,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.8,
            elevation: 5,
          }}
        /> */}
        <OTPInputView
          pinCount={4}
          autoFocusOnLoad={false}
          code={this.state.codeOtp}
          style={{ width: "70%", height: 120 }}
          codeInputFieldStyle={styles.underlineStyleBase}
          onCodeChanged={(codeOtp) => {
            this.setState({ codeOtp });
          }}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          keyboardType="number-pad"
        />
      </View>
    );
    // } else {
    // return null;
    // }
  }

  renderCountDown() {
    if (this.state.visibleBtn) {
      return (
        <CountDown
          id={"1"}
          until={this.state.counter}
          onFinish={() => this.setState({ visibleBtn: false })}
          // onPress={() => alert('hello')}
          size={20}
          timeToShow={["M", "S"]}
          digitStyle={{
            backgroundColor: "#e3e4e6",
            marginTop: 5,
            marginBottom: 20,
          }}
          digitTxtStyle={{ color: "#1CC625" }}
          timeLabels={{ m: "", s: "" }}
        />
      );
    } else {
      return (
        <CountDown
          id={"2"}
          until={30}
          // onFinish={() => this.setState({visibleBtn: false})}
          // onPress={() => alert('hello')}
          size={20}
          timeToShow={["H", "M"]}
          digitStyle={{
            backgroundColor: "#e3e4e6",
            marginTop: 5,
            marginBottom: 20,
          }}
          digitTxtStyle={{ color: "red" }}
          timeLabels={{ m: "", s: "" }}
        />
      );
    }
  }

  render() {
    return (
      <View>
        <RBSheet
          ref={(ref) => {
            this.RBSheetOtp = ref;
          }}
          closeOnPressMask={false}
          closeOnPressBack={false}
          closeOnDragDown={false}
          height={(Dimensions.get("window").height * 7) / 8}
          closeOnDragDown={false}
          customStyles={{
            container: {
              flex: 10,
              backgroundColor: "transparent",
              justifyContent: "center",
              alignContent: "center",
            },
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginEnd: 5,
              marginStart: 5,
              //   paddingHorizontal: 20,
              justifyContent: "center",
              //   alignItems: 'center',
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                margin: 7,
              }}
            >
              <Icon
                style={{ margin: 5 }}
                name="x"
                type="feather"
                size={36}
                color="#0a61c3"
                onPress={() => this.actionClose()}
              />
            </View>
            <ScrollView>
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {this.renderCountDown()}
                <Image
                  style={styles.imageOtp}
                  source={require("./../../../../assets/image/img_otp.png")}
                />
                <Text style={styles.textDescOtp}>
                  Kode OTP berhasil dikirim ke nomor telepon dan email anda{" "}
                  {/* {this.state.phone.substring(0, this.state.phone.length - 3) +
                'xxx'} */}
                </Text>
                {this.renderInputOTP()}
                {this.renderBtn()}
              </View>
            </ScrollView>
          </View>
          {this.rbSheetLoadKonfirm()}
          {this.rbSheetGagalKonfirm()}
          {this.rbSheetSuccesKonfirm()}
          {this.rbSheetVerifSucces()}
          {this.rbSheetVerifNumber()}
        </RBSheet>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  containerOtp: {
    flex: 1,
    alignItems: "center",
    marginTop: 86,
  },
  imageOtp: {
    width: 200,
    height: 200,
    resizeMode: "cover",
  },
  bodyHeader: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "orange",
  },
  titleHeader: {
    color: "white",
    fontSize: 22,
  },
  btnSubmitNoHp: {
    width: "100%",
    color: "#fff",
    paddingVertical: "4%",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#0a61c3",
  },
  imageHeaderLeft: {
    width: 32,
    height: 32,
  },
  textDescOtp: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 14,
    color: "#636363",
  },
  containBtnVerif: {
    width: "100%",
    justifyContent: "flex-end",
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  textBtnVerif: {
    color: "#fff",
    fontWeight: "bold",
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 3,
    color: "#FF8033",
    fontSize: 22,
    borderColor: "#FF8033",
  },
  underlineStyleHighLighted: {
    borderColor: "#FF8033",
  },
  BSView: {
    alignItems: "center",
    paddingHorizontal: "10%",
  },
  BSInfo: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 6,
    color: "#FF8033",
  },
  BSMessage: {
    fontSize: 18,
    marginBottom: 22,
  },
  BSOke: {
    width: 100,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF8033",
    borderRadius: 12,
    marginLeft: 10,
    paddingVertical: 10,
  },
  BSClose: {
    width: 100,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF8033",
    borderRadius: 12,
    paddingVertical: 10,
  },
  BSCloseText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF8033",
  },
  BSCLanjutText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0a61c3",
  },
});

export default withNavigation(BsInputOtp);
