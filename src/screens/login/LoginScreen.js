import React, {Fragment, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {Provider} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import ApiMethod from '../../api/ApiMethod';
import CustomButton from '../../compenents/CustomButton';
import CustomProgress from '../../compenents/CustomProgress';
import ImageView from '../../compenents/ImageView';
import height from '../../Units/height';
import width from '../../Units/width';
import ColorCode from '../../utility/ColorCode';
import ConstData from '../../utility/ConstData';
import Fonts from '../../utility/Fonts';
import StorageUtility from '../../utility/StorageUtility';
import ToastUtility from '../../utility/ToastUtility';
import VersionCheck from 'react-native-version-check';

const LoginScreen = ({navigation}) => {
  const [userName, setUserName] = useState(''); //abhishek@techmavesoftware.com
  const [password, setPassword] = useState(''); //12345
  const [passwordVisible, setPasswordVisible] = useState(true);

  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    setShowProgress(false);
    
    setTimeout(() => {
      VersionCheck.needUpdate().then(async res => {
        console.log(res); // true
        if (res.isNeeded) {
          Alert.alert(
            'Update Avalable',
            'A new version is available. Please update your app to use latest features',
            [
              {
                text: 'Update',
                onPress: () => {
                  Linking.openURL(res.storeUrl); // open store if update is needed.
                },
              },
            ],
          );
        }
      });
    }, 1500);
  }, []);

  const login = () => {
    if (userName.trim() == '') {
      ToastUtility.showToast('Enter Username');
    } else if (password.trim() == '') {
      ToastUtility.showToast('Enter Password');
    } else {
      tpLogin();
    }
  };

  const tpLogin = () => {
    setShowProgress(true);
    var formData = new FormData();
    formData.append('email', userName.trim());
    formData.append('password', password.trim());

    ApiMethod.login(
      formData,
      async pass => {
        console.log(pass);
        if (pass.access_token) {
          await StorageUtility.storeJWTToken(pass.access_token);
          getProfile();
        } else {
          setShowProgress(false);
          if (pass.response) {
            ToastUtility.showToast(ConstData.getErrorMsg(pass.response));
          } else {
            ToastUtility.showToast(pass.message);
          }
        }
      },
      fail => {
        console.log(fail);
        setShowProgress(false);
        ToastUtility.showToast('Some Error Occurred!');
      },
    );
  };

  const getProfile = () => {
    setShowProgress(true);

    ApiMethod.getProfile(
      async pass => {
        console.log(pass);
        setShowProgress(false);
        if (pass.status == 200) {
          var data = pass.data;
          data.proile_image = pass.proile_image;
          await StorageUtility.storeUser(data);
          await StorageUtility.setSession(true);
          navigation.navigate('Waiting');
        }
      },
      fail => {
        console.log(fail);
        setShowProgress(false);
        ToastUtility.showToast('Some Error Occurred.');
      },
    );
  };

  return (
    <Provider>
      <StatusBar
        animated={true}
        translucent={true}
        backgroundColor="#FFFFFF00"
        barStyle={'dark-content'} // : 'dark-content'
        showHideTransition={'fade'}
      />
      <ImageView>
        <KeyboardAwareScrollView style={{flex: 1, width: '100%'}}>
          <View
            style={{
              // flex: 1,
              width: '100%',
              height: 100 * height,
              alignItems: 'center',
            }}>
            <View style={{width: '90%'}}>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 5.5 * width,
                  fontFamily: Fonts.SemiBold,
                  marginTop: 10 * height,
                }}>{`Hello! Welcome back`}</Text>

              <Text
                style={{
                  fontSize: 4 * width,
                  fontFamily: Fonts.SemiBold,
                  marginTop: 2 * height,
                  color: ColorCode.primary,
                }}>
                {'Login'}
              </Text>
              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  marginTop: 1 * height,
                  color: '#4B4B4B',
                }}>
                {'Please enter your email and password below'}
              </Text>
            </View>

            <View
              style={{
                marginTop: 4 * height,
                width: '100%',
                paddingHorizontal: 6 * width,
              }}>
              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Medium,
                  color: '#000000',
                }}>
                {'Email'}
              </Text>

              <TextInput
                style={{
                  width: '100%',
                  height: 7 * height,
                  color: '#000000',
                  paddingHorizontal: 4 * width,
                  marginTop: 1 * height,
                  fontSize: 3.4 * width,
                  fontFamily: Fonts.Medium,
                  borderRadius: 3 * width,
                  borderColor: '#9C9A9A',
                  borderWidth: 1,
                }}
                placeholderTextColor="#A4A4A4"
                placeholder=" Enter Email"
                numberOfLines={1}
                keyboardType="default"
                autoCapitalize="none"
                value={userName}
                onChangeText={y => setUserName(y)}
              />

              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Medium,
                  color: '#000000',
                  marginTop: 2 * height,
                }}>
                {'Password'}
              </Text>

              <View
                style={{
                  width: '100%',
                  height: 7 * height,
                  marginTop: 1 * height,
                  borderRadius: 3 * width,
                  borderColor: '#9C9A9A',
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TextInput
                  style={{
                    //width: '100%',
                    flex: 1,
                    height: 7 * height,
                    paddingHorizontal: 4 * width,
                    color: '#000000',
                    fontSize: 3.4 * width,
                    fontFamily: Fonts.Medium,
                  }}
                  placeholderTextColor="#A4A4A4"
                  placeholder="Enter Password"
                  numberOfLines={1}
                  keyboardType="default"
                  autoCapitalize="none"
                  secureTextEntry={passwordVisible}
                  value={password}
                  onChangeText={y => setPassword(y)}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginEnd: 3 * width,
                    width: 8 * width,
                    height: 8 * width,
                  }}>
                  <Entypo
                    name={passwordVisible ? 'eye-with-line' : 'eye'}
                    size={4.2 * width}
                    color="#ADA4A5"
                  />
                </TouchableOpacity>
              </View>

              <CustomButton
                btnText="Log In"
                colors={['#008A3D', '#008A3D']}
                enable={true}
                btnStyle={{
                  width: '100%',
                  marginTop: 6 * height,
                  marginBottom: 2 * height,
                  elevation: 1 * width,
                }}
                btnTextStyle={{
                  //fontWeight: '700',
                  fontFamily: Fonts.Regular,
                  fontSize: 4 * width,
                }}
                onPress={() => {
                  login();
                  // navigation.navigate('Intro');
                }}
              />

              {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: 10 * width,
                  height: 1,
                  backgroundColor: '#656565',
                }}
              />
              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  color: '#656565',
                  paddingHorizontal: 1 * height,
                }}>
                {'or log in with'}
              </Text>
              <View
                style={{
                  width: 10 * width,
                  height: 1,
                  backgroundColor: '#656565',
                }}
              />
            </View> */}
            </View>

            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                bottom: 2 * height,
              }}>
              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Medium,
                  color: '#2F2F2F',
                }}>
                {'New User?'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Signup');
                }}
                style={{margin: 1 * width}}>
                <Text
                  style={{
                    fontSize: 3 * width,
                    fontFamily: Fonts.Medium,
                    color: '#116939',
                  }}>
                  {'Create an account now'}
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </KeyboardAwareScrollView>
      </ImageView>

      <CustomProgress show={showProgress} />
    </Provider>
  );
};

export default LoginScreen;
