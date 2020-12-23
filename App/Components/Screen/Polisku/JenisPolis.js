import React, {Component} from 'react';
import axios from 'axios';
import Api from './../../../Utils/Api';
import 'react-native-gesture-handler';
import {withNavigation} from 'react-navigation';
import HTML from 'react-native-render-html';
import {getDataWitHeader} from './../../../Services';
import {getValue} from './../../../Modules/LocalData';
import {Header, Icon} from 'react-native-elements';

import {
  Container,
  Content,
  Item,
  Card,
  CardItem,
  Body,
  Input,
} from 'native-base';
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  Button,
  Dimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
class JenisPolis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_user: '',
      token: '',
      detailproduct: '',
      detailproductheader: '',
      dataGrid: '',
      visible: true,
    };
  }

  async componentDidMount() {
    await this.getProfile();
    // await this.getDataGrid();
    console.log('response id user =>  ', this.state.id_user);
    // this.getDetailProduct();
    // this.getDetailProductHeader();
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

  gotoBack() {
    // this.props.navigation.goBack();
  }
  async getDataGrid() {
    var dataGrid = this.props.navigation.getParam('label');
    await this.setState({dataGrid: dataGrid});
  }
  gotoChat() {
    // let url = '';
    // let datagrid = this.state.dataGrid;
    // console.log('gotoChat', datagrid);
    // if (datagrid == 'Asuransi Kebakaran') {
    //   url = 'beli polis kebakaran';
    // } else if (datagrid == 'Asuransi Kecelakaan') {
    //   url = 'beli polis kecelakaandiri';
    // } else if (datagrid == 'Asuransi Travel') {
    //   url = 'beli polis travel';
    // } else if (datagrid == 'Asuransi Kendaraan') {
    //   url = 'beli polis kendaraan';
    // }
    // this.props.navigation.navigate('Chat', {pengguna: url});
  }

  goToChat(message) {
    this.props.navigation.navigate('TambahPolis', {pengguna: message});
  }

  goToPolisKu(message) {
    this.props.navigation.navigate('Polisku', {jenisPolis: message});
  }

  render() {
    return (
      <Container>
        <Header
          rightContainerStyle={{flex: 2}}
          centerContainerStyle={{flex: 1}}
          leftComponent={{
            text: '< Kembali',
            style: {color: '#FF8033'},
            color: '#005CE6',
            onPress: () => this.props.navigation.goBack(),
          }}
          rightComponent={
            <View style={{alignContent: 'flex-end', alignItems: 'flex-end'}}>
              <Text
                style={{
                  color: '#005CE6',
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginHorizontal: 10,
                }}>
                Asuransiku!
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

        <View style={{flex: 1}}>
          <View
            style={{
              alignContent: 'flex-end',
              alignItems: 'flex-end',
              flexDirection: 'row',
              marginBottom: 10,
            }}>
            <View
              style={{
                flex: 1,
                alignContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              {/* <TouchableOpacity
                onPress={() => this.goToPolisKu('')}
                style={styles.textLihatPolis}>
                <Text style={{color: '#fff', fontSize: 10}}>Lihat Polis</Text>
              </TouchableOpacity> */}
            </View>
            <View
              style={{
                alignContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => this.goToChat('beli polis kendaraan')}
                style={styles.textTambahPolis}>
                <Text style={{color: '#fff', fontSize: 10}}>Tambah Polis</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView>
            <ImageBackground
              imageStyle={{borderRadius: 11, resizeMode: 'stretch'}}
              style={{
                height: 200,
                width: Dimensions.get('window').width - 20,
                marginBottom: 0,
                marginStart: 10,
                marginEnd: 10,
              }}
              source={require('./../../../assets/image/card_kendaraan.png')}>
              {/* <View style={styles.textImageThumbnail}>
                <TouchableOpacity
                  onPress={() => this.goToPolisKu('kendaraan')}
                  style={styles.textLihatPolis}>
                  <Text style={{color: '#fff', fontSize: 10}}>Lihat Polis</Text>
                </TouchableOpacity>
              </View> */}
            </ImageBackground>

            <ImageBackground
              imageStyle={{borderRadius: 11, resizeMode: 'stretch'}}
              style={styles.imageThumbnail}
              source={require('./../../../assets/image/card_kebakaran.png')}>
              {/* <View style={styles.textImageThumbnail}>
                <TouchableOpacity
                  onPress={() => this.goToPolisKu('kebakaran')}
                  style={styles.textLihatPolis}>
                  <Text style={{color: '#fff', fontSize: 10}}>Lihat Polis</Text>
                </TouchableOpacity>
              </View> */}
            </ImageBackground>

            <ImageBackground
              imageStyle={{borderRadius: 11, resizeMode: 'stretch'}}
              style={styles.imageThumbnail}
              source={require('./../../../assets/image/card_travel.png')}>
              {/* <View style={styles.textImageThumbnail}>
                <TouchableOpacity
                  onPress={() => this.goToPolisKu('travel')}
                  style={styles.textLihatPolis}>
                  <Text style={{color: '#fff', fontSize: 10}}>Lihat Polis</Text>
                </TouchableOpacity>
              </View> */}
            </ImageBackground>

            <ImageBackground
              imageStyle={{borderRadius: 11, resizeMode: 'stretch'}}
              style={styles.imageThumbnail}
              source={require('./../../../assets/image/card_kecelakaan.png')}>
              {/* <View style={styles.textImageThumbnail}>
                <TouchableOpacity
                  onPress={() => this.goToPolisKu('personal_accident')}
                  style={styles.textLihatPolis}>
                  <Text style={{color: '#fff', fontSize: 10}}>Lihat Polis</Text>
                </TouchableOpacity>
              </View> */}
            </ImageBackground>
          </ScrollView>
        </View>
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
    alignItems: 'flex-end',
    marginEnd: 20,
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

export default withNavigation(JenisPolis);
