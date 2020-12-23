import React, {Component} from 'react';

import {WebView} from 'react-native-webview';
import {withNavigation} from 'react-navigation';
import {View, Platform, ActivityIndicator, ScrollView} from 'react-native';
import {Container, Content} from 'native-base';
import {Header} from 'react-native-elements';

class DetailNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      dataDummy:
        '<p><center><img src="https://sheridanmedia.com/wp-content/uploads/2020/03/coronavirus_1-678x381.jpg"></center><h2>Tips menangani Corona</h2><br /><ol><li>Mencuci tangan dengan benar</li><li>Menggunakan masker</li><li>Menjaga daya tahan tubuh</li><li>Tidak pergi ke negara terjangkit</li><li>Menghindari kontak dengan hewan yang berpotensi menularkan coronavirus</li><ol></p>',
    };
  }

  hideSpinner = () => {
    this.setState({visible: false});
  };

  componentDidMount() {
    const item = this.props.navigation.getParam('message');
    this.setState({dataDummy: item});
    // this.setState({dataDummy: ''});
    console.log('detail chat', item);
  }

  render() {
    return (
      <Container>
        <Header
          leftComponent={{
            icon: 'arrow-back',
            color: '#fff',
            onPress: () => this.props.navigation.goBack(),
          }}
          centerComponent={{
            text: 'Detail Notifikasi',
            style: {
              color: '#fff',
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
            },
          }}
          containerStyle={{
            backgroundColor: '#FF8033',
            height: Platform.OS == 'ios' ? 64 : 56,
            paddingTop: 0,
          }}
        />

        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {this.state.visible && (
            <ActivityIndicator
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              size="large"
              color="#FF8033"
            />
          )}
          <WebView
            onLoad={this.hideSpinner}
            // style={{flex: 1}}
            originWhitelist={['*']}
            style={{marginTop: 0}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            // startInLoadingState={true}
            // scalesPageToFit={Platform.OS === 'ios' ? false : true}
            scalesPageToFit={false}
            source={{
              html: this.state.dataDummy,
            }}
          />
        </ScrollView>
      </Container>
    );
  }
}

export default withNavigation(DetailNotification);
