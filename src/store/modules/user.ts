import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IRoleMenusResult, IUserInfo, IUserLoginResult } from '@/types';
import { getRoleMenuList } from '@/service/modules/menus';
import { refreshToken } from '@/service/modules/auth';
import { localCache, sessionCache } from '@/utils/cache';

interface IUserState {
  userInfo: IUserInfo | null;
  token: string;
  refreshToken: string;
  userMenus: IRoleMenusResult[] | [];
}

export const fetchUserMenus = createAsyncThunk('user/fetchUserMenus', async () => {
  const menus = await getRoleMenuList();
  return menus;
});

export const fetchRefreshToken = createAsyncThunk('user/fetchRefreshToken', async () => {
  const result = await refreshToken();
  return result;
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserMenus.fulfilled, (state, { payload }) => {
      state.userMenus = payload;
      sessionCache.setCache('userMenus', JSON.stringify(payload));
    });
    builder.addCase(fetchRefreshToken.fulfilled, (state, { payload }) => {
      state.token = payload.token;
      state.refreshToken = payload.refreshToken;
    });
  }
});

export const { setUserLoginInfoReducer } = userSlice.actions;

export default userSlice.reducer;
