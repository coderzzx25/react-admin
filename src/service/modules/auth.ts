import request from '..';
import type { IUserLoginInfo, IUserLoginResult } from '@/types';

// 登录
export const userLogin = (data: IUserLoginInfo) => {
  return request.post<IUserLoginResult>({
    url: '/auth/login',
    data
  });
};

export const refreshToken = () => {
  return request.get({
    url: '/auth/refresh_token'
  });
};
