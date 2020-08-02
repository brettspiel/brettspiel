import React, { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { paths } from "../paths";
import { healthcheck } from "../api/healthcheck";
import { registerAddress } from "../modules/server";
import { createUser } from "../modules/user";
import { Button, Container, Form, Image } from "react-bootstrap";
import { css } from "@emotion/core";
import { FieldError, useForm } from "react-hook-form";
import { DeepMap } from "react-hook-form/dist/types/utils";
import { LoginPageToLoungePageWorkflow } from "../debug/LoginPageToLoungePageWorkflow";

export const LoginPage: React.FunctionComponent = () => {
  useEffect(() => {
    new LoginPageToLoungePageWorkflow().run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = useDispatch();
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<{
    serverAddress: string;
    userName: string;
  }>({ mode: "onBlur", reValidateMode: "onBlur" });

  const onSubmitProps = handleSubmit(async (data) => {
    const ok = await healthcheck(data.serverAddress!);
    if (ok) {
      dispatch(registerAddress(data.serverAddress));
      await dispatch(createUser(data.userName));
      history.push(paths["/"].routingPath);
    }
  });

  return (
    <Container css={styles.Container}>
      <Image
        css={styles.Image}
        roundedCircle
        src="/logo.png"
        alt="brettspiel logo"
      />
      <Form css={styles.Form} onSubmit={onSubmitProps}>
        <Form.Group>
          <Form.Label>サーバーアドレス</Form.Label>
          <Form.Control
            ref={register({
              validate: {
                urlForm: (value) =>
                  value.startsWith("https://") && value.endsWith(".ngrok.io"),
                connectivity: async (value) =>
                  await healthcheck(value).catch(() => false),
              },
            })}
            type="text"
            name="serverAddress"
            placeholder="https://xxxxxxx.ngrok.io"
            isInvalid={!!errors.serverAddress}
          />
          <ErrorMessages errors={errors} name="serverAddress" />
        </Form.Group>
        <Form.Group>
          <Form.Label>ユーザー名</Form.Label>
          <Form.Control
            ref={register({ required: true })}
            name="userName"
            isInvalid={!!errors.userName}
          />
          <ErrorMessages errors={errors} name="userName" />
        </Form.Group>

        <Button block type="submit">
          ログイン
        </Button>
      </Form>
    </Container>
  );
};

const ErrorMessages: React.FunctionComponent<{
  errors: DeepMap<{ serverAddress: string; userName: string }, FieldError>;
  name: "serverAddress" | "userName";
}> = ({ errors, name }) => {
  const message = useMemo(() => {
    switch (errors[name]?.type) {
      case "required":
        return "必須です";
      case "urlForm":
        return "URL形式で入力してください";
      case "connectivity":
        return "サーバーへ接続できませんでした";
    }
    return "不正な入力値です";
  }, [errors, name]);
  return (
    <Form.Control.Feedback type="invalid">{message}</Form.Control.Feedback>
  );
};

const styles = {
  Container: css({
    width: "30rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }),
  Image: css({
    height: "auto",
    width: "60%",
  }),
  Form: css({
    width: "100%",
  }),
};
