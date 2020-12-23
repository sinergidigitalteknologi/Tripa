import React, {Component} from 'react';

import {withNavigation} from 'react-navigation';
import RBSheet from 'react-native-raw-bottom-sheet';
import Spinner from 'react-native-loading-spinner-overlay';

import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

import {Container, Content} from 'native-base';
import {Header, Icon} from 'react-native-elements';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

class NotificationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSpinner: false,
      message: '',
      order: [
        {
          ordertype: '0001',
          ordertime: '08/02/2010',
          amount: 200000,
          orderdetail: [
            {
              pedas: 'tidak',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'iya',
              mani: 'iya',
            },
          ],
        },
        {
          ordertype: '0002',
          ordertime: '09/02/2010',
          amount: 100000,
          orderdetail: [
            {
              pedas: 'tidak',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'iya',
              mani: 'iya',
            },
          ],
        },
        {
          ordertype: '0001',
          ordertime: '08/02/2010',
          amount: 200000,
          orderdetail: [
            {
              pedas: 'tidak',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'iya',
              mani: 'iya',
            },
          ],
        },
        {
          ordertype: '0002',
          ordertime: '09/02/2010',
          amount: 100000,
          orderdetail: [
            {
              pedas: 'tidak',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'iya',
              mani: 'iya',
            },
          ],
        },
        {
          ordertype: '0001',
          ordertime: '08/02/2010',
          amount: 200000,
          orderdetail: [
            {
              pedas: 'tidak',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'iya',
              mani: 'iya',
            },
          ],
        },
        {
          ordertype: '0002',
          ordertime: '09/02/2010',
          amount: 100000,
          orderdetail: [
            {
              pedas: 'tidak',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'iya',
              mani: 'iya',
            },
          ],
        },
        {
          ordertype: '0001',
          ordertime: '08/02/2010',
          amount: 200000,
          orderdetail: [
            {
              pedas: 'tidak',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'iya',
              mani: 'iya',
            },
          ],
        },
        {
          ordertype: '0002',
          ordertime: '09/02/2010',
          amount: 100000,
          orderdetail: [
            {
              pedas: 'tidak',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'iya',
              mani: 'iya',
            },
          ],
        },
        {
          ordertype: '0002',
          ordertime: '09/02/2010',
          amount: 100000,
          orderdetail: [
            {
              pedas: 'tidak',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'iya',
              mani: 'iya',
            },
          ],
        },
        {
          ordertype: '0002',
          ordertime: '09/02/2010',
          amount: 100000,
          orderdetail: [
            {
              pedas: 'tidak',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'iya',
              mani: 'iya',
            },
          ],
        },
        {
          ordertype: '0002',
          ordertime: '09/02/2010',
          amount: 100000,
          orderdetail: [
            {
              pedas: 'tidak',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'iya',
              mani: 'iya',
            },
          ],
        },
        {
          ordertype: '0002',
          ordertime: '09/02/2010',
          amount: 100000,
          orderdetail: [
            {
              pedas: 'tidak',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'tidak',
              mani: 'iya',
            },
            {
              pedas: 'iya',
              saus: 'iya',
              mani: 'iya',
            },
          ],
        },
      ],
    };
  }

  componentDidMount() {}

  detailNotif = () => {
    this.props.navigation.navigate('DetailNotification');
  };

  gotoNotification = () => {
    this.props.navigation.navigate('Notification');
  };

  renderBS = () => {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheetLogin = ref;
        }}
        height={200}
        closeOnPressMask={false}
        closeOnPressBack={false}
        duration={250}
        customStyles={{
          container: {
            justifyContent: 'center',
          },
        }}>
        <View style={styles.BSView}>
          <Text style={styles.BSInfo}>Peringatan</Text>
          <Text style={styles.BSMessage}>{this.state.message}</Text>
          <TouchableOpacity
            onPress={() => this.RBSheetLogin.close()}
            style={styles.BSClose}>
            <Text style={styles.BSCloseText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  };

  alertMessage = message => {
    this.setState({
      message: message,
    });
    setTimeout(() => {
      this.RBSheetLogin.open();
    }, 1000);
  };

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
            text: 'Notifications',
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
            elevation: 7,
          }}
        />

        <Spinner visible={this.state.showSpinner} />

        {this.renderBS()}
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
    paddingHorizontal: '10%',
  },
  BSInfo: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 6,
    color: '#0a61c3',
  },
  BSMessage: {
    fontSize: 18,
    marginBottom: 22,
  },
  BSClose: {
    width: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0a61c3',
    borderRadius: 12,
    paddingVertical: 10,
  },
  BSCloseText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0a61c3',
  },
});

export default withNavigation(NotificationPage);
