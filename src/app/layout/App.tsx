import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import Navbar from "./Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import {
  BrowserRouter as Router,
  Route,
  useLocation,
  Switch,
} from "react-router-dom";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import "./styles.css";
import TestErrors from "../../features/error/TestErrors";
import { ToastContainer } from "react-toastify";
import NotFound from "../../features/error/NotFound";
import ServerError from "../../features/error/ServerError";
import { useStore } from "../stores/store";
import Loading from "./Loading";
import ModalContainer from "../common/modals/ModalContainer";
import ProfilePage from "../../features/Profiles/ProfilePage";
import PrivateRoute from "./PrivateRoute";

function App() {
  const location = useLocation();
  const { userStore, commonStore, modalStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setApploaded());
    } else {
      commonStore.setApploaded();
    }
  }, [userStore, commonStore]);

  if (!commonStore.appLoaded) return <Loading content="Loading app..." />;

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      {/* modal container  */}
      {modalStore.modal.open && <ModalContainer />}
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <Navbar />
            <Container style={{ marginTop: "7em" }}>
              {/* component */}
              {/* parent routes must include exact keyword */}
              <Switch>
                <PrivateRoute
                  exact
                  path="/activities"
                  component={ActivityDashboard}
                />
                <PrivateRoute
                  path="/activities/:id"
                  component={ActivityDetails}
                />
                {/* one component but 2 different routes: create new And update*/}
                <PrivateRoute
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                <PrivateRoute
                  path="/profiles/:username"
                  component={ProfilePage}
                />
                <PrivateRoute path="/errors" component={TestErrors} />
                <Route path="/server-error" component={ServerError} />
                {/* <Route component={ModalContainer} /> */}
                {/* all of routes that below `NotFound` component will not be rendered */}
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App); // observer(App) keep track of data inside App
