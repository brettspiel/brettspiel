import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { paths } from "../paths";
import { healthcheck } from "../api/healthcheck";
import { registerAddress } from "../modules/server";
import { createUser } from "../modules/user";
import { Button, Container, Form, Image } from "react-bootstrap";
import { css } from "@emotion/core";

export const LoginPage: React.FunctionComponent = () => {
  // useEffect(() => {
  //   new LoginPageToLoungePageWorkflow().run();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const dispatch = useDispatch();
  const history = useHistory();

  const [serverAddress, setServerAddress] = useState("");
  const [userName, setUserName] = useState("");

  const handleSubmit = useCallback(async () => {
    const ok = await healthcheck(serverAddress!);
    if (ok) {
      dispatch(registerAddress(serverAddress));
      await dispatch(createUser(userName));
      history.push(paths["/"].routingPath);
    }
  }, [dispatch, history, serverAddress, userName]);

  return (
    <Container css={styles.Container}>
      <Image
        css={styles.Image}
        roundedCircle
        src="/logo.png"
        alt="brettspiel logo"
      />
      <Form css={styles.Form} onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>サーバーアドレス</Form.Label>
          <Form.Control
            type="text"
            placeholder="https://xxxxxxx.ngrok.io"
            value={serverAddress}
            onChange={(event) => setServerAddress(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>ユーザー名</Form.Label>
          <Form.Control
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
          />
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
