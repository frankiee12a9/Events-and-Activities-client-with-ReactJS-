import React from "react";
import * as semanticUiReact from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import {
  Image,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Menu,
} from "semantic-ui-react";
import { link } from "fs";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/store";

export default observer(function Navbar() {
  const { userStore } = useStore();
  const { user } = userStore;

  return (
    <semanticUiReact.Menu inverted fixed="top">
      <semanticUiReact.Container>
        <semanticUiReact.Menu.Item header as={NavLink} exact to="/">
          <img
            src="assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Reactivities
        </semanticUiReact.Menu.Item>
        <semanticUiReact.Menu.Item
          as={NavLink}
          to="/activities"
          exact
          name="Activities"
        />
        <semanticUiReact.Menu.Item
          as={NavLink}
          to="/errors"
          exact
          name="Errors"
        />
        <semanticUiReact.Menu.Item>
          <semanticUiReact.Button
            as={NavLink}
            to="/createActivity"
            positive
            content="Create Activity"
          />
        </semanticUiReact.Menu.Item>
        {userStore.isLoggedIn && (
          <Menu.Item position="right">
            <Image
              src={user?.image || "/assets/user.png"}
              alt="logo"
              avatar
              spaced="right"
            />
            <Dropdown pointing="top left" text={user?.displayName}>
              <DropdownMenu>
                <DropdownItem
                  content="My Profile"
                  as={link}
                  to={`/profiles/${user?.username}`}
                  icon="user"
                  onClick={userStore.getUser}
                />

                {/* <Route path="/profiles/:username" component={ProfilePage} /> */}
                <DropdownItem
                  content="Logout"
                  as={link}
                  to="/"
                  onClick={userStore.logout}
                  icon="power"
                />
              </DropdownMenu>
            </Dropdown>
          </Menu.Item>
        )}
      </semanticUiReact.Container>
    </semanticUiReact.Menu>
  );
});
