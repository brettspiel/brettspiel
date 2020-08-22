import React, { useCallback, useEffect, useState } from "react";
import { useReduxState } from "../../hooks/useReduxState";
import { useLoggedIn } from "../LoggedInRoute";
import { games } from "@brettspiel/games/lib/games";
import { useSocket } from "../../hooks/useSocket";
import { ReadyState } from "react-use-websocket/dist";
import { SocketMessage } from "@brettspiel/io-types/lib/socket/SocketMessage";
import { ChatLogSendRequest } from "@brettspiel/io-types/lib/socket/ChatLogSendRequest";
import { useDispatch } from "react-redux";
import { addLog } from "../../modules/loungeChatLog";
import { GameApi } from "../../api/GameApi";
import { useServerConnection } from "../../hooks/useServerConnection";
import {
  Button,
  Card,
  Comment,
  Divider,
  Input,
  List,
  Space,
  Typography,
} from "antd";

export const LoungePage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { self } = useLoggedIn();
  const chatLogs = useReduxState((state) => state.loungeChatLog.logs);
  const { serverAddress } = useServerConnection();
  const [chatMessage, setChatMessage] = useState("");
  const { sendMessage, readyState, lastJsonMessage } = useSocket(
    "/lounge/chat"
  );
  const sendChatLog = useCallback(
    (message: string) => {
      if (readyState === ReadyState.OPEN) {
        sendMessage(
          SocketMessage.encode({
            type: "ChatLogSend",
            payload: ChatLogSendRequest.encode({
              user: self,
              message,
            }),
          }) as any
        );
      }
    },
    [readyState, self, sendMessage]
  );
  useEffect(() => {
    if (lastJsonMessage?.payload) {
      dispatch(addLog(lastJsonMessage.payload as any));
    }
  }, [dispatch, lastJsonMessage]);

  return (
    <Space size="large" direction="vertical">
      <Space direction="vertical">
        <Typography.Title level={2}>ゲームを始める</Typography.Title>
        <Space direction="horizontal">
          {Object.entries(games).map(([type, game]) => (
            <Card
              key={type}
              actions={[
                <Button
                  type="primary"
                  onClick={() => {
                    new GameApi(serverAddress!).createRoom("TicTacToe");
                  }}
                >
                  このゲームで遊ぶ
                </Button>,
              ]}
            >
              <Card.Meta
                title={game.name}
                description={game.categories.join("/")}
              />
              <List
                bordered
                dataSource={[].filter((room: any) => room.type === type)}
                renderItem={(room: any) => (
                  <List.Item
                    key={room.id}
                  >{`${room.host.name} is wanting player of ${room.type}`}</List.Item>
                )}
              />
            </Card>
          ))}
        </Space>
      </Space>

      <Divider />

      <Space direction="vertical">
        <Typography.Title level={3}>チャット</Typography.Title>

        {chatLogs.map((chatLog) => (
          <Comment
            key={`${chatLog.timestamp}_${chatLog.user.id}`}
            author={chatLog.user.name}
            content={chatLog.message}
            datetime={
              <span>{new Date(chatLog.timestamp).toLocaleTimeString()}</span>
            }
          />
        ))}

        <Input
          placeholder="チャット"
          value={chatMessage}
          onChange={(event) => setChatMessage(event.target.value)}
        />
        <Button
          onClick={() => {
            if (self) {
              setChatMessage("");
              sendChatLog(chatMessage);
            }
          }}
        >
          送信
        </Button>
      </Space>
    </Space>
  );
};
