import React, {Component} from 'react';
import 'react-native-gesture-handler';
import Api from '../../../../Utils/Api';
import HTML from 'react-native-render-html';
import {
  withNavigation,
  StackActions,
  NavigationActions,
} from 'react-navigation';
import {Header, Icon} from 'react-native-elements';
import {getDataWitHeader} from './../../../../Services';
import {getValue, removeValue} from './../../../../Modules/LocalData';
import RBSheet from 'react-native-raw-bottom-sheet';

import {Content, Container} from 'native-base';

import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'Login'})],
});

class DetailProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_user: '',
      token: '',
      nik: '',
      address: '',
      birth_date: '',
      birth_place: '',
      gender: '',
      provincie: '',
      city: '',
      sub_district: '',
      village: '',
      zip_code: '',
      message: 'Maaf profil anda belum lengkap',
      email_verify: false,
      no_hp: false,
      profile: false,

      detailproduct: '',
      detailproductheader: '',
      dataGrid: '',
      visible: true,

      type: '',
    };
  }

  async componentDidMount() {
    await this.getProfile();
    await this.getDataGrid();
    console.log('response id user =>  ', this.state.id_user);
    await this.getDetailProduct();
    await this.getDetailProductHeader();
    await this.getProfileFromServer();
    // await this.profileVAlidation();
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

  hideSpinner = () => {
    this.setState({visible: false});
  };

  async getProfileFromServer() {
    getDataWitHeader(
      Api.base_url2 + 'users/' + this.state.id_user + '/tripa',
      this.state.token,
    )
      .then(response => {
        if (response.success) {
          this.setState({
            nik: response.data.tripaUser.nik,
            address: response.data.tripaUser.alamat_tinggal,
            birth_date: response.data.birthDate,
            birth_place: response.data.tripaUser.tempat_lahir,
            gender: response.data.gender,
            provincie: response.data.tripaUser.provinsi,
            city: response.data.tripaUser.kota,
            sub_district: response.data.tripaUser.kecamatan,
            village: response.data.tripaUser.kelurahan,
            zip_code: response.data.tripaUser.kode_pos,
            email_verify: response.data.isEmailVerified,
            no_hp: response.data.isPhoneVerified,
          });
        }
      })
      .catch(error => {
        if (error.response.status == 401) {
          removeValue('userData');
          removeValue('hasLogin');
          removeValue('fcm');
          this.props.navigation.dispatch(resetAction);
          console.log('error get profile', error.response);
        }
      });
  }

  async profileVAlidation() {
    var nik = this.state.nik;
    var address = this.state.address;
    var birth_date = this.state.birth_date;
    var birth_place = this.state.birth_place;
    var gender = this.state.gender;
    var provincie = this.state.provincie;
    var city = this.state.city;
    var sub_district = this.state.sub_district;
    var village = this.state.village;
    var zip_code = this.state.zip_code;
    if (nik == '' || nik == null) {
      console.log('validation ', nik);
      this.RBSheetValidation.open();
    } else if (address == '' || address == null) {
      this.RBSheetValidation.open();
    } else if (birth_date == '' || birth_date == null) {
      this.RBSheetValidation.open();
    } else if (birth_place == '' || birth_place == null) {
      this.RBSheetValidation.open();
    } else if (gender == '' || gender == null) {
      this.RBSheetValidation.open();
    } else if (provincie == '' || provincie == null) {
      this.RBSheetValidation.open();
    } else if (city == '' || city == null) {
      this.RBSheetValidation.open();
    } else if (sub_district == '' || sub_district == null) {
      this.RBSheetValidation.open();
    } else if (village == '' || village == null) {
      this.RBSheetValidation.open();
    } else if (zip_code == '' || zip_code == null) {
      this.RBSheetValidation.open();
    } else {
      this.setState({profile: true});
    }
  }

  async getDetailProduct() {
    let url = '';
    let datagrid = this.state.dataGrid;
    if (datagrid == 'Asuransi Kebakaran') {
      url = 'polis-kebakaran';
    } else if (datagrid == 'Asuransi Kecelakaan') {
      url = 'polis-kecelakaandiri';
    } else if (datagrid == 'Asuransi Travel') {
      url = 'polis-travel';
    } else if (datagrid == 'Asuransi Kendaraan') {
      url = 'polis-kendaraan';
    } else if (datagrid == 'Asuransi Kebakaran Syariah') {
      url = 'polis-kebakaran-shariah';
    } else if (datagrid == 'Asuransi Kecelakaan Syariah') {
      url = 'polis-kecelakaandiri-shariah';
    } else if (datagrid == 'Asuransi Kendaraan Syariah') {
      url = 'polis-kendaraan-shariah';
    }

    console.log('getDataGrid', this.state.dataGrid);
    console.log('getDataGrid URl', url);

    getDataWitHeader(
      Api.base_url2 +
        'users/' +
        this.state.id_user +
        '/tripa/product-detail/' +
        url,
      this.state.token,
    ).then(response => {
      this.setState({detailproduct: response.data.value});
    });
  }

  async getDetailProductHeader() {
    let url = '';
    let datagrid = this.state.dataGrid;
    if (datagrid == 'Asuransi Kebakaran') {
      url = 'polis-kebakaran-header';
    } else if (datagrid == 'Asuransi Kecelakaan') {
      url = 'polis-kecelakaandiri-header';
    } else if (datagrid == 'Asuransi Travel') {
      url = 'polis-travel-header';
    } else if (datagrid == 'Asuransi Kendaraan') {
      url = 'polis-kendaraan-header';
    } else if (datagrid == 'Asuransi Kebakaran Syariah') {
      url = 'polis-kebakaran-header-syariah';
    } else if (datagrid == 'Asuransi Kecelakaan Syariah') {
      url = 'polis-kecelakaandiri-header-syariah';
    } else if (datagrid == 'Asuransi Kendaraan Syariah') {
      url = 'polis-kendaraan-header-syariah';
    }
    getDataWitHeader(
      Api.base_url2 +
        'users/' +
        this.state.id_user +
        '/tripa/product-detail/' +
        url,
      this.state.token,
    ).then(response => {
      this.setState({detailproductheader: response.data.value});
    });
  }
  gotoBack() {
    // this.props.navigation.goBack();
  }
  async getDataGrid() {
    var dataGrid = this.props.navigation.getParam('label');
    var type = this.props.navigation.getParam('type');

    await this.setState({dataGrid: dataGrid, type});
  }
  async gotoChat() {
    await this.profileVAlidation();
    if (this.state.profile == true) {
      let url = '';
      let datagrid = this.state.dataGrid;
      console.log('gotoChat', datagrid);

      if (this.state.type == 'syariah') {
        if (datagrid == 'Asuransi Kebakaran Syariah') {
          url = 'beli polis kebakaran';
        } else if (datagrid == 'Asuransi Kecelakaan Syariah') {
          url = 'beli polis kecelakaan diri';
        } else if (datagrid == 'Asuransi Kendaraan Syariah') {
          url = 'beli polis kendaraan';
        }
        this.props.navigation.navigate('Chat', {pengguna: url + ' syariah'});
      } else {
        if (datagrid == 'Asuransi Kebakaran') {
          url = 'beli polis kebakaran';
        } else if (datagrid == 'Asuransi Kecelakaan') {
          url = 'beli polis kecelakaan diri';
        } else if (datagrid == 'Asuransi Travel') {
          url = 'beli polis travel';
        } else if (datagrid == 'Asuransi Kendaraan') {
          url = 'beli polis kendaraan';
        }
        this.props.navigation.navigate('Chat', {pengguna: url});
      }
    }
  }
  gotoChatSimulasi() {
    let url = '';
    let datagrid = this.state.dataGrid;
    if (this.state.type == 'syariah') {
      if (datagrid == 'Asuransi Kebakaran Syariah') {
        url = 'Simulasi asuransi kebakaran syariah';
      } else if (datagrid == 'Asuransi Kecelakaan Syariah') {
        url = 'Simulasi asuransi kecelakaan diri syariah';
      } else if (datagrid == 'Asuransi Travel Syariah') {
        url = 'Simulasi asuransi travel syariah';
      } else if (datagrid == 'Asuransi Kendaraan Syariah') {
        url = 'Simulasi asuransi kendaraan syariah';
      }
      this.props.navigation.navigate('Chat', {pengguna: url});
    } else {
      if (datagrid == 'Asuransi Kebakaran') {
        url = 'Simulasi asuransi kebakaran';
      } else if (datagrid == 'Asuransi Kecelakaan') {
        url = 'Simulasi asuransi kecelakaan diri';
      } else if (datagrid == 'Asuransi Travel') {
        url = 'Simulasi asuransi travel';
      } else if (datagrid == 'Asuransi Kendaraan') {
        url = 'Simulasi asuransi kendaraan';
      }
      this.props.navigation.navigate('Chat', {pengguna: url});
    }
  }

  gotoProfile() {
    this.RBSheetValidation.close();
    this.props.navigation.navigate('Profile');
  }

  remderBsValidation() {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheetValidation = ref;
        }}
        height={Dimensions.get('window').height / 2 + 100}
        closeOnPressMask={false}
        closeOnPressBack={false}
        duration={250}
        customStyles={{
          container: {
            backgroundColor: 'transparent',
            justifyContent: 'center',
          },
        }}>
        <View style={styles.BSView}>
          <Text style={styles.BSInfoWarning}>Peringatan !!</Text>
          <Text style={styles.BSMessage}>{this.state.message}</Text>
          <TouchableOpacity
            onPress={() => this.gotoProfile()}
            style={styles.BSCloseWarning}>
            <Text style={styles.BSCloseTextWarning}>Ubah profil</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
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
        {this.state.visible && (
          <ActivityIndicator
            color={['#FF8033']}
            style={{
              color: '#FF8033',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            size="large"
          />
        )}

        <Content showsVerticalScrollIndicator={false}>
          <View>
            <View
              style={{
                flex: 1,
                margin: 5,
                borderRadius: 5,
                // shadowColor: '#000',
                // shadowOffset: {width: 0, height: 5},
                // shadowOpacity: 0.5,
                // shadowRadius: 5,
                // elevation: 5,
              }}>
              <HTML
                onParsed={this.hideSpinner}
                imagesMaxWidth={Dimensions.get('window').width - 10}
                // imagesInitialDimensions={width:200,height: 200}
                html={this.state.detailproductheader}
                //   imagesMaxWidth={Dimensions.get('window').width}
              />
            </View>
            {!this.state.visible && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 5,
                }}>
                <TouchableOpacity onPress={() => this.gotoChatSimulasi()}>
                  <View
                    style={{
                      width: 85,
                      height: 35,
                      backgroundColor: '#005CE6',
                      justifyContent: 'center',
                      borderRadius: 50,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      Simulasi
                    </Text>
                  </View>
                </TouchableOpacity>

                <View>
                  <TouchableOpacity onPress={() => this.gotoChat()}>
                    <View
                      style={{
                        width: 85,
                        height: 35,
                        marginStart: 10,
                        marginEnd: 15,
                        backgroundColor: '#FF8033',
                        justifyContent: 'center',
                        borderRadius: 50,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                        }}>
                        Beli
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {!this.state.visible && (
              <View style={{marginLeft: 15, marginRight: 15}}>
                <HTML
                  style
                  html={this.state.detailproduct}
                  //   imagesMaxWidth={Dimensions.get('window').width}
                />
              </View>
            )}
            {this.remderBsValidation()}
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  BSView: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignContent: 'center',
    marginHorizontal: 10,
    marginBottom: Dimensions.get('window').height / 2 - 100,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  BSInfo: {
    fontWeight: 'bold',
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 20,
    marginBottom: 6,
    color: '#0a61c3',
  },
  BSInfoWarning: {
    fontWeight: 'bold',
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 20,
    marginBottom: 16,
    color: '#FFCC00',
  },
  BSMessage: {
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 18,
    marginBottom: 22,
  },
  BSClose: {
    fontFamily: 'HKGrotesk-Regular',
    width: 100,
    borderWidth: 2,
    alignSelf: 'flex-end',
    borderColor: '#0a61c3',
    borderRadius: 12,
    paddingVertical: 10,
  },
  BSCloseWarning: {
    width: 100,
    borderWidth: 2,
    alignSelf: 'flex-end',
    borderColor: '#FFCC00',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 6,
  },
  BSCloseText: {
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#0a61c3',
  },
  BSCloseTextWarning: {
    fontSize: 14,
    fontFamily: 'HKGrotesk-Regular',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  leftComponent: {flexDirection: 'row', alignItems: 'center'},
  textbackAction: {
    marginStart: 10,
    fontSize: 16,
  },
});
export default withNavigation(DetailProduct);
