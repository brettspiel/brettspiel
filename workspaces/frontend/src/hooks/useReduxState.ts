import { ReduxState } from "../store";
import { useSelector } from "react-redux";
import { useCallback } from "react";

export const useReduxState = <TSelected>(
  selector: (state: ReduxState) => TSelected
) => useSelector<ReduxState, TSelected>(useCallback(selector, []));
