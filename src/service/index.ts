import { message } from 'antd';
import { BASE_URL, TIME_OUT } from './config';
import Request from './request';
import { hideLoading, showLoading } from '@/components/Loading';
import store from '@/store';
import { fetchRefreshToken } from '@/store/modules/user';

let refreshToken: boolean = false;

const request = new Request({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestSuccessFn: (config) => {
      const token = refreshToken ? store.getState().user.refreshToken : store.getState().user.token;
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
      if (error.response?.status === 401 && !refreshToken) {
        refreshToken = true;
        store.dispatch(fetchRefreshToken()).then(() => {
          refreshToken = false;
        });
      }
      hideLoading();
      message.error(error.response?.data as string);
    }
  }
});

export default request;
