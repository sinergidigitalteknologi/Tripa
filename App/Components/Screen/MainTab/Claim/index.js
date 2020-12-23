import React, {Component} from 'react';

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';

import {Container, Content} from 'native-base';

import {Header, Icon} from 'react-native-elements';

import Accordion from 'react-native-collapsible/Accordion';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

class Claim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: [
        {
          id: 2000,
          category: 'Pengajuan Polis',
          date: '08/02/2010',
          type: 'Ansuransi Kebakaran',
          details: {
            type: 'Ansuransi Kebakaran',
            jaminan: 'Tertabrak Kendaraan',
            tertanggung: 'Atas Nama Sendiri',
          },
        },
        {
          id: 2109,
          category: 'Claim Polis',
          date: '08/02/2010',
          type: 'Ansuransi Kebakaran',
          details: {
            type: 'Ansuransi Kebakaran',
            jaminan: 'Kerusakan Kendaraan',
            tertanggung: 'Atas Nama Orang Lain',
          },
        },
        {
          id: 2122,
          category: 'Claim Polis',
          date: '08/02/2010',
          type: 'Ansuransi Travel',
          details: {
            type: 'Paket Silver',
            jaminan: 'Kerusakan Kendaraan',
            tertanggung: 'Atas Nama Orang Lain',
          },
        },
        {
          id: 2109,
          category: 'Claim Polis',
          date: '08/02/2010',
          type: 'Ansuransi Kebakaran',
          details: {
            type: 'Ansuransi Kebakaran',
            jaminan: 'Kerusakan Kendaraan',
            tertanggung: 'Atas Nama Orang Lain',
          },
        },
        {
          id: 2000,
          category: 'Pengajuan Polis',
          date: '08/02/2010',
          type: 'Ansuransi Kebakaran',
          details: {
            type: 'Ansuransi Kebakaran',
            jaminan: 'Tertabrak Kendaraan',
            tertanggung: 'Atas Nama Sendiri',
          },
        },
      ],
    };
  }

  componentDidMount() {}

  _renderHeader = item => {
    return (
      <View style={styles.itemHeader}>
        <View style={styles.itemGrid}>
          <Text style={{color: 'black', fontSize: 14, fontWeight: 'bold'}}>
            {item.category}
          </Text>
          <Text style={styles.labelText}>{item.date}</Text>
        </View>
        <View style={styles.itemGrid}>
          <Text style={{color: 'black', fontSize: 14, fontWeight: 'bold'}}>
            {item.type}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="check" type="feather" color="#0a61c3" size={20} />
            <Text style={styles.successText}>Success</Text>
          </View>
        </View>
      </View>
    );
  };

  _renderContent = item => {
    return (
      <View style={styles.itemContent}>
        <View style={styles.sticky}>
          <Text>
            No.Pesanan: #{item.id} ( {item.category} )
          </Text>
        </View>
        <View style={styles.itemContentGrid}>
          <View style={{flexDirection: 'row', paddingVertical: 8}}>
            <Text style={{width: '30%'}}>Type</Text>
            <Text style={{width: '5%'}}>:</Text>
            <Text>{item.details.type}</Text>
          </View>
          <View style={{flexDirection: 'row', paddingVertical: 8}}>
            <Text style={{width: '30%'}}>Jaminan</Text>
            <Text style={{width: '5%'}}>:</Text>
            <Text>{item.details.jaminan}</Text>
          </View>
          <View style={{flexDirection: 'row', paddingVertical: 8}}>
            <Text style={{width: '30%'}}>Tertanggung</Text>
            <Text style={{width: '5%'}}>:</Text>
            <Text>{item.details.tertanggung}</Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <Container>
        <Header
          centerComponent={{
            text: 'Riwayat Transaksi',
            style: {
              color: '#fff',
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
            },
          }}
          containerStyle={{
            backgroundColor: '#0a61c3',
            height: Platform.OS == 'ios' ? 64 : 56,
            paddingTop: 0,
            borderBottomColor: 'transparent',
          }}
        />

        <Content style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <Accordion
            sections={this.state.order}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            underlayColor="transparent"
          />
        </Content>
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
    width: '100%',
    flex: 1,
    padding: 14,
  },
  sticky: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    alignItems: 'center',
    width: deviceWidth,
  },
  successText: {
    fontSize: 13,
    color: '#0a61c3',
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

export default Claim;
