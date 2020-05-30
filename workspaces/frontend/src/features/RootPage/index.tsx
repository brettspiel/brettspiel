import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { paths } from "../../paths";
import { TitleMenuPageToLoungePageWorkflow } from "../../debug/TitleMenuPageToLoungePageWorkflow";
import { Button, Input } from "semantic-ui-react";
import { healthcheck } from "../../api/healthcheck";
import { registerAddress } from "../../modules/server";
import { createUser } from "../../modules/user";

export const RootPage: React.FunctionComponent = () => {
  useEffect(() => {
    new TitleMenuPageToLoungePageWorkflow().run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = useDispatch();
  const history = useHistory();

  const [serverAddress, setServerAddress] = useState("");
  const [userName, setUserName] = useState("");

  const handleClickClient = useCallback(async () => {
    const ok = await healthcheck(serverAddress!);
    if (ok) {
      dispatch(registerAddress(serverAddress));
      await dispatch(createUser(userName));
      history.push(paths["/lounge"].routingPath);
    }
  }, [dispatch, history, serverAddress, userName]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <Input
          type="text"
          label="サーバーアドレス"
          placeholder="https://xxxxxxx.ngrok.io"
          value={serverAddress}
          onChange={(event) => setServerAddress(event.target.value)}
        />
        <Input
          label="ユーザー名"
          value={userName}
          onChange={(event) => setUserName(event.target.value)}
        />
        <Button onClick={handleClickClient}>ログイン</Button>
      </div>
    </div>
  );
};
