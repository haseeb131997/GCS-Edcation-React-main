import React, {Fragment, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Provider} from 'react-native-paper';
import CustomStatus from '../../../compenents/CustomStatus';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageView from '../../../compenents/ImageView';
import height from '../../../Units/height';
import width from '../../../Units/width';
import Fonts, {Light} from '../../../utility/Fonts';
import ConstData from '../../../utility/ConstData';
import CustomProgress from '../../../compenents/CustomProgress';
import ApiMethod from '../../../api/ApiMethod';
import StorageUtility from '../../../utility/StorageUtility';
import FastImage from 'react-native-fast-image';
import VersionCheck from 'react-native-version-check';

const HomeTabScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [homeData, setHomeData] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused Call any action
      getUserDetail();
    });
  }, []);

  const getUserDetail = async () => {
    var uu = await StorageUtility.getUser();
    console.log(uu);
    console.log(uu.proile_image);
    setUser(uu);
    // var path = await StorageUtility.getProfilePath();
    // setUserPath(path);

    homeDataCall();
  };

  const homeDataCall = () => {
    setShowProgress(true);
    ApiMethod.getHomeData(
      pass => {
        setShowProgress(false);
        console.log('Home Data pass ', pass);
        if (pass.status == 200) {
          setHomeData(pass);
        }
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
      },
      fail => {
        setShowProgress(false);
      },
    );
  };

  return (
    <Provider>
      <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
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
          <View
            style={{
              color: '#000000',
              // fontSize: 4 * width,
              fontFamily: Fonts.SemiBold,
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: 4 * width,
                fontFamily: Fonts.SemiBold,
              }}>
              {'Welcome back'}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: '#16763E',
                  fontSize: 4 * width,
                  fontFamily: Fonts.SemiBold,
                  marginStart: 1 * width,
                }}>
                {`${user?.name}`}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}
              style={{
                marginRight: 5 * width,
                height: 6 * height,
                width: 6 * height,
                padding: width * 2,
                backgroundColor: '#fcf9f9',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3 * height,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,

                elevation: 2,
              }}>
              {homeData && homeData.unread_notification ? (
                <View
                  style={{
                    position: 'absolute',
                    top: -height * 0.5,
                    right: -width * 1,
                    backgroundColor: 'green',
                    borderRadius: width * 3.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      paddingHorizontal: width * 1.5,
                      paddingVertical: width * 0.1,
                      color: '#ffffff',
                      fontSize: 13,
                      fontWeight: '600',
                    }}>
                    {homeData.unread_notification}
                  </Text>
                </View>
              ) : null}
              <Icons name="bell-outline" size={7 * width} color="#008A3D" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <FastImage
                source={
                  user && user.proile_image
                    ? {uri: user.proile_image}
                    : require('../../../assets/images/tab_profile.png')
                }
                style={{
                  height: 6 * height,
                  width: 6 * height,
                  borderRadius: 4 * height,
                  backgroundColor: '#DADADA',
                  resizeMode: user && user.upload_profile ? 'cover' : 'contain',
                  padding: 2 * height,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{backgroundColor: '#FFFFFF', flex: 1, marginTop: 1 * width}}>
          <View style={{width: '100%'}}>
            <View
              style={{
                flex: 1,
                width: '100%',
                marginTop: 1 * width,
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 5 * width,
                // flexDirection: 'row',
                // justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '100%',
                  height: 25 * height,
                  marginTop: 4 * width,
                  // backgroundColor: '#ada',
                }}>
                <FastImage
                  source={require('../../../assets/images/banner1.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 4 * width,
                    resizeMode: 'cover',
                  }}
                />
              </View>

              <View
                style={{
                  width: '100%',
                  marginTop: 3 * width,
                  marginBottom: 3 * width,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  // backgroundColor: '#ada',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('MySyllabus')}
                  style={Styles.halfRoundShape}>
                  <View style={Styles.circle}>
                    <Image
                      source={require('../../../assets/images/syllabus_icon.png')}
                      style={{width: '40%', height: '40%'}}
                    />
                  </View>
                  <Text style={Styles.circleText}>{'My Syllabus'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('MyProgress', {
                      course_name: homeData.course_name,
                    })
                  }
                  style={Styles.halfRoundShape}>
                  <View style={Styles.circle}>
                    <Image
                      source={require('../../../assets/images/attendance_icon.png')}
                      style={{width: '40%', height: '40%'}}
                    />
                  </View>
                  <Text style={Styles.circleText}>{'My Progress'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{flex: 1, height: 1 * width, backgroundColor: '#F5F5F5'}}
            />
            <View
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 5 * width,
                paddingVertical: 3 * width,
              }}>
              <Text style={Styles.headerText}>{'My Syllabus'}</Text>

              {homeData?.course_name ? (
                <View
                  style={[Styles.courseRoundShape, ConstData.ELEVATION_STYLE]}>
                  <FastImage
                    source={
                      homeData?.course_image
                        ? {uri: homeData.course_image}
                        : require('../../../assets/images/course_img.png')
                    }
                    style={{
                      width: '100%',
                      // height: 100 * height,
                      height: '100%', // * height,
                      height: 24 * height,
                      backgroundColor: '#ada',
                      resizeMode: 'cover',
                      borderTopLeftRadius: 3 * width,
                      borderTopRightRadius: 3 * width,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('AssignmentList', {
                        course_name: homeData?.course_name,
                      })
                    }
                    style={{
                      width: '100%',
                      height: 7 * height,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 5 * width,
                      flexDirection: 'row',
                    }}>
                    <Text style={Styles.courseText} numberOfLines={2}>
                      {`${homeData?.course_name}`}
                    </Text>
                    <AntDesign
                      name="arrowright"
                      size={5 * width}
                      color="#16763E"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={Styles.courseRoundShape}>
                  <Text style={Styles.courseText}>{`No Course Found`}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>

      <CustomProgress show={showProgress} />
    </Provider>
  );
};

const Styles = StyleSheet.create({
  circle: {
    width: 6 * height,
    height: 6 * height,
    borderRadius: 5 * height,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    color: '#000000',
    fontSize: 4 * width,
    fontFamily: Fonts.Medium,
    marginStart: 2 * width,
  },
  headerText: {
    color: '#000000',
    fontSize: 4.4 * width,
    fontFamily: Fonts.SemiBold,
    // marginTop: 2 * width,
  },
  courseText: {
    flex: 1,
    color: '#000000',
    fontSize: 4 * width,
    fontFamily: Fonts.SemiBold,
  },
  halfRoundShape: {
    width: '48%',
    height: 9 * height,
    backgroundColor: '#FCF2E2',
    borderRadius: 3 * width,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  courseRoundShape: {
    width: '100%',
    // height: '100%',
    // flex: 1,
    // height: 9 * height,
    marginTop: 2 * width,
    backgroundColor: '#FFFFFF',
    borderRadius: 3 * width,
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
  },
});

export default HomeTabScreen;
