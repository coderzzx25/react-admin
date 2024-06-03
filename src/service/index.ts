import { message } from 'antd';
import { BASE_URL, TIME_OUT } from './config';
import Request from './request';
import { hideLoading, showLoading } from '@/components/Loading';
import store from '@/store';

const request = new Request({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestSuccessFn: (config) => {
      const token = store.getState().user.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      showLoading();
      return config;
    },
    requestFailureFn: (error) => {
      hideLoading();
      return error;
    },
    responseSuccessFn: (response) => {
      hideLoading();
      return response.data;
    },
    responseFailureFn: (error) => {
      hideLoading();
      message.error(error.response?.data as string);
    }
  }
});

export default request;
