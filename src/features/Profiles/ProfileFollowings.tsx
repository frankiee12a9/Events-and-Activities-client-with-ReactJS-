import { observer } from "mobx-react-lite";
import React from "react";
import { Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileCard from "./ProfileCard";

export default observer(function ProfileFollowings() {
  const { profileStore } = useStore();
  const { attendeeProfile, followings, loadingFollowings, activeTab } =
    profileStore;

  // no needed anymore!
  //   useEffect(() => {
  //     loadFollowings("followings").then(() =>
  //       console.log("all followings loaded.")
  //     );
  //   }, [loadFollowings]);

  return (
    <Tab.Pane loading={loadingFollowings}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={
              activeTab === 3
                ? `People following ${attendeeProfile?.displayName}`
                : `People ${attendeeProfile?.displayName} is following`
            }
          />
        </Grid.Column>
        <Grid.Column width={16}>
          {followings &&
            followings.map((following) => (
              <ProfileCard key={following.username} profile={following} />
            ))}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});

{
  /* <Popup
  hoverable
  key={attendee.username}
  trigger={
    <List.Item
      key={attendee.username}
      as={Link}
      to={`/profiles/${attendee.username}`}
    >
      <Image
        size="mini"
        style={attendee.following ? styles : null}
        circular
        bordered
        src={attendee.image || `/assets/user.png`}
      />
    </List.Item>
  }
>
  <Popup.Content>
    <ProfileCard profile={attendee} />
  </Popup.Content>
</Popup>; */
}
