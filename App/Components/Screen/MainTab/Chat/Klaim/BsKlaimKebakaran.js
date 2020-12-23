import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import {convertToRupiah} from '../../../../../Utils/Helper';
import CustomAlert from '../../../../../Utils/CustomAlert';

import {
  View,
  Text,
  BackHandler,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';

class BsKlaimKebakaran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisibleObject: false,
      dataMessage: [],
      dataForm: {},

      noPolisAsuransi: '',
      tglKejadian: moment().format('YYYY-MM-DD'),
      penyebabKerugian: '',
      uraianKronologisKejadian: '',
      hartaBenda: '',
      estimasi_kerugian: '',
      nilaiTuntutan: '',
      isDatePickerVisible: false,
      isAlertForm: true,
    };
  }
  componentDidMount() {
    console.log('componentDidMount Kebakaran');
    this.props.onKlaimKebakaran(this);
  }
  componentWillUnmount() {
    console.log('componentWillUnmount Kebakaran');
    this.props.onKlaimKebakaran(undefined);
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
    this.RBSheet.open();
    // this.renderModal();
  }

  showDatePicker = () => {
    console.log('showDatePicker');
    this.setState({isDatePickerVisible: true});
  };

  handleConfirm = date => {
    var dt = moment(date).format('YYYY-MM-DD');
    var date_now = moment().format('YYYY-MM-DD');

    this.setState({isDatePickerVisible: false});
    var a = moment().diff(moment(date)) < 0;
    console.log('date', a);

    if (a) {
      setTimeout(() => {
        this.customAlert('Perhatian', 'Isi tanggal kejadian dengan benar');
      }, 1000);
    } else {
      this.setState({tglKejadian: dt});
    }
  };
  async nextForm() {
    this.setState({modalVisible: false});
    await this.validationsForm();
    if (this.state.isAlertForm == true) {
      var dataForm = {
        no_polis_asuransi: this.state.noPolisAsuransi,
        tanggal_kejadian: this.state.tglKejadian,
        penyebab_kerugian: this.state.penyebabKerugian,
        kronologis_kejadian: this.state.uraianKronologisKejadian,
        kerusakan: this.state.hartaBenda,
        estimasi_kerugian: this.state.estimasi_kerugian.replace(
          /,.*|[^0-9]/g,
          '',
        ),
      };
      this.props.sendToChat(JSON.stringify(dataForm));
      this.RBSheet.close();
      this.resetForm();
    }

    // this.props.showPolis2(true);
  }
  batal() {
    this.setState({modalVisible: false});
    this.props.messageCancel('batal');
    this.RBSheet.close();
    // this.props.messageCancel('batal');
    this.resetForm();
  }

  resetForm() {
    this.setState({
      noPolisAsuransi: '',
      tglKejadian: moment().format('YYYY-MM-DD'),
      penyebabKerugian: '',
      uraianKronologisKejadian: '',
      hartaBenda: '',
      estimasi_kerugian: '',
      nilaiTuntutan: '',
    });
  }

  customAlert(title, message) {
    CustomAlert.AlertValidation(title, message);
  }

  validationsForm() {
    if (
      this.state.noPolisAsuransi == '' ||
      this.state.noPolisAsuransi == '- Pilih -' ||
      this.state.noPolisAsuransi == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap isi no polis');
    } else if (
      this.state.tglKejadian == '' ||
      this.state.tglKejadian == '- Pilih -' ||
      this.state.tglKejadian == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap isi tanggal kejadian');
    } else if (
      this.state.penyebabKerugian == '' ||
      this.state.penyebabKerugian == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap isi penyebab kerugian');
    } else if (
      this.state.uraianKronologisKejadian == '' ||
      this.state.uraianKronologisKejadian == '- Pilih -' ||
      this.state.uraianKronologisKejadian == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap isi uraian kronologis kejadian');
    } else if (this.state.hartaBenda == '' || this.state.hartaBenda == null) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap isi harta benda ');
    } else if (
      this.state.estimasi_kerugian == '' ||
      this.state.estimasi_kerugian == '- Pilih -' ||
      this.state.estimasi_kerugian == null
    ) {
      this.setState({isAlertForm: false});
      this.customAlert('Perhatian', 'Harap isi estimasi kerugian');
    } else {
      this.setState({isAlertForm: true});
    }
  }

  onValueEstimasiKerugian(value) {
    if (value == null || value == '') {
      value = 0;
    }
    var a = convertToRupiah(value);
    console.log(' a = ', a);
    console.log(' a2 = ', value);

    this.setState({estimasi_kerugian: convertToRupiah(value)});
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
            flex: 10,
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
              backgroundColor: '#3d9acc',
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
              Form Pengajuan Klaim Asuransi Kebakaran{' '}
            </Text>
          </View>
          <ScrollView>
            <View
              style={{
                marginHorizontal: 10,
                marginBottom: 20,
                flex: 1,
                paddingHorizontal: 5,
              }}>
              <Text style={styles.titleInput}>No Polis Asuransi : </Text>
              <TextInput
                style={styles.inputs}
                placeholder="No Polis Asuransi"
                value={this.state.noPolisAsuransi}
                keyboardType={'numeric'}
                onChangeText={noPolisAsuransi =>
                  this.setState({noPolisAsuransi})
                }
              />

              <Text style={styles.titleInput}>Tanggal Kejadian : </Text>
              <TouchableOpacity onPress={() => this.showDatePicker()}>
                <View style={styles.inputs}>
                  <Text
                    placeholder="Pilih Tanggal"
                    value={this.state.tglKejadian}
                    // onChangeText={nik => this.setState({chosenDate})}
                    underlineColorAndroid="transparent">
                    {this.state.tglKejadian == ''
                      ? 'Pilih tanggal'
                      : this.state.tglKejadian}
                  </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.titleInput}>Penyebab Kerugian : </Text>
              <TextInput
                style={styles.inputs}
                placeholder="Penyebab Kerugian"
                value={this.state.penyebabKerugian}
                onChangeText={penyebabKerugian =>
                  this.setState({penyebabKerugian})
                }
              />
              <Text style={styles.titleInput}>
                Uraian Kronologis Kejadian :{' '}
              </Text>
              <TextInput
                numberOfLines={3}
                multiline={true}
                style={styles.inputs}
                placeholder=" Uraian Kronologis Kejadian"
                value={this.state.uraianKronologisKejadian}
                onChangeText={uraianKronologisKejadian =>
                  this.setState({uraianKronologisKejadian})
                }
              />
              <Text style={styles.titleInput}>
                Harta Benda Yang Mengalami Kerusakan :{' '}
              </Text>
              <TextInput
                style={styles.inputs}
                placeholder=" Harta Benda Yang Mengalami Kerusakan"
                value={this.state.hartaBenda}
                onChangeText={hartaBenda => this.setState({hartaBenda})}
              />
              <Text style={styles.titleInput}>Estimasi Kerugian : </Text>
              <TextInput
                style={styles.inputs}
                keyboardType={'numeric'}
                placeholder="Estimasi Kerugian"
                value={this.state.estimasi_kerugian}
                onChangeText={estimasi_kerugian =>
                  this.onValueEstimasiKerugian(estimasi_kerugian)
                }
              />
              <View style={{marginTop: 20, flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => this.batal()}
                  style={styles.btnBatal}>
                  <Text style={styles.textBtn}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.nextForm()}
                  style={styles.btnLanjut}>
                  <Text style={styles.textBtn}>Submit</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={this.state.isDatePickerVisible}
                  mode="date"
                  onConfirm={date => this.handleConfirm(date)}
                  onCancel={() => this.setState({isDatePickerVisible: false})}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </RBSheet>
    );
  }
}

const styles = StyleSheet.create({
  titleInput: {
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 2,
    marginTop: 10,
    fontWeight: 'bold',
    fontFamily: 'HKGrotesk-Regular',
  },
  inputs: {
    color: 'black',
    fontFamily: 'HKGrotesk-Regular',
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
    backgroundColor: '#3d9acc',
    marginTop: 10,
    marginLeft: '5%',
  },
  btnBatal: {
    width: '45%',
    color: '#fff',
    paddingVertical: '4%',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#3d9acc',
    marginTop: 10,
    marginRight: '5%',
  },
  textBtn: {
    color: 'white',
    fontFamily: 'HKGrotesk-Regular',
  },
  picker: {
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    left: -35,
    width: '120%',
  },
});

export default BsKlaimKebakaran;
