import GetCall from './GetCall';
import ImageUploadCall from './ImageUploadCall';
import LocationApiCall from './LocationApiCall';
import PaymentApi from './PaymentApi';
import PostCall from './PostCall';

export default {
  login: (data, pass, fail) => {
    PostCall.Post('login', data, pass, fail);
  },

  signup: (data, pass, fail) => {
    PostCall.Post('login', data, pass, fail);
  },

  getProfile: (pass, fail) => {
    GetCall.Get('get-profile', pass, fail);
  },

  getHomeData: (pass, fail) => {
    GetCall.Get('home-data', pass, fail);
  },

  myAssignments: (pass, fail) => {
    GetCall.Get('my-assignments', pass, fail);
  },

  allNotices: (pass, fail) => {
    GetCall.Get('notice', pass, fail);
  },

  myProgress: (urlData, pass, fail) => {
    GetCall.Get('my-progress?', pass, fail, urlData);
  },

  mySyllabus: (urlData, pass, fail) => {
    GetCall.Get('my-syllabus?', pass, fail, urlData);
  },

  uploadAssignments: (data, pass, fail) => {
    PostCall.Post('submit-assignment', data, pass, fail);
  },
  getNotification: (pass, fail) => {
    GetCall.Get('notification-list', pass, fail);
  },
  readNotification: (data, pass, fail) => {
    PostCall.Post('read-notification', data, pass, fail);
  },
};
