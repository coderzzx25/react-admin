import { memo } from 'react';
import type { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
}

const Menus: FC<IProps> = () => {
  return <div>Menus</div>;
};

export default memo(Menus);
