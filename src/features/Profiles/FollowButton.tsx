import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useEffect } from "react";
import { Button, Reveal } from "semantic-ui-react";
import { AttendeeProfile } from "../../app/models/AttendeeProfile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: AttendeeProfile;
}

export default observer(function FollowButton({ profile }: Props) {
  const { profileStore, userStore } = useStore();

  const { updateFollowing, updateLoading } = profileStore;

  useEffect(() => {
    console.log(profile.following);
  }, [profile.following]);

  // disable button when user is themself
  console.log(userStore.user?.username);
  console.log(profile.username);
  if (userStore.user?.username === profile.username) {
    return null;
  }

  const handleFollow = (e: SyntheticEvent, username: string) => {
    e.preventDefault();
    profile.following
      ? updateFollowing(username, false)
      : updateFollowing(username, true);
  };

  return (
    <Reveal animated="move">
      <Reveal.Content visible style={{ width: "100%" }}>
        <Button
          fluid
          color="teal"
          content={profile.following ? "Following" : "Not Following"}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: "100%" }}>
        <Button
          basic
          fluid
          color={profile.following ? "red" : "green"}
          content={profile.following ? "Unfollow" : "Follow"}
          loading={updateLoading}
          onClick={(e) => handleFollow(e, profile.username)}
        />
      </Reveal.Content>
    </Reveal>
  );
});
