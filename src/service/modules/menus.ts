import request from '..';
import type { IMenuInfo, IRoleMenusResult } from '@/types';

// 获取角色菜单列表
export const getRoleMenuList = () => {
  return request.get<IRoleMenusResult[]>({
    url: '/menus/role/list'
  });
};

// 获取菜单列表
export const getMenusList = () => {
  return request.get<IMenuInfo[]>({
    url: '/menus/list'
  });
};
