import request from '..';
import type { IRoleSearch, IRoleListResult, IAddRoleField } from '@/types';

// 获取角色列表
export const getRolesList = (params: IRoleSearch) => {
  return request.get<IRoleListResult>({
    url: '/roles/list',
    params
  });
};

// 创建角色
export const createRole = (data: IAddRoleField) => {
  return request.post({
    url: '/roles/create',
    data
  });
};

// 编辑角色
export const editRole = (roleId: number, data: IAddRoleField) => {
  return request.post({
    url: `/roles/edit/${roleId}`,
    data
  });
};
