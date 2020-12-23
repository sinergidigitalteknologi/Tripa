import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {withNavigation} from 'react-navigation';
import {View, ScrollView, Platform, ActivityIndicator} from 'react-native';
import {Container, Content} from 'native-base';
import {Header} from 'react-native-elements';

class WebviewAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      visible: true,
      dataDummy:
        '<p><center><img src="https://sheridanmedia.com/wp-content/uploads/2020/03/coronavirus_1-678x381.jpg"></center><h2>Tips menangani Corona</h2><br /><ol><li>Mencuci tangan dengan benar</li><li>Menggunakan masker</li><li>Menjaga daya tahan tubuh</li><li>Tidak pergi ke negara terjangkit</li><li>Menghindari kontak dengan hewan yang berpotensi menularkan coronavirus</li><ol></p>',
    };
  }

  hideSpinner = () => {
    this.setState({visible: false});
  };

  async componentDidMount() {
    await this.getDataUrl();
  }

  async getDataUrl() {
    var dataGrid = this.props.navigation.getParam('url');
    await this.setState({url: dataGrid});
  }

  render() {
    return (
      <Container>
        <Header
          leftComponent={{
            icon: 'arrow-back',
            color: '#005CE6',
            onPress: () => this.props.navigation.goBack(),
          }}
          centerComponent={{
            text: 'Tripa',
            style: {
              color: '#005CE6',
              fontSize: 16,
              fontWeight: 'bold',
              justifyContent: 'flex-start',
            },
          }}
          containerStyle={{
            backgroundColor: '#fff',
            height: Platform.OS == 'ios' ? 64 : 56,
            paddingTop: 0,
            // borderBottomColor: '#000',
            elevation: 7,
          }}
        />
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <WebView
            style={{marginTop: 0}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            source={{
              uri: this.state.url,
            }}
          />
        </ScrollView>
      </Container>
    );
  }
}

export default withNavigation(WebviewAll);
