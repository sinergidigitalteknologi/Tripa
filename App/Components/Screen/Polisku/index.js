import React, {Component} from 'react';
import axios from 'axios';
import 'react-native-gesture-handler';
import {withNavigation} from 'react-navigation';
import {getValue} from './../../../Modules/LocalData';
import {Header, Icon} from 'react-native-elements';
import {postDataWitHeader} from './../../../Services';
import ApiEndPoint from './../../../Modules/Utils/ApiEndPoint';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import {Card, CardItem, Container} from 'native-base';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {TextInput, Button} from 'react-native-paper';
class Polisku extends Component {
  constructor(props) {
    super(props);
    this.data = this.props.navigation.getParam('jenisPolis');
    this.state = {
      id_user: '',
      isLoading: true,
      token: '',
      detailproduct: '',
      detailproductheader: '',
      dataGrid: '',
      visible: true,
      id: '',
      isActive: false,
      isDatePickerVisible: false,
      noPolis: [],
      periodeAwal: '',

      typeAssurance: this.props.navigation.getParam('jenisPolis'),
      dataSource: [],
    };
  }

  async componentDidMount() {
    console.log('response params jenisPolis =>  ', this.data);
    await this.getProfile();
    // await this.getDataGrid();
    console.log('response id user =>  ', this.state.id_user);
    // this.getDetailProduct();
    // this.getDetailProductHeader();
    this.loadDataAll();
    // this.willFocusSubscription = this.props.navigation.addListener(
    //   'willFocus',
    //   () => {
    //     console.log("Nama_saya", udin);

    //     this.getKey();
    //   }
    // )
  }

