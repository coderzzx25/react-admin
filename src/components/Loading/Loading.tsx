import { Spin } from 'antd';

const Loading = () => {
  return (
    <Spin
      size="large"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

export default Loading;
