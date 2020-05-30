import { configureStore } from "@reduxjs/toolkit";
import { user } from "./modules/user";
import { server } from "./modules/server";
import { loungeChatLog } from "./modules/loungeChatLog";

export const store = configureStore({
  reducer: {
    user,
    server,
    loungeChatLog,
  },
  devTools: process.env.NODE_ENV === "development",
});

export type ReduxState = ReturnType<typeof store.getState>;
