import React, {Component} from 'react';
import axios from 'axios';
import Api from '../../../../Utils/Api';
import 'react-native-gesture-handler';
import {withNavigation} from 'react-navigation';
import HTML from 'react-native-render-html';
import {getDataWitHeader} from './../../../../Services';
import {getValue} from './../../../../Modules/LocalData';
import {Header, Icon} from 'react-native-elements';
import {NavigationEvents} from 'react-navigation';
import tripa_call from './../../../../Utils/String/';
import Modal, {
  ModalTitle,
  ModalContent,
  ModalFooter,
  ModalButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-modals';
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
  Linking,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
class Layanan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_user: '',
      token: '',
      detailproduct: '',
      detailproductheader: '',
      dataGrid: '',
      visible: true,
      dataSource: {},
      coloum: 3,
      a: 'icon_tentang_tripa.png',
      modalVisible: false,
    };
  }

  async componentDidMount() {
    this.setState({
      dataSource: [
        {
          id: 0,
          src: require('../../../../assets/image/icon_tentang_tripa.png'),
          text: 'Tentang Tripa',
        },
        {
          id: 1,
          src: require('../../../../assets/image/icon_status_polis.png'),
          text: 'Status Polis',
        },
        {
          id: 0,
          src: require('../../../../assets/image/icon_klaim_polis.png'),
          text: 'Klaim Polis',
        },
        {
          id: 1,
          src: require('../../../../assets/image/icon_status_klaim.png'),
          text: 'Status Klaim',
        },
        {
          id: 0,
          src: require('../../../../assets/image/icon_pencarian_lokasi.png'),
          text: 'Pencarian Lokasi',
        },
        {
          id: 1,
          src: require('../../../../assets/image/icon_hubungi_agent.png'),
          text: 'Hubungi Agent',
        },
      ],
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

  gotoDetail(message) {
    // this.setState({modalVisible: true});
    if (message == 'Hubungi Agent') {
      Linking.openURL(`tel:${tripa_call.tripa_call}`);
    } else {
      this.props.navigation.navigate('Chat', {pengguna: message});
    }
  }
  renderModal() {
    return (
      <Modal
        visible={this.state.modalVisible}
        modalStyle={styles.modalStyle}
        rounded
        actionsBordered
        onTouchOutside={() => {
          this.setState({modalVisible: false});
        }}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        containerStyle={{}}
        overlayBackgroundColor="#000000">
        <View
          style={{
            alignContent: 'center',
            justifyContent: 'center',
            height: 100,
            padding: 10,
            backgroundColor: 'white',
            // borderRadius: 10,
          }}>
          <Text style={{textAlign: 'center', color: ''}}>
            Fitur akan tersedia pada progress minggu depan
          </Text>
        </View>
      </Modal>
    );
  }
  renderGrid() {
    console.log('renderGrid', this.state.dataSource);
    return (
      <View style={styles.MainContainer}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.viewGrid}
              onPress={() => this.gotoDetail(item.text)}>
              {/* <View style={styles.viewGrid}> */}
              <Image
                style={styles.imageThumbnailGrid}
                source={item.src}
                // src={this.state.a}
              />
              <Text style={styles.textGrid}>{item.text}</Text>
              {/* </View> */}
            </TouchableOpacity>
          )}
          //Setting the number of column
          numColumns={this.state.coloum}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
  getPostbackPenggunaan = () => {
    console.log('getPostbackPenggunaan Layanan');
    // Tts.stop();
  };
  render() {
    return (
      <Container>
        <NavigationEvents
          onWillFocus={() => {
            this.getPostbackPenggunaan();
          }}
        />
        <Content>
          <ImageBackground
            resizeMode={'stretch'}
            // imageStyle={{width: 100, height: 300}}
            style={styles.bgcity}
            source={require('../../../../assets/image/home_tripa_tower.png')}
          />
          <View style={styles.header1}>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-start',
                marginLeft: 10,
              }}>
              <Icon
                name="arrow-left"
                type="font-awesome"
                size={25}
                iconStyle={{color: '#fff', margin: 5}}
                containerStyle={{
                  backgroundColor: 'rgba(52, 52, 52, 0.6)',
                  width: 35,
                  height: 35,
                  borderRadius: 50,
                }}
                onPress={() => this.props.navigation.goBack()}
              />
            </View>
            <View style={styles.logoImageContainer}>
              <Image
                style={styles.logotripa}
                source={require('../../../../assets/image/img_logo_tripa.png')}
              />
            </View>
          </View>
          {this.renderGrid()}
          <Image
            style={styles.imageThumbnail}
            source={require('../../../../assets/image/img_promo_01.png')}
          />
          {this.renderModal()}
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  shade: {},
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: 140,
    marginStart: 20,
    marginEnd: 20,
  },
  imageThumbnailGrid: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 65,
    width: 65,
    resizeMode: 'stretch',
    // marginTop: 5,
    // backgroundColor: 'grey',
  },
  textGrid: {
    textAlign: 'center',
    fontSize: 12,
    color: '#005CE6',
    marginTop: 0,
  },
  viewGrid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 30,
  },
  header1: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImageContainer: {
    flex: 1,
    width: 200,
    marginRight: 20,
    alignItems: 'flex-end',
  },
  imageThumbnail: {
    height: 200,
    width: Dimensions.get('window').width - 20,
    marginTop: 20,
    marginBottom: 10,
    marginStart: 10,
    marginEnd: 10,
    resizeMode: 'contain',
  },
  logotripa: {
    width: 90,
    height: 50,
    resizeMode: 'contain',
  },
  bgcity: {
    position: 'absolute',
    width: '100%',
    height: 280,
  },

  cardStyle: {
    borderRadius: 11,
    // height: 200,
    // width: 280,
    marginBottom: 10,
  },
  modalStyle: {
    backgroundColor: 'transparent',
    // backgroundColor: 'green',
    width: Dimensions.get('window').width - 100,
  },
});

export default withNavigation(Layanan);
