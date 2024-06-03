import styled from 'styled-components';
import loginBg from '@/assets/images/login-bg.svg';
import loginLeft from '@/assets/images/login-left.svg';

const LoginWrapper = styled.div`
  position: relative;
  height: 100vh;
  background-image: url(${loginBg});
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .other-action {
    position: absolute;
    top: 15px;
    right: 15px;
    display: flex;
    font-size: 20px;
    color: #fff;
    gap: 20px;
    cursor: pointer;

    span {
      padding: 5px;
      border-radius: 50%;
    }

    span:hover {
      cursor: pointer;
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .content {
    width: 1280px;
    height: 600px;
    flex: none;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    border-radius: 10px;
  }

  .left {
    flex: 1;
  }

  .img {
    width: 600px;
    height: 450px;
    background-image: url(${loginLeft});
    background-size: cover;
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .ant-form {
      width: 550px;
      padding: 0 120px;
    }
  }
`;

export default LoginWrapper;
