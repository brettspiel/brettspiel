import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.css";
import {
  Button,
  Card,
  Comment,
  Container,
  Header,
  Input,
  Segment,
} from "semantic-ui-react";
import { useSocket } from "../../hooks/useSocket";
import { useReduxState } from "../../hooks/useReduxState";
import { useDispatch } from "react-redux";
import { addLog } from "../../modules/loungeChatLog";
import { LoungePageSendChatWorkflow } from "../../debug/LoungePageSendChatWorkflow";
import { useLoggedIn } from "../LoggedInRoute";
import { ChatLog } from "@brettspiel/domain-types/lib/ChatLog";
import { games } from "@brettspiel/games/lib/games";
import { GameType } from "@brettspiel/domain-types/lib/GameRoom";
import { GameRoomsApi } from "../../api/GameRoomsApi";

export const LoungePage: React.FunctionComponent = () => {
  const { self, serverAddress, secretToken } = useLoggedIn();
  const dispatch = useDispatch();
  const chatLogs = useReduxState((state) => state.loungeChatLog.logs);
  const [chatMessage, setChatMessage] = useState("");
  const {
    connect,
    disconnect,
    emit,
    subscribe,
    unsubscribe,
  } = useSocket(serverAddress, "/lounge", { userId: self.id, secretToken });
  useEffect(() => {
    new LoungePageSendChatWorkflow(emit).run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chatLogSubscriber = useCallback(
    (chatLog: ChatLog) => {
      dispatch(addLog(chatLog));
    },
    [dispatch]
  );
  useEffect(() => {
    connect();
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    subscribe("server/lounge/chatLog", chatLogSubscriber);
    return () => unsubscribe("server/lounge/chatLog", chatLogSubscriber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const subscriber = console.log;
    subscribe("server/lounge/roomStatusChange", subscriber);
    return () => unsubscribe("server/lounge/roomStatusChange", subscriber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    new GameRoomsApi(serverAddress, { userId: self.id, secretToken })
      .list()
      .promise()
      .then(console.log);
  }, [secretToken, self.id, serverAddress]);

  return (
    <Container className={styles.lounge}>
      <Segment>
        <Header as="h3">ゲームを始める</Header>
        <Card.Group>
          {Object.entries(games).map(([type, game]) => (
            <Card key={type}>
              <Card.Content
                header={game.name}
                meta={game.categories.join("/")}
              />
              <Card.Content extra>
                <Button
                  basic
                  color="green"
                  onClick={() => {
                    emit(
                      "client/lounge/openRoom",
                      GameType.decode(type).unsafeCoerce()
                    );
                  }}
                >
                  このゲームで遊ぶ
                </Button>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </Segment>

      <Comment.Group>
        <Header as="h3" dividing>
          チャット
        </Header>

        {chatLogs.map((chatLog) => (
          <Comment key={`${chatLog.timestamp}_${chatLog.user.id}`}>
            <Comment.Content>
              <Comment.Author as="span">{chatLog.user.name}</Comment.Author>
              <Comment.Metadata>
                <span>
                  {new Date(chatLog.timestamp).toLocaleDateString()} -{" "}
                  {new Date(chatLog.timestamp).toLocaleTimeString()}
                </span>
              </Comment.Metadata>
              <Comment.Text>{chatLog.message}</Comment.Text>
            </Comment.Content>
          </Comment>
        ))}
      </Comment.Group>

      <Input
        placeholder="チャット"
        value={chatMessage}
        onChange={(event) => setChatMessage(event.target.value)}
      />
      <Button
        onClick={() => {
          if (self) {
            emit("client/lounge/chatSend", {
              user: self,
              message: chatMessage,
            });
            setChatMessage("");
          }
        }}
      >
        送信
      </Button>
    </Container>
  );
};
