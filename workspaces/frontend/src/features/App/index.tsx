import React from "react";
import { Router, Route, Switch, Redirect } from "react-router";
import { paths } from "../../paths";
import { RootPage } from "../RootPage";
import { LoungePage } from "../LoungePage";
import { Provider } from "react-redux";
import { store } from "../../store";
import styles from "./styles.module.css";
import { SocketProvider } from "../../hooks/useSocket";
import { LoginPage } from "../LoginPage";
import { history } from "../../history";

export const App: React.FunctionComponent = () => (
  <Provider store={store}>
    <SocketProvider>
      <Router history={history}>
        <div className={styles.app}>
          <Switch>
            <Route path={paths["/"].routingPath} component={RootPage} exact />
            <Route
              path={paths["/login"].routingPath}
              component={LoginPage}
              exact
            />
            <Route
              path={paths["/lounge"].routingPath}
              component={LoungePage}
              exact
            />
            <Route render={() => <Redirect to={paths["/"].routingPath} />} />
          </Switch>
        </div>
      </Router>
    </SocketProvider>
  </Provider>
);
