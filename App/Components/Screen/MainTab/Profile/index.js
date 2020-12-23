import React, { Component } from "react";
import { Header, Icon } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  NavigationEvents,
  NavigationActions,
  withNavigation,
  StackActions,
} from "react-navigation";
import { Body, Card, Content, CardItem, Container } from "native-base";
import { getDataWithHeader, postDataWitHeader } from "./../../../../Services";
import ApiEndPoint from "./../../../../Modules/Utils/ApiEndPoint";
import { getValue, removeValue } from "./../../../../Modules/LocalData";
import { encData } from "./../../../../Modules/Utils/Encrypt";
import Modal from "react-native-modals";
import util_string from "../../../../Utils/String";

import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Login" })],
});

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUser: {},
      dataUserTripa: {},
      uriPhoto: "",
      isLoading: false,
      message: "",
      errorHit: false,
      phoneAlready: "",
      isFetching: false,
      modalVisible: false,
      password: "",
      messagePassword: "",
    };
  }

  componentDidMount() {
    console.log("componentDidMount profile");
    this.getProfile();
  }
  componentWillMount() {
    console.log("componentWillMount profile");
    // this.getProfile();
  }
  componentDidUpdate() {
    console.log("componentDidUpdate profile ");
  }
  componentWillUnmount() {
    console.log("componentWillUnmount profile");
  }

  getProfile = () => {
    getValue("userData").then((response) => {
      // console.log('response saveData =>  ', response);
      this.setState(
        {
          isLoading: true,
        },
        () => {
          if (response.data.id != null && response.access_token != null) {
            const dataRest = getDataWithHeader(
              ApiEndPoint.base_url + "/users/" + response.data.id + "/tripa",
              response.access_token
            );
            dataRest
              .then((res) => {
                let date = new Date();
                console.log("GET_PROFILE_RESPONSE", res);
                if (res.success) {
                  this.setState({
                    isLoading: false,
                    dataUser: res.data,
                    uriPhoto: res.data.picture + "?time=" + date,
                    dataUserTripa: res.data.tripaUser,
                    isFetching: false,
                  });
                } else {
                  this.setState({
                    isLoading: false,
                    isFetching: false,
                  });
                }
              })
              .catch((err) => {
                this.setState({
                  isLoading: false,
                  isFetching: false,
                });
                if (err.response.status == 401 || err.response.status == 404) {
                  removeValue("userData");
                  removeValue("hasLogin");
                  removeValue("fcm");
                  // removeValue('dataNotif');

                  this.props.navigation.dispatch(resetAction);
                }
              });
          }
        }
      );
    });
  };

  moveUpdateFoto() {
    this.props.navigation.navigate("UpdateFoto", {
      dataUser: this.state.dataUser,
    });
  }

  beforeUpdateProfile = () => {
    this.RBSheetBeforeUpdateProfile.open();
  };

  renderToUpdateProfile = () => {
    this.RBSheetBeforeUpdateProfile.close();

    if (this.state.password != "") {
      var dataPassword = encData(this.state.password);

      const params = {
        password: dataPassword,
      };

      getValue("userData").then((resValue) => {
        if (resValue.data.id != null && resValue.access_token != null) {
          this.RBSheetLoadVerifNum.open();

          const dataRestSimpan = postDataWitHeader(
            ApiEndPoint.base_url +
              "/users/" +
              resValue.data.id +
              "/validation-password",
            params,
            resValue.access_token
          );

          dataRestSimpan
            .then((response) => {
              console.log("PASSWORD_PROFILE", response);

              if (response.success == true) {
                this.RBSheetLoadVerifNum.close();
                this.setState({
                  password: "",
                });
                this.props.navigation.navigate("UpdateProfile", {
                  dataUser: this.state.dataUser,
                });
              } else {
                this.RBSheetLoadVerifNum.close();
                this.setState(
                  {
                    password: "",
                    messagePassword: response.error.message,
                  },
                  () => {
                    this.RBSheetLoadUpdateProfile.open();
                  }
                );
              }
            })
            .catch((err) => {
              this.RBSheetLoadVerifNum.close();
              console.log(
                "Error_konfirmasi_phone",
                err.response.data.error.message
              );

              this.setState(
                {
                  password: "",
                  messagePassword: err.response.data.error.message,
                },
                () => {
                  this.RBSheetLoadUpdateProfile.open();
                }
              );
            });
        }
      });
    } else {
      this.setState(
        {
          messagePassword: "Password Kosong, Harap isi dengan bener!!",
        },
        () => {
          this.RBSheetLoadUpdateProfile.open();
        }
      );
    }
  };

  changePassword = () => {
    this.props.navigation.navigate("ChangePassword");
  };
  moveToRegisterMember = () => {
    this.props.navigation.navigate("MemberRegister");
  };

  rbSheetLogout = () => {
    getValue("userData").then((response) => {
      console.log("response saveData =>  ", response);

      this.setState(
        {
          isLoading: true,
        },

        () => {
          if (response.data.id != null && response.access_token != null) {
            const dataRest = getDataWithHeader(
              ApiEndPoint.base_url + "/auth/logout",
              response.access_token
            );
            dataRest
              .then((res) => {
                if (res.success == true) {
                  this.setState({
                    isLoading: false,
                  });
                  removeValue("userData");
                  removeValue("hasLogin");
                  removeValue("fcm");
                  // removeValue('dataNotif');
                  this.RBSheetProfile.close();
                  this.props.navigation.dispatch(resetAction);
                } else {
                  removeValue("userData");
                  removeValue("hasLogin");
                  removeValue("fcm");

                  // removeValue('dataNotif');
                  this.RBSheetProfile.close();
                  this.props.navigation.dispatch(resetAction);
                }
              })
              .catch((err) => {
                this.setState({
                  isLoading: false,
                });
                removeValue("userData");
                removeValue("hasLogin");
                removeValue("fcm");

                // removeValue('dataNotif');

                this.RBSheetProfile.close();
                this.props.navigation.dispatch(resetAction);
              });
          }
        }
      );
    });
  };

  logoutProfile = () => {
    this.alertMessage("Apakah anda ingin keluar ?");
  };

  alertMessage = (message) => {
    this.setState({
      message: message,
    });
    setTimeout(() => {
      this.RBSheetProfile.open();
    }, 1000);
  };

  verifNoHpAction = () => {
    this.RBSheetLoadVerifNum.open();
    // this.props.navigation.navigate('VerifOtp', {
    //   otp: '5050',
    //   phone: this.state.dataUser.phone
    // });
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
                    this.props.navigation.navigate("VerifOtp", {
                      phone: this.state.dataUser.phone,
                    });
                  }, 1500);
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

  rbSheetVerifNumber = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetLoadVerifNum = ref;
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
          <ActivityIndicator size="large" color="#FF8033" />
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            Sedang memuat...
          </Text>
        </View>
      </RBSheet>
    );
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
                  Tutup
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

  rbSheetLoadUpdateProfile = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetLoadUpdateProfile = ref;
        }}
        height={Dimensions.get("window").height / 2 + 100}
        closeOnPressMask={true}
        duration={250}
        customStyles={{
          container: {
            justifyContent: "center",
            backgroundColor: "transparent",
          },
        }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 30,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginBottom: Dimensions.get("window").height / 2 - 100,
            borderRadius: 12,
            backgroundColor: "white",
          }}
        >
          <Image
            style={{
              alignItems: "center",
              width: 80,
              height: 80,
              resizeMode: "contain",
            }}
            source={require("./../../../../assets/image/img_warning.png")}
          />
          <Text style={{ marginTop: 10 }}>{this.state.messagePassword}</Text>
        </View>
      </RBSheet>
    );
  };

  rbSheetBeforeUpdateProfile = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetBeforeUpdateProfile = ref;
        }}
        height={200}
        closeOnPressMask={false}
        duration={250}
        customStyles={{
          container: {
            justifyContent: "center",
            backgroundColor: "transparent",
          },
        }}
      >
        <View style={styles.BSViewKonfirmPassword}>
          <Text style={styles.BSInfo}>Konfirmasi Kata Sandi</Text>
          <View>
            <TextInput
              style={styles.inputs}
              returnKeyType="go"
              autoCapitalize="none"
              value={this.state.password}
              onChangeText={(password) => this.setState({ password })}
              onSubmitEditing={() => this.renderToUpdateProfile()}
              placeholder="Kata Sandi"
              secureTextEntry={true}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => this.RBSheetBeforeUpdateProfile.close()}
              style={[styles.BSClose, { marginRight: 4 }]}
            >
              <Text style={styles.BSCloseText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.renderToUpdateProfile}
              style={[styles.BSOke, { marginLeft: 4 }]}
            >
              <Text style={styles.BSCLanjutText}>Lanjut</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  };

  verifEmailAction = () => {
    this.props.navigation.navigate("VerifEmail", {
      email: this.state.dataUser.email,
    });
  };

  refreshData = () => {
    this.setState({
      isFetching: true,
    });
    this.getProfile();
  };
  async onNavigationEvents() {
    console.log("onNavigationEvents");
    await this.getProfile();
  }

  renderModalUploadFoto() {
    return (
      <Modal
        onHardwareBackPress={() => true}
        modalStyle={styles.bottomSheet}
        visible={this.state.modalVisible}
        rounded
        actionsBordered
        onTouchOutside={() => {
          this.setState({ modalVisible: false });
        }}
      >
        <View style={{ width: 300, height: 300 }}>
          <View style={{ marginTop: 5, flexDirection: "row" }} />
        </View>
      </Modal>
    );
  }

  goToEditPhone = () => {
    // this.props.navigation.navigate('UpdatePhone');
  };

  render() {
    return (
      <Container>
        <NavigationEvents
          onWillFocus={() => {
            this.onNavigationEvents();
          }}
        />
        <Header
          leftComponent={{
            text: "Profil",
            style: {
              fontFamily: "HKGrotesk-Regular",
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
              marginHorizontal: 6,
            },
          }}
          rightComponent={
            <TouchableOpacity onPress={this.logoutProfile}>
              <Text
                style={{
                  fontFamily: "HKGrotesk-Regular",
                  color: "#fff",
                  fontSize: 12,
                  marginHorizontal: 6,
                }}
              >
                Keluar
              </Text>
            </TouchableOpacity>
          }
          containerStyle={{
            backgroundColor: "#FF8033",
            height: Platform.OS == "ios" ? 64 : 56,
            paddingTop: 0,
            borderBottomColor: "transparent",
          }}
        />

        {this.state.isLoading != false ? (
          <View
            style={{
              flex: 1,
              marginTop: "20%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator color="#FF8033" size="large" />
          </View>
        ) : (
          <Content
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isFetching}
                onRefresh={this.refreshData}
              />
            }
          >
            <View style={styles.OvalShapeView} />
            <View
              style={{
                alignItems: "center",
                paddingHorizontal: 26,
                paddingTop: 20,
                paddingBottom: 70,
              }}
            >
              {this.state.dataUser.picture != null &&
              this.state.dataUser.picture != "" ? (
                <TouchableOpacity onPress={() => this.moveUpdateFoto()}>
                  <Image
                    style={styles.fotoContent}
                    source={{ uri: this.state.uriPhoto }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => this.moveUpdateFoto()}>
                  <Image
                    style={styles.fotoContent}
                    source={require("./../../../../assets/image/img_profile_page.png")}
                  />
                </TouchableOpacity>
              )}

              <Text style={styles.nameContent}>
                {this.state.dataUser.name != null &&
                this.state.dataUser.name != ""
                  ? this.state.dataUser.name
                  : "Undefined"}
              </Text>
              <Card style={styles.cardProfile}>
                <CardItem>
                  <Body style={styles.cardContent}>
                    <Text
                      style={{ width: "50%", fontFamily: "HKGrotesk-Regular" }}
                    >
                      Nama Lengkap
                    </Text>
                    <Text style={styles.cardProfileContentText}>
                      {this.state.dataUser.name != null &&
                      this.state.dataUser.name != ""
                        ? this.state.dataUser.name
                        : "Undefined"}
                    </Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body style={styles.cardContent}>
                    <Text style={styles.cardProfileContentText1}>Nik</Text>
                    <Text style={styles.cardProfileContentText2}>
                      {this.state.dataUserTripa.nik != null &&
                      this.state.dataUserTripa.nik != ""
                        ? this.state.dataUserTripa.nik
                        : "-"}
                    </Text>
                  </Body>
                </CardItem>
                {/* <CardItem>
                  <Body style={styles.cardContent}>
                    <Text style={{width: '50%'}}>Kode Nasabah</Text>
                    <Text style={styles.cardProfileContentText3}>-</Text>
                  </Body>
                </CardItem> */}
              </Card>

              <View style={styles.containerContact}>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={styles.imageIcon}
                    source={require("./../../../../assets/image/ic_mail.png")}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#636363",
                    }}
                  >
                    {this.state.dataUser.email != null &&
                    this.state.dataUser.email != ""
                      ? this.state.dataUser.email
                      : "Undefined"}
                  </Text>
                </View>
                {this.state.dataUser.isEmailVerified == false ? (
                  <TouchableOpacity
                    onPress={() => this.verifEmailAction()}
                    style={styles.btnVerifikasiAkun}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      Verifikasi Email
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View>
                    {/* <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                      }}>
                      Verified Email
                    </Text> */}
                  </View>
                )}
              </View>

              <View style={styles.containerContact}>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={styles.imageIcon}
                    source={require("./../../../../assets/image/ic_phone.png")}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#636363",
                    }}
                  >
                    {this.state.dataUser.phone != null &&
                    this.state.dataUser.phone != ""
                      ? this.state.dataUser.phone
                      : "Undefined"}
                  </Text>
                </View>

                {this.state.dataUser.isPhoneVerified == false ? (
                  <TouchableOpacity
                    onPress={() => this.verifNoHpAction()}
                    style={styles.btnVerifikasiAkun}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      Verifikasi No Handphone
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View>
                    {/* <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                      }}>
                      Verified Phone Number
                    </Text> */}
                  </View>
                )}
              </View>

              <View style={styles.containerContact}>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={styles.imageIcon}
                    source={require("./../../../../assets/image/ic_location.png")}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#636363",
                    }}
                  >
                    {this.state.dataUserTripa.alamat_tinggal != null &&
                    (this.state.dataUserTripa.alamat_tinggal != null) != ""
                      ? this.state.dataUserTripa.alamat_tinggal
                      : " -  "}
                  </Text>
                </View>
              </View>
              <View style={styles.btnUpdateProfileContent}>
                <TouchableOpacity
                  onPress={() => this.beforeUpdateProfile()}
                  style={styles.btnUpdateProfile}
                >
                  <Text style={styles.btnUpdateProfileText}>Ubah Profil</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.btnChangePasswordContent}>
                <TouchableOpacity
                  onPress={() => this.changePassword()}
                  style={styles.btnChangePassword}
                >
                  <Text style={styles.btnUpdateProfileText}>
                    Ubah Kata Sandi
                  </Text>
                </TouchableOpacity>
              </View>

              {/* <View style={styles.btnChangePasswordContent}>
                <TouchableOpacity
                  onPress={() => this.moveToRegisterMember()}
                  style={styles.btnChangePassword}>
                  <Text style={styles.btnUpdateProfileText}>
                    Daftar Sebagai Agen
                  </Text>
                </TouchableOpacity>
              </View> */}

              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "HKGrotesk-Regular",

                  marginTop: 40,
                }}
              >
                {Platform.OS == "android"
                  ? util_string.android_version
                  : util_string.ios_version}
              </Text>
            </View>
          </Content>
        )}

        {this.rbSheetVerifNumber()}
        {this.rbSheetVerifSucces()}
        {this.rbSheetLoadUpdateProfile()}
        {this.renderModalUploadFoto()}
        {this.rbSheetBeforeUpdateProfile()}

        <RBSheet
          ref={(ref) => {
            this.RBSheetProfile = ref;
          }}
          height={Dimensions.get("window").height / 2 + 100}
          closeOnPressMask={false}
          duration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              backgroundColor: "transparent",
            },
          }}
        >
          <View style={styles.BSView}>
            <Text style={styles.BSInfo}>Peringatan !!</Text>
            <Text style={styles.BSMessage}>{this.state.message}</Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                onPress={() => this.RBSheetProfile.close()}
                style={styles.BSClose}
              >
                <Text style={styles.BSCloseText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.rbSheetLogout}
                style={styles.BSOke}
              >
                <Text style={styles.BSCLanjutText}>Lanjut</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  cardProfile: {
    width: "100%",
    paddingVertical: 4,
    marginBottom: 20,
  },
  fotoContent: {
    width: 160,
    height: 160,
    borderWidth: 5,
    marginBottom: 16,
    borderColor: "white",
    borderRadius: 260 / 2,
  },
  nameContent: {
    fontFamily: "HKGrotesk-Regular",
    fontSize: 22,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
    borderBottomColor: "#dfdfdf",
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
  inputs: {
    width: Dimensions.get("window").width - 40,
    fontFamily: "HKGrotesk-Regular",
    color: "#989a9d",
    paddingVertical: Platform.OS == "ios" ? "4.6%" : "3%",
    paddingLeft: "5%",
    paddingRight: "5%",
    borderRadius: 12,
    backgroundColor: "#ededed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    elevation: 1,
    marginTop: 10,
    marginBottom: 15,
    marginVertical: 20,
  },
  containerContact: {
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  containerContact3: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  cardProfileContentText: {
    fontFamily: "HKGrotesk-Regular",
    width: "50%",
    textAlign: "right",
    fontWeight: "bold",
  },
  cardProfileContentText1: {
    fontFamily: "HKGrotesk-Regular",
    width: "50%",
    // color: '#0a61c3',
    // fontWeight: 'bold',
  },
  cardProfileContentText2: {
    fontFamily: "HKGrotesk-Regular",
    width: "50%",
    textAlign: "right",
    fontWeight: "bold",
    // color: '#0a61c3',
  },
  cardProfileContentText3: {
    width: "50%",
    textAlign: "right",
    fontWeight: "bold",
    // color: '#FF8033',
  },
  OvalShapeView: {
    position: "absolute",
    backgroundColor: "#FF8033",
    width: Dimensions.get("window").width,
    height: 300,
    borderBottomLeftRadius: 250,
    borderBottomRightRadius: 250,
    transform: [{ scaleX: 2 }],
  },
  imageIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
    resizeMode: "contain",
  },
  btnUpdateProfileContent: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btnChangePasswordContent: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btnUpdateProfileText: {
    color: "#fff",
    fontWeight: "bold",
  },
  btnUpdateProfile: {
    width: "100%",
    color: "#fff",
    paddingVertical: "4%",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FF8033",
  },
  btnChangePassword: {
    width: "100%",
    color: "#fff",
    paddingVertical: "4%",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FF8033",
  },
  btnVerifikasiAkun: {
    borderRadius: 14,
    marginTop: 6,
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 30,
    backgroundColor: "#0a61c3",
  },
  viewVerifiedkasiAkun: {
    borderRadius: 7,
    marginTop: 6,
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 40,
    backgroundColor: "#FF8033",
  },
  BSView: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    // alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: Dimensions.get("window").height / 2 - 100,
    borderRadius: 12,
    backgroundColor: "white",
  },
  BSViewKonfirmPassword: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginHorizontal: 5,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "white",
  },
  BSInfo: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
    color: "#FF8033",
  },
  BSMessage: {
    fontFamily: "HKGrotesk-Regular",
    fontSize: 18,
    marginBottom: 22,
  },
  BSOke: {
    width: 100,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "red",
    borderRadius: 12,
    marginLeft: 10,
    paddingVertical: 10,
  },
  BSClose: {
    fontFamily: "HKGrotesk-Regular",
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
    color: "red",
  },
});

export default Profile;
