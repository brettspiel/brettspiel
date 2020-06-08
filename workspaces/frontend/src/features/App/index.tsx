import React from "react";
import { Router, Route, Switch, Redirect } from "react-router";
import { paths } from "../../paths";
import { LoginPage } from "../LoginPage";
import { LoungePage } from "../LoungePage";
import { Provider } from "react-redux";
import { store } from "../../store";
import styles from "./styles.module.css";
import { SocketProvider } from "../../hooks/useSocket";
import { history } from "../../history";
import { LoggedInRoute } from "../LoggedInRoute";

export const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <SocketProvider>
      <Router history={history}>
        <div className={styles.app}>
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
    </SocketProvider>
  </Provider>
);
