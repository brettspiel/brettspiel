import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.css";
import {
  Button,
  Card,
  Comment,
  Container,
  Header,
  Input,
  Item,
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
import { GameRoom, GameType } from "@brettspiel/domain-types/lib/GameRoom";

export const LoungePage: React.FunctionComponent = () => {
  const { self, serverAddress, secretToken } = useLoggedIn();
  const dispatch = useDispatch();
  const chatLogs = useReduxState((state) => state.loungeChatLog.logs);
  const [chatMessage, setChatMessage] = useState("");
  const {
    connect,
    disconnect,
    request,
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
  const [gameRooms, setGameRooms] = useState<GameRoom[]>([]);
  useEffect(() => {
    subscribe("server/lounge/roomStatusChange", setGameRooms);
    return () => unsubscribe("server/lounge/roomStatusChange", setGameRooms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    request("request/lounge/rooms", null).then((rooms) => {
      if (rooms) setGameRooms(rooms);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className={styles.lounge}>
      <Segment>
        <Header as="h3">ゲームを始める</Header>
        <Card.Group>
          {Object.entries(games).map(([type, game]) => (
            <Card key={type}>
              <Card.Content>
                <Card.Header>{game.name}</Card.Header>
                <Card.Meta>{game.categories.join("/")}</Card.Meta>

                <Item.Group divided>
                  {gameRooms
                    .filter((room) => room.type === type)
                    .map((room) => (
                      <Item
                        key={room.id}
                      >{`${room.host.name} is wanting player of ${room.type}`}</Item>
                    ))}
                </Item.Group>
              </Card.Content>
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
