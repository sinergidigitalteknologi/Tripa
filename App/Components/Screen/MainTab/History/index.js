import React, { Component } from "react";
import { NavigationEvents } from "react-navigation";
import { getValue } from "./../../../../Modules/LocalData";
import { postDataWitHeader, getDataWitHeader } from "./../../../../Services";
import ApiEndPoint from "./../../../../Modules/Utils/ApiEndPoint";
import RBSheet from "react-native-raw-bottom-sheet";

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator,
  TouchableHighlight,
  FlatList,
  RefreshControl,
} from "react-native";
import { Container, Content, Card, CardItem } from "native-base";
import { Header, Icon } from "react-native-elements";
// import {TouchableHighlight} from 'react-native-gesture-handler';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

class Claim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_user: "",
      isLoading: true,
      token: "",
      detailproduct: "",
      detailproductheader: "",
      dataGrid: "",
      visible: true,
      id: "",
      isActive: false,
      isCardActive: false,
      isDatePickerVisible: false,
      isCardSelected: "",
      noPolis: [],
      periodeAwal: "",
      idPolis: "",
      errorHit: false,
      message: "",
      total: "",
      // typeAssurance: this.props.navigation.getParam('jenisPolis'),
      dataSource: [],
      dataRequest: "",
      page: 0,
      lastPage: 1,
      loadingFooter: false,
      isFetch: false,
    };

    this.dataLoadMore = this.dataLoadMore.bind(this);
  }

  async componentDidMount() {
    await this.getProfile();
    this.loadDataAll();
  }

  async onFocus() {}

  onWillBlur() {}

  async getProfile() {
    await getValue("userData").then((response) => {
      if (response != null) {
        const id = response.data.id;
        const tok = response.access_token;
        this.setState({ id_user: id });
        this.setState({ token: tok });
      }
    });
  }

  loadDataAll = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        // this.getKey();
        this.getFirstHistory();
      }
    );
  };

  async getFirstHistory() {
    var dataPage = this.state.page + 1;

    getDataWitHeader(
      ApiEndPoint.base_url +
        "/tripa/" +
        this.state.id_user +
        "/get_history_transaction?per_page=10&page=" +
        dataPage,
      this.state.token
    )
      .then((response) => {
        if (response.success == true) {
          this.setState({
            dataSource: response.data,
            isLoading: false,
            total: response.pagination.total,
            page: dataPage,
            lastPage: response.pagination.totalPages,
            loadingFooter: false,
            isFetch: true,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({
          isLoading: false,
          loadingFooter: false,
          isFetch: false,
        });
      });
  }

  async getHistory() {
    var dataPage = this.state.page + 1;

    if (this.state.isFetch != true) {
      getDataWitHeader(
        ApiEndPoint.base_url +
          "/tripa/" +
          this.state.id_user +
          "/get_history_transaction?per_page=10&page=" +
          dataPage,
        this.state.token
      )
        .then((response) => {
          if (response.success == true) {
            this.setState({
              dataSource: this.state.dataSource.concat(response.data),
              isLoading: false,
              total: response.pagination.total,
              page: dataPage,
              lastPage: response.pagination.totalPages,
              loadingFooter: false,
              isFetch: true,
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
          this.setState({
            isLoading: false,
            loadingFooter: false,
            isFetch: false,
          });
        });
    }
  }

  dataLoadMore() {
    this.setState({ loadingFooter: true, isFetch: false });

    if (
      this.state.dataSource.length > 9 &&
      this.state.page < this.state.lastPage
    ) {
      if (this.state.isLoading == false) {
        this.getHistory();
      }
    } else {
      this.setState({ loadingFooter: false });
    }
  }

  async deleteData(id) {
    const params = { id_history: id };
    await this.setState({ dataSource: "" });
    postDataWitHeader(
      ApiEndPoint.base_url +
        "/tripa/" +
        this.state.id_user +
        "/delete_history_transaction",
      params,
      this.state.token
    )
      .then((response) => {
        if (response.success == true) {
          this.loadDataAll();
          this.RBSheetModal.close();
          this.setState({
            isCardActive: false,
            isCardSelected: "",
            errorHit: false,
            message: "Berhasil menghapus riwayat transaksi",
          });
          setTimeout(() => {
            this.RBSheet.open();
          }, 1000);
        }
      })
      .catch((error) => {
        console.log("error deleteData", error);
        this.RBSheetModal.close();
      });
  }

  getKey = () => {
    getValue("userData").then((response) => {
      if (response != null) {
        const id = response.data.id;
        const tok = response.access_token;
        const params = {
          nama_asuransi: this.data,
        };
        const dataRest = postDataWitHeader(
          ApiEndPoint.base_url + "/tripa/" + id + "/get_key_polis",
          params,
          tok
        );

        dataRest
          .then((res) => {
            if (res.success == true) {
              // this.cekPengajuanPolis(res.data, id, tok);
              console.log("getKey =>  ", res.data);
              this.getInfoPolis(res.data, this.state.id_user, this.state.token);
            }
          })
          .catch((err) => {
            this.setState({
              isLoading: false,
              dataSource: [],
            });
          });
      }
    });
  };
  getInfoPolis = (dataAll, id, tok) => {
    let dataPengajuan = [];
    let nameAss = [];
    dataAll.map((data, index) => {
      dataPengajuan.push(parseInt(data.key));
      nameAss.push(data.nama_asuransi);
    });
    console.log("dataPengajuan", dataPengajuan);

    const params = {
      key: dataPengajuan,
    };

    const dataRest = postDataWitHeader(
      ApiEndPoint.base_url + "/tripa/" + id + "/get_info_polis",
      params,
      tok
    );

    dataRest
      .then((res) => {
        if (res.success == true) {
          console.log("Success_Get_get_info_polis", res.data);

          var dataSource = res.data;

          dataSource.map((data, index) => {
            data.typeAssurance = nameAss[index];
            data.idPolis = dataPengajuan[index];
          });
          this.setState({
            isLoading: false,
            dataSource: dataSource,
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          dataSource: [],
        });
      });
  };

  refreshData() {}

  onIsActive(id) {
    console.log("is active", id);
    if (this.state.id != null && this.state.id != id) {
      this.setState({
        id: id,
        isActive: true,
      });
    } else if (this.state.id != null) {
      this.setState({
        id: id,
        isActive: !this.state.isActive,
      });
    }
  }

  onSelectedCard(id, idPolis) {
    console.log("onselected", idPolis);
    if (this.state.isCardSelected != null && this.state.isCardSelected != id) {
      this.setState({
        isCardSelected: id,
        isCardActive: true,
        idPolis: idPolis,
      });
    } else if (this.state.isCardSelected != null) {
      this.setState({
        isCardSelected: id,
        isCardActive: !this.state.isCardActive,
        idPolis: idPolis,
      });
    }
  }

  onSelectedDelete(id) {
    this.setState({
      isCardSelected: id,
    });
    this.RBSheetModal.open();
  }

  closeModal() {
    this.RBSheetModal.close();
    this.setState({
      isCardActive: false,
      isCardSelected: "",
    });
  }

  renderFooter = () => {
    if (!this.state.loadingFooter) return null;
    return (
      <View
        style={{
          paddingTop: 8,
          paddingBottom: 12,
          borderColor: "transparent",
        }}
      >
        <ActivityIndicator animating size="large" color="#02aced" />
      </View>
    );
  };

  listEmptyComponent = () => {
    if (!this.state.isLoading) {
      return (
        <Container style={{ alignItems: "center", paddingTop: -20 }}>
          <View style={{ paddingTop: "50%" }}>
            <Icon name="hexagon" type="feather" size={50} color="#000" />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 18 }}>
              Belum ada transaksi
            </Text>
          </View>
        </Container>
      );
    }
  };

  _renderHeader = (item) => {
    return (
      <View style={styles.itemHeader}>
        <View style={styles.itemGrid}>
          <Text style={{ color: "black", fontSize: 14, fontWeight: "bold" }}>
            {item.category}
          </Text>
          <Text style={styles.labelText}>{item.date}</Text>
        </View>
        <View style={styles.itemGrid}>
          <Text style={{ color: "black", fontSize: 14, fontWeight: "bold" }}>
            {item.type}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="check" type="feather" color="#0a61c3" size={20} />
            <Text style={styles.successText}>Success</Text>
          </View>
        </View>
      </View>
    );
  };

  renderData = ({ item, index }) => {
    var isActive = false;
    var isSelected = false;
    var dataArrRequest = [];
    var request = item.request.replace(/([\/\{\}\"])/g, "");
    var splitRequest = request.split(",");

    console.log("render data", index);
    if (index == this.state.id) {
      isActive = this.state.isActive != false ? true : false;
    }
    if (index == this.state.isCardSelected) {
      isSelected = this.state.isCardActive != false ? true : false;
    }

    return (
      <View style={{ marginVertical: 3, marginHorizontal: 10 }}>
        <Card>
          <View style={{ width: "100%", padding: 10 }}>
            <View>
              <View style={{ flexDirection: "row", marginRight: 10 }}>
                <View style={{ flexDirection: "row", flex: 2 }}>
                  <Icon name="hexagon" type="feather" color="#005CE6" />
                  <Text
                    style={{
                      marginLeft: 5,
                      marginRight: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {item.type}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: "red", fontSize: 12, marginTop: -2 }}>
                  {item.created_at.substring(0, 10)}
                </Text>
              </View>
              <View
                style={{
                  height: 2,
                  backgroundColor: "#005CE6",
                  marginTop: 10,
                }}
              />
            </View>
            <View style={{ marginHorizontal: 5, marginTop: 10 }}>
              {splitRequest.map((data, index) => {
                var itemdata = data.split(":");
                if (
                  itemdata[1] != "false" &&
                  itemdata[1] != "Rp. 0" &&
                  itemdata[1] != ""
                ) {
                  return (
                    <View style={{ flexDirection: "row", marginTop: 8 }}>
                      <Text style={{ width: "47%" }}>
                        {itemdata[0].replace(/_/g, " ")}
                      </Text>
                      <Text style={{ width: "5%" }}>:</Text>
                      <Text style={{ width: "49%" }}>
                        {itemdata[1] == "true" ? "Ya" : itemdata[1]}
                      </Text>
                    </View>
                  );
                }
              })}
            </View>
            <View style={{ marginTop: 18 }}>
              <View style={{ flexDirection: "row" }}>
                {/* <TouchableOpacity
                    onPress={() => this.onIsActive(index)}
                    style={{flexDirection: 'row', flex: 1}}>
                    <View style={{width: '50%'}}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#005CE6',
                          marginRight: 5,
                        }}>
                        Detail
                      </Text>
                    </View>
                    <View>
                      <Icon
                        name={isActive == false ? 'chevron-down' : 'chevron-up'}
                        type="feather"
                        color="#005CE6"
                      />
                    </View>
                  </TouchableOpacity> */}

                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                />
                <TouchableOpacity
                  onPress={() => this.onSelectedDelete(item.id)}
                >
                  <Icon
                    name="trash"
                    type="font-awesome"
                    color="red"
                    size={20}
                  />
                </TouchableOpacity>
                {/* <View style={{width: '50%', alignItems: 'flex-end'}}>
                            <Icon
                                name='more-horizontal'
                                type='feather'
                            />
                        </View> */}
              </View>
            </View>
          </View>
          {isSelected == true ? (
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
            />
          ) : null}
        </Card>
      </View>
    );
  };

  renderModal() {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetModal = ref;
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
          <Text style={styles.BSMessage}>
            Apakah anda yakin ingin menghapus data ini?
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => this.closeModal()}
              style={styles.BSClose}
            >
              <Text style={styles.BSCloseText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.deleteData(this.state.isCardSelected)}
              style={styles.BSOke}
            >
              <Text style={styles.BSCLanjutText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  }

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
              onPress={() => this.RBSheet.close()}
              style={styles.BSClose}
            >
              <Text style={styles.BSCloseText}>Ok</Text>
            </TouchableOpacity>
          </View>
        )}
      </RBSheet>
    );
  };

  render() {
    return (
      <Container>
        <Header
          centerComponent={
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{
                  color: "#005CE6",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Riwayat Transaksi
              </Text>
              <Text style={{ marginTop: 5, color: "#005CE6" }}>
                {this.state.total}
              </Text>
            </View>
          }
          rightComponent={
            this.state.isCardActive == true ? (
              <TouchableOpacity onPress={() => this.RBSheetModal.open()}>
                <Icon name="trash" type="font-awesome" color="red" size={20} />
              </TouchableOpacity>
            ) : null
          }
          containerStyle={{
            backgroundColor: "#fff",
            height: Platform.OS == "ios" ? 64 : 56,
            paddingTop: 0,
            elevation: 7,
            borderBottomColor: "transparent",
            justifyContent: "space-around",
          }}
        />
        <NavigationEvents
          onWillFocus={() => {
            this.onFocus();
          }}
          onWillBlur={() => {
            this.onWillBlur();
          }}
        />
        <Content
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }} // important!
          refreshControl={
            <RefreshControl
              colors={["#FF8033"]}
              refreshing={this.state.isLoading}
              onRefresh={this.loadDataAll}
            />
          }
        >
          {this.state.isLoading ? (
            // <ActivityIndicator
            //   style={{
            //     justifyContent: 'center',
            //     alignItems: 'center',
            //     backgroundColor: 'grey',
            //   }}
            //   color="#FF8033"
            //   size="large"
            // />
            <View />
          ) : (
            <View style={{ flex: 1, marginTop: 20 }}>
              <FlatList
                data={this.state.dataSource}
                renderItem={this.renderData}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={this.listEmptyComponent}
                onEndReached={this.dataLoadMore}
                keyExtractor={(item, key) => key}
                onEndReachedThreshold={0.9}
                ListFooterComponent={this.renderFooter.bind(this)}
              />
            </View>
          )}

          {this.renderModal()}
          {this.renderBS()}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemHeader: {
    padding: 5,
    flexDirection: "row",
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
  },
  itemGrid: {
    width: deviceWidth / 2 - 10,
    padding: 5,
  },
  itemContent: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  itemContentGrid: {
    width: "100%",
    flex: 1,
    padding: 14,
  },
  sticky: {
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 10,
    alignItems: "center",
    width: deviceWidth,
  },
  successText: {
    fontSize: 13,
    color: "#0a61c3",
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
    color: "#FF8033",
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
    borderColor: "#FF8033",
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
    marginHorizontal: 5,
  },
  BSCloseText: {
    fontFamily: "HKGrotesk-Regular",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    borderColor: "#FF8033",
    color: "#FF8033",
  },
  BSCloseTextWarning: {
    fontSize: 14,
    fontFamily: "HKGrotesk-Regular",
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFCC00",
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
  BSCLanjutText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
  },
});

export default Claim;
