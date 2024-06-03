import { Button, Result } from 'antd';
import { memo } from 'react';
import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface IProps {
  children?: ReactNode;
}

const Notfound: FC<IProps> = () => {
  const navigate = useNavigate();
  const onClickBack = () => {
    navigate('/');
  };
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉,您访问的页面不存在"
      extra={
        <Button type="primary" onClick={onClickBack}>
          返回首页
        </Button>
      }
    />
  );
};

export default memo(Notfound);
