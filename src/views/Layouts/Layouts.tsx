import { memo, useEffect, useMemo, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Watermark } from 'antd';
import LayoutsWrapper from './style';
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/store';
import { fetchUserMenus } from '@/store/modules/menus';
import { getMenuPath, mapRouterToMenus } from '@/utils/router-handle';
import LayoutMenu from '@/components/LayoutMenu/LayoutMenu';
import LayoutTabs from '@/components/LayoutTabs/LayoutTabs';
import LayoutHeader from '@/components/LayoutHeader/LayoutHeader';

interface IProps {
  children?: ReactNode;
}

const { Sider, Content } = Layout;

const Layouts: FC<IProps> = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.user, useAppShallowEqual);
  const { userMenus } = useAppSelector((state) => state.menu, useAppShallowEqual);
  const { isCollapsed } = useAppSelector((state) => state.main, useAppShallowEqual);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (!userMenus || !userMenus.length) {
      dispatch(fetchUserMenus());
    }
  }, [dispatch, userMenus]);

  const menusPathList = useMemo(() => getMenuPath(userMenus), [userMenus]);
  const menuList = useMemo(() => mapRouterToMenus(userMenus), [userMenus]);

  const checkAndNavigate = useCallback(() => {
    const staticPath = ['/welcome', '/404'];
    if (!menusPathList.includes(pathname) && !staticPath.includes(pathname)) {
      navigate('/404');
    }
  }, [menusPathList, pathname, navigate]);

  useEffect(() => {
    const debounceCheck = setTimeout(checkAndNavigate, 100);
    return () => clearTimeout(debounceCheck);
  }, [pathname, checkAndNavigate]);

  return (
    <Watermark content={userInfo?.username}>
      <LayoutsWrapper>
        <Sider collapsed={isCollapsed}>
          <LayoutMenu menuList={menuList} menusPathList={menusPathList} />
        </Sider>
        <Layout>
          <LayoutHeader />
          <Content className="main-content">
            <LayoutTabs />
            <Outlet />
          </Content>
        </Layout>
      </LayoutsWrapper>
    </Watermark>
  );
};

export default memo(Layouts, (prevProps: IProps, nextProps: IProps) => prevProps.children === nextProps.children);
