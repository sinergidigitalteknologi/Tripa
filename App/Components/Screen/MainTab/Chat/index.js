import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import {moderateScale} from '../../../../Utils/Scale';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Icon, Header} from 'react-native-elements';
import moment from 'moment';
import Api from '../../../../Utils/Api';
import ApiEndPoint from './../../../../Modules/Utils/ApiEndPoint';
import {postDataWitHeader, postNoHeader} from './../../../../Services';
import Tts from 'react-native-tts';
import HTML from 'react-native-render-html';
import BsPengajuanPKebakaran from './BsPengajuanPKebakaran';
import BsPengajuanPKebakaran2 from './BsPengajuanPKebakaran2';
import BsPengajuanPTravel from './BsPenhgajuanPTravel';
import BsPengajuanPTravel2 from './BsPengajuanPTravel2';
import BsPengajuanPPA from './BsPengajuanPPA';
import BsPengajuanPPA2 from './BsPengajuanPPA2';
import BsPengajuanPKendaraan from './BsPengajuanPKendaraan';
import BsPengajuanPKendaraan2 from './BsPengajuanPKendaraan2';
import BsDetailTypeProduct from './BsDetailTypeProduct';
import BsKlaimKebakaran from './Klaim/BsKlaimKebakaran';
import BsKlaimPPA from './Klaim/BsKlaimPPA';
import BsKlaimKendaraan from './Klaim/BsKlaimKendaraan';
import BsKlaimTravel from './Klaim/BsKlaimTravel';
import BsSimulasiKebakaran from './Simulasi/BsSimulasiKebakaran';
import BsSimulasiKebakaran2 from './Simulasi/BsSimulasiKebakaran2';
import BsSimulasiKendaraan from './Simulasi/BsSimulasiKendaraan';
import BsSimulasiPPA from './Simulasi/BsSimulasiPPA';
import BsSimulasiTravel from './Simulasi/BsSimulasiTravel';
import BsUploadFoto from './BsUploadFoto';
import BsUploadFotoKendaraan from './BsUploadFotoKendaraan';
import BsUploadFotoTravel from './BsUploadFotoTravel';
import BsUploadFotoPPA from './BsUploadFotoPPA';
import BsUploadFotoKlaim from './Klaim/BsUploadFotoKlaim';
import BsVerifOtpAndEmail from './BsVerifOtpAndEmail';
import BsInputOtp from './BsInputOtp';
import WakalBilUjrah from './WakalBilUjrah';
//Pengajuan iOS Version -> ditambahkan oleh agus 13-06-2020

import {getValue} from './../../../../Modules/LocalData';
import Voice from '@react-native-community/voice';
import {connect} from 'react-redux';
import {addTodo, toggleTodo} from '../../../../redux/actions';
import {
  getTodosByVisibilityFilter,
  getLength,
} from '../../../../redux/getredux';
import Geolocation from '@react-native-community/geolocation';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import AddTodo from './../../../../redux/Addtodo';
import Sound from 'react-native-sound';
import CustomBs from '../../../../Utils/CustomBs';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
  Linking,
  TouchableHighlight,
  BackHandler,
  DeviceEventEmitter,
  Alert,
  Platform,
} from 'react-native';
import {Input, Button} from 'native-base';
const WINDOW_HEIGHT = Dimensions.get('window').height;
const keyboardVerticalOffset = Platform.OS == 'ios' ? 50 : 0; //ini ditambahan oleh agus untuk set padding keyboard ke textinput
let sound = 'first';
let ResponsiveVoice;

class Chat extends Component {
  constructor(props) {
    super(props);
    const {chatVerticalOffset, fixNavBarOffset} = this.props;
    const navigationHeight = fixNavBarOffset ? NAVIGATION_HEIGHT : 0;
    const verticalOffset = (chatVerticalOffset || 0) + navigationHeight;
    let watchID = null;
    this.state = {
      dataMessage: [],
      dataQuickButton: [],
      messageFromMe: '',
      user: '',
      recognized: '',
      started: '',
      latitude: '',
      longitude: '',
      notif: 0,
      checkJailStatus: '',
      modalBsPengajuanKebakaran: false,
      modalBsPengajuanKebakaran2: false,
      chosenDate: new Date(),
      firstChat: '',
      isDatePickerVisible: false,
      id_user: '',
      token: '',
      message: '',
      visibleMic: true,
      currentLongitude: 'unknown', //Initial Longitude
      currentLatitude: 'unknown', //Initial Latitude
      flatListHeight: WINDOW_HEIGHT - verticalOffset, //agus
      initialPosition: '',
      lastPosition: '',
      isLoading: false,
      isChatPage: false,
    };
    Tts.setDefaultLanguage('id-ID');
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
    this.setDate = this.setDate.bind(this);
    this.sendMessageForm = this.sendMessageForm.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.sendMessageHide = this.sendMessageHide.bind(this);
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    // console.log('componentDidMount chat');
  }
  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
    // Tts.stop();

    if (Platform.OS == 'android') {
      //ini ditambahkan oleh agus pada 14-06-2020 karna di ios tidak terbaca untuk stoplistener location services
      LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // agus
    let prevDataMsg = prevState.dataMessage.length - 1;

    if (prevDataMsg !== this.state.dataMessage.length) {
      setTimeout(() => {
        this.refs.scroller.scrollToEnd();
      }, 250);
      // console.log('ini if componentdidupdate');
    } else {
      // console.log('ini else componentdidupdate');
    }
  }

  async getPostbackPenggunaan() {
    this.setState({isChatPage: true});
    await this.getLocation();
  }

  willBlur() {
    this.setState({isChatPage: false});
    if (Platform.OS == 'android') {
      Tts.voices().then(voices => Tts.stop());
    } else {
      this.stopVoiceIos();
    }
    this.props.navigation.setParams({pengguna: null});
  }

  async handleAddTodo(message) {
    await this.props.addTodo(message);
  }

  handleChatAgent(data) {
    console.log('handleChatAgent', data);
  }

