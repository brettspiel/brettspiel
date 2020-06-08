import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatLog } from "@brettspiel/domain-types/lib/ChatLog";

export type LoungeChatLogState = {
  logs: ChatLog[];
};

const initialState: LoungeChatLogState = {
  logs: [],
};

const slice = createSlice({
  name: "loungeChatLog",
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<ChatLog>) => {
      state.logs.push(action.payload);
    },
    addHistories: (state, action: PayloadAction<ChatLog[]>) => {
      state.logs.push(...action.payload);
      state.logs.sort((a, b) => a.timestamp - b.timestamp);
    },
  },
});

export const { addLog, addHistories } = slice.actions;
export const loungeChatLog = slice.reducer;
