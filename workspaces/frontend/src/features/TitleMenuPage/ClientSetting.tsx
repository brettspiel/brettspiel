import React, { useCallback, useState } from "react";
import { Button, Input } from "semantic-ui-react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { registerId } from "../../modules/server";
import { paths } from "../../paths";
import { healthcheck } from "../../api/healthcheck";
import { useServerConnection } from "../../hooks/useServerConnection";
import { getServerAddress } from "../../utils/serverAddress";

export type Props = {
  onCancel: () => any;
};

export const ClientSetting: React.FunctionComponent<Props> = ({ onCancel }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [serverId, setServerId] = useState("");
  const serverAddress = getServerAddress(serverId);
  const { disconnect } = useServerConnection();

  const handleClickClient = useCallback(async () => {
    const ok = await healthcheck(serverAddress!);
    if (ok) {
      dispatch(registerId(serverId));
      history.push(paths["/login"].routingPath);
    }
  }, [dispatch, history, serverAddress, serverId]);
  const handleClickCancel = useCallback(async () => {
    try {
      await disconnect();
    } finally {
      onCancel();
    }
  }, [disconnect, onCancel]);

  return (
    <>
      <Input
        ref={(ref) => ref && ref.focus()}
        type="text"
        placeholder="サーバーID"
        value={serverId}
        onChange={(event) => setServerId(event.target.value)}
      />
      <Button onClick={handleClickClient}>接続</Button>
      <Button onClick={handleClickCancel}>キャンセル</Button>
    </>
  );
};
