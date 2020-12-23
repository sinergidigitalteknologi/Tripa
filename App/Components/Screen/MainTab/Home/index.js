import "react-native-gesture-handler";
import React, { Component } from "react";
import {
  NavigationEvents,
  NavigationActions,
  withNavigation,
  StackActions,
} from "react-navigation";
import GridMenuHome from "./GridMenuHome";
import CarouselBeritaHome from "./CarouselBeritaHome";
import CarouselInfoPromo from "./CarouselInfoPromo";
import { Icon } from "react-native-elements";
import Tts from "react-native-tts";
import { getValue, removeValue } from "./../../../../Modules/LocalData";
import Modal, { SlideAnimation } from "react-native-modals";
import ApiEndPoint from "./../../../../Modules/Utils/ApiEndPoint";
import {
  getDataWithHeader,
  postNoHeader,
  postDataWitHeader,
} from "./../../../../Services";
import RBSheet from "react-native-raw-bottom-sheet";
import Sound from "react-native-sound";
import CustomBs from "../../../../Utils/CustomBs";
import util_string from "../../../../Utils/String";

import {
  Container,
  Header,
  Content,
  Item,
  Card,
  CardItem,
  Body,
  Input,
} from "native-base";
import {
  Text,
  View,
  Animated,
  Alert,
  TouchableHighlight,
  BackHandler,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  RefreshControl,
  Linking,
  Dimensions,
  Platform,
} from "react-native";
import { Button } from "react-native-paper";
import Api from "../../../../Utils/Api";

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Login" })],
});
const resetActionHome = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Home" })],
});

const setLanguage = () => {
  try {
  } catch {}
  Tts.voices().then((voices) => console.log("setDefaultLanguage"));
};

