import React, {Fragment, useEffect, useState} from 'react';
import {Image, ImageBackground, StatusBar, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {Modal, Provider} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
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

const LoginAsScreen = ({navigation}) => {
  const [loginType, setLoginType] = useState(0);
  const [userName, setUserName] = useState(''); //aims@gmail.com
  const [password, setPassword] = useState(''); //123456
  const [passwordVisible, setPasswordVisible] = useState(true);

  const [showProgress, setShowProgress] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setShowProgress(false);
  }, []);

  const showSuccessPopup = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigation.navigate('TabStack');  
    }, 1000);
  }
  const login = () => {
    if (userName.trim() == '') {
      ToastUtility.showToast('Enter Username');
    } else if (password.trim() == '') {
      ToastUtility.showToast('Enter Password');
    } else {
      var formData = new FormData();
      formData.append('email', userName.trim());
      formData.append('password', password.trim());

      if (loginType == 1) {
        hLogin(formData);
      } else if (loginType == 3) {
        tpLogin(formData);
      }
    }
  };

  const hLogin = form => {
    setShowProgress(true);

    ApiMethod.hospitalLogin(
      form,
      async pass => {
        console.log(pass);
        if (pass.status == 200) {
          await StorageUtility.storeJWTToken(pass.token);
          getProfile();
        } else {
          setShowProgress(false);
          if (pass.response){
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

  const tpLogin = form => {
    setShowProgress(true);

    ApiMethod.tpLogin(
      form,
      async pass => {
        console.log(pass);
        if (pass.status == 200) {
          await StorageUtility.storeJWTToken(pass.token);
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
    // var formData = new FormData();
    
    if (loginType == 1){
      // formData.append('email', userName.trim());
      ApiMethod.getHProfile(
        async pass => {
          console.log(pass);
          setShowProgress(false);
          if (pass.status == 200) {
            await StorageUtility.storeUser(pass.data);
            await StorageUtility.storeProfilePath(pass.image_url);
            await StorageUtility.setSession(true);
            await StorageUtility.storeUserType(loginType);
            navigation.navigate('Waiting');
          }
        },
        fail => {
          console.log(fail);
          setShowProgress(false);
          ToastUtility.showToast('Some Error Occurred.');
        },
      );
    } else {
      
      ApiMethod.getTPProfile(
        async pass => {
          console.log(pass);
          setShowProgress(false);
          if (pass.status == 200) {
            var data = pass.data;
            data.upload_profile = pass.profile_image_url + data.upload_profile;
            await StorageUtility.storeUser(data);
            await StorageUtility.storeProfilePath(pass.profile_image_url);
            await StorageUtility.setSession(true);
            await StorageUtility.storeUserType(loginType);
            navigation.navigate('Waiting');
          }
        },
        fail => {
          console.log(fail);
          setShowProgress(false);
          ToastUtility.showToast('Some Error Occurred.');
        },
      );
    }
  }

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
                }}>{`Help us set\nyour account`}</Text>

              <Text
                style={{
                  fontSize: 3 * width,
                  fontFamily: Fonts.Regular,
                  marginTop: 2 * height,
                  color: '#4B4B4B',
                }}>
                {'Please tell us your schedule\npreference'}
              </Text>
            </View>

            <View
              style={{
                marginTop: 4 * height,
                width: '100%',
                flex: 1,
                paddingHorizontal: 6 * width,
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => setLoginType(1)}
                  style={{
                    width: '45%',
                    height: 45 * width,
                    borderRadius: 3 * width,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    borderColor: loginType == 1 ? '#16763E' : '#FFFFFF',
                  }}>
                  <Image
                    source={require('../../assets/images/type_virtual.png')}
                    style={{
                      width: 12 * width,
                      height: 12 * width,
                      resizeMode: 'contain',
                    }}
                  />

                  <Image
                    source={
                      loginType == 1
                        ? require('../../assets/images/type_select.png')
                        : require('../../assets/images/type_unselect.png')
                    }
                    style={{
                      width: 5.6 * width,
                      height: 5.6 * width,
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      top: 3 * width,
                      start: 3 * width,
                    }}
                  />

                  <Text
                    style={{
                      fontFamily: Fonts.SemiBold,
                      fontSize: 3.4 * width,
                      color: '#000000',
                      position: 'absolute',
                      bottom: 8 * width,
                    }}>
                    Virtual
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setLoginType(2)}
                  style={{
                    width: '45%',
                    height: 45 * width,
                    borderRadius: 3 * width,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    borderColor: loginType == 2 ? '#16763E' : '#FFFFFF',
                  }}>
                  <Image
                    source={require('../../assets/images/type_in_person.png')}
                    style={{
                      width: 12 * width,
                      height: 12 * width,
                      resizeMode: 'contain',
                    }}
                  />

                  <Image
                    source={
                      loginType == 2
                        ? require('../../assets/images/type_select.png')
                        : require('../../assets/images/type_unselect.png')
                    }
                    style={{
                      width: 5.6 * width,
                      height: 5.6 * width,
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      top: 3 * width,
                      start: 3 * width,
                    }}
                  />

                  <Text
                    style={{
                      fontFamily: Fonts.SemiBold,
                      fontSize: 3.4 * width,
                      color: '#000000',
                      position: 'absolute',
                      bottom: 8 * width,
                    }}>
                    In Person
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                bottom: 2 * height,
              }}>
              <CustomButton
                btnText="Select"
                colors={['#008A3D', '#008A3D']}
                enable={true}
                btnStyle={{
                  width: '90%',
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
                  
                  showSuccessPopup();
                  // login();
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ImageView>

      <Modal visible={showSuccess} onDismiss={() => setShowSuccess(false)}>
        <View
          style={{
            width: '80%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 4 * height,
            backgroundColor: '#FFFFFF',
            borderRadius: 4 * width,
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: 7 * height,
              height: 7 * height,
              borderRadius: 5 * height,
              backgroundColor: '#008A3D',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Feather name="check" size={8 * width} color="#FFFFFF" />
          </View>

          <Text
            style={{
              fontFamily: Fonts.Medium,
              fontSize: 3.4 * width,
              color: '#000000',
              marginTop: 3 * height,
            }}>
            {'Schedule Set to Virtual!'}
          </Text>
        </View>
      </Modal>

      <CustomProgress show={showProgress} />
    </Provider>
  );
};

export default LoginAsScreen;
