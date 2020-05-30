import React, { useCallback, useState } from "react";
import { Button, Input } from "semantic-ui-react";
import { createUser } from "../../modules/user";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { paths } from "../../paths";
import { useServerConnection } from "../../hooks/useServerConnection";

export const LoginPage: React.FunctionComponent = () => {
  const history = useHistory();
  const { serverAddress } = useServerConnection();
  if (!serverAddress) {
    history.push(paths["/"].routingPath);
  }

  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();
  const handleClickLogin = useCallback(async () => {
    await dispatch(createUser(userName));
    history.push(paths["/lounge"].routingPath);
  }, [dispatch, history, userName]);

  return (
    <div>
      <Input
        placeholder="ユーザー名"
        value={userName}
        onChange={(event) => setUserName(event.target.value)}
      />
      <Button onClick={handleClickLogin}>サーバーにログイン</Button>
    </div>
  );
};
