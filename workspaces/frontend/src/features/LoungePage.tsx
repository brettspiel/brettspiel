import React, { useCallback, useEffect, useMemo } from "react";
import { useReduxState } from "../hooks/useReduxState";
import { useLoggedIn } from "./LoggedInRoute";
import { games } from "@brettspiel/games/lib/games";
import { useSocket } from "../hooks/useSocket";
import { ReadyState } from "react-use-websocket/dist";
import { SocketMessage } from "@brettspiel/io-types/lib/socket/SocketMessage";
import { ChatLogSendRequest } from "@brettspiel/io-types/lib/socket/ChatLogSendRequest";
import { useDispatch } from "react-redux";
import { addLog } from "../modules/loungeChatLog";
import { GameApi } from "../api/GameApi";
import { useServerConnection } from "../hooks/useServerConnection";
import {
  Button,
  Card,
  Col,
  Comment,
  Form,
  Input,
  List,
  Row,
  Typography,
} from "antd";
import { InterpolationWithTheme } from "@emotion/core";
import { SplitPane } from "react-collapse-pane";

export const LoungePage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { self } = useLoggedIn();
  const chatLogsRaw = useReduxState((state) => state.loungeChatLog.logs);
  const chatLogs = useMemo(() => chatLogsRaw.slice().reverse(), [chatLogsRaw]);
  const { serverAddress } = useServerConnection();
  const { sendMessage, readyState, lastJsonMessage } = useSocket(
    "/lounge/chat"
  );
  useEffect(() => {
    if (lastJsonMessage?.payload) {
      dispatch(addLog(lastJsonMessage.payload as any));
    }
  }, [dispatch, lastJsonMessage]);
  const handleFinish = useCallback(
    ({ message }: Record<string, string>) => {
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

  return (
    <SplitPane split="horizontal">
      <Row gutter={16}>
        <Typography.Title level={2}>ゲームを始める</Typography.Title>
        {Object.entries(games).map(([type, game]) => (
          <Col key={type} span={6}>
            <Card
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
          </Col>
        ))}
      </Row>

      <div css={styles.ChatSection}>
        <Typography.Title level={3}>チャット</Typography.Title>

        <div css={styles.ChatLog}>
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
        </div>

        <Form layout="inline" onFinish={handleFinish} css={styles.ChatForm}>
          <Form.Item
            name="message"
            css={styles.ChatInput}
            rules={[{ required: true }]}
            validateStatus={"success"}
            help={false}
          >
            <Input placeholder="チャット" />
          </Form.Item>
          <Form.Item css={styles.ChatSent}>
            <Button htmlType="submit">送信</Button>
          </Form.Item>
        </Form>
      </div>
    </SplitPane>
  );
};

const styles: Record<string, InterpolationWithTheme<any>> = {
  ChatSection: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
  ChatLog: {
    minHeight: 0,
    flexShrink: 1,
    overflowY: "scroll",
    "& .ant-comment-inner": {
      padding: "0 0 8px",
    },
  },
  ChatForm: {
    marginTop: "auto",
  },
  ChatInput: {
    "&.ant-form-item": {
      flexGrow: 1,
    },
  },
  ChatSent: {
    "&.ant-form-item": {
      marginRight: "0",
    },
  },
};
