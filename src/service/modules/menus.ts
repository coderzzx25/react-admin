import request from '..';
import type { IMenuInfo, IRoleMenusResult, IMenuDataList } from '@/types';

// 获取角色菜单列表
export const getRoleMenuList = () => {
  return request.get<IRoleMenusResult[]>({
    url: '/menus/role/list'
  });
};

// 获取菜单列表
export const getMenusList = () => {
  return request.get<IMenuInfo[]>({
    url: '/menus/permission'
  });
};

interface ISearchInfo {
  page: number;
  limit: number;
  menuName?: string;
}

export const getMenuLists = (data: ISearchInfo) => {
  return request.get<IMenuDataList>({
    url: '/menus',
    params: data
  });
};
