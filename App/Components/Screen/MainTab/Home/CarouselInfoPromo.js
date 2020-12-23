import React, {Component} from 'react';
import axios from 'axios';
import Base from '../../../../Utils/Api';
import 'react-native-gesture-handler';
import {getDataWitHeader} from './../../../../Services';
import Api from '../../../../Utils/Api';
import {getValue} from './../../../../Modules/LocalData';
import Shimmer from 'react-native-shimmer';

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
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  Button,
  Platform,
  Dimensions,
} from 'react-native';

class CarouselInfoPromo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh_token: '',
      showAlert: false,
      showLogout: false,
      reloadPage: false,
      dataSource: {},
      response: {},
      data2: [],
      data: '',
      id_user: '',
      token: '',
      visibleShimmer: true,
      dataShimmer: [{id: '1'}, {id: '1'}],
    };
  }
  async componentDidMount() {
    this.firstAction();
    this.props.onCarouselPromo(this);
  }

  componentWillUnmount() {
    this.props.onCarouselPromo(undefined);
  }

  async firstAction() {
    await this.setState({visibleShimmer: true});
    await this.getProfile();
    var that = this;
    this.getCarouselBerita();
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
  moveToNews = data => {
    console.log('move news ', data);
    this.props.navigationAction(data);
  };

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
                      height: 200,
                      width: 280,
                      backgroundColor: '#dadfe6',
                      borderRadius: 10,
                      marginEnd: -10,
                      marginStart: 20,
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
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={this.state.data2}
          keyExtractor={(item, index) => index}
          ItemSeparatorComponent={() => <View style={{margin: 5}} />}
          contentContainerStyle={{marginStart: 20, paddingEnd: 40}}
          renderItem={this.renderListBerita}
        />
      </View>
    );
  }
  renderListBerita = ({item}) => {
    return (
      <View
        style={{
          width: 280,
          borderRadius: 11,
          borderColor: '#c7c5c5',
          borderWidth: 0.7,
          shadowColor: '#000',
          shadowOpacity: Platform.OS == 'ios' ? 0 : 0.6,
          elevation: 1.2,
          shadowRadius: 1,
        }}>
        <TouchableOpacity
          onPress={() => this.moveToNews(item.defaultAction.uri)}>
          <Image
            style={styles.imageThumbnail}
            source={{uri: item.thumbnailImageUrl}}
          />
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'HKGrotesk-Regular',
              marginTop: 5,
              color: 'black',
              marginHorizontal: 20,
            }}>
            {item.title.split('<br>')}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontFamily: 'HKGrotesk-Regular',
              marginTop: 10,
              marginStart: 20,
              marginEnd: 20,
              color: '#FF8033',
              marginBottom: 10,
            }}>
            Selanjutnya {'>'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  getCarouselBerita() {
    getDataWitHeader(
      Api.base_url2 + 'users/' + this.state.id_user + '/home/news',
      this.state.token,
    )
      .then(res => {
        if (res.success != false) {
          this.setState({data2: res.data.columns, visibleShimmer: false});
        } else {
        }
      })
      .catch(err => {
        console.log(err.response);
      });
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    marginBottom: 10,
  },
  imageThumbnail: {
    height: 130,
    width: 280,
    marginBottom: 10,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    // resizeMode: 'stretch',
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
export default CarouselInfoPromo;
