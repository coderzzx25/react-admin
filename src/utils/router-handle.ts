import { Key, ReactNode, createElement } from 'react';
import { IRoleMenusResult } from '@/types';
import { RouteObject } from 'react-router-dom';
import * as Icons from '@ant-design/icons';
import { ItemType, MenuItemType, MenuItemGroupType } from 'antd/es/menu/interface';
import type { TreeDataNode } from 'antd';

import type { IMenuInfo, MenuItem } from '@/types';

// 加载本地路由
export const loadLocalRouter = (): RouteObject[] => {
  const modules: Record<string, any> = import.meta.glob('../router/modules/**/*.tsx', { eager: true });
  const routes: RouteObject[] = [];
  for (const key in modules) {
    const route = modules[key].default;
    routes.push(route);
  }
  return routes;
};

// 获取菜单路径
export const getMenuPath = (list: IRoleMenusResult[]): string[] => {
  if (!Array.isArray(list)) {
    return [];
  }
  return list.reduce((result: string[], item: IRoleMenusResult) => {
    if (item.children) {
      return result.concat(...getMenuPath(item.children));
    }
    return result.concat(item.url);
  }, []);
};

const customIcons: { [key: string]: any } = Icons;
const getIcon = (icon: string) => {
  return createElement(customIcons[icon]);
};

const getAndMenuItem = (
  key: Key,
  label: ReactNode,
  icon?: ReactNode,
  children?: ItemType[] | undefined
): MenuItemType | MenuItemGroupType => {
  return {
    key,
    label,
    icon: icon ? getIcon(icon as string) : undefined,
    children
  } as MenuItemType | MenuItemGroupType;
};

export const mapRouterToMenus = (menus: IRoleMenusResult[] = []): MenuItem[] => {
  const finalMenuData: MenuItem[] = [];
  for (const item of menus) {
    if (item.children?.length) {
      const children: MenuItem[] = [];
      for (const child of item.children) {
        children.push(getAndMenuItem(child.url, child.menuName, child.icon, undefined));
      }
      finalMenuData.push(getAndMenuItem(item.url, item.menuName, item.icon, children));
    } else {
      finalMenuData.push(getAndMenuItem(item.url, item.menuName, item.icon));
    }
  }
  return finalMenuData;
};

export const searchRoute = (path: string, routes: IRoleMenusResult[] = []): IRoleMenusResult | '' => {
  if (!Array.isArray(routes)) {
    throw new Error('The routes parameter must be an array');
  }
  for (const item of routes) {
    if (item.url === path) return item;
    if (item.children?.length) {
      const result = searchRoute(path, item.children);
      if (result) return result;
    }
  }
  return '';
};

interface IBreadcrumb {
  title: string;
}

export const mapMenusToBreadcrumb = (path: string, menus: IRoleMenusResult[]): IBreadcrumb[] => {
  if (!menus) return [];
  const breadcrumb: IBreadcrumb[] = [];
  for (const item of menus) {
    if (item.url === path) {
      breadcrumb.push({ title: item.menuName });
    }
    if (item.children?.length) {
      const result = searchRoute(path, item.children);
      if (result) {
        breadcrumb.push({ title: item.menuName }, { title: result.menuName });
      }
    }
  }
  return breadcrumb;
};

export const mapTreeToTreeDataNode = (tree: IMenuInfo[]): TreeDataNode[] => {
  return tree.map((item) => {
    if (item.children) {
      return {
        title: item.menuName,
        key: item.id.toString(),
        children: mapTreeToTreeDataNode(item.children)
      };
    } else if (item.permission) {
      return {
        title: item.menuName,
        key: item.id.toString(),
        children: item.permission.map((permission) => ({
          title: permission.permissionName,
          key: permission.id.toString()
        }))
      };
    }
    return {
      title: item.menuName,
      key: item.id.toString()
    };
  });
};

export const findCheckedKeys = (tree: TreeDataNode[], menuIds: string[]): string[] => {
  let keys: string[] = [];
  tree.forEach((item) => {
    if (item.children) {
      keys = keys.concat(findCheckedKeys(item.children, menuIds));
    } else {
      if (menuIds.includes(item.key.toString())) {
        keys.push(item.key.toString());
      }
    }
  });
  return keys;
};
