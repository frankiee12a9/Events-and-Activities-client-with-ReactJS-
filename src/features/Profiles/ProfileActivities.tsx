import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useEffect } from "react";
import { Card, Grid, Tab, TabProps } from "semantic-ui-react";
import { ActivityProfile } from "../../app/models/AttendeeProfile";
import { useStore } from "../../app/stores/store";
import ProfileActivityItem from "./ProfileActivityItem";

const panes = [
  { menuItem: "Future Events", pane: { key: "future" } },
  { menuItem: "Past Events", pane: { key: "past" } },
  { menuItem: "Hosting Events", pane: { key: "hosting" } },
];

export default observer(function ProfileActivities() {
  const {
    profileStore: {
      attendeeProfile,
      ActivitiesProfile,
      loadingActivitiesProfile,
      loadActivitiesProfile2,
    },
  } = useStore();

  useEffect(() => {
    if (ActivitiesProfile.length <= 1)
      loadActivitiesProfile2(attendeeProfile!.username);
    // loadActivitiesProfile2(attendeeProfile!.username);
  }, [loadActivitiesProfile2, attendeeProfile]);

  // handle custom tab change
  const handleChange = (e: SyntheticEvent, data: TabProps) => {
    loadActivitiesProfile2(
      attendeeProfile!.username,
      panes[data.activeIndex as number].pane.key
    );
  };

  return (
    <Tab.Pane loading={loadingActivitiesProfile}>
      <Grid>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4}>
            {ActivitiesProfile.map((profileActivitiy: ActivityProfile) => (
              <ProfileActivityItem
                profileActivity={profileActivitiy}
                key={profileActivitiy.id}
              />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
