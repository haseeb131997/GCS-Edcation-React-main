import React, {Fragment, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Provider} from 'react-native-paper';
import CustomStatus from '../../../compenents/CustomStatus';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageView from '../../../compenents/ImageView';
import width from '../../../Units/width';
import ConstData from '../../../utility/ConstData';
import Fonts from '../../../utility/Fonts';
import ToastUtility from '../../../utility/ToastUtility';
import StorageUtility from '../../../utility/StorageUtility';
import ApiMethod from '../../../api/ApiMethod';
import FastImage from 'react-native-fast-image';
import CustomProgress from '../../../compenents/CustomProgress';
import {CommonActions} from '@react-navigation/native';

const ProfileTabScreen = ({navigation}) => {
  const [userData, setUser] = useState(null);
  const [userPath, setUserPath] = useState('');
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    setShowProgress(false);
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused Call any action
      getUserDetail();
    });
  }, []);

  const getUserDetail = async () => {
    var uu = await StorageUtility.getUser();
    console.log(uu);
    setUser(uu);
    // var path = await StorageUtility.getProfilePath();
    // setUserPath(path);

    // getProfile();
  };

  const getProfile = () => {
    // ApiMethod.getTPProfile(
    //   async pass => {
    //     console.log(pass);
    //     setShowProgress(false);
    //     if (pass.status == 200) {
    //       var data = pass.data;
    //       data.upload_profile = pass.profile_image_url + data.upload_profile;
    //       await StorageUtility.storeUser(data);
    //       setUserPath(pass.trophy_image_url);
    //     }
    //   },
    //   fail => {
    //     console.log(fail);
    //     setShowProgress(false);
    //     ToastUtility.showToast('Some Error Occurred.');
    //   },
    // );
  };

  const onLogoutPress = () => {
    Alert.alert('Warning!', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        // style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          await StorageUtility.logout();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'AuthStack'}],
            }),
          );
        },
      },
    ]);
  };

  const deleteAccount = () => {
    Alert.alert('Warning!', 'Are you sure you want to delete your account?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          setTimeout(() => {
            setShowProgress(false);
            Alert.alert(
              'Success!',
              'Your request has been submitted. Our team will contact you soon.',
            );
          }, 2000);
          setShowProgress(true);
        },
      },
    ]);
  };

  return (
    <Provider>
      <View style={{flex: 1}}>
        <CustomStatus trans={false} isDark={true} color="#FFFFFF" />
        <View
          style={{
            width: '100%',
            height: 8 * height,
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 6 * width,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#000000',
              fontFamily: Fonts.SemiBold,
              fontSize: 4.5 * width,
            }}>
            {'Profile'}
          </Text>
        </View>

        <View
          style={{width: '100%', height: 1 * width, backgroundColor: '#F5F5F5'}}
        />

        {userData && (
          <View
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: '#FFFFFF',
              paddingVertical: 3 * width,
              alignItems: 'center',
            }}>
            <FastImage
              source={
                userData.proile_image
                  ? {uri: userData.proile_image}
                  : require('../../../assets/images/welcome_img.png')
              }
              style={{
                width: 30 * width,
                height: 30 * width,
                borderRadius: 20 * width,
                backgroundColor: '#F1F1F1',
                marginTop: 2 * width,
              }}
            />
            <Text
              style={{
                color: '#000000',
                fontFamily: Fonts.SemiBold,
                fontSize: 4 * width,
                marginTop: 3 * width,
              }}>
              {userData?.name}
            </Text>

            <View
              style={[
                {
                  width: '90%',
                  paddingHorizontal: 4 * width,
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 1 * height,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 1 * width,
                  marginTop: 2 * height,
                },
                ConstData.ELEVATION_STYLE,
              ]}>
              <Feather name="user" size={6 * width} color={'#008A3D'} />
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 4 * width,
                  paddingVertical: 1 * width,
                }}>
                <Text
                  style={{
                    color: '#868686',
                    fontSize: 3 * width,
                    fontFamily: Fonts.Medium,
                  }}>
                  Name
                </Text>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 3.4 * width,
                    fontFamily: Fonts.Medium,
                  }}>
                  {userData?.name}
                </Text>
              </View>
            </View>

            <View
              style={[
                {
                  width: '90%',
                  paddingHorizontal: 4 * width,
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 1 * height,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 1 * width,
                  marginTop: 2 * height,
                },
                ConstData.ELEVATION_STYLE,
              ]}>
              <Feather name="book" size={6 * width} color={'#008A3D'} />
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 4 * width,
                  paddingVertical: 1 * width,
                }}>
                <Text
                  style={{
                    color: '#868686',
                    fontSize: 3 * width,
                    fontFamily: Fonts.Medium,
                  }}>
                  Class
                </Text>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 3.4 * width,
                    fontFamily: Fonts.Medium,
                  }}>
                  {userData?.class}
                </Text>
              </View>
            </View>

            <View
              style={[
                {
                  width: '90%',
                  paddingHorizontal: 4 * width,
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 1 * height,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 1 * width,
                  marginTop: 2 * height,
                },
                ConstData.ELEVATION_STYLE,
              ]}>
              <Feather name="phone-call" size={6 * width} color={'#008A3D'} />
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 4 * width,
                  paddingVertical: 1 * width,
                }}>
                <Text
                  style={{
                    color: '#868686',
                    fontSize: 3 * width,
                    fontFamily: Fonts.Medium,
                  }}>
                  Number
                </Text>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 3.4 * width,
                    fontFamily: Fonts.Medium,
                  }}>
                  {userData?.mobile}
                </Text>
              </View>
            </View>

            <View
              style={[
                {
                  width: '90%',
                  paddingHorizontal: 4 * width,
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 1 * height,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 1 * width,
                  marginTop: 2 * height,
                },
                ConstData.ELEVATION_STYLE,
              ]}>
              <Feather name="mail" size={6 * width} color={'#008A3D'} />
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 4 * width,
                  paddingVertical: 1 * width,
                }}>
                <Text
                  style={{
                    color: '#868686',
                    fontSize: 3 * width,
                    fontFamily: Fonts.Medium,
                  }}>
                  Email
                </Text>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 3.4 * width,
                    fontFamily: Fonts.Medium,
                  }}>
                  {userData?.email}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '88%',
                flexDirection: 'row',
                paddingVertical: 1 * height,
                marginTop: 2 * height,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  onLogoutPress();
                }}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 1 * height,
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name={'logout'}
                  size={6 * width}
                  color="#E92020"
                />
                <Text
                  style={{
                    textAlignVertical: 'center',
                    color: '#E92020',
                    fontSize: 4 * width,
                    fontFamily: Fonts.Medium,
                    paddingHorizontal: 2 * width,
                  }}>
                  LOGOUT
                </Text>
              </TouchableOpacity>

              {Platform.OS == 'ios' && (
                <TouchableOpacity
                  onPress={() => {
                    deleteAccount();
                  }}
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 1 * height,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      textAlignVertical: 'center',
                      color: '#121212',
                      fontSize: 4 * width,
                      fontFamily: Fonts.Regular,
                      paddingHorizontal: 2 * width,
                    }}>
                    Delete Account
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>

      <CustomProgress show={showProgress} />
    </Provider>
  );
};

const Styles = StyleSheet.create({
  headerText: {
    color: '#000000',
    fontSize: 4.4 * width,
    fontFamily: Fonts.SemiBold,
    // marginTop: 2 * width,
  },

  headerText1: {
    color: '#000000',
    fontSize: 3.8 * width,
    fontFamily: Fonts.Medium,
    // marginTop: 2 * width,
  },
  weekText: {
    color: '#000000',
    fontSize: 3.4 * width,
    fontFamily: Fonts.Medium,
    marginStart: 3 * width,
    flex: 1,
  },
  weekText1: {
    color: '#000000',
    fontSize: 3.4 * width,
    fontFamily: Fonts.Regular,
    marginTop: 1 * width,
  },
});

export default ProfileTabScreen;
