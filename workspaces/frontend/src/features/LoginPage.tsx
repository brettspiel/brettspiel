import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { healthcheck } from "../api/healthcheck";
import { css } from "@emotion/core";
import { Button, Checkbox, Form, Input, Space } from "antd";
import { createUser } from "../modules/user";
import { paths } from "../paths";
import { registerAddress } from "../modules/server";
import { CloudServerOutlined, UserOutlined } from "@ant-design/icons";
import { useLocalStorageState } from "ahooks";

export const LoginPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [savedServerAddress, setSavedServerAddress] = useLocalStorageState(
    "savedServerAddress",
    ""
  );
  const [savedUserName, setSavedUserName] = useLocalStorageState(
    "savedUserName",
    ""
  );

  return (
    <Space size="large" css={styles.Container}>
      <Space direction="vertical" size="small">
        <img css={styles.Image} src="/logo.png" alt="brettspiel logo" />
        <Form
          initialValues={{
            serverAddress: savedServerAddress,
            userName: savedUserName,
            remember: savedServerAddress !== "" || savedUserName !== "",
          }}
          css={styles.Form}
          onFinish={async ({ serverAddress, userName, remember }) => {
            const ok = await healthcheck(serverAddress!);
            if (ok) {
              dispatch(registerAddress(serverAddress));
              await dispatch(createUser(userName));
              if (remember) {
                setSavedServerAddress(serverAddress);
                setSavedUserName(userName);
              } else {
                setSavedServerAddress("");
                setSavedUserName("");
              }
              history.push(paths["/"].routingPath);
            }
          }}
        >
          <Form.Item
            name="serverAddress"
            hasFeedback
            rules={[
              { required: true, message: "必須です" },
              {
                validator: async (_, value: string | undefined) => {
                  if (
                    !value ||
                    !value.startsWith("https://") ||
                    !value.endsWith(".ngrok.io")
                  )
                    return Promise.reject("URL形式で入力してください");
                  if (!(await healthcheck(value).catch(() => false)))
                    return Promise.reject("サーバーへ接続できませんでした");
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              type="text"
              prefix={<CloudServerOutlined />}
              placeholder="https://xxxxxxx.ngrok.io"
            />
          </Form.Item>
          <Form.Item
            name="userName"
            hasFeedback
            rules={[{ required: true, message: "必須です" }]}
          >
            <Input
              type="text"
              prefix={<UserOutlined />}
              placeholder="ユーザー名"
            />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>ログイン情報を記憶する</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button block htmlType="submit" type="primary">
              ログイン
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Space>
  );
};

const styles = {
  Container: css({
    margin: "4rem auto",
  }),
  Image: css({
    display: "block",
    height: "auto",
    width: "60%",
    margin: "auto",
    border: "solid 0.2rem lightgray",
    borderRadius: "50%",
  }),
  Form: css({
    width: "100%",
  }),
};
