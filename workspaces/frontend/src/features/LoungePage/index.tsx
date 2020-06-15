import React, { useEffect, useState } from "react";
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
import { useReduxState } from "../../hooks/useReduxState";
import { useLoggedIn } from "../LoggedInRoute";
import { games } from "@brettspiel/games/lib/games";
import { useSocket } from "../../hooks/useSocket";
import { ReadyState } from "react-use-websocket/dist";

export const LoungePage: React.FunctionComponent = () => {
  const { self } = useLoggedIn();
  const chatLogs = useReduxState((state) => state.loungeChatLog.logs);
  const [chatMessage, setChatMessage] = useState("");
  const { sendMessage, readyState } = useSocket("/echo");
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ type: "hello" }));
    }
  }, [readyState, sendMessage]);

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
                  {[]
                    .filter((room: any) => room.type === type)
                    .map((room: any) => (
                      <Item
                        key={room.id}
                      >{`${room.host.name} is wanting player of ${room.type}`}</Item>
                    ))}
                </Item.Group>
              </Card.Content>
              <Card.Content extra>
                <Button basic color="green" onClick={() => {}}>
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
            setChatMessage("");
          }
        }}
      >
        送信
      </Button>
    </Container>
  );
};
