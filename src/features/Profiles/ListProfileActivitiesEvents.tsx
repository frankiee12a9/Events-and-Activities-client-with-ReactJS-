import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ActivitiesProfileFilter from "./ActivitiesProfileFilter";
import ProfileActivityItem from "./ProfileActivityItem";

// testing solution
export default observer(function ListProfileActivitiesEvents() {
  const {
    profileStore: { loadActivitiesProfile, ActivitiesProfile },
  } = useStore();

  useEffect(() => {
    if (ActivitiesProfile.length <= 1) loadActivitiesProfile();
  }, [ActivitiesProfile.length, loadActivitiesProfile]);

  console.log("profileActivities:", ActivitiesProfile);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          {/* <Header content="Events" icon="event" floated="left" /> */}
          <ActivitiesProfileFilter />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group>
            {ActivitiesProfile &&
              ActivitiesProfile.map((profileActivity) => (
                <ProfileActivityItem
                  key={profileActivity.id}
                  profileActivity={profileActivity}
                />
              ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
