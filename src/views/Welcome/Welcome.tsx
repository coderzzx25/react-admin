import { memo } from 'react';
import type { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
}

const Welcome: FC<IProps> = () => {
  return <div>Welcome</div>;
};

export default memo(Welcome);
