import {Platform} from 'react-native';
import width from '../Units/width';
import ColorCode from './ColorCode';

export default {
  //Base_Path: 'https://techmavesoftwaredev.com/gcs_education/api/',
  Base_Path: 'https://gceeducationapp.com/api/',
  
  Email_Regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/,
  HTML_Regex: /(<([^>]+)>)/gi,
  Phone_Regex:
    /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/,
  Gender: ['Male', 'Female'],
  loginDuration: [
    {label: 'For 12 hours', value: 12},
    {label: 'For 7 days', value: 24 * 7},
    {label: 'For 30 days', value: 24 * 30},
    {label: 'Until I log out', value: 0},
  ],
  MaritalStatus: ['Single', 'Married'],
  ELEVATION_STYLE:
    Platform.OS == 'android'
      ? {
          elevation: 1 * width,
        }
      : {
          shadowOffset: {
            width: -0.1 * width,
            height: -0.1 * width,
          },
          shadowColor: ColorCode.greyDDD,
          shadowOpacity: 1,
          zIndex: 999,
        },

  ELEVATION_STYLE2:
    Platform.OS == 'android'
      ? {
          elevation: 2 * width,
        }
      : {
          shadowOffset: {
            width: -0.1 * width,
            height: -0.1 * width,
          },
          shadowColor: ColorCode.greyDDD,
          shadowOpacity: 2 * width,
          zIndex: 999,
        },

  getErrorMsg: obj => {
    console.log('obj', obj);
    var arr = [];
    var error = '';

    Object.keys(obj).map(key => {
      console.log(key, obj[key]);

      obj[key].map(er => {
        // arr.push(er);
        if (error == '') {
          error = er;
        } else {
          error += ' ' + er;
        }
      });
    });
    console.log('final error=>  ', error);
    return error;
  },
};
