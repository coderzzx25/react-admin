import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IRoleMenusResult } from '@/types';

import { getRoleMenuList } from '@/service/modules/menus';
import { sessionCache } from '@/utils/cache';

interface IMenuState {
  userMenus: IRoleMenusResult[] | [];
}

export const fetchUserMenus = createAsyncThunk('user/fetchUserMenus', async () => {
  const menus = await getRoleMenuList();
  return menus;
});

const menusSlice = createSlice({
  name: 'menus',
  initialState: {
    userMenus: JSON.parse(sessionCache.getCache('userMenus') || '[]')
  } as IMenuState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserMenus.fulfilled, (state, { payload }) => {
      state.userMenus = payload;
      sessionCache.setCache('userMenus', JSON.stringify(payload));
    });
  }
});

export default menusSlice.reducer;
