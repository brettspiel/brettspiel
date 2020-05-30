import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ServerState = {
  serverAddress?: string;
};

const initialState: ServerState = {};

const slice = createSlice({
  name: "server",
  initialState,
  reducers: {
    registerAddress: (state, action: PayloadAction<string>) => {
      state.serverAddress = action.payload;
    },
    unregisterAddress: (state) => {
      delete state.serverAddress;
    },
  },
});

export const { registerAddress, unregisterAddress } = slice.actions;
export const server = slice.reducer;
