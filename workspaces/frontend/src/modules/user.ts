import { User } from "../types/domain/User";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UsersApi } from "../api/UsersApi";
import { UserCreateRequest } from "../types/io/UserCreateRequest";
import { ReduxState } from "../store";

export type UserState = {
  self?: User;
  secretToken?: string;
};

const initialState: UserState = {};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addSelf: (state, action: PayloadAction<User>) => {
      state.self = action.payload;
    },
    addSecretToken: (state, action: PayloadAction<string>) => {
      state.secretToken = action.payload;
    },
  },
});

export const createUser = createAsyncThunk(
  "user/createUser",
  (name: string, thunkApi) => {
    const serverAddress = (thunkApi.getState() as ReduxState).server
      .serverAddress;
    if (!serverAddress) throw new Error("serverAddress not found");
    const req = UserCreateRequest.decode({ name });
    if (req.isLeft()) throw new Error(JSON.stringify(req));

    return new UsersApi(serverAddress)
      .create(req.unsafeCoerce())
      .promise()
      .then((result) => result.unsafeCoerce())
      .then((userResult) => {
        thunkApi.dispatch(slice.actions.addSelf(userResult.user));
        thunkApi.dispatch(slice.actions.addSecretToken(userResult.secretToken));
      });
  }
);

export const user = slice.reducer;
