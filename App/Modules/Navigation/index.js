import * as React from 'react';
import {createAppContainer} from 'react-navigation';
import {View, Image, StyleSheet} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';

// Import Component Between Navigation
import Splash from '../../Components/Screen/Splash';
import Login from '../../Components/Screen/Welcome/Login';
import VerifOtp from '../../Components/Screen/Verif/VerifOtp';
import Register from '../../Components/Screen/Welcome/Register';
import MemberRegister from '../../Components/Screen/MainTab/Profile/MemberRegister';
import ForgotPassword from '../../Components/Screen/Welcome/ForgotPassword';
import VerifEmail from '../../Components/Screen/Verif/VerifEmail';
import NotificationPage from '../../Components/Screen/Notification';
import UpdateProfile from '../../Components/Screen/MainTab/Profile/UpdateProfile';
import UpdateFoto from '../../Components/Screen/MainTab/Profile/UpdateFoto';
import ChangePassword from '../../Components/Screen/MainTab/Profile/ChangePassword';
import DetailNotification from '../../Components/Screen/Notification/DetailNotification';
import Polisku from '../../Components/Screen/Polisku';
import JenisPolis from '../../Components/Screen/Polisku/JenisPolis';
import TambahPolis from '../../Components/Screen/Polisku/TambahPolis';

// Import Component MainTab
import Chat from '../../Components/Screen/MainTab/Chat';
import Home from '../../Components/Screen/MainTab/Home';
import OptionProduct from '../../Components/Screen/MainTab/Home/OptionProduct';
import Inbox from '../../Components/Screen/MainTab/Inbox';
import History from '../../Components/Screen/MainTab/History';
import Profile from '../../Components/Screen/MainTab/Profile';
import DetailProduct from '../../Components/Screen/MainTab/Home/DetailProduct';
import WebviewAll from '../../Components/Screen/WebviewAll';
import Layanan from '../../Components/Screen/MainTab/Home/Layanan';

// const TabBarComponent = props => <View {...props} />;

const MainTab = createMaterialTopTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <View>
            <Image
              style={styles.icon}
              source={
                focused
                  ? require('../../assets/image/ic_home_1.png')
                  : require('../../assets/image/ic_home_2.png')
              }
            />
          </View>
        ),
      },
    },
    Inbox: {
      screen: Inbox,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <View>
            <Image
              style={styles.icon}
              source={
                focused
                  ? require('../../assets/image/ic_inbox_1.png')
                  : require('../../assets/image/ic_inbox_2.png')
              }
            />
          </View>
        ),
      },
    },
    Chat: {
      screen: Chat,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <View style={{position: 'absolute'}}>
            <Image
              style={{
                position: 'absolute',
                // zIndex: 1,
                height: 76,
                width: 80,
                alignContent: 'center',
                marginTop: -21,
                marginLeft: -20,
                marginRight: -20,
                // resizeMode: 'contain',
              }}
              source={
                focused
                  ? require('../../assets/image/ic_chat_1.png')
                  : require('../../assets/image/ic_chat_1.png')
              }
            />
          </View>
        ),
      },
    },
    History: {
      screen: History,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <View>
            <Image
              style={styles.icon}
              source={
                focused
                  ? require('../../assets/image/ic_claim_1.png')
                  : require('../../assets/image/ic_claim_2.png')
              }
            />
          </View>
        ),
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <View>
            <Image
              style={styles.icon}
              source={
                focused
                  ? require('../../assets/image/ic_profile_1.png')
                  : require('../../assets/image/ic_profile_2.png')
              }
            />
          </View>
        ),
      },
    },
  },
  {
    swipeEnabled: false,
    lazy: true,
    // tabBarComponent: props => {
    //   return (
    //     <View
    //       style={{
    //         position: 'absolute',
    //         left: 0,
    //         right: 0,
    //         bottom: 0,
    //       }}>
    //       <TabBarComponent {...props} />
    //     </View>
    //   );
    // },
    tabBarOptions: {
      activeTintColor: '#4f4b4b',
      inactiveTintColor: '#4f4b4b',
      showIcon: true,
      showLabel: false,
      sceneContainerStyle: {
        position: 'absolute',
        backgroundColor: 'green',
      },
      iconStyle: {
        marginBottom: 20,
      },
      style: {
        borderTopWidth: 0,
        width: '100%',
        backgroundColor: '#FF8033',
        elevation: 5,
        zIndex: 1,
        // position: 'absolute',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: Platform.OS == 'android' ? 55 : 65,
      },
      labelStyle: {
        fontSize: 3,
        color: '#02aced',
        marginTop: -2,
      },
      indicatorStyle: {
        backgroundColor: '#FF8033',
      },
    },
    initialRouteName: 'Home',
    tabBarPosition: 'bottom',
  },
);

const AppStackNavigator = createStackNavigator(
  {
    Splash: {
      screen: Splash,
      navigationOptions: {
        headerShown: false,
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        headerShown: false,
      },
    },
    Register: {
      screen: Register,
      navigationOptions: {
        headerShown: false,
      },
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: {
        headerShown: false,
      },
    },
    MainTab: {
      screen: MainTab,
      navigationOptions: {
        headerShown: false,
      },
    },
    VerifOtp: {
      screen: VerifOtp,
      navigationOptions: {
        headerShown: false,
      },
    },
    VerifEmail: {
      screen: VerifEmail,
      navigationOptions: {
        headerShown: false,
      },
    },
    UpdateProfile: {
      screen: UpdateProfile,
      navigationOptions: {
        headerShown: false,
      },
    },

    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: {
        headerShown: false,
      },
    },
    Notification: {
      screen: NotificationPage,
      navigationOptions: {
        headerShown: false,
      },
    },
    DetailNotification: {
      screen: DetailNotification,
      navigationOptions: {
        headerShown: false,
      },
    },
    WebviewAll: {
      screen: WebviewAll,
      navigationOptions: {
        headerShown: false,
      },
    },
    Polisku: {
      screen: Polisku,
      navigationOptions: {
        headerShown: false,
      },
    },
    JenisPolis: {
      screen: JenisPolis,
      navigationOptions: {
        headerShown: false,
      },
    },
    TambahPolis: {
      screen: TambahPolis,
      navigationOptions: {
        headerShown: false,
      },
    },
    Layanan: {
      screen: Layanan,
      navigationOptions: {
        headerShown: false,
      },
    },
    DetailProduct: {
      screen: DetailProduct,
      navigationOptions: {
        headerShown: false,
      },
    },
    MemberRegister: {
      screen: MemberRegister,
      navigationOptions: {
        headerShown: false,
      },
    },
    UpdateFoto: {
      screen: UpdateFoto,
      navigationOptions: {
        headerShown: false,
      },
    },
    OptionProduct: {
      screen: OptionProduct,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: 'Splash',
  },
);

const styles = StyleSheet.create({
  icon: {
    height: 28,
    width: 28,
    marginTop: -3,
    resizeMode: 'contain',
  },
});

export const AppContainer = createAppContainer(AppStackNavigator);
