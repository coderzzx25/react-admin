import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { localCache } from '@/utils/cache';

interface IMainState {
  isDark: boolean;
  isCollapsed: boolean;
  defaultPrimaryColor: string | '#1677ff';
}

const mainSlice = createSlice({
  name: 'main',
  initialState: {
    isDark: localCache.getCache('isDark') || false,
    isCollapsed: localCache.getCache('isCollapsed') || false,
    defaultPrimaryColor: localCache.getCache('defaultPrimaryColor') || '#1677ff'
  } as IMainState,
  reducers: {
    setDarkReducer(state, { payload }: PayloadAction<boolean>) {
      state.isDark = payload;
      localCache.setCache('isDark', payload);
    },
    setCollapsedReducer(state, { payload }: PayloadAction<boolean>) {
      state.isCollapsed = payload;
      localCache.setCache('isCollapsed', payload);
    },
    setPrimaryColor(state, { payload }: PayloadAction<string>) {
      state.defaultPrimaryColor = payload;
      localCache.setCache('defaultPrimaryColor', payload);
    }
  }
});

export const { setDarkReducer, setCollapsedReducer, setPrimaryColor } = mainSlice.actions;

export default mainSlice.reducer;
