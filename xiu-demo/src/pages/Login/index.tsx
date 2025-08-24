import { useNavigate } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
import { encryptParam } from '@/common/encrypt';
import { setTokenInLocal } from '@/common/keyAndToken';
import { login } from '@/service/login';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = async (values: any) => {
    const encrypted = await encryptParam(values);
    const [data, err] = await login({ encrypted });
    if (err || !data) return;
    setTokenInLocal(data.token);
    localStorage.setItem('user', values.username); // 用于和token中携带的name比较判断用户登录状态
    navigate('/home');
  };

  return <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item<FieldType>
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<FieldType>
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button
        type="primary"
        htmlType="submit"
      >
        Submit
      </Button>
    </Form.Item>
  </Form>
};

export default Login;