  handleBackButtonClick() {
    // console.log('ini on backPress');
    this.goBack();
    // this.props.navigation.goBack(null);
    return true;
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
  //microPhone
  onSpeechRecognized = e => {};
  onSpeechError = e => {};
  onSpeechStart = e => {};
  onSpeechEnd = e => {
    this.setState({
      end: '√',
    });

    this.sendMessage(this.state.messageFromMe);
    if (Platform.OS == 'android') {
      setTimeout(() => {
        this.sendMessage(this.state.messageFromMe);
      }, 2500);
    }
  };
  onSpeechResults = e => {
    //code ini diubah pada 14-06-2020 oleh agus, sendmessage yg awalnya di onspeecresults diubah ke onspeechend agar tidak duplikat kirim di ios
    this.setState({
      results: e.value,
    });
    this.setState({messageFromMe: e.value[0]});
    this.setState({visibleMic: true});
    setTimeout(() => {
      Voice.stop();
    }, 2000);
  };
  onSpeechPartialResults = e => {};
  onSpeechVolumeChanged = e => {};

  onStartButtonPress(e) {
    Voice.start('id_ID');
    this.setState({visibleMic: false});
    if (Platform.OS == 'android') {
      Tts.stop();
    } else {
      this.stopVoiceIos();
    }
  }

  onStopMicroPhone() {
    Voice.stop();
    this.setState({visibleMic: true});
  }

  async sendMessage(newMessage, conditions) {
    console.log('sendMessage', newMessage);

    if (newMessage == '') {
    } else {
      let dataMessage = this.state.dataMessage;
      let data = {
        text: newMessage,
        type: 'messageFromMe',
        time: moment().format('HH:mm'),
      };
      dataMessage.push(data);
      this.setState({dataMessage: dataMessage, messageFromMe: ''});
      this.handleAddTodo(data);
      await this.giveLoading();
      this.refs.scroller.scrollToEnd();
      await this.getDataChat(newMessage);
    }
  }
  async sendMessageHide(newMessage) {
    if (newMessage == '') {
    } else {
      let dataMessage = this.state.dataMessage;
      let data = {
        text: newMessage,
        type: 'messageFromMe',
        time: moment().format('HH:mm'),
      };
      // dataMessage.push(data);
      this.setState({dataMessage: dataMessage, messageFromMe: ''});
      await this.giveLoading();
      this.refs.scroller.scrollToEnd();
      await this.getDataChat(newMessage);
      this.refs.scroller.scrollToEnd();
    }
  }
  async sendFirstChat(newMessage) {
    console.log('sendFirstChat');
    if (newMessage == '') {
    } else {
      let dataMessage = this.state.dataMessage;
      let data = {
        text: newMessage,
        type: 'messageFromMe',
      };
      // dataMessage.push(data);
      this.setState({dataMessage: dataMessage, messageFromMe: ''});
      await this.giveLoading();
      this.getDataChat(newMessage);
      this.refs.scroller.scrollToEnd();
    }
  }

  requestPermissionIos() {
    console.log('requestPermissionIos');
    check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
              // …
            });
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
              // …
              console.log(
                'The permission is denied and not requestable anymore',
                result,
              );
            });
            break;
        }
      })
      .catch(error => {
        // …
      });
    // Geolocation.requestAuthorization();
  }

  async getLocation() {
    this.giveLoading();
    if (this.state.id_user == '' || this.state.token == '') {
      await this.getProfile();
    }
    if (Platform.OS == 'android') {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message:
          '<h2>Aktivkan Lokasi Perangkat</h2>Aplikasi ini membutuhkan lokasi anda:<br/><br/>Menggunakan GPS, Wi-Fi, dan jaringan untuk mengakses lokasi<br/><br/>',
        ok: 'YA',
        cancel: 'TIDAK',
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
        preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
        providerListener: true, // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
      })
        .then(
          function(success) {
            // success => {alreadyEnabled: true, enabled: true, status: "enabled"}
            Geolocation.getCurrentPosition(
              position => {
                let initialPosition = JSON.stringify(position);
                // this.setState({initialPosition});
                this.setState({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
                // send firts chat
                this.props.toggleTodo(this.props.todosLength);
                var newMessage = this.props.navigation.getParam('pengguna');
                if (newMessage != undefined || newMessage != null) {
                  this.sendMessage(newMessage);
                } else {
                  this.sendFirstChat('hai');
                }
              },
              error => console.log('error geo'.error),
              {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
            );
          }.bind(this),
        )
        .catch(error => {
          console.log('Error LocationServicesDialogBox', error.message);
          this.props.toggleTodo(this.props.todosLength);
          var newMessage = this.props.navigation.getParam('pengguna');
          if (newMessage != undefined || newMessage != null) {
            this.sendMessage(newMessage);
          } else {
            this.sendFirstChat('hai');
          }
        });
      BackHandler.addEventListener('hardwareBackPress', () => {
        //(optional) you can use it if you need it
        //do not use this method if you are using navigation."preventBackClick: false" is already doing the same thing.
        LocationServicesDialogBox.forceCloseDialog();
      });

      DeviceEventEmitter.addListener('locationProviderStatusChange', function(
        status,
      ) {
        // only trigger when "providerListener" is enabled
        console.log('LocationServicesDialogBox ', status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
      });
    } else {
      Geolocation.getCurrentPosition(
        position => {
          let initialPosition = JSON.stringify(position);
          // this.setState({initialPosition});
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          // send firts chat
          this.props.toggleTodo(this.props.todosLength);
          var newMessage = this.props.navigation.getParam('pengguna');
          if (newMessage != undefined || newMessage != null) {
            this.sendMessage(newMessage);
          } else {
            this.sendFirstChat('hai');
          }
        },
        error => {
          console.log('error geo', error);
          this.requestPermissionIos();
          this.props.toggleTodo(this.props.todosLength);
          // this.customBs.showBSNotif(
          //   'Aktivkan Lokasi Perangkat, Aplikasi ini membutuhkan lokasi anda',
          // );
          var newMessage = this.props.navigation.getParam('pengguna');
          if (newMessage != undefined || newMessage != null) {
            this.sendMessage(newMessage);
          } else {
            this.sendFirstChat('hai');
          }
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );
    }
  }

  async getNewLocation() {
    if (Platform.OS == 'android') {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message:
          '<h2>Aktifkan Lokasi Perangkat</h2>Aplikasi ini membutuhkan lokasi anda:<br/><br/>Menggunakan GPS, Wi-Fi, dan jaringan untuk mengakses lokasi<br/><br/>',
        ok: 'YA',
        cancel: 'TIDAK',
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
        preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
        providerListener: true, // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
      })
        .then(
          function(success) {
            // success => {alreadyEnabled: true, enabled: true, status: "enabled"}
            Geolocation.getCurrentPosition(
              position => {
                let initialPosition = JSON.stringify(position);
                // this.setState({initialPosition});
                this.setState({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
                // send firts chat
              },
              error => console.log('error geo'.error),
              {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
            );
          }.bind(this),
        )
        .catch(error => {
          console.log('Error LocationServicesDialogBox', error.message);
          this.props.toggleTodo(this.props.todosLength);
          // var newMessage = this.props.navigation.getParam('pengguna');
          // if (newMessage != undefined || newMessage != null) {
          //   this.sendMessage(newMessage);
          // } else {
          //   this.sendFirstChat('hai');
          // }
        });
      BackHandler.addEventListener('hardwareBackPress', () => {
        //(optional) you can use it if you need it
        //do not use this method if you are using navigation."preventBackClick: false" is already doing the same thing.
        LocationServicesDialogBox.forceCloseDialog();
      });

      DeviceEventEmitter.addListener('locationProviderStatusChange', function(
        status,
      ) {
        // only trigger when "providerListener" is enabled
        console.log('LocationServicesDialogBox ', status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
      });
    } else {
      Geolocation.getCurrentPosition(
        position => {
          let initialPosition = JSON.stringify(position);
          // this.setState({initialPosition});
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          // send firts chat
        },
        error => {
          this.requestPermissionIos();
          console.log('error geo new', error);
          // this.props.toggleTodo(this.props.todosLength);
          // this.customBs.showBSNotif(
          //   'Aktivkan Lokasi Perangkat, Aplikasi ini membutuhkan lokasi anda',
          // );
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );
    }
  }

  stopVoiceIos() {
    try {
      ResponsiveVoice.stop();
    } catch {}
  }

  getUserData() {
    getValue('userData').then(response => {
      this.setState({user: response});
      this.getDataChat('halo');
    });
  }

  async giveLoading(newMessage) {
    let dataMessage = this.state.dataMessage;

    let data = {
      text: '...',
      type: 'loading',
    };
    dataMessage.push(data);
    await this.handleAddTodo(data);
    // this.setState({dataMessage: dataMessage, messageFromMe: ''});
  }

  async getDataChat(newMessage) {
    let dataMessage = this.state.dataMessage;
    let user_id = this.state.user;
    if (this.state.latitude == '' || this.state.longitude == '') {
      await this.getNewLocation();
    }

    let params = {
      // user_id: user_id.data.id,
      user_id: this.state.id_user,
      query: newMessage,
      lat: this.state.latitude,
      lon: this.state.longitude,
      channel: Platform.OS == 'ios' ? 'ios' : 'android',
      messageable_type: 'user',
      messageable_id: this.state.id_user,
    };

    //ini ditambahkan pada 14-06-2020 oleh agus untuk mengambil link responsive voice dari API
    let femaleVoice;
    let textVoice;
    let encodetext;
    let replaceText;
    let payload = {
      platform: 'ios',
    };
    await postNoHeader(ApiEndPoint.voice + 'general/getvoiceurl', payload)
      .then(response => {
        //  console.log('response get voice : ', response)
        femaleVoice = response.female;
      })
      .catch(error => {
        console.log('error voice : ', error);
      }); //get Data female voice

    await postDataWitHeader(Api.base_url_chat, params, this.state.token)
      .then(response => {
        dataMessage.pop();
        this.props.toggleTodo(this.props.todosLength);
        this.setState({dataQuickButton: response.result.quickbutton});
        if (response.result.output != null) {
          response.result.output.map(data => {
            data.time = moment().format('HH:mm');
            dataMessage.push(data);
            this.setState({dataMessage: dataMessage});
            this.handleAddTodo(data);
            if (data.speech != null) {
              if (data.type == 'carousel') {
                //ditambahkan pada 14-06-2020 oleh agus untuk penyesuaian voice agar tidak menggunakan voice bawaan ios
                if (Platform.OS == 'android') {
                  if (this.state.isChatPage) {
                    Tts.speak(data.speech);
                  }
                } else {
                  textVoice = data.speech;
                  encodetext = encodeURI(textVoice);
                  replaceText = femaleVoice.replace('$paramtext', encodetext);
                  ResponsiveVoice = new Sound(replaceText, null, error => {
                    if (error) {
                      // console.log('error voice : ',error)
                    } else {
                      if (this.state.isChatPage) {
                        ResponsiveVoice.play();
                      }
                    }
                  });
                }
              } else {
                if (Platform.OS == 'android') {
                  if (typeof sound != undefined) {
                    // Tts.stop();
                    sound = undefined;
                  }
                  if (this.state.isChatPage) {
                    Tts.speak(data.speech);
                    sound = 'speak';
                  }
                } else {
                  //ini ditambahkan oleh agus 14-06-2020 untuk penyesuaian voice ios agar tidak menggunakan voice bawaan ios
                  textVoice = data.speech;
                  encodetext = encodeURI(textVoice);
                  replaceText = femaleVoice.replace('$paramtext', encodetext);

                  if (typeof ResponsiveVoice != 'undefined') {
                    ResponsiveVoice.stop();
                    ResponsiveVoice = undefined;
                  }

                  ResponsiveVoice = new Sound(replaceText, null, error => {
                    if (error) {
                      // console.log('error voice : ',error)
                    } else {
                      if (this.state.isChatPage) {
                        ResponsiveVoice.play();
                      }
                    }
                  });
                }
              }
            }
            this.filterBS(data);
          });
        }
      })
      .catch(err => {
        console.log('ERROR = ', err);
        this.props.toggleTodo(this.props.todosLength);
        let data = {
          text: 'Maaf, sepertinya ada kesalahan. coba lagi nanti ya',
          type: 'text',
          time: moment().format('HH:mm'),
        };
        let dataMessage = this.state.dataMessage;
        dataMessage.pop();
        dataMessage.push(data);
        this.handleAddTodo(data);
        this.setState({dataMessage: dataMessage});
        if (this.state.isChatPage && Platform.OS == 'android') {
          Tts.speak(data.text);
        }
        // }
      });
  }
  setToInputMessage(Message) {
    this.setState({messageFromMe: Message});
  }

  renderGrid = ({item}) => {
    return (
      <Button
        onPress={() => this.actionGrid(item)}
        style={{
          flexDirection: 'column',
          margin: 1,
          height: Dimensions.get('window').width / 3 - 50,
          width: Dimensions.get('window').width / 3 - 20,
          backgroundColor: '#f7f7f7',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 5,
        }}>
        <Text
          style={{
            fontFamily: 'HKGrotesk-Regular',
            fontWeight: 'bold',
            color: '#9b9b9b',
            fontSize: 17,
          }}>
          {item.text}
        </Text>
        <Text
          style={{
            fontFamily: 'HKGrotesk-Regular',
            color: '#9b9b9b',
            fontSize: 14,
            marginTop: 5,
          }}>
          {item.subText}
        </Text>
      </Button>
    );
  };

  renderCarousel(item) {
    return item.content.columns.map((dataCarousel, index) => {
      return (
        <View
          style={{
            borderRadius: 10,
            width: 250,
            marginTop: 3,
            marginBottom: 3,
            marginEnd: 20,
            borderColor: '#c7c5c5',
            borderWidth: 0.7,
            shadowColor: '#000',
            shadowOpacity: Platform.OS == 'ios' ? 0 : 0.6, //ini dibuat kondisi agar UI shadownya tidak muncul di ios karna desain ios lebih kepada flat //agus 13-06-2020
            elevation: 1.2,
            shadowRadius: 1,
          }}>
          <View
            style={{
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              height: 150,
              width: 250,
              overflow: 'hidden',
            }}>
            <Image
              style={{
                height: '100%',
                width: undefined,
                resizeMode: 'stretch',
              }}
              source={{uri: dataCarousel.thumbnailImageUrl}}
            />
          </View>

          <Text
            key={index}
            style={{
              fontFamily: 'HKGrotesk-Regular',
              maxWidth: 250,
              margin: 10,
              fontWeight: 'bold',
            }}>
            {dataCarousel.title.split('<br>')}
          </Text>

          <Text
            key={index + 1}
            style={{
              fontFamily: 'HKGrotesk-Regular',
              maxWidth: 250,
              margin: 10,
            }}>
            {dataCarousel.text.split('<br>')}
          </Text>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {dataCarousel.actions.map((dataActions, index) => {
              return (
                <TouchableOpacity
                  onPress={() => this.actionCarousel(dataActions)}
                  transparent
                  style={{height: 30, marginBottom: 5}}>
                  <Text
                    key={index.toString()}
                    style={{
                      fontFamily: 'HKGrotesk-Regular',
                      color: '#0087d4',
                      fontWeight: 'bold',
                      justifyContent: 'center',
                      textAlign: 'center',
                      magin: 5,
                    }}>
                    {dataActions.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    });
  }
  renderSummary(item) {
    return item.content.columns.map((dataSummary, index) => {
      return (
        <View style={{marginHorizontal: 10, flexDirection: 'row'}}>
          <Text
            style={{
              flex: 3,
              marginVertical: 5,
              marginHorizontal: 5,
              fontWeight: 'bold',
            }}>
            {dataSummary.field}
          </Text>
          <Text style={{marginVertical: 5, marginHorizontal: 5}}>:</Text>
          <Text style={{flex: 4, marginVertical: 5, marginHorizontal: 5}}>
            {dataSummary.value}
          </Text>
        </View>
      );
    });
  }

  renderMovie(item) {
    return item.content.columns.map((dataMovie, index) => {
      return (
        <View
          style={{
            borderRadius: 10,
            width: 250,
          }}>
          <View style={{height: 200, width: 250}}>
            <Image
              style={{
                height: '100%',
                width: 250,
                resizeMode: 'stretch',
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}
              source={{uri: dataMovie.thumbnailImageUrl}}
            />
          </View>

          <Text
            key={index}
            style={{
              fontFamily: 'HKGrotesk-Regular',
              maxWidth: 250,
              margin: 10,
              fontWeight: 'bold',
            }}>
            {dataMovie.title}
          </Text>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {dataMovie.actions.map((dataActions, index) => {
              return (
                <Button
                  onPress={() => this.actionMovie(dataActions)}
                  transparent
                  style={{height: 30}}>
                  <Text
                    key={index.toString()}
                    style={{
                      fontFamily: 'HKGrotesk-Regular',
                      color: '#0087d4',
                      fontWeight: 'bold',
                    }}>
                    {dataActions.label}
                  </Text>
                </Button>
              );
            })}
          </View>
        </View>
      );
    });
  }
  renderWeather(item) {
    return item.content.columns.map((dataWeather, index) => {
      if (index != 0) {
        return (
          <View style={{flex: 1}}>
            <Text style={{color: '#fff', fontSize: 10, textAlign: 'center'}}>
              {dataWeather.shortDate}
            </Text>
            {/* {index == 3 && ( */}
            <Text style={styles.titledetailsWeather}>Siang</Text>
            {/* )}
            {index != 3 && <Text style={styles.titledetailsWeather}>{''}</Text>} */}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                source={{uri: dataWeather.dayIconUrl}}
              />
            </View>
            <Text
              style={{
                flex: 1,
                color: '#fff',
                fontSize: 10,
                textAlign: 'center',
                marginBottom: 20,
              }}>
              {dataWeather.minTemperature}
              {'\u00B0'} - {dataWeather.maxTemperature}
              {'\u00B0'}
            </Text>
            {/* {index == 3 && ( */}
            <Text style={styles.titledetailsWeather}>Malam</Text>
            {/* )}
            {index != 3 && <Text style={styles.titledetailsWeather}>{''}</Text>} */}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                source={{uri: dataWeather.nightIconUrl}}
              />
            </View>
            <Text
              style={{
                flex: 1,
                color: '#fff',
                fontSize: 10,
                textAlign: 'center',
                marginBottom: 10,
              }}>
              {dataWeather.minTemperature}
              {'\u00B0'} - {dataWeather.maxTemperature}
              {'\u00B0'}
            </Text>
          </View>
        );
      }
    });
  }

  renderQuickButton = ({item}) => {
    if (this.state.dataQuickButton.length == 0) {
      return null;
    } else {
      return (
        <Button
          transparent
          onPress={() => this.sendMessage(item)}
          style={{
            margin: 5,
            borderWidth: 0.5,
            borderColor: '#dedede',
            borderRadius: 20,
            minWidth: 50,
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
          }}>
          <View>
            <Text
              style={{
                fontFamily: 'HKGrotesk-Regular',
                paddingTop: 5,
                paddingBottom: 8,
                paddingLeft: 12,
                paddingRight: 12,
              }}>
              {item}
            </Text>
          </View>
        </Button>
      );
    }
  };

  actionGrid(item) {
    this.sendMessage(item.defaultAction.data);
  }

  actionMovie(item) {
    if (item.type == 'postback') {
      this.sendMessage(item.data);
    } else if (item.type == 'uri') {
      Linking.openURL(item.uri);
    } else if (item.type == 'fuctions') {
    } else {
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${this.state.latitude},${this.state.longitude}`;
      const label = 'Lenna Maps';
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      Linking.openURL(url);
    }
  }

  actionCarousel(item) {
    if (item.type == 'postback') {
      this.sendMessage(item.data);
    } else if (item.type == 'uri') {
      Linking.openURL(item.uri);
    } else if (item.type == 'location') {
      console.log('actionCarousel', item);
      let lat = '';
      let long = '';
      const words = item.data.split(',');

      const latLng = `${words[0]},${words[1]}`;
      let label = words[2];

      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });
      Linking.openURL(url);
    } else {
      this.sendMessage(item.data);
    }
  }

  renderData = ({item}) => {
    switch (item.content.type) {
      case 'text':
        return (
          <View style={{margin: 10}}>
            <View
              style={{
                alignSelf: 'flex-start',
                padding: 7,
                // backgroundColor: '#f6f7f8',
                backgroundColor: '#e8e9eb',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'HKGrotesk-Regular',
                  color: '#000',
                  fontWeight: '500',
                }}>
                {item.content.text}
              </Text>
              <Text style={{color: '#000', fontSize: 10, textAlign: 'left'}}>
                {item.content.time}
              </Text>
            </View>
          </View>
        );
      case 'messageFromMe':
        return (
          <TouchableOpacity
            style={{margin: 10}}
            onPress={() => this.setToInputMessage(this.state.messageFromMe)}>
            <View
              style={{
                alignSelf: 'flex-end',
                fontFamily: 'HKGrotesk-Regular',
                padding: 7,
                backgroundColor: '#005CE6',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 0,
              }}>
              <Text style={{color: '#fff', fontWeight: '500'}}>
                {item.content.text}
              </Text>
              <Text style={{color: '#fff', fontSize: 10, textAlign: 'right'}}>
                {item.content.time}
              </Text>
            </View>
          </TouchableOpacity>
        );
      case 'loading':
        return (
          <View style={{margin: 10}}>
            <View
              style={{
                alignSelf: 'flex-start',
                padding: 7,
                // backgroundColor: '#f6f7f8',
                backgroundColor: '#e8e9eb',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 10,
              }}>
              <Image
                // autoSize={true}
                style={{margin: 8, height: 9, width: 30}}
                resizeMode="stretch"
                source={require('../../../../assets/animation/22.gif')}
                autoPlay
              />
            </View>
          </View>
        );
      case 'image':
        return (
          <View
            style={{
              margin: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 300,
                width: Dimensions.get('window').width - 30,
                borderRadius: 10,
              }}>
              <Image
                style={{
                  height: 300,
                  width: Dimensions.get('window').width - 30,
                  resizeMode: 'stretch',
                  borderRadius: 10,
                }}
                source={{uri: item.content.originalContentUrl}}
              />
            </View>
          </View>
        );
      case 'html':
        return (
          <View style={{margin: 10}}>
            <HTML
              html={item.content.html}
              imagesMaxWidth={Dimensions.get('window').width}
            />
          </View>
        );
      case 'carousel':
        return (
          <View style={{margin: 10}}>
            <ScrollView
              horizontal={true}
              style={{overflow: 'visible'}}
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator={false}>
              {this.renderCarousel(item)}
            </ScrollView>
          </View>
        );
      case 'list':
        return <Text> </Text>;
      case 'movie':
        return (
          <View style={{margin: 10}}>
            <ScrollView
              horizontal={true}
              style={{overflow: 'visible'}}
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator={false}>
              {this.renderMovie(item)}
            </ScrollView>
          </View>
        );
      case 'summary':
        return (
          <View
            style={{
              marginTop: 30,
              marginHorizontal: 10,
              marginBottom: 10,
              backgroundColor: '#fff',
              borderWidth: 0.8,
              borderColor: '#dedede',
              borderRadius: 5,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.8,
              elevation: 3,
            }}>
            <View
              style={{
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  marginTop: -30,
                  borderRadius: 50,
                  justifyContent: 'center',
                  borderWidth: 1.3,
                  borderColor: '#dedede',
                  padding: 10,
                  backgroundColor: '#005CE6',
                }}>
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    resizeMode: 'stretch',
                  }}
                  source={require('../../../../assets/image/notepad.png')}
                />
              </View>

              <Text
                style={{
                  textAlign: 'center',
                  color: 'black',
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginTop: 10,
                }}>
                {item.content.title}
              </Text>
              <View
                style={{
                  height: 2,
                  width: '90%',
                  backgroundColor: '#005CE6',
                  marginHorizontal: 10,
                  marginTop: 10,
                }}
              />
            </View>

            {this.renderSummary(item)}

            {item.content.title == 'Hasil Simulasi' && (
              <View style={{marginHorizontal: 10, marginVertical: 5}}>
                <Text style={{marginTop: 15}}>
                  Disclaimer : perhitungan hanya bersifat simulasi dan bertujuan
                  sebagai ilustrasi
                </Text>
              </View>
            )}
          </View>
        );
      case 'weather':
        return (
          <View
            style={{
              fontFamily: 'HKGrotesk-Regular',
              padding: 14,
              backgroundColor: '#0087d3',
              margin: 10,
              borderRadius: 7,
            }}>
            <Text style={{fontSize: 20, color: '#fff'}}>
              {item.content.area} {', '}
              {item.content.countryCode}
            </Text>
            <Text style={{fontSize: 12, color: '#fff'}}>
              {item.content.columns[0].longDate}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <View style={{flex: 1}}>
                <Text style={styles.titledetailsWeather}>Siang</Text>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 37,
                      height: 37,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    source={{uri: item.content.columns[0].dayIconUrl}}
                  />
                  <Text
                    numberOfLines={2}
                    style={{
                      color: '#fff',
                      fontSize: 12,
                      textAlign: 'center',
                    }}>
                    {item.content.columns[0].dayWeather == ''
                      ? '-'
                      : item.content.columns[0].dayWeather}
                  </Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.titledetailsWeather}>Suhu</Text>
                <Text
                  style={{color: '#fff', textAlign: 'center', fontSize: 25}}>
                  {item.content.columns[0].temperature}
                  {'\u00B0'}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      flex: 1,
                      color: '#fff',
                      fontSize: 12,
                      textAlign: 'center',
                    }}>
                    Min {item.content.columns[0].minTemperature}
                    {'\u00B0'}
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      flex: 1,
                      color: '#fff',
                      fontSize: 12,
                      textAlign: 'center',
                    }}>
                    Maks {item.content.columns[0].maxTemperature}
                    {'\u00B0'}
                  </Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.titledetailsWeather}>Malam</Text>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 37,
                      height: 37,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    source={{uri: item.content.columns[0].nightIconUrl}}
                  />
                  <Text
                    numberOfLines={2}
                    style={{
                      color: '#fff',
                      fontSize: 12,
                      textAlign: 'center',
                    }}>
                    {item.content.columns[0].nightWeather}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{backgroundColor: '#fff', height: 1, marginVertical: 10}}
            />
            <View style={{flexDirection: 'row'}}>
              {this.renderWeather(item)}
            </View>
          </View>
        );
      case 'grid':
        return (
          <View
            style={{
              margin: 10,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderWidth: 0.5,
              borderColor: '#dedede',
              borderRadius: 10,
            }}>
            <View style={{width: 100, height: 100}}>
              <Image
                style={{height: 80, width: 80, resizeMode: 'stretch'}}
                source={{uri: item.content.imageUrl}}
              />
            </View>
            <View style={{marginTop: 10, marginBottom: 10}}>
              <FlatList
                data={item.content.columns}
                extraData={item.content.columns}
                renderItem={this.renderGrid}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
              />
            </View>
          </View>
        );
      case 'wildFireForm':
        return <View />;
      case 'travelForm':
        return <View />;
      case 'vehicleForm':
        return <View />;
      case 'personalAccidentForm':
        return <View />;
      case '':
        return false;
    }
  };

  setDate(newDate) {
    this.setState({chosenDate: newDate});
  }

  firstChat() {
    if (this.firstChat == '') {
      this.sendMessage('hai');
    }
  }

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };
  handleConfirm = date => {
    this.setState({isDatePickerVisible: false});
  };

  showPolisKebakaran = (data, title, type) => {
    console.log('showPolisKebakaran');
    this.child.setModalVisible(data, title, type);
  };
  showPolisKebakaran2 = (data, title) => {
    this.child2.setModalVisible(data, title);
  };
  showPolisTravel = visible => {
    this.travel.setModalVisible(true);
  };
  showPolisTravel2 = visible => {
    this.travel2.setModalVisible(true);
  };
  showPolisPPA = (data, title, type) => {
    this.ppa.setModalVisible(data, title, type);
    // this.refs.scroller.scrollToEnd();
  };
  showPolisPPA2 = visible => {
    this.ppa2.setModalVisible(true);
    // this.refs.scroller.scrollToEnd();
  };
  showPolisKendaraan = (data, title, type) => {
    this.kendaraan.setModalVisible(data, title, type);
    // this.refs.scroller.scrollToEnd();
  };
  showPolisKendaraan2 = (data, title) => {
    this.kendaraan2.setModalVisible(data, title);
    // this.refs.scroller.scrollToEnd();
  };
  showKlaimKebakaran = visible => {
    this.klaimKebakran.setModalVisible(true);
    // this.refs.scroller.scrollToEnd();
  };
  showKlaimPPA = visible => {
    this.klaimPPA.setModalVisible(true);
    // this.refs.scroller.scrollToEnd();
  };
  showKlaimKendaraan = visible => {
    this.klaimKendaraan.setModalVisible(true);
    // this.refs.scroller.scrollToEnd();
  };
  showKlaimTravel = visible => {
    this.klaimTravel.setModalVisible(true);
    // this.refs.scroller.scrollToEnd();
  };
  showWildFireSimulation = (data, title, type) => {
    this.simulasiKebakaran.setModalVisible(data, title, type);
  };
  showWildFireSimulation2 = data => {
    this.simulasiKebakaran2.setModalVisible(true, data);
  };
  showVehicleFormSimulation(title, type) {
    this.simulasiKendaraan.setModalVisible(title, type);
  }
  showPersonalAccidentSimulation(title, type) {
    console.log('showPersonalAccidentSimulation');

    this.simulasiPPA.setModalVisible(title, type);
  }
  showsimulasiTravelForm() {
    this.simulasiTravel.setModalVisible(true);
  }
  showDetailsTypeProduct = (type, form_name) => {
    this.detailTypeProduct.setModalVisible(type, form_name);
  };
  showWakalBilUjrah(data) {
    this.wakalbilujrah.setModalVisible(data);
  }

  sendMessageForm(data) {
    this.sendFirstChat(data);
  }

  showUploadFoto = (value, title) => {
    this.uploadfoto.setModalVisible(value, title);
  };
  showUploadFotoKendaraan = (value, type) => {
    this.uploadfotokendaraan.setModalVisible(value, type);
  };
  showUploadFotoTravel = value => {
    this.uploadfototravel.setModalVisible(value);
  };
  showUploadFotoPPA = (data, type) => {
    this.uploadfotoPPA.setModalVisible(data, type);
  };

  showUploadFotoKlaim = (value, type) => {
    this.uploadfotoklaim.setModalVisible(value, type);
  };

  showVerifOtp = data => {
    this.bsVerifOtp.setModalVisible(data);
  };
  showInputOtp = data => {
    this.bsInputOtp.setModalVisible(data);
  };

  messageCancel = message => {
    // this.sendMessage.bind(this);
    // this.sendMessage(message);
    // this.closeBs();
    this.child.setModalVisible(false);
  };

  closeBs = () => {
    this.child.setModalVisible(false);
  };

  filterBS(data) {
    if (data.type == 'wildFireForm') {
      this.showPolisKebakaran();
    } else if (data.type == 'vehicleForm') {
      this.showPolisKendaraan();
    } else if (data.type == 'personalAccidentForm') {
      this.showPolisPPA();
    } else if (data.type == 'travelForm') {
      this.showPolisTravel();
    } else if (data.type == 'simulasiVehicelForm') {
      this.showVehicleFormSimulation();
    } else if (data.type == 'simulasiWildfireForm') {
      this.showWildFireSimulation();
    } else if (data.type == 'simulasiPersonalAccidentForm') {
      this.showPersonalAccidentSimulation();
    } else if (data.type == 'Form Foto Pengajuan Polis Kebakaran') {
      this.showUploadFoto(data.columns);
    } else if (data.type == 'Form Foto Pengajuan Polis Kebakaran Syariah') {
      this.showUploadFoto(data.columns, 'Asuransi Kebakaran Syariah');
    } else if (data.type == 'Form Foto Pengajuan Polis Kendaraan') {
      this.showUploadFotoKendaraan(data.columns);
    } else if (data.type == 'Form Foto Pengajuan Polis Kendaraan Syariah') {
      this.showUploadFotoKendaraan(data.columns, 'Asuransi Kendaraan Syariah');
    } else if (data.type == 'Form Foto Pengajuan Polis Travel') {
      this.showUploadFotoTravel(data.columns);
    } else if (data.type == 'simulasiTravelForm') {
      this.showsimulasiTravelForm();
    } else if (data.type == 'Form Foto Pengajuan Polis Personal Accident') {
      this.showUploadFotoPPA(data.columns);
    } else if (
      data.type == 'Form Foto Pengajuan Polis Personal Accident Syariah'
    ) {
      this.showUploadFotoPPA(data.columns, 'Asuransi kecelakaan diri syariah');
    } else if (data.type == 'confirm') {
      this.showVerifOtp(data.columns);
    } else if (data.type == 'klaimWildfireForm') {
      this.showKlaimKebakaran();
    } else if (data.type == 'klaimVehicleForm') {
      this.showKlaimKendaraan();
    } else if (data.type == 'klaimTravelForm') {
      this.showKlaimTravel();
    } else if (data.type == 'klaimPersonalAccidentForm') {
      this.showKlaimPPA();
    } else if (data.type == 'Form Foto Klaim Polis Kebakaran') {
      this.showUploadFotoKlaim(data.columns, data.type);
    } else if (data.type == 'Form Foto Klaim Polis Kendaraan') {
      this.showUploadFotoKlaim(data.columns, data.type);
    } else if (data.type == 'Form Foto Klaim Polis Personal Accident') {
      this.showUploadFotoKlaim(data.columns, data.type);
    } else if (data.type == 'Form Foto Klaim Polis Travel') {
      this.showUploadFotoKlaim(data.columns, data.type);
    } else if (data.title == 'Asuransi Kebakaran Syariah') {
      this.showPolisKebakaran(data.columns, data.title, data.type);
    } else if (data.title == 'Asuransi Kendaraan Syariah') {
      this.showPolisKendaraan(data.columns, data.title, data.type);
    } else if (data.title == 'Asuransi Personal Accident Syariah') {
      this.showPolisPPA(data.columns, data.title, data.type);
    } else if (data.type == 'wakalBilHujrahWildfireForm') {
      this.showWakalBilUjrah(data.title);
    } else if (data.type == 'wakalBilHujrahVehicleForm') {
      this.showWakalBilUjrah(data.title);
    } else if (data.type == 'wakalBilHujrahPersonalAccidentForm') {
      this.showWakalBilUjrah(data.title);
    } else if (data.title == 'Asuransi Personal Accident Syariah Simulasi') {
      this.showPersonalAccidentSimulation(data.title, data.type);
    } else if (data.title == 'Asuransi Kebakaran Syariah Simulasi') {
      this.showWildFireSimulation('simulasi', data.title, data.type);
    } else if (data.title == 'Asuransi Kendaraan Syariah Simulasi') {
      this.showVehicleFormSimulation(data.title, data.type);
    }
  }
  renderBsPengajuanKebakaran = () => {
    const {date} = this.state;
    return (
      <View>
        <BsPengajuanPKebakaran
          showPolis2={this.showPolisKebakaran2}
          showDetailType={this.showDetailsTypeProduct}
          messageCancel={this.sendMessage}
          onReff={ref => (this.child = ref)}
        />
      </View>
    );
  };
  renderBsPengajuanKebakaran2 = () => {
    const {date} = this.state;
    return (
      <View>
        <BsPengajuanPKebakaran2
          showDetailType={this.showDetailsTypeProduct}
          backToWildFire={() => this.showPolisKebakaran('back')}
          sendToChat={this.sendMessageForm}
          messageCancel={this.sendMessage}
          showUploadFile={this.showUploadFoto}
          value={this.state.modalBsPengajuanKebakaran2}
          onRef={ref => (this.child2 = ref)}
        />
      </View>
    );
  };
  renderBsPengajuanTravel = () => {
    const {date} = this.state;
    return (
      <View>
        <BsPengajuanPTravel
          showDetailType={this.showDetailsTypeProduct}
          showTravel2={this.showPolisTravel2}
          sendToChat={this.sendMessageForm}
          messageCancel={this.sendMessage}
          onTravel={ref => (this.travel = ref)}
        />
      </View>
    );
  };
  renderBsPengajuanTravel2 = () => {
    const {date} = this.state;
    return (
      <View>
        <BsPengajuanPTravel2
          messageCancel={this.sendMessage}
          onTravel2={ref => (this.travel2 = ref)}
        />
      </View>
    );
  };
  renderBsPengajuanPPA = () => {
    const {date} = this.state;
    return (
      <View>
        <BsPengajuanPPA
          showDetailType={this.showDetailsTypeProduct}
          messageCancel={this.sendMessage}
          showPPA2={this.showPolisPPA2}
          sendToChat={this.sendMessageForm}
          onPPA={ref => (this.ppa = ref)}
        />
      </View>
    );
  };
  renderBsPengajuanPPA2 = () => {
    const {date} = this.state;
    return (
      <View>
        <BsPengajuanPPA2
          messageCancel={this.sendMessage}
          onPPA2={ref => (this.ppa2 = ref)}
        />
      </View>
    );
  };
  renderBsPKendaraan = () => {
    const {date} = this.state;
    return (
      <View>
        <BsPengajuanPKendaraan
          showDetailType={this.showDetailsTypeProduct}
          messageCancel={this.sendMessage}
          showPolis2={this.showPolisKendaraan2}
          onKendaraan={ref => (this.kendaraan = ref)}
        />
      </View>
    );
  };
  renderBsPKendaraan2 = () => {
    const {date} = this.state;
    return (
      <View>
        <BsPengajuanPKendaraan2
          backToVehicle={() => this.showPolisKendaraan('back')}
          messageCancel={this.sendMessage}
          sendToChat={this.sendMessageForm}
          onKendaraan2={ref => (this.kendaraan2 = ref)}
        />
      </View>
    );
  };

  renderBsDetailsProduct = () => {
    const {date} = this.state;
    return (
      <View>
        <BsDetailTypeProduct
          messageCancel={this.sendMessage}
          sendToChat={this.sendMessageForm}
          showBsFire={() => this.showPolisKebakaran('back')}
          showBsFire2={() => this.showPolisKebakaran2()}
          showBsVehicle={() => this.showPolisKendaraan('back')}
          showBsTravel={() => this.showPolisTravel()}
          showBsPPA={() => this.showPolisPPA('back')}
          showBsFireSim={() => this.showWildFireSimulation('back')}
          showBsFireSim2={() => this.showWildFireSimulation2()}
          showBsVehicleSim={() => this.showVehicleFormSimulation()}
          showBsTravelSim={() => this.showsimulasiTravelForm()}
          showBsPPASim={() => this.showPersonalAccidentSimulation()}
          onDetailTypeProduct={ref => (this.detailTypeProduct = ref)}
        />
      </View>
    );
  };
  renderBsKlaimKebakaran = () => {
    return (
      <View>
        <BsKlaimKebakaran
          messageCancel={this.sendMessage}
          sendToChat={this.sendMessageForm}
          onKlaimKebakaran={ref => (this.klaimKebakran = ref)}
        />
      </View>
    );
  };
  renderBsKlaimPPA = () => {
    return (
      <View>
        <BsKlaimPPA
          messageCancel={this.sendMessage}
          sendToChat={this.sendMessageForm}
          onKlaimPPA={ref => (this.klaimPPA = ref)}
        />
      </View>
    );
  };
  renderBsKlaimKendaraan = () => {
    return (
      <View>
        <BsKlaimKendaraan
          messageCancel={this.sendMessage}
          sendToChat={this.sendMessageForm}
          onKlaimKendaraan={ref => (this.klaimKendaraan = ref)}
        />
      </View>
    );
  };
  renderBsKlaimTravel = () => {
    return (
      <View>
        <BsKlaimTravel
          messageCancel={this.sendMessage}
          sendToChat={this.sendMessageForm}
          onKlaimTravel={ref => (this.klaimTravel = ref)}
        />
      </View>
    );
  };

  renderBsSimulasiKebakaran = () => {
    return (
      <View>
        <BsSimulasiKebakaran
          showDetailType={this.showDetailsTypeProduct}
          showWildFireSimulation_2={this.showWildFireSimulation2}
          messageCancel={this.sendMessage}
          onSimulasiKebakaran={ref => (this.simulasiKebakaran = ref)}
        />
      </View>
    );
  };
  renderBsSimulasiKebakaran2 = () => {
    return (
      <View>
        <BsSimulasiKebakaran2
          backToWildFireSimulation={() => this.showWildFireSimulation('back')}
          showDetailType={this.showDetailsTypeProduct}
          sendToChat={this.sendMessageForm}
          messageCancel={this.sendMessage}
          onSimulasiKebakaran2={ref => (this.simulasiKebakaran2 = ref)}
        />
      </View>
    );
  };
  renderBsSimulasiKendaraan = () => {
    return (
      <View>
        <BsSimulasiKendaraan
          showDetailType={this.showDetailsTypeProduct}
          messageCancel={this.sendMessage}
          sendToChat={this.sendMessageForm}
          onSimulasiKendaraan={ref => (this.simulasiKendaraan = ref)}
        />
      </View>
    );
  };
  renderBsSimulasiPPA = () => {
    return (
      <View>
        <BsSimulasiPPA
          showDetailType={this.showDetailsTypeProduct}
          messageCancel={this.sendMessage}
          sendToChat={this.sendMessageForm}
          onSimulasiPPA={ref => (this.simulasiPPA = ref)}
        />
      </View>
    );
  };
  renderBsSimulasiTravel = () => {
    return (
      <View>
        <BsSimulasiTravel
          showDetailType={this.showDetailsTypeProduct}
          showTravel2={this.showPolisTravel2}
          sendToChat={this.sendMessageForm}
          messageCancel={this.sendMessage}
          onSimulasiTravel={ref => (this.simulasiTravel = ref)}
        />
      </View>
    );
  };
  renderBsUploadFoto = () => {
    return (
      <View>
        <BsUploadFoto
          sendToChat={this.sendMessageForm}
          messageCancel={this.sendMessage}
          onUploadFoto={ref => (this.uploadfoto = ref)}
        />
      </View>
    );
  };

  renderBsUploadFotoKendaraan = () => {
    return (
      <View>
        <BsUploadFotoKendaraan
          sendToChat={this.sendMessageForm}
          messageCancel={this.sendMessage}
          onUploadFotoKendaraan={ref => (this.uploadfotokendaraan = ref)}
        />
      </View>
    );
  };

  renderBsUploadFotoTravel = () => {
    return (
      <View>
        <BsUploadFotoTravel
          sendToChat={this.sendMessageForm}
          messageCancel={this.sendMessage}
          onUploadFotoTravel={ref => (this.uploadfototravel = ref)}
        />
      </View>
    );
  };
  renderBsUploadFotoPPA = () => {
    return (
      <View>
        <BsUploadFotoPPA
          sendToChat={this.sendMessageForm}
          messageCancel={this.sendMessage}
          onUploadFotoPPA={ref => (this.uploadfotoPPA = ref)}
        />
      </View>
    );
  };

  renderBsUploadFotoKlaim = () => {
    return (
      <View>
        <BsUploadFotoKlaim
          sendToChat={this.sendMessageForm}
          messageCancel={this.sendMessage}
          onUploadFotoKlaim={ref => (this.uploadfotoklaim = ref)}
        />
      </View>
    );
  };

  renderBsVerifOtp = () => {
    return (
      <View>
        <BsVerifOtpAndEmail
          showInputOtp={this.showInputOtp}
          messageCancel={this.sendMessageHide}
          onVerifOtp={ref => (this.bsVerifOtp = ref)}
        />
      </View>
    );
  };

  renderBsInputOtp = () => {
    return (
      <View>
        <BsInputOtp
          messageCancel={this.sendMessageHide}
          onInputOtp={ref => (this.bsInputOtp = ref)}
        />
      </View>
    );
  };

  renderBsWakalBilUjrah = () => {
    return (
      <View>
        <WakalBilUjrah
          messageCancel={this.sendMessage}
          sendToChat={this.sendMessageForm}
          onWakalBilUjrah={ref => (this.wakalbilujrah = ref)}
        />
      </View>
    );
  };

  renderMic = () => {
    if (this.state.visibleMic) {
      return (
        <TouchableHighlight
          activeOpacity={0.1}
          underlayColor="#00000"
          onPress={() => this.onStartButtonPress()}>
          <Image
            style={{width: 45, height: 45}}
            source={require('../../../../assets/image/icon_mic_inactive.png')}
          />
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight
          activeOpacity={0.1}
          underlayColor="#00000"
          onPress={() => this.onStopMicroPhone()}>
          <Image
            style={{width: 45, height: 45}}
            source={require('../../../../assets/image/icon_mic_active.png')}
          />
        </TouchableHighlight>
      );
    }
  };

  render() {
    const {main, user, navigation} = this.props;
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={() => {
            this.getPostbackPenggunaan();
          }}
          onWillBlur={() => {
            this.willBlur();
          }}
        />
        <Header
          leftComponent={{
            text: 'Profile',
            style: {
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
              marginHorizontal: 6,
            },
          }}
          centerComponent={
            // <TouchableHighlight onPress={() => this.showUploadFotoKlaim()}>
            <Image
              style={{height: 25, width: 80, resizeMode: 'stretch'}}
              source={require('../../../../assets/image/img_logo_tripa.png')}
            />
            // </TouchableHighlight>
          }
          containerStyle={{
            backgroundColor: '#FFFFFFFF',
            height: Platform.OS == 'ios' ? 64 : 56,
            paddingTop: 0,
            elevation: 5,
          }}
        />

        {/* Agus - */}
        <FlatList
          ref={'scroller'}
          style={styles.list}
          data={this.props.todos}
          renderItem={this.renderData}
          keyExtractor={(item, key) => key}
          showsVerticalScrollIndicator={false}
          animated={false}
        />

        {/* 
        {this.renderBsUploadFoto()}
        */}
        {this.renderBsPengajuanKebakaran()}
        {this.renderBsPengajuanKebakaran2()}

        {this.renderBsPKendaraan()}
        {this.renderBsPKendaraan2()}
        {this.renderBsPengajuanTravel()}
        {this.renderBsPengajuanTravel2()}
        {this.renderBsPengajuanPPA()}
        {this.renderBsPengajuanPPA2()}
        {this.renderBsKlaimKebakaran()}
        {this.renderBsKlaimPPA()}
        {this.renderBsKlaimKendaraan()}
        {this.renderBsKlaimTravel()}

        {this.renderBsSimulasiKebakaran()}
        {this.renderBsSimulasiKebakaran2()}
        {this.renderBsSimulasiKendaraan()}
        {this.renderBsSimulasiPPA()}
        {this.renderBsUploadFoto()}
        {this.renderBsUploadFotoKendaraan()}
        {this.renderBsUploadFotoTravel()}
        {this.renderBsSimulasiTravel()}
        {this.renderBsUploadFotoPPA()}
        {this.renderBsUploadFotoKlaim()}
        {this.renderBsVerifOtp()}
        {this.renderBsInputOtp()}
        {this.renderBsWakalBilUjrah()}
        {this.renderBsDetailsProduct()}

        <CustomBs onCustomBS={ref => (this.customBs = ref)} />

        {//penambahan kondisi cek os agar inputtext field tidak tertutup oleh keyboard ios 13-06-2020 //agustiar
        Platform.OS == 'android' ? (
          <KeyboardAvoidingView>
            <FlatList
              style={styles.quickbuttonContainer}
              data={this.state.dataQuickButton}
              extraData={this.state}
              horizontal
              renderItem={this.renderQuickButton}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
            />
            <View style={styles.footerRow}>
              {this.renderMic()}
              <Input
                controlled={true}
                style={styles.input}
                value={this.state.messageFromMe}
                returnKeyType="send"
                onSubmitEditing={() =>
                  this.sendMessage(this.state.messageFromMe)
                }
                onChangeText={message =>
                  this.setState({messageFromMe: message})
                }
                placeholder="Ketik pesan anda"
                autoCorrect={false}
              />
              <TouchableOpacity
                transparent
                style={{marginRight: 10}}
                onPress={() => this.sendMessage(this.state.messageFromMe)}>
                <Icon name="send" size={35} color="#005CE6" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={keyboardVerticalOffset}>
            <FlatList
              style={styles.quickbuttonContainer}
              data={this.state.dataQuickButton}
              extraData={this.state}
              horizontal
              renderItem={this.renderQuickButton}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
            />
            <View style={styles.footerRowiOS}>
              {this.renderMic()}
              <Input
                controlled={true}
                style={styles.input}
                value={this.state.messageFromMe}
                returnKeyType="send"
                onSubmitEditing={() =>
                  this.sendMessage(this.state.messageFromMe)
                }
                onChangeText={message =>
                  this.setState({messageFromMe: message})
                }
                placeholder="Ketik pesan anda"
                autoCorrect={false}
              />
              <TouchableOpacity
                transparent
                style={{marginRight: 10}}
                onPress={() => this.sendMessage(this.state.messageFromMe)}>
                <Icon name="send" size={35} color="#005CE6" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    marginTop: getStatusBarHeight(),
  },
  chatInput: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    minHeight: 20,
    borderTopWidth: 1,
    borderColor: '#EAEAEA',
  },
  viewsearch: {
    backgroundColor: '#e5e5e5',
    flexDirection: 'row',
    marginStart: 20,
    marginEnd: 20,
    marginTop: 10,
    marginBottom: 0,
    borderRadius: 12,
    alignItems: 'center',
  },
  iconmic: {
    width: 25,
    height: 25,
    marginEnd: 10,
  },
  header: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    // backgroundColor: '#000',
  },
  footer: {
    height: 20,
    backgroundColor: '#fff',
  },
  list: {
    // height: Dimensions.get('window').height - 250,
    backgroundColor: '#fff',
  },
  quickbuttonContainer: {
    backgroundColor: '#fff',
  },
  input: {
    minHeight: moderateScale(40), //tadinya 40
    fontSize: moderateScale(13),
    width: moderateScale(280),
    paddingHorizontal: moderateScale(5),
    alignSelf: 'center',
    margin: 10,
    height: 20,
    borderRadius: 50,
    paddingVertical: moderateScale(7),
    paddingLeft: moderateScale(5),
    backgroundColor: '#fff',
  },
  footerRow: {
    flexDirection: 'row',
    backgroundColor: '#f6f7f8',
    minHeight: moderateScale(40),
    height: 50,
    width: '100%',
    alignItems: 'center',
  },
  footerRowiOS: {
    flexDirection: 'row',
    backgroundColor: '#f6f7f8',
    minHeight: moderateScale(20),
    height: 50,
    width: '100%',
    alignItems: 'center',
  },
  titleBottomSheeet: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },

  bottomSheet: {
    backgroundColor: 'transparent',
  },
  contentbottomSheet: {
    backgroundColor: '#ededed',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginStart: 5,
    marginEnd: 5,
  },
  titledetailsWeather: {
    color: '#ffe700',
    fontSize: 10,
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  const {visibilityFilter} = state;
  const todos = getTodosByVisibilityFilter(state, 'incomplete');
  const todosLength = getLength(state);
  // console.log('mapStateToProps', todos.length);
  return {todos, todosLength};
};

export const addMessage = data => {
  console.log('addMessage');
};

export default connect(
  mapStateToProps,
  {addTodo, toggleTodo},
)(Chat);
