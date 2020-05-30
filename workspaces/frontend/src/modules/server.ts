import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ServerState = {
  serverId?: string;
};

const initialState: ServerState = {};

const slice = createSlice({
  name: "server",
  initialState,
  reducers: {
    registerId: (state, action: PayloadAction<string>) => {
      state.serverId = action.payload;
    },
    unregisterId: (state) => {
      delete state.serverId;
    },
  },
});

export const { registerId, unregisterId } = slice.actions;
export const server = slice.reducer;
