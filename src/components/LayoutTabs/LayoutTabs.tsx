import { memo, useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Tabs } from 'antd';

import { useAppSelector, useAppShallowEqual } from '@/store';
import { searchRoute } from '@/utils/router-handle';
import { sessionCache } from '@/utils/cache';

interface IProps {
  children?: ReactNode;
}

interface ITabsItem {
  key: string;
  label: string;
  closable: boolean;
}

const LayoutTabs: FC<IProps> = () => {
  const { pathname } = useLocation();
  const { userMenus } = useAppSelector((state) => state.user, useAppShallowEqual);
  const navigate = useNavigate();

  const initialTabsList = JSON.parse(sessionCache.getCache('tabsList') || '[]');
  const initialActiveKey = sessionCache.getCache('activeKey') || pathname;

  const [tabsList, setTabsList] = useState<ITabsItem[]>(
    initialTabsList.length ? initialTabsList : [{ key: '/welcome', label: '首页', closable: false }]
  );
  const [activeKey, setActiveKey] = useState<string>(initialActiveKey);

  useEffect(() => {
    addTabs();
  }, [pathname]);

  useEffect(() => {
    sessionCache.setCache('tabsList', JSON.stringify(tabsList));
    sessionCache.setCache('activeKey', activeKey);
  }, [tabsList, activeKey]);

  // 创建页签
  const addTabs = () => {
    const route = searchRoute(pathname, userMenus);
    if (!route) return;
    setTabsList((prevTabsList) => {
      if (!prevTabsList.find((item) => item.key === route.url)) {
        return [
          ...prevTabsList,
          {
            key: route.url,
            label: route.menuName,
            closable: pathname !== '/welcome'
          }
        ];
      }
      return prevTabsList;
    });
    setActiveKey(pathname);
  };

  // 路由切换
  const handleChange = (key: string) => {
    navigate(key);
    setActiveKey(key);
  };

  // 关闭标签页
  const handleDel = (targetKey: string) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;

    const newTabsList = tabsList.filter((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
      return item.key !== targetKey;
    });

    if (newTabsList.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newTabsList[lastIndex].key;
      } else {
        newActiveKey = newTabsList[0].key;
      }
      navigate(newActiveKey);
    }

    setTabsList(newTabsList);
    setActiveKey(newActiveKey);
  };

  return (
    <Tabs
      activeKey={activeKey}
      items={tabsList.map((tab) => ({
        ...tab,
        children: null
      }))}
      type="editable-card"
      hideAdd
      onChange={handleChange}
      onEdit={(targetKey, action) => {
        if (action === 'remove') {
          handleDel(targetKey as string);
        }
      }}
    />
  );
};

export default memo(LayoutTabs);
