import React from "react";
import { useStore } from "../stores/store";
import {
  Route,
  RouteProps,
  Redirect,
  RouteComponentProps,
} from "react-router-dom";

interface Props extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

// private route to handle unauthorised visiting
export default function PrivateRoute({ component: Component, ...rest }: Props) {
  const {
    userStore: { isLoggedIn },
  } = useStore();

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}
