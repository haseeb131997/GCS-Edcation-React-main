import moment from 'moment';
import React, {Fragment, useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Modal,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Provider, Surface} from 'react-native-paper';
import ApiMethod from '../../api/ApiMethod';
import CustomButton from '../../compenents/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomProgress from '../../compenents/CustomProgress';
import CustomStatus from '../../compenents/CustomStatus';
import ImageView from '../../compenents/ImageView';
import height from '../../Units/height';
import width from '../../Units/width';
import Fonts from '../../utility/Fonts';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import StorageUtility from '../../utility/StorageUtility';
import ToastUtility from '../../utility/ToastUtility';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dropdown} from 'react-native-element-dropdown';

// export type RuleType = 'solid' | 'dashed' | 'dotted' | string;
// export const ruleTypes: RuleTypes = {
//   SOLID: 'solid',
//   DASHED: 'dashed',
//   DOTTED: 'dotted',
// };

const MyProgressScreen = ({navigation, route}) => {
  const [graphData, setGraphData] = useState([]);
  const [skillGraphData, setSkillkGraphData] = useState([]);

  const [showProgress, setShowProgress] = useState(false);
  const course_name = route.params?.course_name;
  console.log(route.params.course_name);

  const [attendance, setAttendance] = useState(true);
  const [assignment, setAssignment] = useState(true);
  const [showSkillGraph, setShowSkillGraph] = useState(false);
  const [visible, setVisible] = useState(null);

  //// year filter //
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 2}, (_, index) => ({
    label: `${currentYear - index}`,
    value: currentYear - index,
  }));

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleYearChange = year => {
    console.log('years**********************************************', year);
    setSelectedYear(year.value);
    // Call your API or perform any other actions here
    apiCall(year.value);
  };

  useEffect(() => {
    apiCall(selectedYear);
  }, []);

  const apiCall = year => {
    setShowProgress(true);
    ApiMethod.myProgress(
      `year=${year}`,
      pass => {
        setShowProgress(false);
        console.log('kkkkkpass', pass);
        if (pass.status == 200) {
          console.log('assignment', pass.assignment.length);
          console.log('attendance', pass.attendance.length);

          const isAttendanceZero = pass.attendance.every(
            item => item.value === 0,
          );

          // Check if every value in assignment array is 0
          const isAssignmentZero = pass.assignment.every(
            item => item.value === 0,
          );

          console.log('Is Attendance Zero:', isAttendanceZero);
          console.log('Is Assignment Zero:', isAssignmentZero);

          // Set states based on the conditions
          setAttendance(!isAttendanceZero);
          setAssignment(!isAssignmentZero);

          let graph = [];
          pass.assignment.map((asmnt, index) => {
            graph.push({
              value: asmnt.value,
              frontColor: '#D69C37',
              gradientColor: '#D69C37',
              spacing: 4,
              label: capitalize(asmnt.month),
            });
            graph.push({
              value: pass.attendance[index].value,
              frontColor: '#16763E',
              gradientColor: '#16763E',
            });
          });

          setGraphData(graph);
          console.log('****************ddddd', graph);

          // setChapterList(pass.data);
        } else {
          // setChapterList([]);
        }

        getProfile();
      },
      fail => {
        setShowProgress(false);
        setGraphData([]);
      },
    );
  };

  const getProfile = () => {
    setShowProgress(true);

    ApiMethod.getProfile(
      async pass => {
        console.log('profile', pass);
        setShowProgress(false);
        if (pass.status == 200) {
          var data = pass.data;

          let graph = [];
          graph.push({
            value: data.skill ? Number(data.skill) : 0,
            frontColor: '#16763E',
            gradientColor: '#16763E',
            // spacing: 4,
            label: course_name ? course_name : null,
          });
          if (data.skill == '' || data.skill == null) {
            setShowSkillGraph(false);
          } else {
            setShowSkillGraph(true);
          }

          setSkillkGraphData(graph);
        }
      },
      fail => {
        console.log(fail);

        setSkillkGraphData([]);
        setShowProgress(false);
        ToastUtility.showToast('Some Error Occurred.');
      },
    );
  };

  const capitalize = word => {
    return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
  };

  return (
    <Provider>
      {/* <CustomStatus trans={false} isDark={true} color="#FFFFFF" /> */}
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
            // paddingTop: height * 10,
          }}>
          <Text
            style={{
              color: '#000000',
              fontFamily: Fonts.SemiBold,
              fontSize: 4.5 * width,
            }}>
            {'My Progress'}
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
          style={{
            width: '30%',
            // width: '23%',
            height: 2 * height,
            // borderColor: '#BBBBBB',
            // borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-end',
            marginRight: width * 3,
          }}>
          <Dropdown
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: '#F7F8F800',
            }}
            placeholderStyle={{
              fontSize: 4 * width,
              // paddingHorizontal: 2 * width,
              fontFamily: Fonts.SemiBold,
              color: '#D8D8D8',
            }}
            selectedTextStyle={{
              fontSize: 4 * width,
              paddingHorizontal: 2 * width,
              fontFamily: Fonts.SemiBold,
              textAlign: 'right',
              color: '#1D1D1D',
            }}
            itemContainerStyle={{
              // marginTop: 5,
              paddingVertical: 0,
              height: 5 * height,
              // backgroundColor: '#afa',
              borderBottomWidth: 1,
              borderBlockColor: '#EBEBEB',
              paddingTop: 0,
              padding: 0,
            }}
            itemTextStyle={{
              margin: 0,
              height: 5 * width,
              marginTop: -1 * width,
              fontSize: 4 * width,
              paddingHorizontal: 0 * width,
              fontFamily: Fonts.Regular,
              color: '#1D1D1D',
              // paddingVertical: 0,
              // paddingTop: 0,
            }}
            data={years}
            showsVerticalScrollIndicator={false}
            maxHeight={30 * height}
            labelField="label"
            valueField="value"
            placeholder={selectedYear || selectedYear === '' ? 'Years' : '...'}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
            value={selectedYear}
            onChange={item => {
              setSelectedYear(item.value);
              handleYearChange(item);
            }}
            containerStyle={{
              backgroundColor: '#FFFFFF',
              marginTop: Platform.OS == 'android' ? 3 * width : 0,
              borderRadius: 1 * width,
            }}
            renderRightIcon={() => {
              console.log('Is visible:', visible);
              return (
                <Ionicons
                  name={visible ? 'chevron-up' : 'chevron-down'}
                  size={5 * width}
                  color="#000000"
                />
              );
            }}
          />
        </View>

        <View
          style={{
            flex: 1,
            width: '100%',
            alignItems: 'center',
            // backgroundColor: '#F0F9F3',
          }}>
          {(assignment === true || attendance === true) && (
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: 5 * width,
                  height: 5 * width,
                  backgroundColor: '#CE9B37',
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.Medium,
                  fontSize: 3.4 * width,
                  color: '#000',
                  height: 5 * width,
                  marginStart: 3 * width,
                }}>
                Assignment
              </Text>

              <View
                style={{
                  width: 5 * width,
                  height: 5 * width,
                  backgroundColor: '#15793E',
                  marginStart: 10 * width,
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.Medium,
                  fontSize: 3.4 * width,
                  color: '#000',
                  height: 5 * width,
                  marginStart: 3 * width,
                }}>
                Attendance
              </Text>
            </View>
          )}

          {assignment === false && attendance === false ? (
            <View style={{alignSelf: 'center', flex: 1}}>
              <Text
                style={{
                  color: '#008A3D',
                  fontSize: 4 * width,
                  fontFamily: Fonts.Medium,
                  paddingTop: height * 20,
                }}>
                No Assignments/Attendance Found
              </Text>
            </View>
          ) : (
            <View style={{flex: 1, width: '95%'}}>
              <BarChart
                // style={{marginStart: 0, backgroundColor: '#aaa'}}
                data={graphData}
                // width={85 * width}
                height={30 * height}
                barWidth={2.6 * width}
                initialSpacing={1}
                endSpacing={1}
                spacing={4 * width}
                barBorderRadius={0}
                hideRules
                // showGradient
                // isThreeD={true}
                yAxisThickness={0}
                xAxisThickness={0}
                // xAxisType={ruleTypes.SOLID}
                // xAxisColor={'#000'}
                // hideYAxisText={true}
                // hideAxesAndRules={true}
                // yAxisTextStyle={{color: '#000'}}
                // stepValue={1000}
                // maxValue={6000}
                // noOfSections={7}
                // yAxisLabelTexts={['0', '5', '10', '15', '20', '25', '30', '35']}
                labelWidth={6 * width}
                yAxisTextStyle={{
                  color: '#000000',
                  // textAlign: 'center',
                  fontFamily: Fonts.Regular,
                  fontSize: 3.5 * width,
                }}
                xAxisLabelTextStyle={{
                  color: '#000000',
                  // textAlign: 'center',
                  fontFamily: Fonts.Regular,
                  fontSize: 3 * width,
                }}
                // yAxisCustomLabel={graphData => `${graphData.value}`}
                // showLine={false}
                // lineConfig={{
                //   color: '#F29C6E',
                //   thickness: 3,
                //   curved: true,
                //   hideDataPoints: true,
                //   shiftY: 20,
                //   initialSpacing: -30,
                // }}
              />
            </View>
          )}

          {showSkillGraph ? (
            <View style={{flex: 1, width: '100%'}}>
              <View
                style={{width: '100%', height: 5, backgroundColor: '#FFFFFF'}}
              />
              <View
                style={{
                  flex: 1,
                  // backgroundColor: '#FFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SemiBold,
                    fontSize: 4 * width,
                    color: '#000',
                    // height: 5 * width,
                    marginBottom: 3 * width,
                  }}>
                  Skill Graph
                </Text>
                <BarChart
                  width={80 * width}
                  height={22 * height}
                  barWidth={60 * width}
                  data={skillGraphData}
                  showYAxisIndices
                  yAxisIndicesWidth={5}
                  xAxisLabelTexts={[`${course_name}`]}
                  noOfSections={4}
                  maxValue={100}
                  hideRules
                  initialSpacing={12 * width}
                  xAxisType={'solid'}
                  xAxisColor={'#000'}
                  yAxisTextStyle={{color: '#000'}}
                  xAxisLabelTextStyle={{
                    color: '#000000',
                    textAlign: 'center',
                    fontFamily: Fonts.Regular,
                    fontSize: 3 * width,
                  }}
                />
                {/* <BarChart
                barWidth={60 * width}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={skillGraphData}
                yAxisThickness={0}
                xAxisThickness={0}
              /> */}
                {/* <BarChart
                // style={{marginStart: 0, backgroundColor: '#aaa'}}
                data={skillGraphData}
                // width={60 * width}
                height={30 * height}
                barWidth={60 * width}
                // initialSpacing={1}
                endSpacing={1}
                // spacing={4 * width}
                barBorderRadius={0}
                // showGradient
                // isThreeD={true}
                yAxisThickness={1}
                xAxisThickness={0}
                // xAxisType={ruleTypes.SOLID}
                // xAxisColor={'#000'}
                // hideYAxisText={true}
                // hideAxesAndRules={true}
                // yAxisTextStyle={{color: '#000'}}
                // stepValue={1000}
                // maxValue={6000}
                noOfSections={6}
                yAxisLabelTexts={['0', '1k', '2k', '3k', '4k', '5k', '6k']}
                // labelWidth={6 * width}
                // xAxisLabelTextStyle={{
                //   color: '#000000',
                //   textAlign: 'center',
                //   fontFamily: Fonts.Regular,
                //   fontSize: 3 * width,
                // }}
                // showLine={false}
                // lineConfig={{
                //   color: '#F29C6E',
                //   thickness: 3,
                //   curved: true,
                //   hideDataPoints: true,
                //   shiftY: 20,
                //   initialSpacing: -30,
                // }}
              /> */}
              </View>
            </View>
          ) : (
            <View style={{alignSelf: 'center', flex: 1}}>
              <Text
                style={{
                  color: '#008A3D',
                  fontSize: 4 * width,
                  fontFamily: Fonts.Medium,
                }}>
                No Skill Data Found
              </Text>
            </View>
          )}
        </View>
      </ImageView>
      <CustomProgress show={showProgress} />
    </Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignSelf: 'flex-end',
    marginHorizontal: width * 3,
    marginBottom: height * 6,
    width: width * 28,
    // height: height * 2,
  },
  pickerContainer: {
    marginTop: 8,
  },
  selectedPickerOption: {
    fontSize: 12,
    color: '#000',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  pickerOption: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  pickerOptionText: {
    fontSize: 12,
    color: '#000',
  },
});
export default MyProgressScreen;
