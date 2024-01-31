import { Card, Form, Layout, Typography } from "@douyinfe/semi-ui";
import Icon, { IconHome } from "@douyinfe/semi-icons";
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
  let title = <Typography.Title heading={3}>登录</Typography.Title>;
  let baseStyle = { height: "350px", width: "450px" };
  let form = (
    <Form
      wrapperCol={{ span: 20 }}
      labelAlign="left"
      labelPosition="left"
      render={({ formState, formApi, values }) => (
        <>
          <Form.Input noLabel={true} field="UserName" addonBefore="beforeIcon" size="large" />
          <Form.Input noLabel={true} field="Password" size="large" />
        </>
      )}
      // layout="horizontal"
      onValueChange={(values) => console.log(values)}
    ></Form>
  );

  return (
    <Card title={title} style={baseStyle}>
      {form}
    </Card>
  );
}
