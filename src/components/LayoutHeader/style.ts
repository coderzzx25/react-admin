import { Header } from 'antd/es/layout/layout';
import styled from 'styled-components';

const LayoutHeaderWrapper = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .icon {
    font-size: 18px;
    cursor: pointer;
  }
`;

export default LayoutHeaderWrapper;
