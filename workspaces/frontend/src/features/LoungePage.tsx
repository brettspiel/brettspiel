import React, { useCallback, useEffect, useState } from "react";
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
  Divider,
  Form,
  Input,
  List,
  Row,
  Space,
  Typography,
} from "antd";
import { css, CSSObject, InterpolationWithTheme } from "@emotion/core";

export const LoungePage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { self } = useLoggedIn();
  const chatLogs = useReduxState((state) => state.loungeChatLog.logs);
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
    <Space size="large" direction="vertical">
      <Typography.Title level={2}>ゲームを始める</Typography.Title>
      <Row gutter={16}>
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

      <Divider />

      <Space direction="vertical" css={styles.ChatForm}>
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

        <Form layout="inline" onFinish={handleFinish}>
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
      </Space>
    </Space>
  );
};

const styles: Record<string, InterpolationWithTheme<any>> = {
  ChatForm: {
    width: "100%",
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
