import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { paths } from "../../paths";
import { TitleMenuPageToLoungePageWorkflow } from "../../debug/TitleMenuPageToLoungePageWorkflow";
import { Button, Form, Image } from "semantic-ui-react";
import { healthcheck } from "../../api/healthcheck";
import { registerAddress } from "../../modules/server";
import { createUser } from "../../modules/user";

export const LoginPage: React.FunctionComponent = () => {
  useEffect(() => {
    new TitleMenuPageToLoungePageWorkflow().run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className={styles.container}>
      <Image src="/logo.png" alt="brettspiel logo" size="small" />
      <div className={styles.box}>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>サーバーアドレス</label>
            <input
              type="text"
              placeholder="https://xxxxxxx.ngrok.io"
              value={serverAddress}
              onChange={(event) => setServerAddress(event.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>ユーザー名</label>
            <input
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
          </Form.Field>

          <Button fluid type="submit">
            ログイン
          </Button>
        </Form>
      </div>
    </div>
  );
};
