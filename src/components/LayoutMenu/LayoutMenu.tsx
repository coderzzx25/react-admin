import { memo, useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { type MenuProps } from 'antd';
import type { MenuItem } from '@/types';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutMenuWrapper from './style';

interface IProps {
  children?: ReactNode;
  menuList: MenuItem[];
  menusPathList: string[];
}

const LayoutMenu: FC<IProps> = ({ menuList, menusPathList }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [selectedKey, setSelectedKey] = useState<string[]>([]);

  useEffect(() => {
    if (menusPathList.includes(pathname)) {
      setSelectedKey([pathname]);
    } else {
      setSelectedKey([]);
    }
  }, [pathname]);

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey([e.key]);
    navigate(e.key);
  };

  return (
    <>
      <LayoutMenuWrapper onClick={onClick} mode="inline" items={menuList} selectedKeys={selectedKey} />
    </>
  );
};

export default memo(LayoutMenu);