let sound;
class Home extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    Tts.getInitStatus().then(
      (res) => {
        console.log("getInitStatus");
      },
      (err) => {
        console.log("error TTS");
        if (err.code === "no_engine") {
          Tts.requestInstallEngine();
        }
      }
    );
    Tts.setDefaultEngine("com.google.android.tts");

    // setLanguage();

    this.state = {
      username: "",
      usernametest: "",
      token: "",
      refresh_token: "",
      showAlert: false,
      showLogout: false,
      reloadPage: false,
      modalVisible: false,
      isFetching: false,
      engineTTS: false,
      modalEngineTTS: false,
      message: "",
      on_home: true,
    };
  }
  async componentDidMount() {
    // await this.checkEngine();
    await this.checkVersionApp();
    setTimeout(() => {
      Tts.setDefaultLanguage("id-ID");
      Tts.setIgnoreSilentSwitch("ignore");
      this.getProfile();
    }, 4000);
  }
  componentDidUpdate() {}

  goToNotification = () => {
    this.props.navigation.navigate("Inbox");
  };

  getPostbackPenggunaan = async () => {
    await this.getProfileFromServer();
    this.setState({ on_home: true });
    if (this.state.engineTTS == false) {
      // this.checkEngine();
    }
  };

  onBlur() {
    this.setState({ on_home: false });

    if (Platform.OS == "ios") {
      try {
        sound.stop();
      } catch {}
    }
    this.setState({ modalVisible: false });
  }

  async checkVersionApp() {
    if (Platform.OS == "ios") {
      var params = {
        os: "ios",
        version: util_string.ios_version,
      };
    } else {
      var params = {
        os: "android",
        version: util_string.android_version,
      };
    }
    postNoHeader(ApiEndPoint.api_version_check, params)
      .then((response) => {
        console.log("checkVersionApp", response);
        if (response.status == 200) {
        } else {
          this.setState({ message: response.message });
          this.RBSheetCheckVersion.open();
        }
      })
      .catch((error) => {
        console.log("checkVersionApp", error);
      });
  }

  async checkEngine() {
    // Tts.setDefaultEngine('com.google.android.tts');
    await Tts.engines().then((engines) => {
      console.log("engine", engines);
      var tts = false;
      var enginesLenght = engines.length - 1;
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
              message:
                "Maaf perangkat anda belum terinstal Google Text-to-Speech",
            });
            this.RBSheet.open();
          } else {
            console.log("checkEngine tts true");
          }
        }
      });
    });
    Tts.setDefaultLanguage("id-ID");
    Tts.setIgnoreSilentSwitch("ignore");
    Tts.voices().then((voices) => console.log("Voices"));
  }

  gotoWebviewAll = (data) => {
    this.props.navigation.navigate("WebviewAll", { url: data });
  };
  refreshData = () => {
    console.log("refreshData");
    this.setState({
      isFetching: true,
    });
    this.refreshHome();
  };

  refreshHome() {
    this.setState({ isFetching: false });
    this.gridMenu.firstAction();
    this.carouselBerita.firstAction();
    this.carouselPromo.firstAction();
  }

  gotoPlayStore(message) {
    this.RBSheet.close();
    this.setState({ modalVisible: false });
    if (message == "app" && Platform.OS == "android") {
      Linking.openURL(
        "https://play.google.com/store/apps/details?id=com.tripa&hl=id"
      );
    } else if (message == "app" && Platform.OS == "ios") {
      Linking.openURL("https://www.apple.com/us/search?src=Tripa%20Smart");
    } else {
      Linking.openURL(
        "https://play.google.com/store/apps/details?id=com.google.android.tts&hl=id"
      );
    }
    // this.props.navigation.dispatch(resetActionHome);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
    setTimeout(() => {
      this.setState({ modalVisible: false });
    }, 5000);
    // this.renderModal();
  }

  async getProfile() {
    getValue("userData").then((response) => {
      // console.log('response saveData =>  ', response);

      if (response.success) {
        if (this.state.on_home) {
          this.setModalVisible(true);
        }
        const nama = response.data.nickname;
        this.setState({ username: nama });
        this.setState({ token: response.access_token });
        if (Platform.OS == "ios" && this.state.on_home) {
          let payload = {
            platform: "ios",
          };

          postNoHeader(ApiEndPoint.voice + "general/getvoiceurl", payload)
            .then((response) => {
              let femaleVoice = response.female;

              let textGreetings =
                "Selamat Datang " +
                nama +
                ", apakah ada yang bisa Astri bantu ?";
              let encodetext = encodeURI(textGreetings);
              let replaceText;

              replaceText = femaleVoice.replace("$paramtext", encodetext);
              sound = new Sound(replaceText, null, (error) => {
                if (error) {
                  // console.log('error voice : ',error)
                } else {
                  sound.play();
                }
              });
            })
            .catch((error) => {
              console.log("error voice : ", error);
            }); //get Data female voice
        } else if (Platform.OS == "android" && this.state.on_home) {
          Tts.speak(
            "Selamat Datang " + nama + ", apakah ada yang bisa Astri bantu ?"
          );
        }
      }
    });
  }

  async getProfileFromServer() {
    getValue("userData").then((response) => {
      // console.log('response saveData =>  ', response);

      if (response.success) {
        const nama = response.data.name;
        const dataRest = getDataWithHeader(
          ApiEndPoint.base_url + "/users/" + response.data.id + "/tripa",
          response.access_token
        );
        dataRest
          .then((res) => {
            // console.log('GET_PROFILE_RESPONSE', res);

            if (res.success) {
            } else {
            }
          })
          .catch((err) => {
            console.log("err +>", err);
            this.setState({
              isLoading: false,
              isFetching: false,
            });
            if (!error.status) {
              // network error
            } else if (
              err.response.status == 401 ||
              err.response.status == 404
            ) {
              removeValue("userData");
              removeValue("hasLogin");
              removeValue("fcm");
              // removeValue('dataNotif');
              this.props.navigation.dispatch(resetAction);
            }
          });
      }
    });
  }

  onCloseModal() {
    this.setState({ modalVisible: false });
  }

  gotoChat = () => {
    this.props.navigation.navigate("Chat", { tok: this.state.access_token });
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
        <View style={styles.BSView}>
          <Text style={styles.BSInfoWarning}>Peringatan !!</Text>
          <Text style={styles.BSMessage}>{this.state.message}</Text>
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

  renderBSCheckversion = () => {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetCheckVersion = ref;
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
          <Text style={styles.BSMessage}>{this.state.message}</Text>
          <TouchableOpacity
            onPress={() => this.gotoPlayStore("app")}
            style={styles.BSCloseWarning}
          >
            <Text style={styles.BSCloseTextWarning}>Unduh</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  };

  render() {
    return (
      <Container>
        <NavigationEvents
          onWillFocus={() => {
            this.getPostbackPenggunaan();
          }}
          onWillBlur={() => {
            this.onBlur();
          }}
        />
        <Content
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isFetching}
              onRefresh={this.refreshData}
            />
          }
        >
          <ImageBackground
            resizeMode={"stretch"}
            style={styles.bgcity}
            source={require("../../../../assets/image/home_tripa_tower.png")}
          />
          <View style={styles.header1}>
            <View style={styles.logoImageContainer}>
              <Image
                style={styles.logotripa}
                source={require("../../../../assets/image/img_logo_tripa.png")}
              />
            </View>
            <View
              style={{
                alignContent: "flex-end",
                alignItems: "flex-end",
                backgroundColor: "rgba(52, 52, 52, 0.6)",
                height: 35,
                borderBottomLeftRadius: 50,
                borderTopLeftRadius: 50,
                paddingLeft: 10,
                paddingRight: 10,
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 10, color: "#fff" }}>
                Tripa Call
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 10, color: "#fff" }}>
                1500 946
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "rgba(52, 52, 52, 0.6)",
                flexDirection: "row",
                marginEnd: 10,
                borderBottomRightRadius: 50,
                borderTopRightRadius: 50,
              }}
            >
              <Icon
                name="bell"
                type="evilicon"
                size={30}
                iconStyle={styles.iconbell}
                containerStyle={styles.bgiconbell}
                onPress={() => {
                  this.goToNotification();
                }}
              />
            </View>
          </View>
          <View>
            <GridMenuHome onGridMenu={(ref) => (this.gridMenu = ref)} />
          </View>
          <View>
            <Text style={styles.textinfohome}>Berita Tripa</Text>
            <CarouselBeritaHome
              onCarouselBerita={(ref) => (this.carouselBerita = ref)}
              navigationAction={
                // this.props.navigation.navigate('WebviewAll')
                this.gotoWebviewAll
              }
            />
          </View>
          <View>
            <Text style={styles.textinfohome}>Berita Terkini</Text>
            <CarouselInfoPromo
              onCarouselPromo={(ref) => (this.carouselPromo = ref)}
              navigationAction={
                // this.props.navigation.navigate('WebviewAll')
                this.gotoWebviewAll
              }
            />
          </View>

          <Modal
            visible={this.state.modalVisible}
            modalStyle={styles.modalStyle}
            actionsBordered
            onTouchOutside={() => {
              this.setState({ modalVisible: false });
            }}
            modalAnimation={
              new SlideAnimation({
                slideFrom: "bottom",
              })
            }
          >
            <View
              style={{
                backgroundColor: "transparent",
                marginRight: 20,
                marginLeft: 20,
              }}
            >
              <TouchableHighlight
                activeOpacity={0.1}
                underlayColor="#00000"
                onPress={() => this.onCloseModal()}
              >
                <View
                  style={{
                    // justifyContent: 'flex-end',
                    alignItems: "flex-end",
                    marginRight: -20,
                    marginBottom: -20,
                    height: 50,
                    // backgroundColor: 'grey',
                  }}
                >
                  <Icon
                    name="times"
                    type="font-awesome"
                    color="#fff"
                    iconStyle={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    containerStyle={{
                      width: 35,
                      height: 35,
                      marginRight: 10,
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "red",
                    }}
                  />
                </View>
              </TouchableHighlight>
              <View
                style={{
                  // flexDirection: 'row',
                  alignContent: "center",
                  // alignItems: 'center',
                }}
              >
                <View
                  style={{
                    // flex: 5,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginBottom: -20,
                  }}
                >
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Image
                      resizeMode={"stretch"}
                      source={require("../../../../assets/image/speech_balloon.png")}
                      style={{
                        width: 150,
                        height: 120,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                      }}
                    />
                    <Text
                      maxLength={3}
                      style={{
                        textAlign: "center",
                        color: "#064266",
                        // color: 'black',
                        fontSize: 14,
                        fontWeight: "bold",
                        fontFamily: "HKGrotesk-Regular",
                        position: "absolute",
                      }}
                    >
                      Selamat Datang!{" "}
                      {this.state.username.length < 15
                        ? "\n" + this.state.username
                        : "\n" + this.state.username.substr(0, 15) + "..."}
                    </Text>
                  </View>
                </View>

                <Image
                  resizeMode={"stretch"}
                  source={require("../../../../assets/image/Tripa_Avatar.png")}
                  style={{
                    // flex: 4,
                    width: Dimensions.get("window").width,
                    height: (Dimensions.get("window").height / 5) * 4,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                  }}
                />
              </View>
            </View>
          </Modal>
          <CustomBs onCustomBS={(ref) => (this.customBs = ref)} />
          {this.renderBS()}
          {this.renderBSCheckversion()}
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  cardstyle: {
    borderRadius: 15,
    backgroundColor: "#ffffff",
    height: 120,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  viewsearch: {
    flexDirection: "row",
    marginStart: 20,
    marginEnd: 20,
    marginTop: 10,
    marginBottom: 0,
    borderRadius: 12,
    alignItems: "center",
  },
  textinputhome: {
    flex: 1,
    marginStart: 10,
  },
  bgiconbell: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  textinfohome: {
    marginStart: 20,
    marginEnd: 20,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "HKGrotesk-Regular",
    color: "#005CE6",
    fontWeight: "bold",
  },
  logoImage: {
    width: "100%",
    height: 84,
    resizeMode: "contain",
  },
  iconbell: {
    color: "#FB4D00",
  },
  bgcity: {
    position: "absolute",
    width: "100%",
    height: 250,
  },
  logotripa: {
    width: 90,
    height: 50,
    resizeMode: "contain",
  },
  header1: {
    width: "100%",
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImageContainer: {
    flex: 1,
    width: 200,
    marginLeft: 10,
    alignItems: "flex-start",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalStyle: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: Dimensions.get("window").width,
    justifyContent: "center",
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
export default Home;
