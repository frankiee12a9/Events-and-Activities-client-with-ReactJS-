import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileEditForm from "./ProfileEditForm";

// interface Props {
//   profile: AttendeeProfile;
// }

export default observer(function ProfileAbout() {
  const { profileStore } = useStore();
  const { isCurrentUser, attendeeProfile } = profileStore;
  const [editMode, setEditMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={`About ${attendeeProfile?.displayName}`}
          />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <ProfileEditForm setEditMode={setEditMode} />
          ) : (
            <span style={{ whiteSpace: "pre-wrap" }}>
              {attendeeProfile?.bio}
            </span>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
