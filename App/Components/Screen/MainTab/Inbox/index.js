import React, {Component} from 'react';
import SwipeView from 'react-native-swipeview';
import {SwipeableFlatList} from 'react-native-swipeable-flat-list';
import RBSheet from 'react-native-raw-bottom-sheet';
import {postDataWitHeader, getDataWitHeader} from './../../../../Services';
import ApiEndPoint from './../../../../Modules/Utils/ApiEndPoint';
import CustomBs from './../../../../Utils/CustomBs';

import {
  View,
  Text,
  Platform,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import {Container, Content} from 'native-base';
import {Header, Icon} from 'react-native-elements';
import {saveData, removeValue, getValue} from '../../../../Modules/LocalData';
import moment from 'moment';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: '',
      id_user: '',
      token: '',
      isLoading: false,
      historyTransaksi: [],
    };
  }

  async componentDidMount() {
    // removeValue('dataNotif');
    await this.getProfile();
    this.getNotifFromServer();

    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      () => {
        this.getNotifFromServer();
      },
    );
  }

  componentWillUnmount() {
    console.log('componentWillUnmount invox');
    this.didFocusSubscription.remove();
  }

  getNotifLocal() {
    getValue('dataNotif').then(response => {
      if (response != null) {
        if (response.length != this.state.historyTransaksi.length) {
          this.setState({
            isLoading: true,
          });
          setTimeout(() => {
            this.setState({
              historyTransaksi: response,
              isLoading: false,
            });
          }, 2000);
        }
      }
      // console.log("dataNotifLenght", response);
    });
  }

  getNotifFromServer() {
    this.setState({isLoading: true, historyTransaksi: ''});
    getDataWitHeader(
      ApiEndPoint.base_url +
        '/tripa/' +
        this.state.id_user +
        '/get_notification',
      this.state.token,
    )
      .then(response => {
        if (response.success == true) {
          this.setState({
            historyTransaksi: response.data,
            isLoading: false,
          });
        } else {
          this.setState({
            isLoading: false,
          });
        }
      })
      .catch(error => {
        this.setState({isLoading: false});
      });
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

  detailHistoryTransaksi = () => {
    this.props.navigation.navigate('DetailNotification');
  };

  gotoDetailNotif = data => {
    this.props.navigation.navigate('DetailNotification', {message: data});
  };

  async deleteNotifFromServer(id) {
    const params = {id_notif: id};

    postDataWitHeader(
      ApiEndPoint.base_url +
        '/tripa/' +
        this.state.id_user +
        '/delete_notification',
      params,
      this.state.token,
    )
      .then(response => {
        if (response.success == true) {
          this.getNotifFromServer();
          this.RBSheetModal.close();
          setTimeout(() => {
            this.customBs.showBsSuccess('Berhasil menghapus notifikasi');
          }, 1000);
        }
      })
      .catch(error => {
        this.RBSheetModal.close();
      });
  }

  // async deleteNotif(index) {
  //   await removeValue('dataNotif');
  //   var dataHistory = this.state.historyTransaksi;
  //   var width = dataHistory.length - 1;
  //   var dataNew = [];
  //   dataHistory.map((data, i) => {
  //     if (i != index) {
  //       console.log('data', data);
  //       dataNew.push(data);
  //     }
  //     if (width == i) {
  //       saveData('dataNotif', dataNew);
  //       getValue('dataNotif').then(response => {
  //         if (response != null) {
  //           if (response.length != this.state.historyTransaksi.length) {
  //             this.setState({
  //               isLoading: true,
  //             });
  //             setTimeout(() => {
  //               this.setState({
  //                 historyTransaksi: response,
  //                 isLoading: false,
  //               });
  //             }, 2000);
  //           }
  //         }
  //       });
  //     }
  //   });

  //   console.log('dataa ', dataNew);

  //   this.RBSheetModal.close();
  // }

  showModal(i) {
    this.setState({index: i});
    this.RBSheetModal.open();
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
            Apakah anda yakin ingin menghapus notifikasi?
          </Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => this.RBSheetModal.close()}
              style={styles.BSClose}>
              <Text style={styles.BSCloseText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.deleteNotifFromServer(this.state.index)}
              style={styles.BSOke}>
              <Text style={styles.BSCLanjutText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  }

  renderItem = ({item, index}) => {
    return (
      // <View style={{flex: 1}}>
      // <SwipeView
      //   renderVisibleContent={() => {
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          margin: 8,
          padding: 10,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#0a61c3',
        }}>
        <View
          style={{
            justifyContent: 'center',
            marginHorizontal: 8,
            flex: 1,
          }}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => this.gotoDetailNotif(item.message_body)}>
            <View style={{justifyContent: 'center'}}>
              <Icon
                name="message-square"
                type="feather"
                color="#0a61c3"
                size={30}
              />
            </View>
            <View
              style={{flexDirection: 'column', marginLeft: 6, marginRight: 10}}>
              <Text
                style={{
                  fontFamily: 'HKGrotesk-Regular',
                  fontSize: 14,
                  fontWeight: 'bold',
                  marginBottom: 4,
                }}>
                {item.title}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 12,
                  fontFamily: 'HKGrotesk-Regular',
                  paddingRight: 10,
                }}>
                {item.body}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 12,
                  fontFamily: 'HKGrotesk-Regular',
                  paddingRight: 10,
                  marginTop: 10,
                  color: '#0a61c3',
                }}>
                {moment(item.created_at).format('DD-MM-YYYY H:mm')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginStart: 10,
          }}>
          <Icon
            onPress={() => this.showModal(item.id)}
            name="trash"
            type="font-awesome"
            color="red"
            size={20}
          />
        </View>
      </View>
    );
  };

  listEmptyComponent = () => {
    if (!this.state.isLoading) {
      return (
        <Container style={{alignItems: 'center', paddingTop: -20}}>
          <View style={{paddingTop: '50%'}}>
            <Icon name="bell-off" type="feather" size={50} color="#000" />
            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 18}}>
              Belum ada Notifikasi
            </Text>
          </View>
        </Container>
      );
    }
  };

  render() {
    return (
      <Container>
        <Header
          centerComponent={{
            text: 'Notifikasi',
            style: {
              color: '#005CE6',
              fontSize: 16,
              fontWeight: 'bold',
            },
          }}
          containerStyle={{
            backgroundColor: 'white',
            height: Platform.OS == 'ios' ? 64 : 56,
            paddingTop: 0,
            borderBottomColor: 'transparent',
            elevation: 7,
          }}
        />
        <CustomBs onCustomBS={ref => (this.customBs = ref)} />
        {this.state.isLoading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator color="#FF8033" size="large" />
          </View>
        ) : (
          <Content
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                colors={['#FF8033']}
                refreshing={this.state.isLoading}
                onRefresh={() => this.getNotifFromServer()}
              />
            }>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.historyTransaksi}
              renderItem={this.renderItem}
              ListEmptyComponent={this.listEmptyComponent}
              keyExtractor={(item, index) => index}
            />
          </Content>
        )}

        {this.renderModal()}
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
    flexDirection: 'row',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
  },
  itemGrid: {
    width: deviceWidth / 2 - 10,
    padding: 5,
  },
  itemContent: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  itemContentGrid: {
    padding: 5,
  },
  sticky: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    alignItems: 'center',
    width: deviceWidth,
  },
  labelText: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  valueText: {
    color: 'gray',
  },
  successText: {
    fontSize: 13,
    color: '#1abc9c',
  },
  BSView: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginHorizontal: 10,
    marginBottom: Dimensions.get('window').height / 2 - 100,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  BSViewKonfirmPassword: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginHorizontal: 5,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: 'white',
  },
  BSInfo: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 15,
    marginTop: 10,
    color: '#FF8033',
  },
  BSMessage: {
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 18,
    marginBottom: 22,
    textAlign: 'center',
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
  BSClose: {
    fontFamily: 'HKGrotesk-Regular',
    width: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF8033',
    borderRadius: 12,
    paddingVertical: 10,
  },
  BSCloseText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8033',
  },
  BSCLanjutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default Inbox;
