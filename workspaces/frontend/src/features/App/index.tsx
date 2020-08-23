import React from "react";
import { Redirect, Route, Router, Switch } from "react-router";
import { paths } from "../../paths";
import { LoginPage } from "../LoginPage";
import { LoungePage } from "../LoungePage";
import { Provider } from "react-redux";
import { store } from "../../store";
import { history } from "../../history";
import { LoggedInRoute } from "../LoggedInRoute";
import { css } from "@emotion/core";

export const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <Router history={history}>
      <div css={styles.app}>
        <Switch>
          <LoggedInRoute
            path={paths["/"].routingPath}
            component={LoungePage}
            exact
          />
          <Route
            path={paths["/login"].routingPath}
            component={LoginPage}
            exact
          />
          <Route render={() => <Redirect to={paths["/"].routingPath} />} />
        </Switch>
      </div>
    </Router>
  </Provider>
);

const styles = {
  app: css({
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    color: "#202020",
  }),
};
