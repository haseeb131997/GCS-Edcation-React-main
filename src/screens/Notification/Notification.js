import moment from 'moment';
import React, {Fragment, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Provider} from 'react-native-paper';
import CustomProgress from '../../compenents/CustomProgress';
import CustomStatus from '../../compenents/CustomStatus';
import Ionicons from 'react-native-vector-icons/Ionicons';
import height from '../../Units/height';
import width from '../../Units/width';
import Fonts from '../../utility/Fonts';
import ApiMethod from '../../api/ApiMethod';

const NotificationScreen = ({navigation}) => {
  const [noticeList, setNoticeList] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    getNotificationList();
  }, []);

  const getNotificationList = () => {
    setShowProgress(true);
    ApiMethod.getNotification(
      pass => {
        setShowProgress(false);
        console.log('pass', pass.data);
        if (pass.status == 200) {
          setNoticeList(pass.data);
          readNotifications(pass.data);
          setShowProgress(false);
        }
      },
      fail => {
        setShowProgress(false);
      },
    );
  };

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.boxView}>
      <View style={styles.circle} />
      <View style={styles.textCotainer}>
        <Text style={styles.headingText}>{item.title}</Text>
        <Text style={styles.mainText}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  /// post request for read notification //
  const readNotifications = items => {
    const formData = new FormData();
    items.forEach(item => {
      if (item.status === 0) {
        formData.append('notification_id[]', item.id);
      }
    });

    ApiMethod.readNotification(
      formData,
      pass => {
        setShowProgress(false);
        if (pass.status == '200') {
          console.log('************TRUE************', pass);
        } else {
          setShowProgress(false);
          console.log('************FALSE************', pass);
        }
      },
      fail => {
        setShowProgress(false);
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
            {'Notifications'}
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

        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            paddingTop: height * 2.5,
          }}>
          <FlatList
            data={noticeList}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      </View>
      <CustomProgress show={showProgress} />
    </Provider>
  );
};

const styles = StyleSheet.create({
  boxView: {
    flexDirection: 'row',
    borderColor: '#e5dcdc',
    borderWidth: 1,
    borderRadius: width * 2,
    width: width * 95,
    paddingHorizontal: width * 2,
    paddingVertical: width * 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 2.5,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#008A3D',
  },
  textCotainer: {
    flex: 1,
    marginLeft: width * 2,
    width: width * 95,
  },
  headingText: {
    color: '#000000',
    marginBottom: height * 0.3,
    fontSize: width * 3.7,
  },
  mainText: {
    color: '#706767',
    fontSize: width * 3.2,
  },
});

export default NotificationScreen;
