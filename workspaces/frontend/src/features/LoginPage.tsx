import React, { FormEvent, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { paths } from "../paths";
import { healthcheck } from "../api/healthcheck";
import { registerAddress } from "../modules/server";
import { createUser } from "../modules/user";
import { Button, Container, Form, Image } from "react-bootstrap";
import { css } from "@emotion/core";
import { useForm } from "react-hook-form";

export const LoginPage: React.FunctionComponent = () => {
  // useEffect(() => {
  //   new LoginPageToLoungePageWorkflow().run();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const dispatch = useDispatch();
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<{
    serverAddress: string;
    userName: string;
  }>();

  console.log("@errors", errors);
  const onSubmitProps = handleSubmit(async (data) => {
    console.log("@data", data);
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
            ref={register({ pattern: /^https:\/\/.*\.ngrok\.io$/ })}
            type="text"
            name="serverAddress"
            placeholder="https://xxxxxxx.ngrok.io"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>ユーザー名</Form.Label>
          <Form.Control ref={register({ required: true })} name="userName" />
        </Form.Group>

        <Button block type="submit">
          ログイン
        </Button>
      </Form>
    </Container>
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
