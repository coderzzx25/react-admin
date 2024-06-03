import { memo, useMemo } from 'react';
import type { FC, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
  TranslationOutlined
} from '@ant-design/icons';
import { Breadcrumb, ColorPicker, Dropdown, Popover } from 'antd';
import type { MenuProps } from 'antd';

import LayoutHeaderWrapper from './style';
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/store';
import { setCollapsedReducer, setDarkReducer, setPrimaryColor } from '@/store/modules/main';
import { mapMenusToBreadcrumb } from '@/utils/router-handle';
import { Color } from 'antd/es/color-picker';
import { localCache } from '@/utils/cache';

interface IProps {
  children?: ReactNode;
}

const LayoutHeader: FC<IProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isCollapsed, isDark, defaultPrimaryColor } = useAppSelector((state) => state.main, useAppShallowEqual);
  const { userMenus, userInfo } = useAppSelector((state) => state.user, useAppShallowEqual);

  // 切换菜单收缩状态
  const onClickCollapsed = () => {
    dispatch(setCollapsedReducer(!isCollapsed));
  };
  // 面包屑
  const breadcrumbItems = useMemo(() => mapMenusToBreadcrumb(pathname, userMenus), [userMenus, pathname]);
  // 退出登录
  const onClickLoginOut = () => {
    localCache.clearCache();
    navigate('/login');
  };
  // 下拉菜单
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '退出登录',
      onClick: onClickLoginOut
    }
  ];

  // 切换暗黑模式
  const onClickToggleDark = () => {
    dispatch(setDarkReducer(!isDark));
  };

  // 切换主题色
  const onClickTogglePrimaryColor = (color: Color) => {
    dispatch(setPrimaryColor(color.toHexString()));
  };

  return (
    <LayoutHeaderWrapper>
      <div className="left">
        {isCollapsed ? (
          <MenuUnfoldOutlined className="icon" onClick={onClickCollapsed} />
        ) : (
          <MenuFoldOutlined className="icon" onClick={onClickCollapsed} />
        )}
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="right">
        {isDark ? (
          <SunOutlined className="icon" onClick={onClickToggleDark} />
        ) : (
          <MoonOutlined className="icon" onClick={onClickToggleDark} />
        )}
        <Popover placement="bottom" content="English/中文">
          <TranslationOutlined className="icon" />
        </Popover>
        <ColorPicker defaultValue={defaultPrimaryColor} size="small" onChangeComplete={onClickTogglePrimaryColor} />
        <Dropdown menu={{ items }} placement="bottom" arrow>
          <span>{userInfo?.username}</span>
        </Dropdown>
      </div>
    </LayoutHeaderWrapper>
  );
};

export default memo(LayoutHeader);
