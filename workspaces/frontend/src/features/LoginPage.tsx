import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { healthcheck } from "../api/healthcheck";
import { css } from "@emotion/core";
import { LoginPageToLoungePageWorkflow } from "../debug/LoginPageToLoungePageWorkflow";
import { Button, Form, Input, Space } from "antd";
import { createUser } from "../modules/user";
import { paths } from "../paths";
import { registerAddress } from "../modules/server";

export const LoginPage: React.FunctionComponent = () => {
  const workflowRef = useRef(new LoginPageToLoungePageWorkflow());
  useEffect(() => {
    workflowRef.current.run();
  }, []);

  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <Space size="large" css={styles.Container}>
      <Space direction="vertical" size="small">
        <img css={styles.Image} src="/logo.png" alt="brettspiel logo" />
        <Form
          css={styles.Form}
          onFinish={async ({ serverAddress, userName }) => {
            const ok = await healthcheck(serverAddress!);
            if (ok) {
              dispatch(registerAddress(serverAddress));
              await dispatch(createUser(userName));
              history.push(paths["/"].routingPath);
            }
          }}
        >
          <Form.Item
            label="サーバーアドレス"
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
            <Input type="text" placeholder="https://xxxxxxx.ngrok.io" />
          </Form.Item>
          <Form.Item
            label="ユーザー名"
            name="userName"
            hasFeedback
            rules={[{ required: true, message: "必須です" }]}
          >
            <Input />
          </Form.Item>

          <Button block htmlType="submit" type="primary">
            ログイン
          </Button>
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
