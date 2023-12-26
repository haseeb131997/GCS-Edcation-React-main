import React, {Fragment, useEffect, useState} from 'react';
import {
  FlatList,
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
import LinearGradient from 'react-native-linear-gradient';
import {Provider} from 'react-native-paper';
import ApiMethod from '../../api/ApiMethod';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../compenents/CustomButton';
import CustomProgress from '../../compenents/CustomProgress';
import CustomStatus from '../../compenents/CustomStatus';
import ImageView from '../../compenents/ImageView';
import height from '../../Units/height';
import width from '../../Units/width';
import Fonts from '../../utility/Fonts';
import StorageUtility from '../../utility/StorageUtility';
import ToastUtility from '../../utility/ToastUtility';
import {useFocusEffect} from '@react-navigation/native';

const dayMap = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};

const MySyllabusScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [virtualClassCalendar, setVirtualClassCalendar] = useState(0);
  const [allChapterList, setAllChapterList] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [chapterDayWise, setChapterDayWise] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(1);

  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    getUserDetail();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // The screen is focused Call any action
      apiCall(selectedWeek);
    }, [selectedWeek]),
  );

  const getUserDetail = async () => {
    var uu = await StorageUtility.getUser();
    setUser(uu);

    if (uu.type == 'virtual') {
      setVirtualClassCalendar(1);
    } else {
      setVirtualClassCalendar(2);
    }
    // var path = await StorageUtility.getProfilePath();
    // setUserPath(path);
  };

  const apiCall = week => {
    setShowProgress(true);
    ApiMethod.mySyllabus(
      `week=${week}`,
      pass => {
        setShowProgress(false);

        if (pass.status == 200) {
          console.log('===%%%%%%%%%chapetpass', pass.data);
          // setDataList(pass.data);
          let tt = {};
          let days = [];
          let chapList = [];
          pass.data.map(item => {
            if (!chapList.some(it => it.chapter_name == item.chapter_name)) {
              chapList.push(item);
            }

            if (tt[item.day]) {
              let t1 = tt[item.day];
              t1.push(item);
              tt[item.day] = t1;
            } else {
              let t1 = [];
              t1.push(item);
              tt[item.day] = t1;
              days.push(item.day);
            }
          });

          setChapterList(days);
          setChapterDayWise(tt);
          console.log('tt', tt);
          // console.log('days', days);

          // console.log('chapList', chapList);
          setAllChapterList(chapList);
        } else {
          setChapterList([]);
          setChapterDayWise([]);
          setShowProgress(false);
          setAllChapterList([]);
        }
      },
      fail => {
        setShowProgress(false);
        setAllChapterList([]);
        setChapterList([]);
        setChapterDayWise([]);
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
        <CustomStatus trans={true} isDark={true} color="#FFFFFF00" />
        <View
          style={{
            width: '100%',
            height: 10 * height,
            // backgroundColor: '#FFFFFF',
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
            {'Schedule'}
          </Text>

          <TouchableOpacity
            onPress={navigation.goBack}
            style={{
              width: 9 * width,
              height: 9 * width,
              margin: 2 * width,
              borderRadius: 2 * width,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#EFFFF6',
            }}>
            <Ionicons name="chevron-back" size={5 * width} color="#000000" />
          </TouchableOpacity>
        </View>
        {/* <View
          style={{width: '100%', height: 1 * width, backgroundColor: '#F5F5F5'}}
        /> */}
        {virtualClassCalendar > 0 && (
          <TouchableOpacity
            onPress={() => {
              console.log('sdsutyruity');
            }}
            style={{
              width: '92%',
              height: 10 * height,
              borderRadius: 3 * width,
              backgroundColor: '#FFFFFF',
            }}>
            {virtualClassCalendar == 1 ? (
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 3 * width,
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    width: 6 * height,
                    height: 6 * height,
                    borderRadius: 5 * height,
                    backgroundColor: '#16763E',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('../../assets/images/syllabus_icon.png')}
                    style={{
                      width: '40%',
                      height: '40%',
                      tintColor: '#FFF',
                      resizeMode: 'center',
                      // alignSelf: 'center',
                    }}
                  />
                </View>

                {user?.class && (
                  <Text
                    style={{
                      flex: 1,
                      color: '#000000',
                      fontFamily: Fonts.SemiBold,
                      marginStart: 4 * width,
                      fontSize: 4.4 * width,
                      width: width * 40,
                    }}>
                    {user.class.length > 100
                      ? `${user.class.substring(0, 80)}...`
                      : user.class}
                  </Text>
                )}
              </View>
            ) : virtualClassCalendar == 2 ? (
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 3 * width,
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    width: 6 * height,
                    height: 6 * height,
                    borderRadius: 5 * height,
                    backgroundColor: '#16763E',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('../../assets/images/syllabus_icon.png')}
                    style={{
                      width: '40%',
                      height: '40%',
                      tintColor: '#FFF',
                      resizeMode: 'center',
                      // alignSelf: 'center',
                    }}
                  />
                </View>

                {user?.class && (
                  <Text
                    style={{
                      flex: 1,
                      color: '#000000',
                      fontFamily: Fonts.SemiBold,
                      marginStart: 4 * width,
                      fontSize: 4.4 * width,
                      width: width * 40,
                    }}>
                    {user.class.length > 100
                      ? `${user.class.substring(0, 80)}...`
                      : user.class}
                  </Text>
                )}
              </View>
            ) : null}
          </TouchableOpacity>
        )}

        <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
          <View style={{width: '94%'}}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                width: '100%',
                marginTop: 4 * width,
                marginBottom: 3 * width,
              }}>
              <View style={{flexDirection: 'row', width: '100%'}}>
                {[1, 2, 3, 4, 5, 6].map(item => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedWeek(item);
                      apiCall(item);
                    }}
                    style={{
                      width: 15 * width,
                      height: 17 * width,
                      backgroundColor:
                        item == selectedWeek ? '#D69C37' : '#FFF0',
                      borderRadius: 2 * width,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: item == selectedWeek ? 0 : 1,
                      borderColor: item == selectedWeek ? '#0000' : '#16763E',
                      marginHorizontal: 1 * width,
                    }}>
                    <Text
                      style={
                        item == selectedWeek
                          ? Styles.weekTextSelected
                          : Styles.weekText
                      }>{`Week ${item}`}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {allChapterList.length > 0 ? (
            virtualClassCalendar == 1 ? (
              // Virtiual
              <View style={{flex: 1, width: '100%'}}>
                <FlatList
                  data={chapterList}
                  style={{
                    paddingHorizontal: 4 * width,
                    // backgroundColor: '#aad',
                  }}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        key={index}
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginVertical: 2 * width,
                        }}>
                        <Text
                          style={{
                            width: '26%',
                            fontFamily: Fonts.Medium,
                            fontSize: 3.6 * width,
                            color: '#000000',
                          }}>
                          {`${dayMap[item]}`}
                        </Text>

                        <View
                          style={{
                            flex: 1,
                            width: '100%',
                            height: 12 * height,
                            borderRadius: 3 * width,
                            backgroundColor: '#FFFFFF',
                            flexDirection: 'row',
                          }}>
                          <View
                            style={{
                              height: '100%',
                              width: 3 * width,
                              overflow: 'hidden',
                            }}>
                            <View
                              style={{
                                flex: 1,
                                width: 6 * width,
                                borderRadius: 3 * width,
                                backgroundColor: '#16763E',
                              }}
                            />
                          </View>
                          <View
                            style={{
                              flex: 1,
                              backgroundColor: '#F4FFF8',
                              borderTopEndRadius: 3 * width,
                              borderBottomEndRadius: 3 * width,
                              paddingHorizontal: 3 * width,
                              paddingVertical: 2 * width,
                            }}>
                            <View
                              style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <Text
                                style={{
                                  fontFamily: Fonts.Medium,
                                  fontSize: 4 * width,
                                  color: '#000000',
                                }}>
                                {`DAY ${item}`}
                              </Text>
                            </View>

                            <Text
                              numberOfLines={1}
                              style={{
                                flex: 1,
                                fontFamily: Fonts.Medium,
                                fontSize: 3 * width,
                                color: '#666666',
                                marginTop: 1 * width,
                              }}>
                              {chapterDayWise &&
                                chapterDayWise[item] &&
                                `${chapterDayWise[item][0].description}`}
                            </Text>

                            <TouchableOpacity
                              onPress={() => {
                                console.log(
                                  'chapterDayWise =11=>',
                                  chapterDayWise[item],
                                );
                                navigation.navigate('SyllabusDetail', {
                                  day: dayMap[item],
                                  dayWiseItem: chapterDayWise[item],
                                  allChapterList: allChapterList,
                                  // chapterList: chapterList,
                                  // chapterDayWise: chapterDayWise,
                                  selectedWeek: selectedWeek,
                                });
                              }}
                              style={{
                                alignSelf: 'flex-end',
                                backgroundColor: '#D1FFE4',
                                paddingHorizontal: 3 * width,
                                paddingVertical: 1 * width,
                                borderRadius: 4 * width,
                              }}>
                              <Ionicons
                                name="arrow-forward-outline"
                                size={5 * width}
                                color="#16763E"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            ) : virtualClassCalendar == 2 ? (
              // In Person
              <View style={{flex: 1, width: '100%'}}>
                <FlatList
                  data={allChapterList}
                  style={{paddingHorizontal: 4 * width}}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        key={index}
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginVertical: 2 * width,
                        }}>
                        <View
                          style={{
                            flex: 1,
                            width: '100%',
                            height: 12 * height,
                            borderRadius: 3 * width,
                            backgroundColor: '#FFFFFF',
                            flexDirection: 'row',
                          }}>
                          <View
                            style={{
                              height: '100%',
                              width: 3 * width,
                              overflow: 'hidden',
                            }}>
                            <View
                              style={{
                                flex: 1,
                                width: 6 * width,
                                borderRadius: 3 * width,
                                backgroundColor: '#16763E',
                              }}
                            />
                          </View>
                          <View
                            style={{
                              flex: 1,
                              backgroundColor: '#F4FFF8',
                              borderTopEndRadius: 3 * width,
                              borderBottomEndRadius: 3 * width,
                              paddingHorizontal: 3 * width,
                              paddingVertical: 2 * width,
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                // width: '26%',
                                fontFamily: Fonts.Medium,
                                fontSize: 3.6 * width,
                                color: '#000000',
                              }}
                              numberOfLines={1}>
                              {`${item.chapter_name}`}
                            </Text>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontFamily: Fonts.Medium,
                                fontSize: 3.2 * width,
                                color: '#666666',
                                marginTop: 1 * width,
                              }}>
                              {`${item.description}`}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate('SyllabusDetail', {
                                  day: dayMap[item],
                                  dayWiseItem: chapterDayWise[item],
                                  allChapterList: allChapterList,
                                  // chapterList: chapterList,
                                  // chapterDayWise: chapterDayWise,
                                  selectedWeek: selectedWeek,
                                  singleChapter: item,
                                });
                              }}
                              style={{
                                alignSelf: 'flex-end',
                                backgroundColor: '#D1FFE4',
                                paddingHorizontal: 3 * width,
                                paddingVertical: 1 * width,
                                borderRadius: 4 * width,
                              }}>
                              <Ionicons
                                name="arrow-forward-outline"
                                size={5 * width}
                                color="#16763E"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            ) : null
          ) : (
            <View style={Styles.courseRoundShape}>
              <Text style={Styles.courseText}>{`No Data Found`}</Text>
            </View>
          )}
        </View>
      </ImageView>
      <CustomProgress show={showProgress} />
    </Provider>
  );
};

