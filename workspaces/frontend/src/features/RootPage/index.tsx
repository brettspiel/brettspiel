import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button, Input, Comment, Header, Segment } from "semantic-ui-react";
import { useSocket } from "../../hooks/useSocket";
import { ChatLog } from "../../types/domain/ChatLog";
import { useLoggedInEffect } from "../../hooks/useLoggedInEffect";
import { useReduxState } from "../../hooks/useReduxState";
import { useDispatch } from "react-redux";
import { addLog } from "../../modules/loungeChatLog";
import { LoungePageSendChatWorkflow } from "../../debug/LoungePageSendChatWorkflow";

export const RootPage: React.FunctionComponent = () => {
  const { self, serverAddress } = useLoggedInEffect();
  const dispatch = useDispatch();
  const chatLogs = useReduxState((state) => state.loungeChatLog.logs);
  const [chatMessage, setChatMessage] = useState("");
  const { connect, disconnect, emit, subscribe, unsubscribe } = useSocket(
    serverAddress,
    "/lounge"
  );
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
    <div className={styles.lounge}>
      <Header as="h3">ゲームを始める</Header>
      <Segment>
        <div>マルバツゲーム</div>
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
    </div>
  );
};
