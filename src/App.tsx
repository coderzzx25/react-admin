import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import { useAppSelector, useAppShallowEqual } from './store';
import { BrowserRouter } from 'react-router-dom';
import Router from './router';

interface IProps {
  children?: ReactNode;
}

const App: FC<IProps> = () => {
  const { isDark, defaultPrimaryColor } = useAppSelector((state) => state.main, useAppShallowEqual);
  return (
    <ConfigProvider
      locale={zhCN}
      componentSize="middle"
      theme={{
        token: {
          colorPrimary: defaultPrimaryColor
        },
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Layout: {
            headerBg: isDark ? '#141414' : '#ffffff',
            bodyBg: isDark ? '#141414' : '#f0f2f5',
            headerPadding: '0 20px'
          },
          Menu: {
            itemBg: isDark ? '#141414' : '#ffffff'
          }
        }
      }}
    >
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default memo(App);
