import { memo } from 'react';
import type { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
}

const Dashboard: FC<IProps> = () => {
  return <div>Dashboard</div>;
};

export default memo(Dashboard);
