import 'react-native-gesture-handler';
import React, {Component} from 'react';
import Modal, {
  ModalTitle,
  ModalContent,
  ModalFooter,
  ModalButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-modals';
import {Text, Image} from 'react-native';
class FirstModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh_token: '',
      showAlert: false,
      showLogout: false,
      reloadPage: false,
      modalVisible: false,
    };
  }
  render() {
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
            backgroundColor: 'white',
            borderRadius: 10,
          }}>
          <Image
            resizeMode={'contain'}
            source={require('../../../../assets/image/ic_modal_home.png')}
            style={{width: '100%', height: 150}}
          />
          <Text
            numberOfLines={1}
            style={{
              textAlign: 'center',
              color: '#005CE6',
              // color: 'black',
              fontSize: 25,
              fontWeight: 'bold',
            }}>
            Hi {this.state.username}...
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#005CE6',
              // color: 'black',
              fontSize: 25,
              fontWeight: 'bold',
            }}>
            Selamat Datang!
          </Text>
          <TouchableHighlight
            activeOpacity={0.1}
            underlayColor="#00000"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => this.setState({modalVisible: false})}>
            <Image
              style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                width: 60,
                height: 60,
                resizeMode: 'stretch',
                bottom: -30,
              }}
              source={require('../../../../assets/image/ic_close.png')}
            />
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
}

export default FirstModal;
