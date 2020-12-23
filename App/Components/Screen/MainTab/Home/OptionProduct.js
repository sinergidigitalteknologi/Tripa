import React, {Component} from 'react';
import ApiEndPoint from '../../../../Modules/Utils/ApiEndPoint';
import {
  NavigationEvents,
  NavigationActions,
  withNavigation,
  StackActions,
} from 'react-navigation';
import {Header, Icon} from 'react-native-elements';
import HTML from 'react-native-render-html';
import {getDataWitHeader} from '../../../../Services';
import {getValue, removeValue} from '../../../../Modules/LocalData';
import CustomBs from '../../../../Utils/CustomBs';
import {Content, Container} from 'native-base';
const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'Login'})],
});

import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

class OptionProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_user: '',
      token: '',
      dataGrid: '',
      dataKonvensional: '',
      visible: false,
      visible2: false,
      dataSyariah: '',
      dataDetailSyariah: '',
      code_color: '#FF8033',
    };
  }

  async componentDidMount() {
    await this.getProfile();
    await this.getOptionProduct();
    await this.getDataKonvensional();
    await this.getDataSyariah();
    await this.getDetailDataSyariah();
  }

  async getProfile() {
    await getValue('userData').then(response => {
      if (response != null) {
        const id = response.data.id;
        const tok = response.access_token;
        this.setState({id_user: id});
        this.setState({token: tok});
      }
    });
  }

  async getOptionProduct() {
    var dataGrid = this.props.navigation.getParam('label');
    await this.setState({dataGrid: dataGrid});
  }

  getDataKonvensional() {
    this.customBs.showBsLoading();
    let url = '';
    let datagrid = this.state.dataGrid;
    if (datagrid == 'Asuransi Kebakaran') {
      url = 'polis-kebakaran-header';
      this.setState({code_color: '#FF8033'});
    } else if (datagrid == 'Asuransi Kecelakaan') {
      url = 'polis-kecelakaandiri-header';
      this.setState({code_color: '#1773d9'});
    } else if (datagrid == 'Asuransi Travel') {
      url = 'polis-travel-header';
      this.setState({code_color: '#ea0000'});
    } else if (datagrid == 'Asuransi Kendaraan') {
      url = 'polis-kendaraan-header';
      this.setState({code_color: '#00dbd5'});
    }
    getDataWitHeader(
      ApiEndPoint.base_url +
        '/users/' +
        this.state.id_user +
        '/tripa/product-detail/' +
        url,
      this.state.token,
    )
      .then(response => {
        if (response.success == true) {
          this.setState({
            dataKonvensional: response.data.value,
            visible: true,
          });
        } else {
          this.customBs.closeBsLoading();
          setTimeout(() => {
            this.customBs.showBsSuccess('Maaf terjadi kendala teknis', '');
          }, 1500);
        }
      })
      .catch(error => {});
  }

  getDataSyariah() {
    let url = '';
    let datagrid = this.state.dataGrid;
    if (datagrid == 'Asuransi Kebakaran') {
      url = 'polis-kebakaran-header-syariah';
    } else if (datagrid == 'Asuransi Kecelakaan') {
      url = 'polis-kecelakaandiri-header-syariah';
    } else if (datagrid == 'Asuransi Kendaraan') {
      url = 'polis-kendaraan-header-syariah';
    }

    if (datagrid == 'Asuransi Travel') {
      this.customBs.closeBsLoading();
    } else {
      getDataWitHeader(
        ApiEndPoint.base_url +
          '/users/' +
          this.state.id_user +
          '/tripa/product-detail/' +
          url,
        this.state.token,
      )
        .then(response => {
          if (response.success == true) {
            this.customBs.closeBsLoading();
          } else {
            this.customBs.closeBsLoading();
            setTimeout(() => {
              this.customBs.showBsSuccess('Maaf terjadi kendala teknis', '');
            }, 1500);
          }
          this.setState({dataSyariah: response.data.value, visible: true});
        })
        .catch(error => {
          console.log('error', error);
          if (error.response.status == 401) {
            this.customBs.closeBsLoading();
            removeValue('userData');
            removeValue('hasLogin');
            removeValue('fcm');
            // removeValue('dataNotif');

            this.props.navigation.dispatch(resetAction);
          }
        });
    }
  }

  getDetailDataSyariah() {
    let url = '';
    let datagrid = this.state.dataGrid;
    if (datagrid == 'Asuransi Kebakaran') {
      url = 'detail-sharia';
    } else if (datagrid == 'Asuransi Kecelakaan') {
      url = 'detail-sharia';
    } else if (datagrid == 'Asuransi Kendaraan') {
      url = 'detail-sharia';
    }

    if (datagrid == 'Asuransi Travel') {
      this.customBs.closeBsLoading();
    } else {
      getDataWitHeader(
        ApiEndPoint.base_url +
          '/users/' +
          this.state.id_user +
          '/tripa/product-detail/' +
          url,
        this.state.token,
      )
        .then(response => {
          if (response.success == true) {
            // this.customBs.closeBsLoading();
          } else {
            // this.customBs.closeBsLoading();
            setTimeout(() => {
              this.customBs.showBsSuccess('Maaf terjadi kendala teknis', '');
            }, 1500);
          }
          this.setState({
            dataDetailSyariah: response.data.value,
            // visible: true,
          });
        })
        .catch(error => {
          console.log('error', error);
          if (error.response.status == 401) {
            this.customBs.closeBsLoading();
            removeValue('userData');
            removeValue('hasLogin');
            removeValue('fcm');
            // removeValue('dataNotif');

            this.props.navigation.dispatch(resetAction);
          }
        });
    }
  }

  gotoDetail(type) {
    let polis = false;
    var message = this.props.navigation.getParam('label');
    if (message == 'Asuransi Kebakaran') {
      polis = true;
    } else if (message == 'Asuransi Kecelakaan') {
      polis = true;
    } else if (message == 'Asuransi Travel') {
      polis = true;
    } else if (message == 'Asuransi Kendaraan') {
      polis = true;
    } else if (message == 'Layanan') {
      polis = message;
    } else if (message == 'Polisku') {
      polis = message;
    }

    if (type == 'syariah') {
      if (polis == true) {
        this.props.navigation.navigate('DetailProduct', {
          label: message + ' Syariah',
          type: type,
        });
      }
    } else {
      if (polis == true) {
        this.props.navigation.navigate('DetailProduct', {
          label: message,
          type: '',
        });
      }
    }
  }

  actionsGoBack() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <Container>
        <Header
          rightContainerStyle={{flex: 2}}
          centerContainerStyle={{flex: 1}}
          leftComponent={
            <View>
              <TouchableOpacity
                style={styles.leftComponent}
                onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" color="#000" backgroundColor="#000" />
                <Text style={styles.textbackAction}>Kembali</Text>
              </TouchableOpacity>
            </View>
          }
          containerStyle={{
            backgroundColor: '#fff',
            height: Platform.OS == 'ios' ? 64 : 56,
            paddingTop: 0,
            borderBottomColor: 'transparent',
            justifyContent: 'space-around',
          }}
        />
        <Content style={styles.content}>
          <View style={styles.card}>
            <HTML
              onParsed={this.hideSpinner}
              imagesMaxWidth={Dimensions.get('window').width - 10}
              // imagesInitialDimensions={width:200,height: 200}
              html={this.state.dataKonvensional}
              //   imagesMaxWidth={Dimensions.get('window').width}
            />
            {this.state.visible && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 5,
                }}>
                <TouchableOpacity onPress={() => this.gotoChatSimulasi()} />

                <View>
                  <TouchableOpacity onPress={() => this.gotoDetail()}>
                    <View
                      style={{
                        width: 85,
                        height: 35,
                        marginStart: 10,
                        marginBottom: 20,
                        marginEnd: 15,
                        backgroundColor: this.state.code_color,
                        justifyContent: 'center',
                        borderRadius: 50,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                        }}>
                        Pilih
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          {this.state.dataGrid != 'Asuransi Travel' && (
            <View style={styles.card}>
              <HTML
                onParsed={this.hideSpinner}
                imagesMaxWidth={Dimensions.get('window').width - 10}
                // imagesInitialDimensions={width:200,height: 200}
                html={this.state.dataSyariah}
                //   imagesMaxWidth={Dimensions.get('window').width}
              />
              {this.state.visible && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginTop: 5,
                  }}>
                  <TouchableOpacity onPress={() => this.gotoChatSimulasi()} />

                  <View>
                    <TouchableOpacity
                      onPress={() => this.gotoDetail('syariah')}>
                      <View
                        style={{
                          width: 85,
                          height: 35,
                          marginStart: 10,
                          marginEnd: 15,
                          backgroundColor: '#01853a',
                          justifyContent: 'center',
                          borderRadius: 50,
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            textAlign: 'center',
                          }}>
                          Pilih
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          <CustomBs
            goBack={this.actionsGoBack}
            onCustomBS={ref => (this.customBs = ref)}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'center',
  },
  leftComponent: {flexDirection: 'row', alignItems: 'center'},
  textbackAction: {
    marginStart: 10,
    fontSize: 16,
  },
});

export default withNavigation(OptionProduct);
