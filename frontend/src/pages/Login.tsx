import { Button, Card, Col, Form, Layout, Row, Space, Typography } from "@douyinfe/semi-ui";
import { IconUser, IconKey } from "@douyinfe/semi-icons";
export default function Login() {
  const { Header, Content } = Layout;
  return (
    <>
      <Layout className="h-screen">
        <Header className="h-14" style={{ background: "var(--semi-color-bg-1)" }}>
          Header
        </Header>
        <Content className="flex justify-center items-center">
          <LoginBox></LoginBox>
        </Content>
      </Layout>
    </>
  );
}

function LoginBox() {
  const { Title, Text } = Typography;

  let title = (
    <Row type="flex" justify="space-between">
      <Title heading={3} type="tertiary">
        Chat-Pro
      </Title>
      <Title heading={3}>登录</Title>
    </Row>
  );

  let baseStyle = { width: "450px" };
  let login = (val: any) => {
    console.log(val);
  };
  return (
    <Card title={title} style={baseStyle}>
      <Form wrapperCol={{ span: 20 }} onSubmit={login} labelAlign="left" labelPosition="left" className="py-4">
        <Form.Input noLabel={true} field="UserName" placeholder={"请输入用户名"} addonBefore=<IconUser></IconUser> size="large" />
        <Form.Input noLabel={true} field="Password" mode="password" placeholder={"请输入密码"} addonBefore=<IconKey></IconKey> size="large" />
        <Button htmlType="submit" theme="solid" className="mt-4" style={{ backgroundColor: "var(--semi-color-primary)" }} type="primary" block>
          登录
        </Button>
        <Row type="flex" justify="space-between" className="mt-4">
          <Col>
            <Text type="secondary">如果没有账号,请先</Text>
            <Text link={{ href: "注册账号" }}>注册账号</Text>
          </Col>
          <Col>
            <Text type="secondary">无法登录</Text>
            <Text link={{ href: "找回密码" }}>找回密码</Text>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
