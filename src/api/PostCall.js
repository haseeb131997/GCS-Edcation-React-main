import axios from "axios";
import Constants from '../utility/ConstData';
import StorageUtility from "../utility/StorageUtility";
import RefreshTokenCall from "./RefreshTokenCall";

const instance = axios.create({
  baseURL: Constants.Base_Path,
  timeout: 100000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

instance.interceptors.request.use(async request => {
  console.log('Api Method', '=========POST=========');
  console.log('Starting Request', JSON.stringify(request));

  var token = await StorageUtility.getJWTToken();
  console.log('JWT TOKEN', token);

  if(token){
    request.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Headers', request.headers);
  return request;
});

instance.interceptors.response.use(response => {
  console.log('Response:', JSON.stringify(response));
  return response;
});

export default {
  Post: (endpoint, data, pass, fail, params = null) => {
    console.log('Api Post Data', data);

    if (params != null) {
      endpoint = endpoint + '/' + params;
    }
    console.log('Api EndPoint', endpoint);

    instance
      .post(endpoint, data)
      .then(function (response) {
        pass(response.data);
      })
      .catch(function (error) {
        console.log(endpoint, 'Error:->', error);
        console.log(endpoint, 'Error.response:->', error.response);
        if (error.response.data) {
          let err = error.response.data;
          console.log(endpoint, 'err:->', err);
          console.log(endpoint, 'err.message:->', err.message);
          if (
            error.response.status == 401 &&
            err.message.includes('Unauthenticated')
          ) {
            console.log(endpoint, 'err.message:-> refreshing Token');
            RefreshTokenCall.refreshPostToken(
              endpoint,
              data,
              pass,
              fail,
              params,
            );
          } else {
            fail(error);
          }
        } else {
          fail(error);
        }
      });
  },
};
