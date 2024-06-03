import type { GetProp, MenuProps } from 'antd';
// 登录信息
export interface IUserLoginInfo {
  username: string;
  password: string;
}

export interface IUserInfo {
  username: string;
  role: number;
}

// 登录返回信息
export interface IUserLoginResult {
  userinfo: IUserInfo;
  token: string;
  refreshToken: string;
}

export interface IPermissionInfo {
  id: number;
  menuId: number;
  permissionName: string;
  permissionValue: string;
}

// 角色路由返回信息
export interface IRoleMenusResult {
  id: string;
  menuName: string;
  url: string;
  icon: string;
  children?: IRoleMenusResult[];
}

// antd菜单项
export type MenuItem = GetProp<MenuProps, 'items'>[number];

// 角色查询参数
export interface IRoleSearch {
  roleName?: string;
  page: number;
  limit: number;
}

export interface IRoleInfo {
  id: number;
  roleName: string;
  menuIds: string[];
  createTime: string;
  updateTime: string;
  status: number;
}

// 角色列表返回信息
export interface IRoleListResult {
  total: number;
  data: IRoleInfo[];
}

// 菜单返回信息
export interface IMenuInfo {
  id: number;
  menuName: string;
  children?: IMenuInfo[];
  permission?: IPermissionInfo[];
}

// 创建角色参数
export interface IAddRoleField {
  roleName: string;
  menuIds: string[];
  status: boolean;
}

export interface IMenuDataInfo {
  id: string;
  menuName: string;
  url: string;
  icon: string;
  grade: number;
  pid: number;
  createTime: string;
  updateTime: string;
  status: number;
  children?: IMenuDataInfo[];
}

export interface IMenuDataList {
  total: number;
  list: IMenuDataInfo[];
}
