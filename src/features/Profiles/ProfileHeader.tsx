import { observer } from "mobx-react-lite";
import React from "react";
import {
  Grid,
  Header,
  Item,
  Segment,
  Statistic,
  Divider,
} from "semantic-ui-react";
import { AttendeeProfile } from "../../app/models/AttendeeProfile";
import FollowButton from "./FollowButton";

interface Props {
  profile: AttendeeProfile;
}

export default observer(function ProfileHeader({ profile }: Props) {
  console.log(profile.followingsCount);
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size="small"
                src={profile?.image || `/assets/user.png`}
              />
              <Item.Content verticalAlign="middle">
                <Header as="h1" content={profile?.displayName} />
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic label="Followers" value={profile.followersCount} />
            <Statistic label="Followings" value={profile.followingsCount} />
          </Statistic.Group>
          <Divider />
          <FollowButton profile={profile} />
        </Grid.Column>
      </Grid>
    </Segment>
  );
});
