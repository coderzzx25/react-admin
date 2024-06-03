import { memo } from 'react';
import type { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
}

const Departments: FC<IProps> = () => {
  return <div>Departments</div>;
};

export default memo(Departments);
