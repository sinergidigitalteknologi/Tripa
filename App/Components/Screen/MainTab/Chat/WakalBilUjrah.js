import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import HTML from 'react-native-render-html';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import {getValue} from '../../../../Modules/LocalData';
import {getDataWithHeader} from '../../../../Services';
import ApiEndPoint from '../../../../Modules/Utils/ApiEndPoint';
import Api from '../../../../Utils/Api';
import Helper from '../../../../Utils/Helper';
import {moderateScale} from '../../../../Utils/Scale';
import {ListItem, CheckBox, Body} from 'native-base';

import {
  View,
  Text,
  ScrollView,
  FlatList,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  LayoutAnimation,
  Linking,
} from 'react-native';

class WakalBilUjrah extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_wakal_bil_ujrah: '',
      id: '',
      tok: '',
      name: '',
      type: '',
      isDataCorrect: false,
    };
  }
  componentDidMount() {
    this.props.onWakalBilUjrah(this);
  }

  componentWillUnmount() {
    this.props.onWakalBilUjrah(undefined);
  }

  async setModalVisible(data) {
    this.RBSheet.open();
    this.setState({type: data});
    await this.getWakalBilUjrah();
  }

  async getWakalBilUjrah() {
    let url = 'wakal-bil-ujrah';
    getValue('userData').then(response => {
      if (response != null) {
        this.setState({
          id: response.data.id,
          tok: response.access_token,
          name: response.data.name,
        });
        getDataWithHeader(
          ApiEndPoint.base_url +
            '/users/' +
            this.state.id +
            '/tripa/product-detail/' +
            url,
          this.state.tok,
        ).then(response => {
          this.setState({data_wakal_bil_ujrah: response.data.value});
        });
      }
    });
  }

  hideSpinner() {}

  batal() {
    this.props.messageCancel('batal');
    this.RBSheet.close();
    this.setState({isDataCorrect: false});
  }

  nextForm() {
    this.props.sendToChat('lanjut');
    this.RBSheet.close();
    this.setState({isDataCorrect: false});
  }
  dataCorrect() {
    if (this.state.isDataCorrect) this.setState({isDataCorrect: false});
    else this.setState({isDataCorrect: true});
  }

  render() {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        height={(Dimensions.get('window').height * 7) / 8}
        closeOnPressMask={false}
        closeOnPressBack={false}
        duration={250}
        customStyles={{
          container: {
            flex: 6,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignContent: 'center',
          },
        }}>
        <View style={styles.contentbottomSheet}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#01853a',
              height: 40,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginBottom: 10,
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              Wakalah Bil Ujrah
            </Text>
          </View>
          <ScrollView>
            <View style={{margin: 10}}>
              <HTML
                onParsed={this.hideSpinner}
                imagesMaxWidth={Dimensions.get('window').width - 20}
                // imagesInitialDimensions={width:200,height: 200}
                html={this.state.data_wakal_bil_ujrah}
                //   imagesMaxWidth={Dimensions.get('window').width}
              />
            </View>
          </ScrollView>
          <View style={{marginBottom: 10}}>
            <ListItem>
              <CheckBox
                color="#FF8033"
                checked={this.state.isDataCorrect}
                onPress={() => this.dataCorrect()}
              />
              <Body>
                <Text style={{paddingHorizontal: 6, fontWeight: 'bold'}}>
                  Saya sebagai peserta rela ber Tabbaru sesuai akad Wakalah Bil
                  Ujrah tersebut di atas{' '}
                </Text>
              </Body>
            </ListItem>
          </View>

          <View
            style={{
              marginTop: 5,
              flexDirection: 'row',
              marginBottom: 30,
              marginHorizontal: 10,
            }}>
            <TouchableOpacity
              onPress={() => this.batal()}
              style={styles.btnBatal}>
              <Text style={styles.textBtn}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!this.state.isDataCorrect}
              onPress={() => this.nextForm()}
              style={
                this.state.isDataCorrect ? styles.btnLanjut : styles.btnDisable
              }>
              <Text style={styles.textBtn}>Lanjut</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  }
}

const styles = StyleSheet.create({
  titleInput: {
    paddingHorizontal:
      Platform.OS == 'ios' ? moderateScale(5) : moderateScale(16),
    fontSize: 14,
    marginBottom: Platform.OS == 'ios' ? moderateScale(5) : moderateScale(2),
    marginTop: 10,
    fontFamily: 'HKGrotesk-Regular',
    fontWeight: 'bold',
  },
  inputs: {
    color: 'black',
    fontFamily: 'HKGrotesk-Regular',
    fontSize: moderateScale(14),
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingLeft: '5%',
    paddingRight: '5%',
    borderRadius: 9,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    elevation: 5,
  },
  input2: {
    width: '100%',
    color: 'black',
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingLeft: '5%',
    paddingRight: '5%',
    borderRadius: 9,
    backgroundColor: '#fff',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    elevation: 5,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: 'transparent',
    height: (Dimensions.get('window').height * 7) / 8,
  },
  titleBottomSheeet: {
    textAlign: 'center',
    fontWeight: 'bold',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#3d9acc',
    marginStart: 5,
    marginEnd: 5,
  },
  contentbottomSheet: {
    flex: 1,
    backgroundColor: '#ededed',
    marginStart: 5,
    marginEnd: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // alignItems: 'center',
  },
  btnLanjut: {
    width: '45%',
    color: '#fff',
    paddingVertical: '4%',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#01853a',
    marginTop: 10,
    marginLeft: '5%',
  },
  btnDisable: {
    width: '45%',
    color: '#fff',
    paddingVertical: '4%',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#b3f5cf',
    marginTop: 10,
    marginLeft: '5%',
  },
  btnBatal: {
    width: '45%',
    color: '#fff',
    paddingVertical: '4%',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#01853a',
    marginTop: 10,
    marginRight: '5%',
  },
  textBtn: {
    color: 'white',
    fontFamily: 'HKGrotesk-Regular',
  },
  picker: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginStart: 10,
  },
  vpicker: {
    backgroundColor: 'white',
    paddingStart: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    elevation: 5,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0.1, 0.1, 0.1)',
  },
});

export default WakalBilUjrah;
