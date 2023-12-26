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

const dayMap = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

const SyllabusDetailScreen = ({navigation, route}) => {
  const [selectedChapter, setSelectedChapter] = useState(route.params.day);
  const [dayWiseItem, setDayWiseItem] = useState(route.params.dayWiseItem);
  const [cap, setcap] = useState(route.params.singleChapter);
  console.log('***************single chapter', route.params.singleChapter);

  const [user, setUser] = useState(null);
  const [virtualClassCalendar, setVirtualClassCalendar] = useState(0);
  const [allChapterList, setAllChapterList] = useState(
    route.params.allChapterList,
  );
  // const [chapterList, setChapterList] = useState(route.params.chapterList);
  // const [chapterDayWise, setChapterDayWise] = useState(
  //   route.params.chapterDayWise,
  // );
  const [selectedWeek, setSelectedWeek] = useState(route.params.selectedWeek);

  const [showProgress, setShowProgress] = useState(false);

  console.log('dayWiseItem', dayWiseItem);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused Call any action
      getUserDetail();
    });
  }, []);

  const getUserDetail = async () => {
    var uu = await StorageUtility.getUser();
    console.log(uu);
    setUser(uu);

    if (uu.type == 'virtual') {
      setVirtualClassCalendar(1);
      ToastUtility.showToast('Virtual');
    } else {
      setVirtualClassCalendar(2);
      ToastUtility.showToast('In Person');
    }

    console.log('***************allChapterList**************', allChapterList);
    let t1 = [];
    allChapterList.map(item => {
      if (dayMap[selectedChapter] == item.day) {
        t1.push(item);
      }
    });
    console.log('***************chapter**************', t1);
    setAllChapterList(t1);

    // var path = await StorageUtility.getProfilePath();
    // setUserPath(path);

    // apiCall(selectedWeek);
  };

  // const apiCall = week => {
  //   setShowProgress(true);
  //   ApiMethod.mySyllabus(
  //     `week=${week}`,
  //     pass => {
  //       setShowProgress(false);
  //       console.log('pass', pass);

  //       if (pass.status == 200) {
  //         // setDataList(pass.data);
  //         let tt = {};
  //         let days = [];
  //         let chapList = [];
  //         pass.data.map(item => {
  //           if (!chapList.some(it => it.chapter_name == item.chapter_name)) {
  //             chapList.push(item);
  //           }
  //           setAllChapterList(chapList);

  //           if (tt[item.day]) {
  //             let t1 = tt[item.day];
  //             t1.push(item);
  //             tt[item.day] = t1;
  //           } else {
  //             let t1 = [];
  //             t1.push(item);
  //             tt[item.day] = t1;
  //             days.push(item.day);
  //           }
  //           setChapterList(days);
  //           setChapterDayWise(tt);
  //           console.log('tt', tt);
  //           console.log('days', days);
  //         });
  //       } else {
  //         // setChapterList([]);
  //       }
  //     },
  //     fail => {
  //       setShowProgress(false);
  //       setAllChapterList([]);
  //       setChapterList([]);
  //       setChapterDayWise([]);
  //     },
  //   );
  // };

  // handling links openning ///
  const handleOpenUrl = async url => {
    const encodedUrl = encodeURI(url);
    // console.log(`Opening URL: ${encodedUrl}`);
    try {
      await Linking.openURL(encodedUrl);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
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
                  paddingHorizontal: 4 * width,
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
                  paddingHorizontal: 4 * width,
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
          <Text
            style={{
              // width: '26%',
              width: '92%',
              fontFamily: Fonts.Medium,
              fontSize: 4 * width,
              marginVertical: 1 * width,
              color: '#000000',
              marginTop: 4 * width,
            }}>
            {selectedChapter
              ? `Week ${selectedWeek} - ${selectedChapter}`
              : `Week ${selectedWeek}`}
          </Text>
          {virtualClassCalendar == 1 ? (
            <View style={{flex: 1, width: '100%'}}>
              <FlatList
                data={dayWiseItem ?? []}
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
                            minHeight: 9 * height,
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
                            <View
                              style={{
                                // width: '26%',
                                // flex: 1,
                                fontFamily: Fonts.Medium,
                                fontSize: 3.6 * width,
                                color: '#000000',
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={{
                                  // width: '26%',
                                  flex: 1,
                                  fontFamily: Fonts.Medium,
                                  fontSize: 3.6 * width,
                                  color: '#000000',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                {`${item.chapter_name}`}
                              </Text>
                              {item.mandatory == 'yes' && (
                                <View
                                  style={{
                                    backgroundColor: '#FFEDED',
                                    borderRadius: width * 6,
                                  }}>
                                  <Text
                                    style={{
                                      fontFamily: Fonts.Medium,
                                      fontSize: 3.2 * width,
                                      color: '#CF0000',
                                      paddingHorizontal: width * 3,
                                      paddingVertical: width * 1,
                                    }}>
                                    {'Mandatory'}
                                  </Text>
                                </View>
                              )}
                            </View>

                            <Text
                              style={{
                                fontFamily: Fonts.Medium,
                                fontSize: 3.2 * width,
                                color: '#666666',
                                marginTop: 1 * width,
                                textAlign: 'justify',
                              }}>
                              {`${item.description}`}
                            </Text>

                            <View
                              style={{
                                width: '100%',
                                flexDirection: 'row',
                                marginTop: 1 * width,
                                justifyContent: 'flex-end',
                              }}>
                              {item.google_form_url != null && (
                                <TouchableOpacity
                                  onPress={() =>
                                    handleOpenUrl(item.google_form_url)
                                  }
                                  style={{
                                    backgroundColor: '#D1FFE4',
                                    paddingHorizontal: 3 * width,
                                    paddingVertical: 1 * width,
                                    borderRadius: 4 * width,
                                    flexDirection: 'row',
                                  }}>
                                  <Text
                                    style={{
                                      fontFamily: Fonts.Medium,
                                      fontSize: 3.2 * width,
                                      color: '#666666',
                                      marginHorizontal: 1 * width,
                                    }}>
                                    {`Open Form`}
                                  </Text>
                                  <Ionicons
                                    name="arrow-forward-outline"
                                    size={5 * width}
                                    color="#16763E"
                                  />
                                </TouchableOpacity>
                              )}

                              {item.google_doc_url != null && (
                                <TouchableOpacity
                                  onPress={() =>
                                    handleOpenUrl(item.google_doc_url)
                                  }
                                  style={{
                                    backgroundColor: '#D1FFE4',
                                    paddingHorizontal: 3 * width,
                                    paddingVertical: 1 * width,
                                    borderRadius: 4 * width,
                                    flexDirection: 'row',
                                    marginStart: 2 * width,
                                  }}>
                                  <Text
                                    style={{
                                      fontFamily: Fonts.Medium,
                                      fontSize: 3.2 * width,
                                      color: '#666666',
                                      marginHorizontal: 1 * width,
                                    }}>
                                    {`Open Doc`}
                                  </Text>
                                  <Ionicons
                                    name="arrow-forward-outline"
                                    size={5 * width}
                                    color="#16763E"
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          ) : virtualClassCalendar == 2 ? (
            <View style={{flex: 1, width: '100%'}}>
              <FlatList
                data={[cap]}
                style={{paddingHorizontal: 4 * width}}
                // keyExtractor={item => item.id.toString()}
                renderItem={({item}) => {
                  return (
                    <View
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
                          minHeight: 9 * height,
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
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                // width: '26%',
                                flex: 1,
                                fontFamily: Fonts.Medium,
                                fontSize: 3.6 * width,
                                color: '#000000',
                              }}>
                              {`${item.chapter_name}`}
                            </Text>
                            {item.mandatory == 'yes' && (
                              <View
                                style={{
                                  backgroundColor: '#FFEDED',
                                  borderRadius: width * 6,
                                }}>
                                <Text
                                  style={{
                                    fontFamily: Fonts.Medium,
                                    fontSize: 3.2 * width,
                                    color: '#CF0000',
                                    paddingHorizontal: width * 3,
                                    paddingVertical: width * 1,
                                  }}>
                                  {'Mandatory'}
                                </Text>
                              </View>
                            )}
                          </View>

                          <Text
                            style={{
                              fontFamily: Fonts.Medium,
                              fontSize: 3.2 * width,
                              color: '#666666',
                              marginTop: 1 * width,
                              textAlign: 'justify',
                            }}>
                            {`${item.description}`}
                          </Text>

                          <View
                            style={{
                              width: '100%',
                              flexDirection: 'row',
                              marginTop: 1 * width,
                              justifyContent: 'flex-end',
                            }}>
                            {item.google_form_url != null && (
                              <TouchableOpacity
                                onPress={() =>
                                  handleOpenUrl(item.google_form_url)
                                }
                                style={{
                                  backgroundColor: '#D1FFE4',
                                  paddingHorizontal: 3 * width,
                                  paddingVertical: 1 * width,
                                  borderRadius: 4 * width,
                                  flexDirection: 'row',
                                }}>
                                <Text
                                  style={{
                                    fontFamily: Fonts.Medium,
                                    fontSize: 3.2 * width,
                                    color: '#666666',
                                    marginHorizontal: 1 * width,
                                  }}>
                                  {`Open Form`}
                                </Text>
                                <Ionicons
                                  name="arrow-forward-outline"
                                  size={5 * width}
                                  color="#16763E"
                                />
                              </TouchableOpacity>
                            )}

                            {item.google_doc_url != null && (
                              <TouchableOpacity
                                onPress={() =>
                                  handleOpenUrl(item.google_doc_url)
                                }
                                style={{
                                  backgroundColor: '#D1FFE4',
                                  paddingHorizontal: 3 * width,
                                  paddingVertical: 1 * width,
                                  borderRadius: 4 * width,
                                  flexDirection: 'row',
                                  marginStart: 2 * width,
                                }}>
                                <Text
                                  style={{
                                    fontFamily: Fonts.Medium,
                                    fontSize: 3.2 * width,
                                    color: '#666666',
                                    marginHorizontal: 1 * width,
                                  }}>
                                  {`Open Doc`}
                                </Text>
                                <Ionicons
                                  name="arrow-forward-outline"
                                  size={5 * width}
                                  color="#16763E"
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          ) : null}
          {/* {allChapterList.length > 0 &&
            (virtualClassCalendar == 1 ? (
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

                              {chapterDayWise &&
                                chapterDayWise[item] &&
                                chapterDayWise[item].some(
                                  ii => ii.mandatory == 'yes',
                                ) && (
                                  // chapterDayWise[item][0].mandatory
                                  <Text
                                    style={{
                                      fontFamily: Fonts.Medium,
                                      fontSize: 3.2 * width,
                                      color: '#CF0000',
                                      backgroundColor: '#FFEDED',
                                      borderRadius: 6 * width,
                                      width: '38%',
                                      textAlign: 'center',
                                      paddingVertical: 1 * width,
                                    }}>
                                    Mandatory
                                  </Text>
                                )}
                            </View>

                            <Text
                              style={{
                                flex: 1,
                                fontFamily: Fonts.Medium,
                                fontSize: 3.2 * width,
                                color: '#666666',
                                marginTop: 1 * width,
                              }}>
                              {chapterDayWise &&
                                chapterDayWise[item] &&
                                `${chapterDayWise[item][0].description}`}
                            </Text>

                            <TouchableOpacity
                              onPress={() => {}}
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
            ) : virtualClassCalendar == 1 ? (
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
                        <Text
                          style={{
                            width: '26%',
                            fontFamily: Fonts.Medium,
                            fontSize: 3.6 * width,
                            color: '#000000',
                          }}>
                          {`${item.chapter_name}`}
                        </Text>

                        <View
                          style={{
                            flex: 1,
                            width: '100%',
                            height: 9 * height,
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
                                fontFamily: Fonts.Medium,
                                fontSize: 3.2 * width,
                                color: '#666666',
                                marginTop: 1 * width,
                              }}>
                              {`${item.description}`}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            ) : null)} */}
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
});
export default SyllabusDetailScreen;
