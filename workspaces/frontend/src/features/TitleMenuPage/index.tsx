import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { registerId } from "../../modules/server";
import { useHistory } from "react-router";
import { paths } from "../../paths";
import { ClientSetting } from "./ClientSetting";
import { useServerConnection } from "../../hooks/useServerConnection";
import { TitleMenuPageToLoungePageWorkflow } from "../../debug/TitleMenuPageToLoungePageWorkflow";

export const TitleMenuPage: React.FunctionComponent = () => {
  useEffect(() => {
    new TitleMenuPageToLoungePageWorkflow().run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = useDispatch();
  const history = useHistory();
  const { serverId, connect, disconnect } = useServerConnection();
  const [isClient, setIsClient] = useState(false);

  const handleClickLaunchServer = useCallback(async () => {
    const serverId = await connect();
    dispatch(registerId(serverId));
    history.push(paths["/login"].routingPath);
  }, [connect, dispatch, history]);
  const handleClickStopServer = useCallback(disconnect, []);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {isClient && <ClientSetting onCancel={() => setIsClient(false)} />}
        {!isClient && serverId == null && (
          <div>
            <Button onClick={handleClickLaunchServer}>サーバーを起動</Button>
            <Button onClick={() => setIsClient(true)}>サーバーに接続</Button>
          </div>
        )}
        <Button negative onClick={handleClickStopServer}>
          サーバーを停止
        </Button>
      </div>
    </div>
  );
};