  loadDataAll = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.getKey();
      },
    );
  };

  getKey = () => {
    getValue('userData').then(response => {
      if (response != null) {
        const id = response.data.id;
        const tok = response.access_token;
        const params = {
          nama_asuransi: this.data,
        };
        const dataRest = postDataWitHeader(
          ApiEndPoint.base_url + '/tripa/' + id + '/get_key_polis',
          params,
          tok,
        );

        dataRest
          .then(res => {
            if (res.success == true) {
              // this.cekPengajuanPolis(res.data, id, tok);
              this.getInfoPolis(res.data, this.state.id_user, this.state.token);
            }
          })
          .catch(err => {
            this.setState({
              isLoading: false,
              dataSource: [],
            });
          });
      }
    });
  };

  cekPengajuanPolis = (dataAll, id, tok) => {
    let dataPengajuan = [];
    let resDataPengajuan = [];
    dataAll.map(data => {
      dataPengajuan.push(parseInt(data.key));
    });
    console.log('dataPengajuan', dataPengajuan);

    const params = {
      key: dataPengajuan,
    };

    const dataRest = postDataWitHeader(
      ApiEndPoint.base_url + '/tripa/' + id + '/cek_status_polis',
      params,
      tok,
    );

    dataRest
      .then(res => {
        if (res.success == true) {
          console.log('Success_Get_cekPengajuanPolis', res.data);
          resDataPengajuan = res.data.filter(function(data) {
            return data.RETURN1 != '';
          });
          console.log('Response_Get_cekPengajuanPolis', resDataPengajuan);
          this.getInfoPolis(resDataPengajuan, id, tok);
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          dataSource: [],
        });
      });
  };

  getInfoPolis = (dataAll, id, tok) => {
    let dataPengajuan = [];
    let nameAss = [];
    dataAll.map((data, index) => {
      dataPengajuan.push(parseInt(data.key));
      nameAss.push(data.nama_asuransi);
    });
    console.log('dataPengajuan', dataPengajuan);

    const params = {
      key: dataPengajuan,
    };

    const dataRest = postDataWitHeader(
      ApiEndPoint.base_url + '/tripa/' + id + '/get_info_polis',
      params,
      tok,
    );

    dataRest
      .then(res => {
        if (res.success == true) {
          console.log('Success_Get_get_info_polis', res.data);

          var dataSource = res.data;

          dataSource.map((data, index) => {
            data.typeAssurance = nameAss[index];
          });
          this.setState({
            isLoading: false,
            dataSource: dataSource,
          });
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          dataSource: [],
        });
      });
  };

  // componentWillUnmount() {
  //   this.willFocusSubscription.remove();
  // }

  listEmptyComponent = () => {
    if (!this.state.isLoading) {
      return (
        <Container style={{alignItems: 'center', paddingTop: -20}}>
          <View style={{paddingTop: '50%'}}>
            <Icon name="hexagon" type="feather" size={50} color="#000" />
            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 18}}>
              Belum ada polis
            </Text>
          </View>
        </Container>
      );
    }
  };

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

  gotoBack() {
    // this.props.navigation.goBack();
  }
  async getDataGrid() {
    var dataGrid = this.props.navigation.getParam('label');
    await this.setState({dataGrid: dataGrid});
  }

  goToChat(message) {
    this.props.navigation.navigate('Chat', {pengguna: message});
  }

  onIsActive(id) {
    console.log('is active', id);
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
  showModalInputNoPolis() {
    this.RBSheet.open();
  }
  handleConfirm = date => {
    var dt = moment(date).format('YYYY/MM/DD');
    console.log('date', dt);

    this.setState({isDatePickerVisible: false});
    this.setState({periodeAwal: dt});
  };
  postData(value) {
    if (this.state.noPolis == '' || this.state.noPolis == null) {
      this.customAlert('Perhatian', 'Harap Masukkan Nomor Polis');
    } else {
      this.setState({isLoading: true});
      var noPolis = [this.state.noPolis];
      this.getInfoPolis(noPolis, this.state.id_user, this.state.token);
      this.RBSheet.close();
      this.setState({noPolis: ''});
    }
  }
  customAlert(t, m) {
    Alert.alert(
      t,
      m,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }
  renderModalInputNoPolis() {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        height={Dimensions.get('window').height / 2 + 100}
        closeOnPressMask={true}
        closeOnPressBack={true}
        duration={250}
        customStyles={{
          container: {
            backgroundColor: 'transparent',
            justifyContent: 'center',
            marginTop: 20,
          },
        }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 30,
            justifyContent: 'center',
            alignContent: 'center',
            marginHorizontal: 10,
            marginBottom: Dimensions.get('window').height / 2 - 100,
            borderRadius: 6,
            backgroundColor: 'white',
            backgroundColor: 'white',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
            Masukkan Nomor Polis
          </Text>
          <TextInput
            style={{
              paddingHorizontal: 0,
              marginTop: 20,
              height: 30,
              backgroundColor: '#fff',
            }}
            placeholder="No. Polis"
            keyboardType="numeric"
            value={this.state.noPolis}
            onChange={value => this.setState({noPolis: value})}
          />
          {/* <Text style={{marginTop: 20, fontSize: 14}}>Periode Awal Polis</Text>
          <TouchableHighlight
            onPress={() => this.setState({isDatePickerVisible: true})}>
            <View>
              <TextInput
                editable={false}
                style={{
                  paddingHorizontal: 0,
                  marginTop: 10,
                  height: 30,
                  backgroundColor: '#fff',
                }}
                placeholder="Periode Awal Polis"
                value={this.state.periodeAwal}
              />
            </View>
          </TouchableHighlight> */}

          <View
            style={{
              alignContent: 'flex-end',
              alignItems: 'flex-end',
              flexDirection: 'row',
              marginTop: 30,
            }}>
            <TouchableOpacity
              // activeOpacity={0.1}
              // underlayColor="#00000"
              onPress={() => this.RBSheet.close()}
              style={{
                flex: 3,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  textAlign: 'right',
                  marginTop: 20,
                  fontSize: 14,
                  color: '#005CE6',
                }}>
                BATAL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              // activeOpacity={0.1}
              // underlayColor="#00000"
              style={{
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}
              onPress={() => this.postData()}>
              <Text
                style={{
                  textAlign: 'right',
                  marginTop: 20,
                  fontSize: 14,
                  color: '#005CE6',
                }}>
                TAMBAH
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  }

  renderData = ({item, index}) => {
    var isActive = false;
    if (index == this.state.id) {
      isActive = this.state.isActive != false ? true : false;
    }
    return (
      <View style={{marginVertical: 3, marginHorizontal: 10}}>
        <Card>
          <CardItem>
            <View style={{width: '100%'}}>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Icon name="hexagon" type="feather" color="#005CE6" />
                    <Text style={{marginLeft: 5, fontWeight: 'bold'}}>
                      Asuransi {item.typeAssurance}
                    </Text>
                  </View>
                  <View style={{alignContent: 'flex-end'}}>
                    <Text>{item.tglJatuhTempo}</Text>
                  </View>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={{color: 'red', fontSize: 12, marginTop: -7}}>
                    Masa Berlaku Polis
                  </Text>
                </View>
                <View
                  style={{height: 2, backgroundColor: '#005CE6', marginTop: 10}}
                />
              </View>
              <View style={{marginHorizontal: 5, marginTop: 10}}>
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <Text style={{width: '47%'}}>Status</Text>
                  <Text style={{width: '5%'}}>:</Text>
                  <Text style={{width: '49%'}}>{item.STATUSRETURN}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <Text style={{width: '47%'}}>Ano</Text>
                  <Text style={{width: '5%'}}>:</Text>
                  <Text style={{width: '49%'}}>{item.ANO}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <Text style={{width: '47%'}}>Nomor Polis</Text>
                  <Text style={{width: '5%'}}>:</Text>
                  <Text style={{width: '49%'}}>{item.NOPOLIS}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <Text style={{width: '47%'}}>Pertanggungan Jenis</Text>
                  <Text style={{width: '5%'}}>:</Text>
                  <Text style={{width: '49%'}}>{item.PERTANGGUNGANJENIS}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <Text style={{width: '47%'}}>Pertanggungan Nama</Text>
                  <Text style={{width: '5%'}}>:</Text>
                  <Text style={{width: '49%'}}>{item.PERTANGGUNGANNAMA}</Text>
                </View>
                {isActive == true ? (
                  <View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Nama Tertanggung</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.NAMATERTANGGUNG}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Tanggal Polis</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.TGL_POLIS}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Periode Awal</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.PERIODEAWAL}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Periode Akhir</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.PERIODEAKHIR}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Voucher</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.VOUCHER}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Currency</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.CURRENCY}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Tsi</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.TSI}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Premium</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.PREMIUM}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Policyfee</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.POLICYFEE}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Stampduty</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.STAMPDUTY}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Discount</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.DISCOUNT}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Amount Total</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.AMOUNT_TOTAL}</Text>
                    </View>
                  </View>
                ) : null}
              </View>
              <View style={{marginTop: 18}}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => this.onIsActive(index)}
                    style={{flexDirection: 'row'}}>
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
                    <View style={{width: '50%', alignItems: 'flex-end'}}>
                      <Icon
                        name={isActive == false ? 'chevron-down' : 'chevron-up'}
                        type="feather"
                        color="#005CE6"
                      />
                    </View>
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
          </CardItem>
        </Card>
      </View>
    );
  };

  render() {
    return (
      <Container>
        <Header
          centerContainerStyle={{flex: 1}}
          leftComponent={{
            text: '< Kembali',
            style: {color: '#FF8033'},
            color: '#005CE6',
            onPress: () => this.props.navigation.goBack(),
          }}
          centerComponent={
            <View style={{marginHorizontal: 10}}>
              <Text
                style={{
                  color: '#005CE6',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Polisku
              </Text>
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
        {/* {this.state.visible && (
          <ActivityIndicator
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            size="large"
          />
        )} */}

        {this.state.isLoading ? (
          <ActivityIndicator
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            color="#FF8033"
            size="large"
          />
        ) : (
          <View style={{flex: 1, marginTop: 20}}>
            <FlatList
              data={this.state.dataSource}
              renderItem={this.renderData}
              // refreshing={this.state.isFetching}
              // onRefresh={this.refreshData}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={this.listEmptyComponent}
              keyExtractor={(item, index) => item.key}
            />
          </View>
        )}

        {this.renderModalInputNoPolis()}
        <DateTimePickerModal
          isVisible={this.state.isDatePickerVisible}
          mode="date"
          onConfirm={date => this.handleConfirm(date)}
          onCancel={this.hideDatePicker}
        />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  textImageThumbnail: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 25,
    right: 30,
  },
  textLihatPolis: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    backgroundColor: '#005CE6',
    borderRadius: 10,
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 0.8},
    shadowOpacity: 0.5,
    elevation: 2,
  },
  textTambahPolis: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FF8033',
    borderRadius: 10,
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 0.8},
    shadowOpacity: 0.5,
    elevation: 2,
  },
  shade: {
    // // position: 'absolute',
    // bottom: 0,
    // right: 0,
    // left: 0,
    // borderBottomLeftRadius: 11,
    // borderBottomRightRadius: 11,
  },
  imageThumbnail: {
    height: 200,
    width: Dimensions.get('window').width - 20,
    marginTop: 15,
    marginBottom: 0,
    marginStart: 10,
    marginEnd: 10,

    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 5},
    // shadowOpacity: 0.5,
    // shadowRadius: 5,
    // elevation: 5,
  },

  cardStyle: {
    borderRadius: 11,
    // height: 200,
    // width: 280,
    marginBottom: 10,
  },
});

export default withNavigation(Polisku);
