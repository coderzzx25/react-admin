import request from '..';
import type { IUserLoginInfo, IUserLoginResult } from '@/types';

// 登录
export const userLogin = (data: IUserLoginInfo) => {
  return request.post<IUserLoginResult>({
    url: '/auth/login',
    data
  });
};
