import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IUserInfo, IUserLoginResult } from '@/types';
import { getRoleMenuList } from '@/service/modules/menus';
import { localCache, sessionCache } from '@/utils/cache';

interface IUserState {
  userInfo: IUserInfo | null;
  token: string;
  refreshToken: string;
}

export const fetchUserMenus = createAsyncThunk('user/fetchUserMenus', async () => {
  const menus = await getRoleMenuList();
  return menus;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: JSON.parse(localCache.getCache('userInfo') || 'null'),
    token: localCache.getCache('token') || '',
    refreshToken: localCache.getCache('refreshToken') || '',
    userMenus: JSON.parse(sessionCache.getCache('userMenus') || '[]')
  } as IUserState,
  reducers: {
    setUserLoginInfoReducer(state, { payload }: PayloadAction<IUserLoginResult>) {
      state.userInfo = payload.userinfo;
      state.token = payload.token;
      state.refreshToken = payload.refreshToken;
      localCache.setCache('token', payload.token);
      localCache.setCache('refreshToken', payload.refreshToken);
      localCache.setCache('userInfo', JSON.stringify(payload.userinfo));
    }
  }
});

export const { setUserLoginInfoReducer } = userSlice.actions;

export default userSlice.reducer;
