import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { paths } from "../../paths";
import { TitleMenuPageToLoungePageWorkflow } from "../../debug/TitleMenuPageToLoungePageWorkflow";
import { Button, Input } from "semantic-ui-react";
import { healthcheck } from "../../api/healthcheck";
import { registerAddress } from "../../modules/server";

export const RootPage: React.FunctionComponent = () => {
  useEffect(() => {
    new TitleMenuPageToLoungePageWorkflow().run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [serverAddress, setServerAddress] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClickClient = useCallback(async () => {
    const ok = await healthcheck(serverAddress!);
    if (ok) {
      dispatch(registerAddress(serverAddress));
      history.push(paths["/login"].routingPath);
    }
  }, [dispatch, history, serverAddress]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <Input
          ref={(ref) => ref && ref.focus()}
          type="text"
          label="サーバーアドレス"
          placeholder="https://xxxxxxx.ngrok.io"
          value={serverAddress}
          onChange={(event) => setServerAddress(event.target.value)}
        />
        <Button onClick={handleClickClient}>接続</Button>
      </div>
    </div>
  );
};
