import moment from 'moment';
import React, {Fragment, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Provider} from 'react-native-paper';
import ApiMethod from '../../../api/ApiMethod';
import CustomProgress from '../../../compenents/CustomProgress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomStatus from '../../../compenents/CustomStatus';
import ImageView from '../../../compenents/ImageView';
import height from '../../../Units/height';
import width from '../../../Units/width';
import Fonts from '../../../utility/Fonts';

const NoticeTabScreen = ({navigation}) => {
  const [noticeList, setNoticeList] = useState([]);

  const [showProgress, setShowProgress] = useState(false);
  const [visible, setVisible] = useState(false);
  const [notice, setNotice] = useState(false);

  const handleViewMore = noticetext => {
    setVisible(true);
    setNotice(noticetext);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused Call any action
      apiCall();
    });
  }, []);

  const apiCall = () => {
    setShowProgress(true);
    ApiMethod.allNotices(
      async pass => {
        setShowProgress(false);
        console.log('passfgdfgd', pass);
        if (pass.status == 200) {
          // let tt = [];
          // pass.data.pass.map(not => {
          //   if(tt.some(t1 => t1 == ))
          //   tt.push(moment(not.added_date).format('EEE'));
          // });
          // console.log(tt);
          // const tt1 = await pass.data.slice(0);
          setNoticeList(pass.data);
        } else {
          setNoticeList(null);
        }
      },
      fail => {
        setShowProgress(false);
        setNoticeList([]);
      },
    );
  };

  const isShowData = (item, index) => {
    console.log(moment(item.added_date).format('dddd'));
    if (index > 0) {
      console.log(moment(noticeList[index - 1].added_date).format('dddd'));
    } else {
      console.log('na');
    }

    return (
      index == 0 ||
      (index > 0 &&
        moment(item.added_date).format('dddd') !=
          moment(noticeList[index - 1].added_date).format('dddd'))
    );
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
            {'Notices'}
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

        <View
          style={{width: '100%', height: 1 * width, backgroundColor: '#F5F5F5'}}
        />
        {noticeList ? (
          <View
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: '#FFFFFF',
              paddingVertical: 3 * width,
            }}>
            <FlatList
              data={noticeList}
              style={{width: '100%', paddingHorizontal: 5 * width}}
              renderItem={({item, index}) => {
                console.log(isShowData(item, index));

                return (
                  <View key={index} style={{width: '100%'}}>
                    {isShowData(item, index) && (
                      <View
                        style={{
                          width: '100%',
                          height: 6 * height,
                          justifyContent: 'center',
                        }}>
                        <Text style={Styles.headerText1}>
                          {moment(item.added_date).format('Do MMM YY')}
                        </Text>
                      </View>
                    )}
                    <View
                      style={{
                        width: '100%',
                        paddingVertical: 3 * width,
                        paddingHorizontal: 2 * width,
                        borderWidth: 1,
                        marginVertical: 1 * width,
                        borderColor: '#E3E3E3',
                        borderRadius: 2 * width,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 3 * width,
                          height: 3 * width,
                          backgroundColor: '#008A3D',
                          borderRadius: 3 * width,
                        }}
                      />

                      <Text numberOfLines={2} style={Styles.weekText}>
                        {item.notice}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleViewMore(item.notice)}
                        style={{
                          borderWidth: 1,
                          marginVertical: 1 * width,
                          borderColor: '#E3E3E3',
                          borderRadius: 1 * width,
                          alignItems: 'center',
                          padding: 0.8 * width,
                          marginLeft: 0.8 * width,
                        }}>
                        <Text
                          style={{
                            fontSize: 11,
                            color: '#000000',
                            fontWeight: '500',
                          }}>
                          View More
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View style={Styles.courseRoundShape}>
            <Text
              style={{
                color: '#008A3D',
                fontSize: 4 * width,
                fontFamily: Fonts.Medium,
                marginTop: 4 * height,
              }}>{`No Data Found`}</Text>
          </View>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(!visible);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // marginTop: 22,
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          <View
            style={{
              width: width * 80,
              height: height * 58,
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,
              // alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{marginBottom: width * 5}}>
              <Text
                style={{
                  textAlign: 'justify',
                  color: '#000000',
                  fontSize: width * 3.4,
                }}>
                {notice}
              </Text>
            </ScrollView>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
              }}
              style={{
                alignSelf: 'center',
                position: 'absolute',
                bottom: width * 2,
                marginTop: Platform.OS === 'ios' ? 5 : -10,
                backgroundColor: '#008A3D',
                borderRadius: 3,
              }}>
              <Text
                style={{
                  color: '#ffffff',
                  padding: width * 1,
                  paddingLeft: width * 2,
                  paddingRight: width * 2,
                }}>
                ok
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

  courseRoundShape: {
    width: '100%',
    height: '100%',
    // flex: 1,
    // height: 9 * height,
    marginTop: 2 * width,
    backgroundColor: '#FFFFFF',
    borderRadius: 3 * width,
    alignItems: 'center',
    // justifyContent: 'center',
    // flexDirection: 'row',
  },
});

export default NoticeTabScreen;
