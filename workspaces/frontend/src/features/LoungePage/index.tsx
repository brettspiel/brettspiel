import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.css";
import {
  Button,
  Input,
  Comment,
  Header,
  Segment,
  Card,
  Container,
} from "semantic-ui-react";
import { useSocket } from "../../hooks/useSocket";
import { ChatLog } from "../../types/domain/ChatLog";
import { useReduxState } from "../../hooks/useReduxState";
import { useDispatch } from "react-redux";
import { addLog } from "../../modules/loungeChatLog";
import { LoungePageSendChatWorkflow } from "../../debug/LoungePageSendChatWorkflow";
import { useLoggedIn } from "../LoggedInRoute";

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
    subscribe("server/lounge/chatLog", chatLogSubscriber);

    return () => {
      unsubscribe("server/lounge/chatLog", chatLogSubscriber);
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className={styles.lounge}>
      <Segment>
        <Header as="h3">ゲームを始める</Header>
        <Card.Group>
          <Card>
            <Card.Content header="TicTacToe" meta="アブストラクト" />
            <Card.Content extra>
              <Button basic color="green">
                このゲームで遊ぶ
              </Button>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content header="L.A.M.A." meta="カードゲーム" />
            <Card.Content extra>
              <Button basic color="green">
                このゲームで遊ぶ
              </Button>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content header="ZÈRTZ" meta="アブストラクト" />
            <Card.Content extra>
              <Button basic color="green">
                このゲームで遊ぶ
              </Button>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content header="AZUL" meta="アブストラクト" />
            <Card.Content extra>
              <Button basic color="green">
                このゲームで遊ぶ
              </Button>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content header="Factory Fun" meta="パズル リアルタイム" />
            <Card.Content extra>
              <Button basic color="green">
                このゲームで遊ぶ
              </Button>
            </Card.Content>
          </Card>
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
