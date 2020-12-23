import React, {Component} from 'react';
import axios from 'axios';
import 'react-native-gesture-handler';
import {withNavigation} from 'react-navigation';
import {getValue} from './../../../Modules/LocalData';
import {Header, Icon} from 'react-native-elements';
import {postDataWitHeader, getDataWithHeader} from './../../../Services';
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
class TambahPolis extends Component {
  constructor(props) {
    super(props);
    this.data = this.props.navigation.getParam('jenisPolis');
    this.state = {
      id_user: '',
      isLoading: false,
      token: '',
      detailproduct: '',
      detailproductheader: '',
      dataGrid: '',
      visible: true,
      id: '',
      isActive: false,
      isDatePickerVisible: false,
      noPolis: '',
      periodeAwal: '',
      isCardSelected: '',
      message: '',
      total: '',

      typeAssurance: this.props.navigation.getParam('jenisPolis'),
      dataSource: [],
    };
  }

  async componentDidMount() {
    await this.getProfile();
    this.getPolisFromServer();
    console.log('response id user =>  ', this.state.id_user);
  }

  onChangeValueNoPolis(value) {
    this.setState({noPolis: value});
  }

  async getPolisFromServer() {
    this.setState({isLoading: true, dataSource: ''});
    getDataWithHeader(
      ApiEndPoint.base_url +
        '/tripa/' +
        this.state.id_user +
        '/get_transaction_all',
      this.state.token,
    )
      .then(response => {
        if (response.success == true) {
          this.setState({
            isLoading: false,
            dataSource: response.data,
            total: response.data.length,
          });
        }
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
      });
  }

