import { configureStore } from '@reduxjs/toolkit';
import { useSelector, TypedUseSelectorHook, useDispatch, shallowEqual } from 'react-redux';

import mainReducer from './modules/main';
import userReducer from './modules/user';
import menuReducer from './modules/menus';

const store = configureStore({
  reducer: {
    main: mainReducer,
    user: userReducer,
    menu: menuReducer
  }
});

// 封装数据类型
type GetStateFnType = typeof store.getState;
type IRootState = ReturnType<GetStateFnType>;
type DispatchType = typeof store.dispatch;
// 导出封装数据类型hook
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;
// 导出封装方法hook
export const useAppDispatch: () => DispatchType = useDispatch;
// shallowEqual数据没有修改的情况下不更新
export const useAppShallowEqual = shallowEqual;

export default store;