const Styles = StyleSheet.create({
  circle: {
    width: 6 * height,
    height: 6 * height,
    borderRadius: 5 * height,
    backgroundColor: '#16763E',
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

  headerText1: {
    color: '#000000',
    fontSize: 4 * width,
    fontFamily: Fonts.SemiBold,
    // marginTop: 2 * width,
  },
  weekText: {
    color: '#000000',
    fontSize: 3.4 * width,
    fontFamily: Fonts.Regular,
    // marginTop: 2 * width,
  },
  weekTextSelected: {
    color: '#FFFFFF',
    fontSize: 3.4 * width,
    fontFamily: Fonts.Regular,
    // marginTop: 2 * width,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 3.4 * width,
    fontFamily: Fonts.Regular,
    // marginTop: 2 * width,
  },
  markDoneText: {
    color: '#008A3D',
    fontSize: 3.4 * width,
    marginStart: 2 * width,
    fontFamily: Fonts.Medium,
    // marginTop: 2 * width,
  },
  courseText: {
    color: '#008A3D',
    fontSize: 4 * width,
    fontFamily: Fonts.Medium,
    marginTop: 4 * height,
  },
  courseRoundShape: {
    width: '100%',
    // height: '100%',
    // flex: 1,
    // height: 9 * height,
    marginTop: 2 * width,
    backgroundColor: 'transparent',
    borderRadius: 3 * width,
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
  },
});
export default MySyllabusScreen;
