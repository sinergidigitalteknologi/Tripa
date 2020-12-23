import React, { Component } from "react";
import HTML from "react-native-render-html";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";
import { getDataWitHeader } from "./../../../../Services";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RBSheet from "react-native-raw-bottom-sheet";
import dataDetail from "../../../../Utils/String";
import valueType from "../../../../Utils/String";
import ApiEndPoint from "./../../../../Modules/Utils/ApiEndPoint";
import Api from "../../../../Utils/Api";
import { getValue } from "./../../../../Modules/LocalData";
import Modal, { SlideAnimation } from "react-native-modals";

import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Content } from "native-base";
import { TouchableHighlight } from "react-native-gesture-handler";

let id = "";
let tok = "";
let data_tripa_user = "";
const dataUser = () => {
  getValue("userData").then((response) => {
    if (response != null) {
      id = response.data.id;
      tok = response.access_token;
      getDataWitHeader(
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

class BsDetailTypeProduct extends Component {
  constructor(props) {
    super(props);
    dataUser();
    this.state = {
      title: "",
      message: "",
      detailproduct: "",
      typeProduct: "",
      form_name: "",
      visible: true,
      modal_visible: false,
    };
    this.hideSpinner = this.hideSpinner.bind(this);
  }
  componentDidMount() {
    this.props.onDetailTypeProduct(this);
  }
  componentWillUnmount() {
    this.props.onDetailTypeProduct(undefined);
  }
  async setModalVisible(title, formName) {
    this.setState({
      modal_visible: true,
      typeProduct: title,
      form_name: formName,
    });
    var data = title;
    setTimeout(() => {
      this.RBSheet.open();
    }, 1500);

    if (data == "" || data == "- Pilih -") {
      this.setState({
        detailproduct: "",
      });
    } else {
      await this.getDetailProduct(title);
    }
    await this.setState({ title: title });
    // this.renderModal();
  }
  getDetailProduct(data) {
    let url = "astri-home-plus";
    let valueDetail = data.toLowerCase();
    if (data == "ASTRI HOD (HOME ON DEMAND)") {
      url = "astri-hod";
    } else if (data == "ASTRI ASTON (AUTOSHIELD TLO ON DEMAND)") {
      url = "astri-aston";
    } else if (data == "ASTRI ASGARD (AUTOSHIELD ALLRISK ON DEMAND)") {
      url = "astri-asgard";
    } else if (data != null) {
      url = valueDetail.replace(/ /g, "-");
    }

    getDataWitHeader(
      Api.base_url2 + "users/" + id + "/tripa/product-detail/" + url,
      tok
    ).then((response) => {
      this.setState({ detailproduct: response.data.value });
    });
  }
  hideSpinner() {
    this.setState({ visible: false });
  }

  async eventClose() {
    var form_name = this.state.form_name;
    this.RBSheet.close();
    await this.setState({ modal_visible: false });
    setTimeout(() => {
      if (form_name == "fire") {
        this.props.showBsFire();
      } else if (form_name == "fire2") {
        this.props.showBsFire2();
      } else if (form_name == "vehicle") {
        this.props.showBsVehicle();
      } else if (form_name == "travel") {
        this.props.showBsTravel();
      } else if (form_name == "ppa") {
        this.props.showBsPPA();
      } else if (form_name == "fire_simulations") {
        this.props.showBsFireSim();
      } else if (form_name == "fire_simulations2") {
        this.props.showBsFireSim2();
      } else if (form_name == "vehicle_simulations") {
        this.props.showBsVehicleSim();
      } else if (form_name == "travel_simulations") {
        this.props.showBsTravelSim();
      } else if (form_name == "ppa_simulations") {
        this.props.showBsPPASim();
      }
    }, 1000);
  }

  // render() {
  //   return (
  //     <Modal
  //       visible={this.state.modal_visible}
  //       modalStyle={styles.modalStyle}
  //       onTouchOutside={() => {
  //         this.setState({modal_visible: false});
  //       }}
  //       modalAnimation={
  //         new SlideAnimation({
  //           slideFrom: 'bottom',
  //         })
  //       }>
  //       <View style={styles.BSView}>
  //         <View
  //           style={{
  //             borderTopLeftRadius: 7,
  //             borderTopRightRadius: 7,
  //             backgroundColor: '#3d9acc',
  //             flexDirection: 'row',
  //           }}>
  //           <Text
  //             style={{
  //               flex: 9,
  //               fontSize: 16,
  //               fontWeight: 'bold',
  //               alignContent: 'center',
  //               alignItems: 'center',
  //               textAlign: 'center',
  //               marginTop: 5,
  //               marginBottom: 10,
  //               marginLeft: 5,

  //               color: 'white',
  //             }}>
  //             {this.state.title}
  //           </Text>
  //           <Icon
  //             name="close"
  //             type="evilicon"
  //             size={30}
  //             iconStyle={{
  //               color: 'white',
  //               justifyContent: 'center',
  //               alignContent: 'center',
  //             }}
  //             containerStyle={{
  //               flex: 1,
  //               justifyContent: 'center',
  //               alignContent: 'center',
  //               marginRight: -5,
  //               backgroundColor: 'transparent',
  //             }}
  //             onPress={() => {
  //               this.eventClose();
  //             }}
  //           />
  //         </View>

  //         <ScrollView
  //           style={{
  //             marginTop: 5,
  //             paddingHorizontal: 10,
  //             flex: 1,
  //           }}>
  //           {this.state.visible && (
  //             <ActivityIndicator
  //               style={{
  //                 flex: 1,
  //                 justifyContent: 'center',
  //                 alignItems: 'center',
  //               }}
  //               size="large"
  //             />
  //           )}
  //           <HTML
  //             onParsed={this.hideSpinner}
  //             imagesMaxWidth={Dimensions.get('window').width - 20}
  //             html={this.state.detailproduct}
  //           />
  //         </ScrollView>
  //       </View>
  //     </Modal>
  //   );
  // }
  render() {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheet = ref;
        }}
        height={Dimensions.get("window").height}
        duration={350}
        closeOnPressMask={false}
        closeOnPressBack={false}
        customStyles={{
          container: {
            backgroundColor: "transparent",
            justifyContent: "center",
            alignContent: "center",
          },
        }}
      >
        <View style={styles.BSView2}>
          <View
            style={{
              borderTopLeftRadius: 7,
              borderTopRightRadius: 7,
              backgroundColor: "#3d9acc",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                flex: 9,
                fontSize: 16,
                fontWeight: "bold",
                alignContent: "center",
                alignItems: "center",
                textAlign: "center",
                marginTop: 5,
                marginBottom: 10,
                marginLeft: 5,

                color: "white",
              }}
            >
              {this.state.title}
            </Text>
            <Icon
              name="close"
              type="evilicon"
              size={30}
              iconStyle={{
                color: "white",
                justifyContent: "center",
                alignContent: "center",
              }}
              containerStyle={{
                flex: 1,
                justifyContent: "center",
                alignContent: "center",
                marginRight: -5,
              }}
              onPress={() => {
                this.eventClose();
              }}
            />
          </View>

          <ScrollView>
            <View style={{ marginTop: 5, paddingHorizontal: 10 }}>
              {this.state.visible && (
                <ActivityIndicator
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  size="large"
                />
              )}
              <HTML
                onParsed={this.hideSpinner}
                imagesMaxWidth={Dimensions.get("window").width - 20}
                // imagesInitialDimensions={width:200,height: 200}
                html={this.state.detailproduct}
                //   imagesMaxWidth={Dimensions.get('window').width}
              />
            </View>
          </ScrollView>
        </View>
      </RBSheet>
    );
  }
}

const styles = StyleSheet.create({
  contentbottomSheet: {
    flex: 1,
    backgroundColor: "#ededed",
    marginStart: 5,
    marginEnd: 5,
  },
  BSView: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: Dimensions.get("window").height / 4,
    borderRadius: 7,
    backgroundColor: "white",
  },
  BSView2: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: Dimensions.get("window").height / 4,

    borderRadius: 7,
    backgroundColor: "white",
  },
  modalStyle: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BsDetailTypeProduct;