  getPolis() {
    console.log('getPolis =>  ', this.state.noPolis);

    const params = {
      no_polis: this.state.noPolis,
      tgl_polis: this.state.periodeAwal,
    };

    const dataRest = postDataWitHeader(
      ApiEndPoint.base_url +
        '/tripa/' +
        this.state.id_user +
        '/get_info_polis_luar',
      params,
      this.state.token,
    );
    dataRest
      .then(res => {
        if (res.success == true) {
          console.log('Success_Get_get_info_polis', res.data);

          var dataSource = res.data;
          this.getPolisFromServer();
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          dataSource: [],
          errorHit: true,
          message: 'No Polis Tidak Tersedia',
        });
        this.RBSheet.open();
      });
  }

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

  onIsActive(id) {
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
    this.RBSheetInputPolis.open();
  }
  handleConfirm = date => {
    var dt = moment(date).format('YYYY-MM-DD');
    console.log('date', dt);

    this.setState({isDatePickerVisible: false});
    this.setState({periodeAwal: dt});
  };
  postData(value) {
    if (this.state.noPolis == '' || this.state.noPolis == null) {
      this.customAlert('Perhatian', 'Harap Masukkan Nomor Polis');
    } else {
      this.setState({isLoading: true});
      var noPolis = this.state.noPolis;
      var polisDate = this.state.periodeAwal;
      this.getPolis();
      // this.getInfoPolis(noPolis, this.state.id_user, this.state.token);
      this.RBSheetInputPolis.close();
    }
  }

  onSelectedDelete(id) {
    console.log('onselectedDelete', id);
    this.setState({
      isCardSelected: id,
    });
    this.RBSheetModal.open();
  }

  async deleteData(id) {
    const params = {id_polis: id};
    postDataWitHeader(
      ApiEndPoint.base_url + '/tripa/' + this.state.id_user + '/delete_polis',
      params,
      this.state.token,
    )
      .then(response => {
        if (response.success == true) {
          this.RBSheetModal.close();
          this.setState({
            isCardSelected: '',
            message: 'Berhasil menghapus riwayat transaksi',
            errorHit: false,
          });
          this.RBSheet.open();
        }
      })
      .catch(error => {
        console.log('error deleteData', error);
        this.RBSheetModal.close();
        this.setState({
          isCardSelected: '',
          message: 'Maaf gagal menghapus riwayat transaksi, coba lagi',
          errorHit: true,
        });
        this.RBSheet.open();
      });
    await this.getProfile();
    this.getPolisFromServer();
  }

  closeModal() {
    this.RBSheetModal.close();
    this.setState({
      isCardActive: false,
      isCardSelected: '',
    });
  }

  renderModal() {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheetModal = ref;
        }}
        height={Dimensions.get('window').height / 2 + 100}
        closeOnPressMask={false}
        duration={250}
        customStyles={{
          container: {
            justifyContent: 'center',
            backgroundColor: 'transparent',
          },
        }}>
        <View style={styles.BSView}>
          <Text style={styles.BSInfo}>Peringatan !!</Text>
          <Text style={styles.BSMessage}>
            Apakah anda yakin ingin menghapus data ini?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => this.closeModal()}
              style={styles.BSClose}>
              <Text style={styles.BSCloseText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.deleteData(this.state.isCardSelected)}
              style={styles.BSOke}>
              <Text style={styles.BSCLanjutText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
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
          this.RBSheetInputPolis = ref;
        }}
        height={Dimensions.get('window').height / 2 + 140}
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
            marginBottom: Dimensions.get('window').height / 2 - 140,
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
            onChangeText={value => this.onChangeValueNoPolis(value)}
          />
          <Text style={{marginTop: 20, fontSize: 14}}>Periode Awal Polis</Text>
          <TouchableOpacity
            activeOpacity={0.1}
            underlayColor="#00000"
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
          </TouchableOpacity>

          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <TouchableOpacity
              activeOpacity={0.1}
              underlayColor="#00000"
              onPress={() => this.RBSheetInputPolis.close()}
              style={{
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                marginRight: 20,
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
              activeOpacity={0.1}
              underlayColor="#00000"
              style={{
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
                  <View style={{flexDirection: 'row', flex: 2}}>
                    <Icon name="hexagon" type="feather" color="#005CE6" />
                    <Text style={{marginLeft: 5, fontWeight: 'bold'}}>
                      {item.PERTANGGUNGANNAMA}
                    </Text>
                  </View>
                  <View
                    style={{flex: 1, alignContent: 'flex-end', marginTop: 5}}>
                    <Text style={{textAlign: 'right'}}>
                      {item.periode_akhir}
                    </Text>
                  </View>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={{fontSize: 14, marginTop: -2}}>
                    {item.PERIODEAKHIR}
                  </Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={{color: 'red', fontSize: 12, marginTop: -2}}>
                    Masa berlaku polis
                  </Text>
                </View>
                <View
                  style={{height: 2, backgroundColor: '#005CE6', marginTop: 10}}
                />
              </View>
              <View style={{marginHorizontal: 5, marginTop: 10}}>
                {/* <View style={{flexDirection: 'row', marginTop: 8}}>
                  <Text style={{width: '47%'}}>Status</Text>
                  <Text style={{width: '5%'}}>:</Text>
                  <Text style={{width: '49%'}}>{item.STATUSRETURN}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <Text style={{width: '47%'}}>Ano</Text>
                  <Text style={{width: '5%'}}>:</Text>
                  <Text style={{width: '49%'}}>{item.ANO}</Text>
                </View> */}
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <Text style={{width: '47%'}}>Nomor Polis</Text>
                  <Text style={{width: '5%'}}>:</Text>
                  <Text style={{width: '49%'}}>{item.NOPOLIS}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <Text style={{width: '47%'}}>Jenis Pertanggungan</Text>
                  <Text style={{width: '5%'}}>:</Text>
                  <Text style={{width: '49%'}}>{item.PERTANGGUNGANJENIS}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <Text style={{width: '47%'}}>Nama Produk</Text>
                  <Text style={{width: '5%'}}>:</Text>
                  <Text style={{width: '49%'}}>{item.PERTANGGUNGANNAMA}</Text>
                </View>
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
                {isActive == true ? (
                  <View>
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
                      <Text style={{width: '47%'}}>Mata Uang</Text>
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
                      <Text style={{width: '47%'}}>Biaya Polis</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.POLICYFEE}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Materai</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.STAMPDUTY}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Diskon</Text>
                      <Text style={{width: '5%'}}>:</Text>
                      <Text style={{width: '49%'}}>{item.DISCOUNT}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Text style={{width: '47%'}}>Total Jumlah</Text>
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
                    <View>
                      <Icon
                        name={isActive == false ? 'chevron-down' : 'chevron-up'}
                        type="feather"
                        color="#005CE6"
                      />
                    </View>
                  </TouchableOpacity>

                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => this.onSelectedDelete(item.IDPOLIS)}>
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
          </CardItem>
        </Card>
      </View>
    );
  };

  renderBS = () => {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
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
        {this.state.errorHit != false ? (
          <View style={styles.BSView}>
            <Text style={styles.BSInfoWarning}>Peringatan !!</Text>
            <Text style={styles.BSMessage}>{this.state.message}</Text>
            <TouchableOpacity
              onPress={() => this.RBSheet.close()}
              style={styles.BSCloseWarning}>
              <Text style={styles.BSCloseTextWarning}>Tutup</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.BSView}>
            <Text style={styles.BSInfo}>Berhasil</Text>
            <Text style={styles.BSMessage}>{this.state.message}</Text>
            <TouchableOpacity
              onPress={() => this.RBSheet.close()}
              style={styles.BSClose}>
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
          centerComponent={
            <View
              style={{
                marginHorizontal: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#005CE6',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Polisku
              </Text>
              <Text style={{marginTop: 5, color: '#005CE6'}}>
                {this.state.total}
              </Text>
            </View>
          }
          rightComponent={
            <View
              style={{
                paddingRight: 2,
                alignContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity>
                <Icon
                  name="plus-circle"
                  type="feather"
                  color="#005CE6"
                  onPress={() => this.showModalInputNoPolis()}
                />
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
              showsVerticalScrollIndicator={true}
              ListEmptyComponent={this.listEmptyComponent}
              keyExtractor={(item, index) => item.key}
            />
          </View>
        )}

        {this.renderModalInputNoPolis()}
        {this.renderModal()}
        {this.renderBS()}

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
  shade: {},
  imageThumbnail: {
    height: 200,
    width: Dimensions.get('window').width - 20,
    marginTop: 15,
    marginBottom: 0,
    marginStart: 10,
    marginEnd: 10,
  },

  cardStyle: {
    borderRadius: 11,
    marginBottom: 10,
  },
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
    color: '#FF8033',
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
    borderColor: '#FF8033',
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
    marginHorizontal: 5,
  },
  BSCloseText: {
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    borderColor: '#FF8033',
    color: '#FF8033',
  },
  BSCloseTextWarning: {
    fontSize: 14,
    fontFamily: 'HKGrotesk-Regular',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  BSOke: {
    width: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 12,
    marginLeft: 10,
    paddingVertical: 10,
  },
  BSCLanjutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
  },
  leftComponent: {flexDirection: 'row', alignItems: 'center'},
  textbackAction: {
    marginStart: 10,
    fontSize: 14,
  },
});

export default withNavigation(TambahPolis);
