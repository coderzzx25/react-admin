import { memo } from 'react';
import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Flex, Form, Input, Layout, Popover, Typography } from 'antd';
import { UserOutlined, LockOutlined, SunOutlined, MoonOutlined, TranslationOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';

import LoginWrapper from './style';
import { useAppDispatch, useAppSelector, useAppShallowEqual } from '@/store';
import { IUserLoginInfo } from '@/types';
import { localCache } from '@/utils/cache';
import { userLogin } from '@/service/modules/auth';
import { setUserLoginInfoReducer } from '@/store/modules/user';
import { setDarkReducer } from '@/store/modules/main';

interface IProps {
  children?: ReactNode;
}

interface ILoginFieldTypes extends IUserLoginInfo {
  remember: boolean;
}

const { Title, Link } = Typography;

const Login: FC<IProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isDark } = useAppSelector((state) => state.main, useAppShallowEqual);
  // 切换暗黑模式
  const onClickToggleDark = () => {
    dispatch(setDarkReducer(!isDark));
  };
  const onClickUserLogin: FormProps<ILoginFieldTypes>['onFinish'] = async (values) => {
    const { username, password, remember } = values;
    if (remember) {
      // 记住账户密码
      localCache.setCache('username', username);
      localCache.setCache('password', password);
      localCache.setCache('remember', remember);
    } else {
      // 不记住账户密码
      localCache.deleteCache('username');
      localCache.deleteCache('password');
      localCache.deleteCache('remember');
    }
    // 发送登录请求
    const loginResult = await userLogin({ username, password });
    if (!loginResult) return;
    // 保存用户信息
    dispatch(setUserLoginInfoReducer(loginResult));
    // 跳转到首页
    navigate('/');
  };
  return (
    <LoginWrapper>
      <div className="other-action">
        {isDark ? <SunOutlined onClick={onClickToggleDark} /> : <MoonOutlined onClick={onClickToggleDark} />}
        <Popover placement="bottom" content="English/中文">
          <TranslationOutlined />
        </Popover>
      </div>
      <Layout className="content">
        <div className="left">
          <div className="img"></div>
        </div>
        <div className="right">
          <Title level={3}>欢迎登录</Title>
          <Form
            autoComplete="off"
            initialValues={{
              remember: localCache.getCache('remember') ?? false,
              username: localCache.getCache('username') ?? '',
              password: localCache.getCache('password') ?? ''
            }}
            onFinish={onClickUserLogin}
          >
            <Form.Item<ILoginFieldTypes> name="username" rules={[{ required: true, message: '请输入你的账户' }]}>
              <Input placeholder="请输入你的账户" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item<ILoginFieldTypes> name="password" rules={[{ required: true, message: '请输入你的密码' }]}>
              <Input.Password placeholder="请输入你的密码" prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between">
                <Form.Item<ILoginFieldTypes> name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住密码</Checkbox>
                </Form.Item>
                <Link target="_blank" type="secondary">
                  忘记密码?
                </Link>
              </Flex>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登 录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Layout>
    </LoginWrapper>
  );
};

export default memo(Login);
