import React, {Fragment, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Modal, Provider} from 'react-native-paper';
import CustomStatus from '../../../compenents/CustomStatus';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageView from '../../../compenents/ImageView';
import width from '../../../Units/width';
import Fonts from '../../../utility/Fonts';
import height from '../../../Units/height';
import ApiMethod from '../../../api/ApiMethod';
import CustomProgress from '../../../compenents/CustomProgress';
import moment from 'moment';

const AssignmentTabScreen = ({navigation}) => {
  const [chapterList, setChapterList] = useState([]);

  const [showProgress, setShowProgress] = useState(false);
  const [showGrades, setShowGrades] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused Call any action
      apiCall();
    });
  }, []);

  // const getUserDetail = async () => {
  //   // var uu = await StorageUtility.getUser();
  //   // console.log(uu);
  //   // setUser(uu);

  // };

  const apiCall = () => {
    setShowProgress(true);
    ApiMethod.myAssignments(
      pass => {
        setShowProgress(false);
        console.log('pass@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', pass);
        if (pass.status == 200) {
          setChapterList(pass.data);
        } else {
          setChapterList([]);
        }
      },
      fail => {
        setShowProgress(false);
        setChapterList([]);
      },
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
            {'Assignments'}
          </Text>

          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
        </View>

        <View
          style={{width: '100%', height: 1 * width, backgroundColor: '#F5F5F5'}}
        />

        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: '#FFFFFF',
            paddingVertical: 3 * width,
          }}>
          <View
            style={{
              width: '100%',
              alignItems: 'flex-end',
              paddingHorizontal: 4 * width,
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowGrades(true);
              }}>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 3.4 * width,
                  fontFamily: Fonts.Medium,
                  // marginTop: 1 * width,
                  paddingHorizontal: 2 * width,
                  paddingVertical: 1 * width,
                  textDecorationLine: 'underline',
                  textDecorationColor: '#008A3D',
                }}>
                {'View Grading Table'}
              </Text>
            </TouchableOpacity>
          </View>

          {chapterList.length != 0 ? (
            <FlatList
              data={chapterList}
              style={{width: '100%', paddingHorizontal: 5 * width}}
              renderItem={({item, index}) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: '100%',
                      marginVertical: 1 * width,
                      // borderWidth: 1,
                      // borderColor: '#E3E3E3',
                      // borderRadius: 2 * width,
                      // alignItems: 'center',
                    }}>
                    <View
                      style={{
                        paddingVertical: 2 * width,
                        paddingHorizontal: 4 * width,
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderColor: '#E3E3E3',
                        borderTopEndRadius: 2 * width,
                        borderTopStartRadius: 2 * width,
                      }}>
                      <Text style={Styles.headerText1}>
                        {item.chapter_name}
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{flex: 1}}>
                          <Text style={Styles.weekText}>{'Assigned On'}</Text>
                          <Text style={Styles.weekText}>{'Submitted On'}</Text>
                        </View>

                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                          <Text style={Styles.weekText1}>{`${moment(
                            item.assigned_date,
                          ).format('MMM DD')}`}</Text>
                          <Text style={Styles.weekText1}>{`${moment(
                            item.submit_date,
                          ).format('MMM DD')}`}</Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        width: '100%',
                        height: 4.4 * height,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: item.grade ? '#008A3D' : '#c0c0c0',
                        paddingHorizontal: 4 * width,
                        borderBottomEndRadius: 2 * width,
                        borderBottomStartRadius: 2 * width,
                      }}>
                      <Text style={Styles.gradeText}>{'Grade'}</Text>
                      <Text
                        style={
                          item.grade ? Styles.gradeText1 : Styles.gradeText2
                        }>
                        {item.grade ? `${item.grade}` : `-`}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
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
      </View>

      <Modal
        visible={showGrades}
        onDismiss={() => {
          setShowGrades(false);
        }}>
        <View
          style={{
            width: '80%',
            alignSelf: 'center',
            borderRadius: 2 * width,
            backgroundColor: '#FFFFFF',
            // paddingHorizontal: 3 * width,
            // paddingVertical: 3 * width,
            flexDirection: 'row',
          }}>
          <View
            style={{flex: 1, alignItems: 'center', paddingVertical: 1 * width}}>
            <Text
              style={{
                color: '#000000',
                fontSize: 3.2 * width,
                fontFamily: Fonts.Medium,
                padding: 1 * width,
              }}>{`Percentage`}</Text>

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#BCBCBC',
                marginVertical: 1,
              }}
            />
            <Text
              style={{
                color: '#000000',
                fontSize: 3.2 * width,
                fontFamily: Fonts.Medium,
                padding: 1 * width,
              }}>{`90-100%`}</Text>
            <Text
              style={{
                color: '#000000',
                fontSize: 3.2 * width,
                fontFamily: Fonts.Medium,
                padding: 1 * width,
              }}>{`80-89%`}</Text>
            <Text
              style={{
                color: '#000000',
                fontSize: 3.2 * width,
                fontFamily: Fonts.Medium,
                padding: 1 * width,
              }}>{`70-79%`}</Text>
            <Text
              style={{
                color: '#000000',
                fontSize: 3.2 * width,
                fontFamily: Fonts.Medium,
                padding: 1 * width,
              }}>{`60-69%`}</Text>
            <Text
              style={{
                color: '#000000',
                fontSize: 3.2 * width,
                fontFamily: Fonts.Medium,
                padding: 1 * width,
              }}>{`50-59%`}</Text>
          </View>

          <View
            style={{width: 1, height: '100%', backgroundColor: '#BCBCBC'}}
          />

          <View
            style={{flex: 1, alignItems: 'center', paddingVertical: 1 * width}}>
            <Text
              style={{
                color: '#000000',
                fontSize: 3.2 * width,
                fontFamily: Fonts.Medium,
                padding: 1 * width,
              }}>{`Grade`}</Text>

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#BCBCBC',
                marginVertical: 1,
              }}
            />
            <Text
              style={{
                color: '#000000',
                fontSize: 3.2 * width,
                fontFamily: Fonts.Medium,
                padding: 1 * width,
              }}>{`A`}</Text>
            <Text
              style={{
                color: '#000000',
                fontSize: 3.2 * width,
                fontFamily: Fonts.Medium,
                padding: 1 * width,
              }}>{`B`}</Text>
            <Text
              style={{
                color: '#000000',
                fontSize: 3.2 * width,
                fontFamily: Fonts.Medium,
                padding: 1 * width,
              }}>{`C`}</Text>
            <Text
              style={{
                color: '#000000',
                fontSize: 3.2 * width,
                fontFamily: Fonts.Medium,
                padding: 1 * width,
              }}>{`D`}</Text>
            <Text
              style={{
                color: '#000000',
                fontSize: 3.2 * width,
                fontFamily: Fonts.Medium,
                padding: 1 * width,
              }}>{`F`}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setShowGrades(false)}
          style={{
            marginTop: width * 5,
            alignSelf: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 2 * width,
          }}>
          <Text
            style={{
              paddingHorizontal: width * 3.5,
              paddingVertical: width * 1,
              color: '#000000',
              fontSize: 13,
            }}>
            Close
          </Text>
        </TouchableOpacity>
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
    fontSize: 4 * width,
    fontFamily: Fonts.SemiBold,
    // marginTop: 2 * width,
  },
  weekText: {
    color: '#969696',
    fontSize: 3.4 * width,
    fontFamily: Fonts.Regular,
    marginTop: 1 * width,
  },
  gradeText: {
    color: '#FFFFFF',
    fontSize: 3.4 * width,
    fontFamily: Fonts.Regular,
    // marginTop: 1 * width,
  },
  gradeText1: {
    color: '#FFFFFF',
    fontSize: 3.4 * width,
    fontFamily: Fonts.Medium,
    // marginTop: 1 * width,
  },
  gradeText2: {
    color: '#969696',
    fontSize: 3.4 * width,
    fontFamily: Fonts.Medium,
    // marginTop: 1 * width,
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
export default AssignmentTabScreen;
