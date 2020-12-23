import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  withNavigation,
  NavigationActions,
  StackActions,
} from 'react-navigation';

import {getDataWitHeader} from './../../../../Services';
import Api from '../../../../Utils/Api';
import Shimmer from 'react-native-shimmer';
import {getValue, removeValue} from './../../../../Modules/LocalData';

import {
  Container,
  Header,
  Content,
  Item,
  Card,
  CardItem,
  Body,
  Input,
  Icon,
} from 'native-base';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'Login'})],
});
class GridMenuHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh_token: '',
      showAlert: false,
      showLogout: false,
      reloadPage: false,
      dataSource: {},
      response: {},
      page: 0,
      coloum: 3,
      content: [],
      data: [],
      id_user: '',
      token: '',
      visibleShimmer: true,
      dataShimmer: [
        {id: '1'},
        {id: '1'},
        {id: '1'},
        {id: '1'},
        {id: '1'},
        {id: '1'},
      ],
    };
  }
  async componentDidMount() {
    this.props.onGridMenu(this);
    setTimeout(() => {
      this.firstAction();
    }, 3000);
  }
  componentWillUnmount() {
    this.props.onGridMenu(undefined);
  }
  async firstAction() {
    await this.setState({visibleShimmer: true});
    var that = this;
    await this.getProfile();
    await this.getGridmenu();

    let contensize = this.state.content.length;
    let items = Array.apply(null, Array(contensize)).map((v, i) => {
      return {
        id: i,
        src: this.state.content[i].imageUrl,
        text: this.state.content[i].label,
      };
    });
    that.setState({
      dataSource: items,
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

  getGridmenu = async () => {
    await getDataWitHeader(
      Api.base_url2 + 'users/' + this.state.id_user + '/home/features',
      this.state.token,
    )
      .then(res => {
        this.response = res.data;
        if (res.success != false) {
          this.setState({
            coloum: this.response[0].columntotal,
            content: this.response[0].content,
          });

          this.setState({visibleShimmer: false});
        } else {
          console.log('satus 401');
          // this.props.navigation.navigate('Login');
        }
      })
      .catch(err => {
        console.log('ini error hit Api = ', err.response.status);
        if (err.response.status == 401 || err.response.status == 404) {
          removeValue('userData');
          removeValue('hasLogin');
          removeValue('fcm');
          this.props.navigation.dispatch(resetAction);
        }
      });
  };
  gotoChat(message) {
    this.props.navigation.navigate('Chat', {pengguna: message});
  }
  gotoDetailsProduct(message) {
    let polis = false;
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
    console.log('Data gotoDetailsProduct ', polis + ' ' + message);

    if (polis == true) {
      this.props.navigation.navigate('OptionProduct', {label: message});
    } else if (polis == 'Polisku') {
      this.props.navigation.navigate('TambahPolis');
    } else if (polis == 'Layanan') {
      this.props.navigation.navigate('Layanan');
    }
  }
  render() {
    return (
      <View style={styles.MainContainer}>
        {this.state.visibleShimmer && (
          <Shimmer opacity={0.8}>
            <FlatList
              data={this.state.dataShimmer}
              renderItem={({item}) => (
                <TouchableOpacity style={styles.viewGrid}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 60,
                      width: 60,
                      backgroundColor: '#dadfe6',
                      borderRadius: 50,
                    }}
                  />
                  <View
                    style={{
                      width: 50,
                      height: 18,
                      backgroundColor: '#dadfe6',
                      marginTop: 8,
                    }}
                  />
                </TouchableOpacity>
              )}
              //Setting the number of column
              numColumns={3}
              keyExtractor={(item, index) => index.toString()}
            />
          </Shimmer>
        )}
        {!this.state.visibleShimmer && (
          <FlatList
            data={this.state.dataSource}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.viewGrid}
                onPress={() => this.gotoDetailsProduct(item.text)}>
                {/* <View style={styles.viewGrid}> */}
                <Image style={styles.imageThumbnail} source={{uri: item.src}} />
                <Text style={styles.textGrid}>{item.text}</Text>
                {/* </View> */}
              </TouchableOpacity>
            )}
            //Setting the number of column
            numColumns={this.state.coloum}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: 140,
    marginStart: 20,
    marginEnd: 20,
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    width: 90,
    resizeMode: 'stretch',
  },
  textGrid: {
    textAlign: 'center',
    fontSize: 13,
    color: '#005CE6',
    marginTop: -10,
    fontFamily: 'HKGrotesk-Regular',
    fontWeight: 'bold',
  },
  viewGrid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 30,
  },
});

export default withNavigation(GridMenuHome);
